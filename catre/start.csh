#! /bin/csh -f

pm2 stop catre

cat < /dev/null > catre.log

pm2 start --log catre.log --name catre ../bin/catreserver.sh

pm2 save
