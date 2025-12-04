FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files first for better layer caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Expose port
EXPOSE 5173

# Start development server with hot reload
CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0"]

