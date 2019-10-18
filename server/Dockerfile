FROM node:8.7.0-alpine


RUN mkdir -p /srv/app/grampy-server
WORKDIR /srv/app/grampy-server

COPY package.json /srv/app/grampy-server
COPY package-lock.json /srv/app/grampy-server

RUN npm install

COPY . /srv/app/grampy-server

CMD ["npm", "run", "server"]
