FROM node:7.9

WORKDIR .

COPY . .

RUN npm install -g pm2

RUN npm install

EXPOSE 3000

CMD ["pm2-docker", "pm2.json"]