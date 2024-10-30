#! /bin/csh -f

# if (! $?PROIOT ) setenv PROIOT $PRO/iot
# set WD = $PROIOT/devices

cd ~/SENSE/devices

ant

pm2 stop devices

cat < /dev/null > $WD/devices.log

pm2 start --log $WD/devices.log --name devices $WD/rundevices.sh

# popd







