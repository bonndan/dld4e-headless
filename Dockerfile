FROM node:carbon-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y graphicsmagick git


COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3030
CMD [ "node", "src/index.js" ]