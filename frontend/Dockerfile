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