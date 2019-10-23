#!/bin/bash
set -e
BASE_DIR=`dirname "$0"`

VERSION=${npm_package_version}
if [ -z "$VERSION" ]; then
  VERSION="1.0.0"
fi

echo Image version: $VERSION

pushd ${BASE_DIR}/.. 2>&1 >/dev/null
docker build -t loopback4-example-shopping-monorepo:$VERSION -f Dockerfile.monorepo .
docker build --build-arg version=$VERSION -t loopback4-example-shopping:$VERSION -f Dockerfile.shopping .
docker build --build-arg version=$VERSION -t loopback4-example-recommender:$VERSION -f Dockerfile.recommender .
popd
