FROM node:11.6.0-alpine

COPY . /app
WORKDIR /app

RUN npm install
RUN npm rebuild node-sass

EXPOSE 3000

CMD ["npm", "run", "start"]

