FROM node:16-alpine

ENV APP_FOLDER="/app"

RUN apk --update add redis 
COPY ./iqsign/package.json ${APP_FOLDER}/iqsign/package.json

WORKDIR ${APP_FOLDER}/iqsign
RUN npm install

WORKDIR ${APP_FOLDER}
COPY . .

WORKDIR ${APP_FOLDER}/iqsign
RUN npm install
RUN chmod +x ${APP_FOLDER}/iqsign/startd.sh

EXPOSE 3335
