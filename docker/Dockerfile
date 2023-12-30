FROM node:alpine

ENV VERSION=${VERSION:-'development'} \
    NPM_CRON=${NPM_CRON:-false} \
    USER_AGENT=${USER_AGENT:-"GenericApp/development"} \
    TZ=${TZ:-'America/New_York'}

LABEL maintainer="r/bruxc <bruxc@sunsreddit.net>" \
      version="$VERSION" \
      description="Automates POST to Reddit API endpoint \
        `/api/site_admin endpoint` (modconfig:description)."

WORKDIR /usr/src/app

COPY ../package.json ./
COPY ../package-lock.json ./
COPY ../src/ ./src/
COPY ../bin/ ./bin/
COPY ../config/ ./config/



RUN npm install

CMD ["npm", "run", "start:cron"]