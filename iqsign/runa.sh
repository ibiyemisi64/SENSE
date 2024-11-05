#! /bin/bash

source ~/.bashrc
source ~/.nvm/nvm.sh

cd ~/SENSE/iqsign

nvm run default appserver.js
