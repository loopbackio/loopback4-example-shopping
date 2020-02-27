#!/bin/bash
set -e
BASE_DIR=`dirname "$0"`

pushd ${BASE_DIR}/.. 2>&1 >/dev/null

mkdir -p tmp

cat > tmp/openapi-generator-lb4.json <<EOF
{
  "ngVersion": "9.0.2",
  "providedInRoot": "true",
  "modelPropertyNaming": "original",
  "supportsES6": "true",
  "stringEnums": true,
  "serviceSuffix": "Service",
  "serviceFileSuffix": ".service",
  "fileNaming": "kebab-case"
}
EOF

cat > tmp/.openapi-generator-ignore <<EOF
# OpenAPI Generator Ignore
**/.gitignore
**/.openapi-generator-ignore
**/git_push.sh
EOF

OPENAPI_SPEC_URL=http://host.docker.internal:3000/openapi.json

echo $0: remove old sdk before generation
rm -fR src/app/shared/sdk2

echo $0: generate sdk from openapi spec: ${OPENAPI_SPEC_URL}
MSYS_NO_PATHCONV=1 \
docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli:v4.2.3 generate \
  -i ${OPENAPI_SPEC_URL} \
  -g typescript-angular \
  -o /local/src/app/shared/sdk \
  -c /local/tmp/openapi-generator-lb4.json \
  --ignore-file-override=/local/tmp/.openapi-generator-ignore \
#  --skip-validate-spec

echo $0: cleanup
rm -f tmp/openapi-generator-lb4.json
rm -f tmp/.openapi-generator-ignore

popd
