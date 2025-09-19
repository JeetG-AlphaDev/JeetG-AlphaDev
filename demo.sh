#!/bin/bash

# NotesHub Development Setup Script
echo "🚀 Setting up NotesHub development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update with your actual values."
fi

# Start infrastructure services
echo "🐳 Starting infrastructure services (PostgreSQL, Redis, MinIO)..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
if docker ps --filter "name=noteshub-postgres" --filter "health=healthy" | grep -q noteshub-postgres; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL is not ready"
fi

if docker ps --filter "name=noteshub-redis" --filter "health=healthy" | grep -q noteshub-redis; then
    echo "✅ Redis is ready"
else
    echo "❌ Redis is not ready"
fi

if docker ps --filter "name=noteshub-minio" --filter "health=healthy" | grep -q noteshub-minio; then
    echo "✅ MinIO is ready"
else
    echo "❌ MinIO is not ready"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup database
echo "🗄️ Setting up database..."
npm run db:generate
npm run db:push
npm run db:seed

echo "🎉 Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your actual API keys and secrets"
echo "2. Run 'npm run dev' to start the development servers"
echo "3. Visit http://localhost:3000 for the frontend"
echo "4. Visit http://localhost:3001 for the backend API"
echo "5. Visit http://localhost:9001 for MinIO console (minioadmin/minioadmin)"
echo ""
echo "Happy coding! 🚀"