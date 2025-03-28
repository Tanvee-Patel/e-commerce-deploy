FROM node:20
WORKDIR /app
COPY package*.json /app
RUN npm ci
RUN npm i bcryptjs
COPY . .
CMD ["npm", "start"]