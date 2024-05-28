FROM node:21.7.1

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src public next* postcss.config.cjs tsconfig.json .
EXPOSE 3000
RUN npm run build

CMD npm run start