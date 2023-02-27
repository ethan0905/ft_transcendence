FROM node:latest AS Production

ENV NODE_ENV=production

# WORKDIR /usr/src/backend
WORKDIR /app

COPY package.json .
# COPY tsconfig.json .

# RUN yarn add -D prisma @types/passport-jwt pactum dotenv-cli @nestjs/cli @prisma/client class-validator class-transformer argon2 @nestjs/config @nestjs/passport passport @nestjs/jwt passport-jwt

# # missing package when running the docker?
# RUN yarn add -D @node-rs/xxhash-linux-arm64-gnu

# RUN yarn install

RUN npm install @nestjs/cli 
RUN npm install express

RUN npm install

COPY . .

# RUN npm run build

EXPOSE 3000
# CMD ["/bin/sh", "-c", "yarn start:dev"]

# ENTRYPOINT ["/bin/sh", "-c", "npm install && npx prisma migrate dev && npm run build && npx prisma migrate deploy && npm start"]
# CMD ["/bin/sh", "-c", "npm start && sleep 2 && npx prisma migrate deploy"]
CMD ["/bin/sh", "-c", "npm start ; npx prisma migrate deploy"]

# CMD ["/bin/bash"]

# FROM node:14

# COPY ./     /app/

# WORKDIR /app

# RUN  yarn install

# EXPOSE 3333

# CMD ["yarn", "start:dev"]