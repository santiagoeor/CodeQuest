FROM node:20-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package definition
COPY package*.json ./

# Expose port
EXPOSE 4200

# Start development server
CMD ["sh", "-c", "if [ ! -d node_modules ] && [ -f package.json ]; then npm install 2>/dev/null || true; fi && npm start"]
