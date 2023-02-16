FROM node:14 as development

ENV NODE_ENV=development

WORKDIR /app

RUN yarn global add @nestjs/cli 
RUN yarn global add express
RUN yarn global add dotenv-cli

COPY . .

EXPOSE 3000

# if you want to run the app
ENTRYPOINT ["/bin/sh", "-c", "yarn install --non-interactive && npx prisma migrate dev && yarn run build && yarn start:prod"]
# if you want to do e2e tests
# CMD ["/bin/sh", "-c", "yarn install --non-interactive && npx prisma migrate dev"]
