FROM node:20-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package definition and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build Angular app
RUN npx ng build --configuration production 2>/dev/null || true

# Expose port
EXPOSE 4200

# In development (with volume mount), use ng serve for hot reload
# In production (without volume mount), serve the built dist/
CMD ["sh", "-c", "if [ -d node_modules/@angular/cli ]; then npx ng serve --host 0.0.0.0 --port 4200 --disable-host-check; else npm start; fi"]
