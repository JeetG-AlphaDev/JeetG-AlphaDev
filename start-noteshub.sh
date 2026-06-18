#!/bin/bash

# NotesHub Backend Quick Start Script
echo "🚀 Starting NotesHub Backend API..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ to continue."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm to continue."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Navigate to the backend directory
cd noteshub-backend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating environment file..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration before production use"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm test

# Check if build was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 NotesHub Backend is ready!"
    echo ""
    echo "📋 Available commands:"
    echo "  npm run dev       - Start development server with hot reload"
    echo "  npm start         - Start production server"
    echo "  npm test          - Run tests"
    echo "  npm run lint      - Check code quality"
    echo "  npm run format    - Format code"
    echo ""
    echo "🌐 API will be available at: http://localhost:3000"
    echo "📊 Health check: http://localhost:3000/health"
    echo "📚 API routes:"
    echo "  POST /api/auth/register   - Register new user"
    echo "  POST /api/auth/login      - Login user"
    echo "  GET  /api/auth/profile    - Get user profile"
    echo "  GET  /api/notes           - Get user notes"
    echo "  POST /api/notes           - Create new note"
    echo ""
    echo "🔧 To start development server:"
    echo "  cd noteshub-backend && npm run dev"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi