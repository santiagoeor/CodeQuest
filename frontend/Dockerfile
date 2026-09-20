FROM node:20-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package definition and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 4200

# If volume mount overrides /app/node_modules with an empty dir, install deps automatically
CMD ["sh", "-c", "if [ ! -d node_modules/@angular/cli ]; then echo '[Frontend] Instalando dependencias en el volumen...' && npm install; fi && npm start"]
