# Use a specific version of Node.js as the base image
FROM node:16-alpine

RUN apk --update add redis 

ENV APP_FOLDER="/app"

COPY ./iqsignv2/package.json ${APP_FOLDER}/iqsignv2/package.json

WORKDIR ${APP_FOLDER}/iqsignv2
RUN npm install

COPY ./iqsignv2 ${APP_FOLDER}/iqsignv2
RUN npm install

EXPOSE 5173
