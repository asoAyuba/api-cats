FROM node:18

WORKDIR /app

COPY package*.json ./
COPY src ./src
COPY index.js ./

RUN npm install

EXPOSE 4000

CMD ["npm", "start"]