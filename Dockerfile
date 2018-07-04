FROM node:carbon-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y imagemagick git


COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3030 9229
CMD [ "node", "--inspect=0.0.0.0:9229", "src/index.js" ]