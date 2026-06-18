# NotesHub Backend API

A comprehensive backend API and authentication system for NotesHub - a modern note-taking application with AI integration.

## 🚀 Features

### Core Features
- **RESTful API** - Complete REST API for notes, users, and admin operations
- **JWT Authentication** - Secure authentication with access and refresh tokens
- **Database Integration** - PostgreSQL with Prisma ORM
- **File Upload** - S3 integration for file storage
- **AI Chat** - OpenAI integration for AI-powered assistance
- **Search** - Full-text search functionality
- **Admin Panel** - Administrative operations and dashboard

### Security Features
- **Password Hashing** - bcrypt for secure password storage
- **Rate Limiting** - Configurable rate limits for different endpoints
- **CORS Protection** - Cross-origin resource sharing configuration
- **Input Validation** - Joi validation for all inputs
- **Security Headers** - Helmet.js for security headers

### Developer Features
- **TypeScript** - Full TypeScript support
- **Testing** - Jest testing framework
- **API Documentation** - Swagger/OpenAPI documentation
- **Code Quality** - ESLint and Prettier
- **Database Migrations** - Prisma migrations
- **Database Seeding** - Demo data seeding

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn
- (Optional) Redis for caching
- (Optional) AWS S3 for file storage

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd noteshub-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/noteshub"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key"
   # ... other variables
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed demo data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Notes Endpoints
- `GET /api/notes` - Get user's notes
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

### File Endpoints
- `POST /api/files/upload` - Upload a file
- `GET /api/files` - Get user's files
- `DELETE /api/files/:id` - Delete a file

### Chat Endpoints
- `GET /api/chat/sessions` - Get chat sessions
- `POST /api/chat/sessions` - Create a new chat session
- `POST /api/chat/sessions/:id/messages` - Send a message

### Admin Endpoints
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/notes` - Get all notes

### Health Check
- `GET /health` - Health check
- `GET /health/ready` - Readiness check  
- `GET /health/live` - Liveness check

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔧 Development

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Database Operations
```bash
# Generate Prisma client
npm run db:generate

# Create and run migration
npm run db:migrate

# Reset database
npm run db:reset

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

### Build and Deploy
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
noteshub-backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── index.ts        # Application entry point
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Database seeding
├── tests/              # Test files
├── .env.example        # Environment variables template
└── package.json        # Dependencies and scripts
```

## 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `JWT_SECRET` | JWT secret key | Yes | - |
| `JWT_REFRESH_SECRET` | JWT refresh secret key | Yes | - |
| `AWS_ACCESS_KEY_ID` | AWS access key | No | - |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | No | - |
| `AWS_S3_BUCKET` | S3 bucket name | No | - |
| `OPENAI_API_KEY` | OpenAI API key | No | - |
| `REDIS_URL` | Redis connection string | No | - |

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

- **Users** - User accounts and profiles
- **Notes** - User notes with content and metadata
- **Files** - File attachments and uploads
- **ChatSessions** - AI chat conversations
- **ChatMessages** - Individual chat messages
- **Admins** - Administrative users
- **AuditLogs** - System audit trails

## 🔒 Security Features

- **JWT Authentication** - Stateless authentication
- **Password Hashing** - bcrypt with configurable rounds
- **Rate Limiting** - Configurable per-endpoint limits
- **Input Validation** - Joi schema validation
- **CORS Protection** - Configurable CORS settings
- **Security Headers** - Helmet.js security headers
- **SQL Injection Protection** - Prisma ORM parameterized queries

## 🚀 Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t noteshub-backend .

# Run container
docker run -p 3000:3000 --env-file .env noteshub-backend
```

### Environment-specific Configuration
- **Development**: Full logging, debug mode
- **Production**: Optimized logging, error handling
- **Testing**: Mock database, isolated tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jeet Gupta**
- Email: jeet.gupta.codes@gmail.com
- GitHub: [@JeetG-AlphaDev](https://github.com/JeetG-AlphaDev)

## 🙏 Acknowledgments

- [Prisma](https://prisma.io/) - Next-generation ORM
- [Express.js](https://expressjs.com/) - Web framework
- [JWT](https://jwt.io/) - Authentication tokens
- [OpenAI](https://openai.com/) - AI integration
- [AWS S3](https://aws.amazon.com/s3/) - File storage