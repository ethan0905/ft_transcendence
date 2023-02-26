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

# =======

FROM node:latest AS Production

ENV NODE_ENV=production

# WORKDIR /usr/src/frontend
WORKDIR /app

# COPY package.json .

# RUN npm install axios
# RUN npm install

COPY . .

# RUN npm run build

EXPOSE 3333

CMD ["/bin/sh", "-c", "npm install && npm start"]

#-====

# FROM node:14

# COPY ./     /app/

# WORKDIR /app

# RUN npm install

# CMD ["npm", "run", "build"]

