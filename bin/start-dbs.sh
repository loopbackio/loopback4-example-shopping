#!/bin/bash
if [ -z "$CI" ]; then
  BASE_DIR=`dirname "$0"`
  $BASE_DIR/stop-dbs.sh

  MONGO_CONTAINER_NAME="mongodb_lb4_shopping"
  docker pull mongo:latest
  docker run --name $MONGO_CONTAINER_NAME -p 27017:27017 -d mongo:latest

  REDIS_CONTAINER_NAME="redis_lb4_shopping"
  docker pull redis:latest
  docker run --name $REDIS_CONTAINER_NAME -p 6379:6379 -d redis:latest
fi
