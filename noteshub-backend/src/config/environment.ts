import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  
  // Database
  DATABASE_URL: Joi.string().required(),
  
  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),
  
  // Password Security
  BCRYPT_ROUNDS: Joi.number().default(12),
  
  // AWS S3
  AWS_ACCESS_KEY_ID: Joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
  AWS_REGION: Joi.string().default('us-east-1'),
  AWS_S3_BUCKET: Joi.string().optional(),
  
  // OAuth
  GOOGLE_CLIENT_ID: Joi.string().optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().optional(),
  GITHUB_CLIENT_ID: Joi.string().optional(),
  GITHUB_CLIENT_SECRET: Joi.string().optional(),
  
  // Redis
  REDIS_URL: Joi.string().optional(),
  
  // API
  API_BASE_URL: Joi.string().default('http://localhost:3000'),
  FRONTEND_URL: Joi.string().default('http://localhost:3001'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
  
  // File Upload
  MAX_FILE_SIZE: Joi.number().default(10485760),
  ALLOWED_FILE_TYPES: Joi.string().default('image/jpeg,image/png,image/gif,application/pdf,text/plain'),
  
  // AI
  OPENAI_API_KEY: Joi.string().optional(),
  AI_MODEL: Joi.string().default('gpt-3.5-turbo'),
  
  // Email
  EMAIL_SERVICE: Joi.string().optional(),
  EMAIL_USER: Joi.string().optional(),
  EMAIL_PASSWORD: Joi.string().optional(),
  
  // Logging
  LOG_LEVEL: Joi.string().default('info'),
  LOG_FILE: Joi.string().default('logs/app.log'),
});

export interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  BCRYPT_ROUNDS: number;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION: string;
  AWS_S3_BUCKET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  REDIS_URL?: string;
  API_BASE_URL: string;
  FRONTEND_URL: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  MAX_FILE_SIZE: number;
  ALLOWED_FILE_TYPES: string;
  OPENAI_API_KEY?: string;
  AI_MODEL: string;
  EMAIL_SERVICE?: string;
  EMAIL_USER?: string;
  EMAIL_PASSWORD?: string;
  LOG_LEVEL: string;
  LOG_FILE: string;
}

let env: Environment;

try {
  const { error, value } = envSchema.validate(process.env, { 
    allowUnknown: true,
    stripUnknown: true 
  });
  
  if (error) {
    throw error;
  }
  
  env = value as Environment;
} catch (error) {
  console.error('❌ Invalid environment variables:');
  if (error instanceof Joi.ValidationError) {
    console.error(error.details.map(detail => detail.message).join('\n'));
  } else {
    console.error(error);
  }
  process.exit(1);
}

export { env };

export const config = {
  app: {
    name: 'NotesHub API',
    version: '1.0.0',
    env: env.NODE_ENV,
    port: env.PORT,
    baseUrl: env.API_BASE_URL,
    frontendUrl: env.FRONTEND_URL,
  },
  
  database: {
    url: env.DATABASE_URL,
  },
  
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  
  security: {
    bcryptRounds: env.BCRYPT_ROUNDS,
    rateLimit: {
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    },
  },
  
  aws: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION,
    s3Bucket: env.AWS_S3_BUCKET,
  },
  
  oauth: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  
  redis: {
    url: env.REDIS_URL,
  },
  
  fileUpload: {
    maxSize: env.MAX_FILE_SIZE,
    allowedTypes: env.ALLOWED_FILE_TYPES.split(','),
  },
  
  ai: {
    openaiApiKey: env.OPENAI_API_KEY,
    model: env.AI_MODEL,
  },
  
  email: {
    service: env.EMAIL_SERVICE,
    user: env.EMAIL_USER,
    password: env.EMAIL_PASSWORD,
  },
  
  logging: {
    level: env.LOG_LEVEL,
    file: env.LOG_FILE,
  },
};