FROM node:20-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package definitions and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build Angular for production (generates dist/codequest-frontend/browser)
RUN npm run build

# Expose production port
EXPOSE 4200

# Start production server
CMD ["node", "server.js"]
