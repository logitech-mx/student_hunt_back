# Step 1: Use a Node.js base image
FROM node:18-slim

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/

# Step 3: Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the entire project into the working directory
COPY . .

# Step 6: Expose the port that the app will run on
EXPOSE 8080

# Step 7: Define the command to run the app (either in production or development)
CMD ["npm", "run", "start"]
