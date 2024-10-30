#! /bin/csh -f

if (! $?PROIOT ) setenv PROIOT $PRO/SENSE
set WD = $PROIOT/devices

pushd $WD

ant

pm2 stop devices

cat < /dev/null > $WD/devices.log

pm2 start --log $WD/devices.log --name devices $WD/rundevices.sh

popd







