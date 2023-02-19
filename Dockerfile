# Angular Server
FROM node:19 AS angular-build
WORKDIR /usr/src/
COPY angular-video-crime-miner/ ./angular-video-crime-miner/
RUN cd angular-video-crime-miner && npm install @angular/cli && npm install && npm run build-site

# Node Server and Local Dev Fresh Clean Database
FROM node:19 AS node-client-build
WORKDIR /usr/src/
COPY node-video-crime-miner/ ./node-video-crime-miner/
RUN cd node-video-crime-miner && npm install && npm run build && npm run refresh

# Postgresql Server
FROM postgres:15 AS postgres-build
WORKDIR /usr/src/
COPY node-video-crime-miner/src/postgres/ /usr/src/video-crime-miner/node-video-crime-miner/src/postgres

EXPOSE 5432:8000

CMD ["node", "node-video-crime-miner/out/index.js"]