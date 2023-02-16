FROM node:14 AS Production

ENV NODE_ENV=production

# WORKDIR /usr/src/backend
WORKDIR /app

# COPY package.json .
# COPY tsconfig.json .

# RUN yarn add -D prisma @types/passport-jwt pactum dotenv-cli @nestjs/cli @prisma/client class-validator class-transformer argon2 @nestjs/config @nestjs/passport passport @nestjs/jwt passport-jwt

# # missing package when running the docker?
# RUN yarn add -D @node-rs/xxhash-linux-arm64-gnu

# RUN yarn install

RUN yarn global add @nestjs/cli 
RUN yarn global add express

COPY . .

# RUN yarn run build

EXPOSE 3000
# CMD ["/bin/sh", "-c", "yarn start:dev"]

ENTRYPOINT ["/bin/sh", "-c", "yarn install --non-interactive && npx prisma migrate dev && yarn run build && yarn start:prod"]

# FROM node:14

# COPY ./     /app/

# WORKDIR /app

# RUN  yarn install

# EXPOSE 3333

# CMD ["yarn", "start:dev"]