FROM node:latest AS Production

ENV NODE_ENV=production

WORKDIR /app

EXPOSE 3000

# ENTRYPOINT ["/bin/sh", "-c", "npm install && npx prisma migrate dev && npm run build && npx prisma migrate deploy && npm start"]
# CMD ["/bin/sh", "-c", "npm start && sleep 2 && npx prisma migrate deploy"]
CMD ["/bin/sh", "-c", "npm run start:debug ; npx prisma migrate deploy"]