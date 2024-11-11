FROM node:alpine
COPY package.json .
WORKDIR /app
RUN yarn install
RUN yarn add typescript -g && yarn add tsx -g
COPY . /app
# RUN tsc
CMD tsx watch /app/src/index.ts