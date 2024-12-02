FROM node:16

COPY iqsign IQSignSENSE ./
COPY secret.zip ./

EXPOSE 5173