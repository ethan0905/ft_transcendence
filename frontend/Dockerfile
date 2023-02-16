FROM node:14 as development

ENV NODE_ENV=development

WORKDIR /app

COPY . .

EXPOSE 3333

CMD ["/bin/sh", "-c", "npm install && npm start"]