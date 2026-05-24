FROM docker.io/library/alpine:3.23 AS base

FROM base AS builder

WORKDIR /var/www
COPY next.config.js next.config.js
COPY .next/ .next
COPY node_modules/ node_modules

RUN tar cfz /application.tar.gz .next node_modules next.config.js

COPY docker/docker-entrypoint.sh /tmp/bin/entrypoint.sh
RUN chmod 0755 /tmp/bin/*

FROM base

LABEL org.opencontainers.image.description="Archives LGBTQI"

EXPOSE 3000/tcp

COPY --from=builder /application.tar.gz /application.tar.gz
COPY --from=builder /tmp/bin/entrypoint.sh /usr/local/bin/entrypoint.sh

ENV HOME=/var/www

WORKDIR /var/www

RUN apk add --no-cache --update-cache --upgrade \
        bash \
        libc6-compat \
        npm && \
     chmod 0777 /var/www

CMD [ "entrypoint.sh" ]
