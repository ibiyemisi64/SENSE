#! /bin/csh -f

pm2 stop oauth

cat < /dev/null > servero.log

pm2 start --log servero.log --name oauth runo.sh
