FROM node:14 AS Production

ENV NODE_ENV=production

WORKDIR /usr/src/backend

COPY package.json .
COPY tsconfig.json .

RUN yarn add -D prisma @types/passport-jwt pactum dotenv-cli
RUN yarn add @prisma/client class-validator class-transformer argon2 @nestjs/config @nestjs/passport passport @nestjs/jwt passport-jwt

RUN yarn install

COPY . .

RUN yarn build

CMD ["sh", "-c", "yarn start:dev"]