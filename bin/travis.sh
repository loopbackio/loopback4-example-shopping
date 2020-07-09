#!/bin/bash

# `brew` may report errors for some packages such as python3 but such failures
# do not impact the build. We'll ignore non-zero return code for now so that CI
# builds on MacOS can pass.
# set -e

if [[ "${TRAVIS_OS_NAME}" == "osx" ]]; then
  echo "OSX => UPDATING HOMEBREW"
  brew update
  echo "OSX => INSTALLING AND STARTING MONGODB"
  brew tap mongodb/brew
  brew install mongodb-community
  brew services start mongodb-community

  echo "OSX => INSTALLING AND STARTING REDIS"
  brew install redis
  brew services start redis
fi

if [ "${TASK}" = "test" ]; then
  echo "TASK => MONGODB/REDIS STARTUP DELAY"
  sleep 10
fi
