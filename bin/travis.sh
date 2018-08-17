#!/bin/bash
set -e

if [[ "${TRAVIS_OS_NAME}" == "osx" ]]; then
  echo "OSX => UPDATING HOMEBREW"
  brew update
  echo "OSX => INSTALLING AND STARTING MONGODB"
  brew install mongodb
  brew services start mongodb
fi

if [ $TASK = "test" ]; then
  echo "TASK => MONGODB STARTUP DELAY"
  sleep 10
fi
