FROM node:carbon-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y --no-install-recommends inkscape git
RUN rm -rf /var/cache/* && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3030 9229
CMD [ "node", "src/index.js" ]