# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
RUN npm install pm2 -g
COPY ecosystem.config.cjs .
EXPOSE 30069
CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]
