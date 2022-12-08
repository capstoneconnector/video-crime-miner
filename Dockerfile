# Angular Server
FROM node:19 AS angular-build
WORKDIR /usr/src/
COPY angular-video-crime-miner/ ./angular-video-crime-miner/
RUN cd angular-video-crime-miner && npm install @angular/cli && npm install && npm run build-site

# Node Server and Local Dev Fresh Clean Database
FROM node:19 AS node-client-build
WORKDIR /usr/src/
COPY node-video-crime-miner/ ./node-video-crime-miner/
RUN cd node-video-crime-miner && npm install && npm run build

FROM postgres:15 AS postgres-build
WORKDIR /usr/src/
COPY node-video-crime-miner/ ./node-video-crime-miner/
RUN service postgresql start
RUN cd node-video-crime-miner/postgres && psql -h localhost -p 5432 -U postgres -f db.sql

EXPOSE 3080

CMD ["node", "node-video-crime-miner/out/index.js"]