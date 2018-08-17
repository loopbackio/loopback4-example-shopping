#!/bin/bash

CONTAINER_NAME="mongodb_c"
docker rm -f $CONTAINER_NAME
docker pull mongo:latest
docker run --name $CONTAINER_NAME -p 27017:27017 -d mongo:latest
