# NotesHub

A modern, full-stack notes management application built with a monorepo architecture. NotesHub provides a comprehensive solution for creating, organizing, and managing your notes with real-time collaboration features.

## 🏗️ Architecture

NotesHub is built as a monorepo using npm workspaces, containing the following applications:

```
noteshub-monorepo/
├── apps/
│   ├── frontend/         # Next.js 14+ React application
│   ├── backend/          # Node.js 20+ Express API server
│   └── worker/           # Background worker service
├── infra/                # Infrastructure and database scripts
├── package.json          # Root workspace configuration
├── docker-compose.yml    # Local development environment
└── README.md
```

## 🚀 Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **NextAuth.js** - Authentication

### Backend
- **Node.js 20+** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions

### Worker
- **Node.js** - Background job processing
- **Bull Queue** - Job queue management
- **Redis** - Queue storage

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **PostgreSQL** - Database
- **Redis** - Cache and queue storage

## 🛠️ Prerequisites

- Node.js 20+ 
- npm 10+
- Docker & Docker Compose (for local development)
- PostgreSQL 16+ (if running without Docker)
- Redis 7+ (if running without Docker)

## ⚡ Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd noteshub-monorepo
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Update database credentials, JWT secrets, etc.
```

### 3. Start with Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Start without Docker

```bash
# Start database services first
# PostgreSQL on port 5432
# Redis on port 6379

# Start all applications
npm run dev

# Or start individually
npm run frontend:dev    # Frontend on http://localhost:3000
npm run backend:dev     # Backend on http://localhost:3001
npm run worker:dev      # Worker service
```

## 📦 Available Scripts

### Root Level Commands

```bash
npm run dev              # Start all apps in development mode
npm run build            # Build all applications
npm run start            # Start all applications in production mode
npm run test             # Run tests across all workspaces
npm run lint             # Lint all applications
npm run clean            # Clean build artifacts
```

### App-Specific Commands

```bash
npm run frontend:dev     # Start frontend only
npm run frontend:build   # Build frontend only
npm run backend:dev      # Start backend only
npm run backend:build    # Build backend only
npm run worker:dev       # Start worker only
npm run worker:build     # Build worker only
```

## 🗄️ Database Setup

The application uses PostgreSQL as the primary database. Initial setup scripts are located in the `infra/` directory.

```bash
# With Docker Compose (automatic)
docker-compose up postgres

# Manual setup
psql -U postgres -f infra/init.sql
```

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example` for complete list):

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/noteshub"
REDIS_URL="redis://localhost:6379"

# Backend
BACKEND_PORT=3001
JWT_SECRET="your-jwt-secret"

# Frontend
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-nextauth-secret"
```

## 📖 Development Guide

### Adding New Features

1. **Frontend Changes**: Work in `apps/frontend/`
2. **API Changes**: Work in `apps/backend/`
3. **Background Jobs**: Work in `apps/worker/`

### Code Organization

- **Frontend**: Uses Next.js App Router structure
- **Backend**: RESTful API with Express.js
- **Worker**: Background job processing
- **Shared Types**: Consider creating a shared package for common types

### Testing

```bash
# Run all tests
npm run test

# Test specific workspace
npm run test --workspace=apps/frontend
npm run test --workspace=apps/backend
npm run test --workspace=apps/worker
```

## 🚀 Deployment

### Production Build

```bash
# Build all applications
npm run build

# Start in production mode
NODE_ENV=production npm run start
```

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jeet Gupta**
- Email: jeet.gupta.codes@gmail.com
- Medium: [@jeet.gupta.codes](https://medium.com/@jeet.gupta.codes)

---

Built with ❤️ using modern web technologies