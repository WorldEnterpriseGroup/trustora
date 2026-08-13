targetScope = 'subscription'

@description('Dedicated Trustora careers intake resource group.')
param resourceGroupName string = 'rg-trustora-careers'

@description('Azure region for the Function and its private storage boundary.')
param location string = 'eastus'

@description('Dream Dataverse environment.')
param dataverseUrl string = 'https://dream.crm.dynamics.com'

@description('Dataverse custom table entity set.')
param applicationEntitySet string = 'tr_trustoraacareerapplications'

@description('Dataverse publisher prefix.')
param applicationFieldPrefix string = 'tr_'

@description('Trustora owner team GUID in Dream.')
param trustoraTeamId string = '539bd333-9e96-f111-8075-000d3a59e29a'

@description('Allowed browser origins for the public static site.')
param allowedOrigins array = [
  'https://trustora.net'
  'https://www.trustora.net'
]

var tags = {
  environment: 'production'
  managedBy: 'iac'
  project: 'trustora'
  service: 'careers-intake'
  subscription: 'focushive-mpn'
  dataClassification: 'candidate-application'
}

resource resourceGroup 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

module infrastructure 'careers.bicep' = {
  name: 'trustora-careers-intake'
  scope: resourceGroup
  params: {
    location: location
    dataverseUrl: dataverseUrl
    applicationEntitySet: applicationEntitySet
    applicationFieldPrefix: applicationFieldPrefix
    trustoraTeamId: trustoraTeamId
    allowedOrigins: allowedOrigins
    tags: tags
  }
}

output resourceGroupName string = resourceGroup.name
output functionAppName string = infrastructure.outputs.functionAppName
output functionHostname string = infrastructure.outputs.functionHostname
output functionIdentityClientId string = infrastructure.outputs.functionIdentityClientId
output functionIdentityPrincipalId string = infrastructure.outputs.functionIdentityPrincipalId
output storageAccountName string = infrastructure.outputs.storageAccountName
