#! /bin/csh -f

pm2 delete iqsignv2

cat < /dev/null > iqsignv2.log

pm2 start --log iqsignv2.log --name iqsignv2 run.sh

pm2 save
