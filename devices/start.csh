#! /bin/csh -f

# if (! $?PROIOT ) setenv PROIOT $PRO/iot
# set WD = $PROIOT/devices

# pushd $WD - this might be the wrong directory
cd /vol/home/server/SENSE/devices/

ant

pm2 stop devices

cat < /dev/null > /vol/home/server/SENSE/devices/devices.log

pm2 start --log ~/SENSE/devices/devices.log --name devices ~/SENSE/devices/rundevices.sh

# popd







