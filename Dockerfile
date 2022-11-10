FROM node:16.15

WORKDIR /home/node/app

COPY . .

COPY ./.docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

RUN yarn

CMD [ "/entrypoint.sh" ]