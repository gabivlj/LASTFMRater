## DOCKERFILE FOR PRODUCTION -> FIRST BUILD REACT_APP WITH NPM RUN BUILD
FROM node:8.7.0-alpine


RUN mkdir -p /srv/app/grampy-server
RUN mkdir -p /srv/app/client/build

WORKDIR /srv/app/grampy-server

COPY ./server/package.json /srv/app/grampy-server
COPY ./server/package-lock.json /srv/app/grampy-server


RUN npm install

COPY ./server /srv/app/grampy-server
COPY ./client/build /srv/app/client/build


CMD ["npm", "run", "server"]
