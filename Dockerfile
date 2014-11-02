FROM node:0.11
ADD . /code
WORKDIR /code
RUN npm install -g gulp bower && npm install && bower install --allow-root
