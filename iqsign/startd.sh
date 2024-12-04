#! /bin/bash

# local development
# start script for docker container

redis-server --daemonize yes
node server.js
mkdir -p "/Library/WebServer/Documents/iqsign/signs/"
