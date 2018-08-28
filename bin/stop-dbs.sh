#!/bin/bash
MONGO_CONTAINER_NAME="mongodb_c"
docker rm -f $MONGO_CONTAINER_NAME

REDIS_CONTAINER_NAME="redis_c"
docker rm -f $REDIS_CONTAINER_NAME

