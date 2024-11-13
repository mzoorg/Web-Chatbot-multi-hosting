FROM node:12.10.0-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

ADD https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem .

EXPOSE 5000

CMD ["sh", "-c", "npm run seed && node ./src/index.js"]