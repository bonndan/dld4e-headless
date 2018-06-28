FROM node:carbon-slim

WORKDIR /usr/src/app


COPY package*.json ./

RUN apt-get update && apt-get install -y graphicsmagick

RUN npm install

COPY . .

EXPOSE 3030
CMD [ "npm", "start" ]