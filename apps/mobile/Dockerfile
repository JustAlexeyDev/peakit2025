FROM node:20-alpine
WORKDIR /usr/src/app

RUN apk add --no-cache git bash

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .

ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0 \
    EXPO_NO_TELEMETRY=1 \
    EXPO_USE_DEV_SERVER=1 \
    CI=1

# Metro + Expo ports
EXPOSE 8081 19000 19001 19002

CMD ["npx", "expo", "start", "--lan", "--clear"]


