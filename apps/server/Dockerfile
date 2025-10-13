FROM oven/bun:1.1-alpine
WORKDIR /usr/src/app
COPY package.json bun.lockb* ./
RUN bun install || true
COPY . .
RUN bun run prisma:generate
EXPOSE 4000
CMD ["bun", "run", "dev"]

