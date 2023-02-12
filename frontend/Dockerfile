# Dockerfile
# Pull the base image
# FROM node:13.12.0-alpine
# # Set the working directory
# WORKDIR /usr/src/frontend
# # Copy app dependencies to container
# COPY ./package*.json ./
# # # Add `/app/node_modules/.bin` to $PATH
# # ENV PATH /app/node_modules/.bin:$PATH
# # Install dependencies
# RUN npm install
# # Deploy app for local development
# CMD npm start --host 0.0.0.0 --port 3000 --disableHostCheck true


FROM node:14 AS Production

ENV NODE_ENV=production

WORKDIR /usr/src/frontend

COPY package.json .

RUN npm install axios
RUN npm install

COPY . .

RUN npm run build

CMD ["sh", "-c", "npm start"]