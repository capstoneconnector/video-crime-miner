FROM node:19 AS angular-build
WORKDIR /usr/src/angular-video-crime-miner/
COPY angular-video-crime-miner/ ./angular-video-crime-miner/
RUN cd angular-video-crime-miner && npm install @angular/cli && npm install && npm run build-site

FROM node:19 AS node-client-build
WORKDIR /usr/src/node-video-crime-miner/
# WORKDIR /usr/src/
COPY --from=angular-build angular-video-crime-miner/dist/ ./angular-video-crime-miner/dist
COPY package*.json ./
RUN npm install && npm run start

EXPOSE 3080

CMD ["node", "out/src/cli/main.js"]