FROM node:20-alpine AS builder
WORKDIR /app
COPY server/package.json server/package-lock.json* ./
RUN npm install
COPY server/ .
# Copy prisma schema from root so server can generate client
COPY prisma/ ./prisma/
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/socketServer.js"]
