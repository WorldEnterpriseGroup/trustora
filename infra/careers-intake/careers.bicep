param location string
param dataverseUrl string
param applicationEntitySet string
param applicationFieldPrefix string
param trustoraTeamId string
param allowedOrigins array
param tags object
@secure()
param d365SmokeToken string

var suffix = uniqueString(resourceGroup().id)
var storageAccountName = 'sttrcr${suffix}'
var functionAppName = 'fn-trustora-careers-${suffix}'
var servicePlanName = 'asp-trustora-careers-${suffix}'
var deploymentContainerName = 'deployments'
var applicationContainerName = 'applications'
var functionEndpoint = 'https://${functionAppName}.azurewebsites.net'
var storageSuffix = environment().suffixes.storage
var storageBlobDataContributorRoleId = 'ba92f5b4-2d11-453d-a403-e96b0029c9fe'
var storageQueueDataContributorRoleId = '974c5e8b-45b9-4653-ba55-5f855dd0fb88'
var storageTableDataContributorRoleId = '0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3'

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
  tags: tags
  properties: {
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    allowCrossTenantReplication: false
    allowSharedKeyAccess: false
    publicNetworkAccess: 'Enabled'
    accessTier: 'Hot'
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
  name: 'default'
  parent: storage
  properties: {
    deleteRetentionPolicy: { enabled: true, days: 7 }
    containerDeleteRetentionPolicy: { enabled: true, days: 7 }
  }
}

resource applicationContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  name: applicationContainerName
  parent: blobService
  properties: { publicAccess: 'None' }
}

resource deploymentContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  name: deploymentContainerName
  parent: blobService
  properties: { publicAccess: 'None' }
}

resource functionIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'uai-trustora-careers-${suffix}'
  location: location
  tags: tags
}

resource plan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: servicePlanName
  location: location
  kind: 'functionapp'
  sku: {
    name: 'FC1'
    tier: 'FlexConsumption'
  }
  properties: { reserved: true }
  tags: tags
}

resource functionApp 'Microsoft.Web/sites@2024-04-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp,linux'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: { '${functionIdentity.id}': {} }
  }
  tags: tags
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    publicNetworkAccess: 'Enabled'
    keyVaultReferenceIdentity: functionIdentity.id
    functionAppConfig: {
      deployment: {
        storage: {
          type: 'blobContainer'
          value: '${storage.properties.primaryEndpoints.blob}${deploymentContainerName}'
          authentication: {
            type: 'UserAssignedIdentity'
            userAssignedIdentityResourceId: functionIdentity.id
          }
        }
      }
      scaleAndConcurrency: {
        maximumInstanceCount: 20
        instanceMemoryMB: 512
      }
      runtime: {
        name: 'node'
        version: '24'
      }
    }
    siteConfig: {
      minTlsVersion: '1.2'
      http20Enabled: true
      cors: {
        allowedOrigins: allowedOrigins
        supportCredentials: false
      }
      appSettings: [
        { name: 'AzureWebJobsStorage__accountName', value: storage.name }
        { name: 'AzureWebJobsStorage__credential', value: 'managedidentity' }
        { name: 'AzureWebJobsStorage__clientId', value: functionIdentity.properties.clientId }
        { name: 'AzureWebJobsStorage__blobServiceUri', value: 'https://${storage.name}.blob.${storageSuffix}' }
        { name: 'AzureWebJobsStorage__queueServiceUri', value: 'https://${storage.name}.queue.${storageSuffix}' }
        { name: 'AzureWebJobsStorage__tableServiceUri', value: 'https://${storage.name}.table.${storageSuffix}' }
        { name: 'AZURE_CLIENT_ID', value: functionIdentity.properties.clientId }
        { name: 'DATAVERSE_URL', value: dataverseUrl }
        { name: 'TRUSTORA_APPLICATION_ENTITY_SET', value: applicationEntitySet }
        { name: 'TRUSTORA_LEAD_ENTITY_SET', value: 'leads' }
        { name: 'TRUSTORA_APPLICATION_FIELD_PREFIX', value: applicationFieldPrefix }
        { name: 'TRUSTORA_TEAM_ID', value: trustoraTeamId }
        { name: 'ALLOWED_ORIGINS', value: join(allowedOrigins, ',') }
        { name: 'RATE_LIMIT_PER_HOUR', value: '5' }
        { name: 'MAX_BODY_BYTES', value: '16384' }
        { name: 'D365_SMOKE_TOKEN', value: d365SmokeToken }
      ]
    }
  }
  dependsOn: [applicationContainer, deploymentContainer, storageBlobContributor, storageQueueContributor, storageTableContributor]
}

resource storageBlobContributor 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storage.id, functionIdentity.id, 'Storage Blob Data Contributor')
  scope: storage
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', storageBlobDataContributorRoleId)
    principalId: functionIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

resource storageQueueContributor 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storage.id, functionIdentity.id, 'Storage Queue Data Contributor')
  scope: storage
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', storageQueueDataContributorRoleId)
    principalId: functionIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

resource storageTableContributor 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storage.id, functionIdentity.id, 'Storage Table Data Contributor')
  scope: storage
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', storageTableDataContributorRoleId)
    principalId: functionIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

output functionAppName string = functionApp.name
output functionHostname string = functionEndpoint
output functionIdentityClientId string = functionIdentity.properties.clientId
output functionIdentityPrincipalId string = functionIdentity.properties.principalId
output storageAccountName string = storage.name
