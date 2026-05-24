FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN chown -R node:node /usr/src/app

USER node

EXPOSE 3000

CMD ["npm", "run", "dev"]
