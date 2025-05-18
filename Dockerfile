FROM node:18-alpine
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Expose and start Vite in host‐accessible mode
EXPOSE 4000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4000"]
