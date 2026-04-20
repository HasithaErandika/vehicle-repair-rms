# Use a lightweight Node.js LTS image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Ensure the app binds to the dynamically assigned port (Digital Ocean injects PORT)
EXPOSE 5000

# Start the Express server
CMD ["npm", "start"]
