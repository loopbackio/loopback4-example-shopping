#!/bin/bash

# Requires Prettier global install https://prettier.io/docs/en/install.html

## Linux (tested on Ubuntu)
export TS_POST_PROCESS_FILE="/usr/bin/prettier --write"
## Mac (untested)
# export TS_POST_PROCESS_FILE="/usr/local/lib/node_modules/prettier --write"
## Win (tested on Win10)
# export TS_POST_PROCESS_FILE="$APPDATA/npm/prettier.cmd --write"

echo "Starting openapi-generator";

openapi-generator generate \
    -i http://127.0.0.1:3000/openapi.json \
    -g javascript \
    -o packages/shopping/public/api \
    --enable-post-process-file

echo "Finished openapi-generator";
