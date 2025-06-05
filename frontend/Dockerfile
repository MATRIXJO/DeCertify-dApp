# Build stage: use Node.js to build the static files
FROM node:18 AS build

WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the React app for production
RUN npm run build

# Production stage: use Nginx to serve the static files
FROM nginx:alpine

# Copy the build output from the previous stage to Nginx's public folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (default for HTTP)
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
