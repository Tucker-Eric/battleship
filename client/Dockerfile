FROM mhart/alpine-node:10 as BASE

WORKDIR /app

COPY package*.json ./

RUN npm ci

FROM BASE as PROD

COPY . .

RUN IGNORE_MOBX_MINIFY_WARNING=true NODE_ENV=production npm run build

FROM nginx:alpine

COPY --from=PROD /app/build /var/www/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf