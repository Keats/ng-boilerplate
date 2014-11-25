FROM node:0.10-slim


RUN mkdir /home/angular

RUN npm install gulp -g && npm install bower -g

WORKDIR /home/angular

ADD package.json /home/angular/package.json
RUN npm install

ADD bower.json /home/angular/bower.json
ADD .bowerrc /home/angular/.bowerrc
RUN bower install --config.interactive=false --allow-root

ADD . /home/angular
