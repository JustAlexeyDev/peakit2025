FROM oven/bun:1.1-alpine
WORKDIR /usr/src/app

# Install system deps sometimes needed by react-native tooling (git, bash)
RUN apk add --no-cache git bash

COPY package.json bun.lockb* ./
RUN bun install || true

COPY . .

ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0 \
    EXPO_NO_TELEMETRY=1 \
    EXPO_USE_DEV_SERVER=1

# Metro + Expo ports
EXPOSE 8081 19000 19001 19002

CMD ["bunx", "--bun", "expo", "start", "--tunnel", "--clear", "--non-interactive"]


