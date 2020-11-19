FROM node:10

WORKDIR /usr/src/app

ENV PATH /usr/src/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install
RUN npm install express -g

COPY . /usr/src/app

EXPOSE 9000

CMD [ "npm", "start" ]