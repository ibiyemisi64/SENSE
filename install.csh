#! /bin/csh -f

# File Name: ~/SENSE/install.
# Purpose: CSH Script that starts all SENSE Services
# Last Modified By: Kelsie Edie on 29 OCT 2024

# 1: Get current SENSE repository code
cd ~/SENSE
git pull --verbose

# 2: Build updated SENSE repository code
# Build iQsign
cd ~/SENSE/iqsign
npm update

# Build iqsignv2
# cd ~/SENSE/iqsignv2
# npm install

# Build Signmaker
cd ~/SENSE/signmaker
ant
# Build CATRE
cd ~/SENSE/catre
ant
# Build Devices
cd ~/SENSE/devices
ant
# Build CEDES
cd ~/SENSE/cedes
npm update

# 3: Start SENSE services (server)
# Start iQsign
cd ~/SENSE/iqsign
./start.csh
# Start iqsignv2
cd ~/SENSE/iqsignv2
./start.csh
# Start CEDES
cd ~/SENSE/cedes
./start.csh
# Start Signmaker
cd ~/SENSE/signmaker
./start.csh
# Start Oauth (different script under iQsign)
cd ~/SENSE/iqsign
./starto.csh
# Start CATRE
cd ~/SENSE/catre
./start.csh
# Start Devices
cd ~/SENSE/devices
./start.csh
