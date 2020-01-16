#!/bin/bash

### Generated code formatting ###

# Requires Prettier global install https://prettier.io/docs/en/install.html

# Enable for your OS or disable by commenting out the line below containing `-enable-post-process-file`

## Linux (tested on Ubuntu)
export TS_POST_PROCESS_FILE="/usr/bin/prettier --write"
## Mac (untested)
# export TS_POST_PROCESS_FILE="/usr/local/lib/node_modules/prettier --write"
## Win (tested on Win10)
# export TS_POST_PROCESS_FILE="$APPDATA/npm/prettier.cmd --write"


echo -e "\n\e[96mAPI client code generator started...\n\e[39m";

openapi-generator generate \
    -i http://127.0.0.1:3000/openapi.json \
    -g javascript \
    -o packages/shopping/public/api \
    --enable-post-process-file

echo -e "\n\e[92mAPI client code generator completed.\n";
