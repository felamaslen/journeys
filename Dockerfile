FROM node:alpine

WORKDIR /opt/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --only=production
RUN npm install --only=development

COPY . .

RUN npm run build

ENV NODE_ENV=production

RUN npm prune

ENV PORT=3000

CMD ["npm", "start"]
