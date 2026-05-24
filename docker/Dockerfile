FROM node:20-alpine AS base

# --- Dependencies ---
FROM base AS deps

WORKDIR /var/www

COPY package.json package-lock.json ./
RUN npm clean-install

# --- Builder: build + package artifacts ---
FROM base AS builder

WORKDIR /var/www

COPY --from=deps /var/www/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SANITY_DATASET
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG SANITY_API_READ_TOKEN

ENV NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID
ENV SANITY_API_READ_TOKEN=$SANITY_API_READ_TOKEN

RUN npm run build

RUN tar cfz /application.tar.gz .next node_modules next.config.js

COPY docker/docker-entrypoint.sh /tmp/bin/entrypoint.sh
RUN chmod 0755 /tmp/bin/entrypoint.sh

# --- Runtime ---
FROM base

LABEL org.opencontainers.image.description="Archives LGBTQI"

RUN apk add --no-cache --update-cache bash libc6-compat \
    && addgroup -S app \
    && adduser -S app -G app

COPY --from=builder /application.tar.gz /application.tar.gz
COPY --from=builder /tmp/bin/entrypoint.sh /usr/local/bin/entrypoint.sh

ENV HOME=/var/www
WORKDIR /var/www

RUN chown app:app /var/www

USER app

EXPOSE 3000/tcp

ENTRYPOINT ["entrypoint.sh"]
