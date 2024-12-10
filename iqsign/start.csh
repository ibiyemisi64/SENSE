#! /bin/csh -f

pm2 delete iqsign

cat < /dev/null > iqsign.log

pm2 start --log iqsign.log --name iqsign run.sh

pm2 save

