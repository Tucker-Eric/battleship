FROM mhart/alpine-node:12 as BASE

WORKDIR /app

COPY package*.json ./

RUN npm i

FROM BASE as BUILD

COPY --from=BASE /app .

COPY . .

RUN npm run build

FROM mhart/alpine-node:slim-12
ENV NODE_ENV=production
WORKDIR /app

COPY --from=BUILD /app /app

CMD ["node", "build/index.js"]