# NotesHub API Documentation

## Quick Start

To test the API, you can use curl commands or any HTTP client like Postman.

### 1. Register a new user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user-id",
      "email": "test@example.com",
      "username": "testuser",
      "firstName": "Test",
      "lastName": "User",
      "avatar": null,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "jwt-access-token",
      "refreshToken": "jwt-refresh-token"
    }
  }
}
```

### 2. Login user

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### 3. Get user profile (requires authentication)

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer your-access-token"
```

### 4. Health check

```bash
curl -X GET http://localhost:3000/health
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the access token in the Authorization header:

```
Authorization: Bearer your-access-token
```

## Rate Limiting

- **Authentication endpoints**: 5 requests per 15 minutes
- **File upload endpoints**: 10 requests per minute
- **Search endpoints**: 30 requests per minute
- **Chat endpoints**: 20 requests per minute
- **General API**: 100 requests per 15 minutes

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "details": {} // Optional additional details
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (resource already exists)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Environment Configuration

Key environment variables for production:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL="your-database-connection-string"
JWT_SECRET="your-secure-jwt-secret"
JWT_REFRESH_SECRET="your-secure-refresh-secret"
```

Optional for enhanced features:
```env
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_S3_BUCKET="your-s3-bucket"
OPENAI_API_KEY="your-openai-key"
REDIS_URL="redis://localhost:6379"
```

## Development

1. Clone the repository
2. Navigate to `noteshub-backend/`
3. Copy `.env.example` to `.env`
4. Install dependencies: `npm install`
5. Start development server: `npm run dev`

The API will be available at `http://localhost:3000`

## Deployment

### Using Docker

```bash
cd noteshub-backend
docker build -t noteshub-backend .
docker run -p 3000:3000 --env-file .env noteshub-backend
```

### Using Docker Compose

```bash
cd noteshub-backend
docker-compose up
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Code Quality

Check code quality:

```bash
npm run lint
npm run format
```

## Support

For questions or issues, please contact:
- Email: jeet.gupta.codes@gmail.com
- GitHub: [@JeetG-AlphaDev](https://github.com/JeetG-AlphaDev)