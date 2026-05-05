# Use a lightweight Node.js LTS image
FROM node:20-alpine AS base

# Set the working directory inside the container
WORKDIR /usr/src/app

# --- Dependencies Stage ---
FROM base AS deps
COPY package*.json ./
RUN npm ci

# --- Production Stage ---
FROM base AS release
ENV NODE_ENV=production

# Copy only production dependencies from deps stage
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY package*.json ./

# Copy the application code
COPY . .

# Use a non-root user for better security
USER node

# Ensure the app binds to the dynamically assigned port
EXPOSE 5000

# Start the Express server
CMD ["node", "server.js"]
