FROM node:24-alpine AS base

# --- Dependencies ---
FROM base AS deps

WORKDIR /var/www

COPY package.json package-lock.json ./
# no lifecycle scripts: the platform binaries (esbuild, sharp, SWC) ship as optional dependencies
RUN npm clean-install --ignore-scripts

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
RUN npm prune --omit=dev
RUN mkdir -p /app && cp -r .next node_modules next.config.js /app/

COPY docker/docker-entrypoint.sh /tmp/entrypoint.sh
RUN chmod 0755 /tmp/entrypoint.sh

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

COPY --from=builder /tmp/entrypoint.sh /usr/local/bin/entrypoint.sh

WORKDIR /var/www
COPY --chown=app:app --from=builder /app/ .
USER app

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget -q -O /dev/null "http://127.0.0.1:${PORT:-3000}/robots.txt" || exit 1

ENTRYPOINT [ "entrypoint.sh" ]
