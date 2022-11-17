FROM node:19 AS angular-build
WORKDIR /usr/src/
COPY angular-video-crime-miner/ ./angular-video-crime-miner/
RUN cd angular-video-crime-miner && npm install @angular/cli && npm install && npm run build-site

FROM node:19 AS node-client-build
WORKDIR /usr/src/
COPY node-video-crime-miner/ ./node-video-crime-miner/
RUN cd node-video-crime-miner && npm install && npm run build

EXPOSE 3080

CMD ["node", "node-video-crime-miner/out/src/cli/main.js"]