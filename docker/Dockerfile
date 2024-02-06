FROM node:alpine

ENV VERSION=${VERSION:-'development'} \
  USER_AGENT=${USER_AGENT:-"GenericApp/development"} \
  TZ=${TZ:-'America/New_York'} \
  CRON=1 \
  WORKDIR=/usr/src/app

LABEL maintainer="r/bruxc <bruxc@sunsreddit.net>" \
  version="$VERSION" \
  description="Automates POST to Reddit API endpoint \
  `/api/site_admin endpoint` (modconfig:description)."

WORKDIR $WORKDIR

COPY ../bin ./bin
COPY ../config ./config
COPY ../scripts/docker/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY ../src ./src
COPY ../package*.json .
COPY ../.npmrc .

RUN chmod +x /usr/local/bin/entrypoint.sh && \
    chown -R node:node $WORKDIR

USER node

RUN npm ci && rm .npmrc

ENTRYPOINT [ "entrypoint.sh" ]