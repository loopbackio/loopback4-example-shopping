#!/bin/bash
set -e

if [[ "${TRAVIS_OS_NAME}" == "osx" ]]; then
  echo "OSX => UPDATING HOMEBREW"
  brew update
  echo "OSX => INSTALLING AND STARTING MONGODB"
  brew install mongodb
  brew services start mongodb

  echo "OSX => INSTALLING AND STARTING REDIS"
  brew install redis
  brew services start redis
fi

if [ $TASK = "test" ]; then
  echo "TASK => MONGODB/REDIS STARTUP DELAY"
  sleep 10
fi
