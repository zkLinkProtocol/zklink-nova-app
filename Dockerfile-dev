FROM 475911326710.dkr.ecr.ap-northeast-1.amazonaws.com/node:20.11.1-slim as build

WORKDIR /zklink-nova-app

ADD . /zklink-nova-app

RUN npm install && npm run build:dev

FROM 475911326710.dkr.ecr.ap-northeast-1.amazonaws.com/nginx:alpine3.18

RUN mkdir /build

COPY --from=build /zklink-nova-app/dist /dist

CMD ["/bin/sh", "-c", "nginx -g 'daemon off;'"]
