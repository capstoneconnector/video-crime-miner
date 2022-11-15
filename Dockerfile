FROM node:19 AS ui-build
WORKDIR /usr/src/angular-video-crime-miner/
COPY angular-video-crime-miner/ ./angular-video-crime-miner/
RUN cd m && angular-video-crime-miner install @angular/cli && npm install && npm run start-site

FROM node:19 AS server-build
WORKDIR /root/node-video-crime-miner/
COPY --from=ui-build /usr/src/app/my-app/dist ./my-app/dist
COPY package*.json ./
RUN npm install
COPY server.js .

EXPOSE 3080

CMD ["node", "server.js"]