FROM node:alpine as development

WORKDIR /app
COPY . .
RUN npm install

FROM node:alpine as production

WORKDIR /app
COPY . .
RUN npm install
ENV NODE_ENV=production
EXPOSE 4000
CMD npm run start:prod
