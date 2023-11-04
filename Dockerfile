# Use the official Node.js image as the base image
FROM node:latest

# Install dockerize
RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz && \
    tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.6.1.tar.gz && \
    rm dockerize-linux-amd64-v0.6.1.tar.gz

# Set the working directory in the container
WORKDIR /app

# Update npm to version 10.2.3
RUN npm install -g npm@10.2.3

# Copy the the application code including package.json and package-lock.json to the container
COPY . .

# Install project dependencies
RUN npm install

# Expose a port if your application listens on a specific port (optional)
EXPOSE 8000

# Command to run your Node.js application
CMD ["npm", "test"]
