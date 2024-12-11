# Stage 1: Build the React app
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json
COPY package.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variables
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}

# RUN npm run build

# RUN npm start

CMD ["npm","run","nextDev"]
