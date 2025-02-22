FROM node:20-alpine

WORKDIR /opt/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 1337

CMD ["yarn", "develop"]