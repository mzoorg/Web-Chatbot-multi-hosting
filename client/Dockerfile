FROM node:12.10.0

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY ./src ./src

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
