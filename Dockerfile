# Use a Node.js base image
FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy all application files
COPY . .

# Cloud Run always sets the PORT env variable. Listen on it.
ENV PORT 8080
EXPOSE 8080

# Start the Node.js application
CMD [ "npm", "start" ]
