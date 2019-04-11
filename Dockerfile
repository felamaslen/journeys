FROM node:alpine

WORKDIR /opt/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --only=production
RUN npm install --only=development

COPY . .

ENV NODE_ENV=development

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "dev:polling"]
