# Use Python base image and install Node
FROM python:3.10-slim

# Install Node.js (LTS) and build tools
RUN apt-get update && apt-get install -y curl build-essential \
  && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy everything
COPY . .

# Install Python dependencies for ML
WORKDIR /app/server/ml
RUN pip install --no-cache-dir -r requirements.txt

# Install server dependencies
WORKDIR /app/server
RUN npm install --production

# (Optional) Build client and serve it from server if you wish
# WORKDIR /app/client
# RUN npm install
# RUN npm run build
# and configure server to serve /client/dist

ENV PORT=4000
EXPOSE 4000

# Start the server (ensure server/package.json has "start" script)
WORKDIR /app/server
CMD ["npm", "run", "start"]
