# NotesHub Backend

Express.js backend API for NotesHub.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Features

- Express.js with TypeScript
- PostgreSQL database integration
- Redis for caching and sessions
- JWT authentication
- RESTful API design
- Request validation with Joi
- Security middleware (helmet, cors)

## Development

The backend runs on `http://localhost:3001` and provides API endpoints for the frontend.

## Environment Variables

```env
DATABASE_URL=postgresql://username:password@localhost:5432/noteshub
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
BACKEND_PORT=3001
```

## API Endpoints

- `GET /health` - Health check
- `GET /api` - API information