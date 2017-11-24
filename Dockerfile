FROM node:8-alpine

ENV PASSWORD pwd

ADD . /srv

RUN set -ex && \
    cd /srv && \
    yarn

EXPOSE 3000

CMD ["node", "/srv/app.js"]