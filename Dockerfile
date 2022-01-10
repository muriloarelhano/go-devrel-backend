FROM node:alpine

COPY . .

RUN npm install && rm -r src

CMD [ "npm", "run start:dev" ]
