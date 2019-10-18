FROM node:8.7.0-alpine

RUN mkdir -p /srv/app/grampy-client

WORKDIR /srv/app/grampy-client

COPY package.json /srv/app/grampy-client
COPY package-lock.json /srv/app/grampy-client

RUN npm install

COPY . /srv/app/grampy-client

CMD ["npm", "start"]