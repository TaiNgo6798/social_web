FROM node:10

WORKDIR /usr/src/app/socialweb/socialFront

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 3000

CMD ["npm", "run", "start"]