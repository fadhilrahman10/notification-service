# Gunakan image Node.js sebagai base image
FROM node:16

# Set working directory di dalam container
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh source code ke dalam container
COPY . .

# Jalankan aplikasi
CMD ["npm", "run", "start"]
