import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/environment';
import { initializeDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/error';
import { apiLimiter } from './middleware/rateLimiting';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import noteRoutes from './routes/notes';
import fileRoutes from './routes/files';
import chatRoutes from './routes/chat';
import adminRoutes from './routes/admin';
import healthRoutes from './routes/health';

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, etc)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      config.app.frontendUrl,
      'http://localhost:3000',
      'http://localhost:3001',
    ];
    
    if (allowedOrigins.includes(origin) || config.app.env === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api', apiLimiter);

// Health check (before rate limiting for monitoring)
app.use('/health', healthRoutes);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'NotesHub API is running',
    version: '1.0.0',
    docs: '/api/docs',
    health: '/health',
  });
});

// 404 handler
app.use('*', notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Server startup
async function startServer() {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    const port = config.app.port;
    
    app.listen(port, () => {
      console.log(`🚀 NotesHub API server running on port ${port}`);
      console.log(`📝 Environment: ${config.app.env}`);
      console.log(`🌐 API Base URL: ${config.app.baseUrl}`);
      console.log(`💻 Frontend URL: ${config.app.frontendUrl}`);
      console.log(`📊 Health check: ${config.app.baseUrl}/health`);
      
      if (config.app.env === 'development') {
        console.log(`🔧 Database Studio: Run 'npm run db:studio' to open Prisma Studio`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

// Start the server
if (require.main === module) {
  startServer();
}

export default app;