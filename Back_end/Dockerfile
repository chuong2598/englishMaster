FROM node:10

WORKDIR /usr/src/app

ENV PATH /usr/src/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install

RUN npm install express -g

RUN npm install pm2 -g

COPY . /usr/src/app

EXPOSE 9000

CMD ["pm2-runtime", "app.js"]
