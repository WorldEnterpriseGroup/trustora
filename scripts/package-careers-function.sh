#!/usr/bin/env bash
# Builds the deployable zip for the Trustora careers-intake Azure Function
# (Flex Consumption, Node 24, see infra/careers-intake/careers.bicep).
#
#   scripts/package-careers-function.sh [output.zip]
#
# The package holds host.json, package.json and src/ plus production
# node_modules (tests and dev files are excluded). It is built in a scratch
# directory so the working tree is never modified. Publish it with:
#
#   az functionapp deployment source config-zip \
#     -g rg-trustora-careers -n fn-trustora-careers-sy4lxie35bmuy --src <zip>
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
src="${root}/infra/careers-intake/function"
out="${1:-${root}/careers-function.zip}"
case "${out}" in /*) ;; *) out="$(pwd)/${out}" ;; esac

for tool in node npm zip; do
  command -v "${tool}" >/dev/null || { echo "missing required tool: ${tool}" >&2; exit 1; }
done
node_major="$(node -p 'process.versions.node.split(".")[0]')"
if [ "${node_major}" -lt 24 ]; then
  echo "Node >= 24 required (function runtime is node 24); found ${node_major}" >&2
  exit 1
fi

work="$(mktemp -d)"
trap 'rm -rf "${work}"' EXIT
cp "${src}/host.json" "${src}/package.json" "${work}/"
cp -R "${src}/src" "${work}/src"
if [ -f "${src}/package-lock.json" ]; then
  cp "${src}/package-lock.json" "${work}/"
  (cd "${work}" && npm ci --omit=dev --no-audit --no-fund)
else
  (cd "${work}" && npm install --omit=dev --no-audit --no-fund)
fi
rm -f "${out}"
(cd "${work}" && zip -qr "${out}" host.json package.json src node_modules)
echo "wrote ${out}"
