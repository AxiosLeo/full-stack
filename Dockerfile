# step 1: docker build -t full-stack .
# step 2: docker run -tdi --rm --name full-stack-container full-stack
# step 3: docker exec -ti full-stack-container /bin/bash

FROM node:latest AS base

FROM base AS build

WORKDIR /usr/src/app
COPY ./backend /usr/src/app/backend/
RUN cd /usr/src/app/backend && \
  npm install && \
  npm run build
COPY ./web /usr/src/app/web
RUN cd /usr/src/app/web && \
  rm -rf node_modules yarn.lock && \
  yarn install && \
  yarn build

FROM base AS package
ARG DEPLOY_ENV="dev"
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/backend/dist /usr/src/app/src
COPY --from=build /usr/src/app/backend/package.json /usr/src/app/package.json
COPY --from=build /usr/src/app/backend/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/web/dist /usr/src/app/views

EXPOSE 3300

ENV DEPLOY_ENV=${DEPLOY_ENV}

CMD ["node", "/usr/src/app/src/bootstrap.js"]
