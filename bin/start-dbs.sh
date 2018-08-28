#!/bin/bash
if [ -z "$CI" ]; then
  MONGO_CONTAINER_NAME="mongodb_c"
  docker rm -f $MONGO_CONTAINER_NAME
  docker pull mongo:latest
  docker run --name $MONGO_CONTAINER_NAME -p 27017:27017 -d mongo:latest

  REDIS_CONTAINER_NAME="redis_c"
  docker rm -f $REDIS_CONTAINER_NAME
  docker pull redis:latest
  docker run --name $REDIS_CONTAINER_NAME -p 6379:6379 -d redis:latest
fi
