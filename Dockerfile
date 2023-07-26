FROM mhart/alpine-node:12

RUN apk update && apk add tzdata

WORKDIR /app

COPY index.js /app/index.js
COPY lib /app/lib
COPY package.json /app/package.json

ENV NODE_ENV=production

RUN apk update && \
    apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && npm i \
    && apk del .gyp

CMD npm run config && npm start