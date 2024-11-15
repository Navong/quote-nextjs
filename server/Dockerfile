FROM alpine:3.21

# Install Node.js and npm
RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY /prisma ./prisma

RUN npx prisma generate

COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]