FROM node:24-alpine AS base

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

ENV NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID

RUN npm run build
RUN mkdir -p /app && cp -r .next node_modules next.config.js /app/

COPY docker/docker-entrypoint.sh /tmp/bin/entrypoint.sh
RUN chmod 0755 /tmp/bin/entrypoint.sh

# --- Runtime ---
FROM base

EXPOSE 3000/tcp

RUN apk add --no-cache --upgrade \
        bash \
        libc6-compat && \
    addgroup --gid 10001 --system app && \
    adduser --uid 10001 \
            --system \
            --disabled-password \
            --home /var/www \
            --shell /sbin/nologin \
            --ingroup app \
            --gecos app \
            app

COPY --from=builder /tmp/bin/entrypoint.sh /usr/local/bin/entrypoint.sh

WORKDIR /var/www
COPY --from=builder /app/ .

USER app
ENTRYPOINT [ "entrypoint.sh" ]
