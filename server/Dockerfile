FROM node:12.10.0-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npm run seed && npm run start"]