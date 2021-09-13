FROM node:lts-alpine
RUN apk add --no-cache git g++ musl-dev libc-dev linux-headers tzdata python3-dev python2-dev make gcc ; mkdir -p /usr/node_app

COPY . /usr/node_app
WORKDIR /usr/node_app

RUN npm install --production

CMD ["npm", "start"]
