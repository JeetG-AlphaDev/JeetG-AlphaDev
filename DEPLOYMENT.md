# NotesHub Deployment Checklist

## 🚀 Production Deployment Steps

### 1. Pre-deployment Preparation

- [ ] **Environment Variables**: Set all required environment variables
- [ ] **LLM API**: Configure and test LLM API integration
- [ ] **Domain & SSL**: Setup domain and SSL certificates
- [ ] **Database**: Provision PostgreSQL database
- [ ] **Storage**: Setup S3-compatible storage
- [ ] **Analytics**: Configure analytics services (optional)

### 2. Frontend Deployment (Vercel)

```bash
# 1. Connect GitHub repository to Vercel
# 2. Set environment variables in Vercel dashboard:
NEXT_PUBLIC_API_URL=https://your-backend-domain.com

# 3. Deploy automatically triggers on push to main branch
```

### 3. Backend Deployment (Railway)

```bash
# 1. Connect GitHub repository to Railway
# 2. Add Railway PostgreSQL and Redis services
# 3. Set environment variables:
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
JWT_SECRET=your-jwt-secret
LLM_API_BASE_URL=your-llm-api-url
LLM_API_KEY=your-llm-api-key
S3_ENDPOINT=your-s3-endpoint
S3_ACCESS_KEY=your-s3-key
S3_SECRET_KEY=your-s3-secret
```

### 4. Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 5. DNS & SSL Configuration

```bash
# Point domain to deployment
# Configure SSL certificates
# Update CORS_ORIGIN in backend
```

---

## 📧 Demo Account Credentials

### Administrator Account
- **Email**: admin@noteshub.com
- **Password**: admin123
- **Role**: Admin (full access)

### Standard User Account  
- **Email**: demo@noteshub.com
- **Password**: demo123
- **Role**: User (standard features)

### Premium User Account
- **Email**: premium@noteshub.com  
- **Password**: premium123
- **Role**: User (premium features enabled)

---

## 🤖 AI System Prompt Template

Use this system prompt when configuring your LLM integration:

```
You are an intelligent tutor assistant integrated into NotesHub, a platform for sharing and reading academic notes. Your role is to help students understand the content they're reading by answering questions and providing explanations.

Guidelines:
1. Always base your answers on the provided note context when available
2. Cite specific sections or line numbers from the notes when referencing information  
3. If the question cannot be answered from the context, clearly state this and offer general guidance
4. Keep responses concise but comprehensive
5. Use an encouraging, educational tone
6. Suggest follow-up questions or related topics when appropriate
7. If asked about topics not covered in the notes, acknowledge this and provide brief general information

Remember: You're helping students learn and understand their study materials better.
```

### Example LLM Configuration

For OpenAI GPT models:
```env
LLM_API_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=sk-your-openai-api-key
LLM_MODEL=gpt-3.5-turbo
STREAMING_SUPPORTED=true
```

For local Ollama:
```env
LLM_API_BASE_URL=http://localhost:11434/v1
LLM_API_KEY=dummy-key
LLM_MODEL=llama2
STREAMING_SUPPORTED=false
```

---

## 🔧 Environment Variables to Replace

### Critical (Must Replace)
- `LLM_API_BASE_URL` - Your LLM API endpoint
- `LLM_API_KEY` - Your LLM API key  
- `LLM_MODEL` - Your preferred model
- `DATABASE_URL` - Production database URL
- `REDIS_URL` - Production Redis URL
- `JWT_SECRET` - Strong JWT secret key
- `JWT_REFRESH_SECRET` - Strong refresh token secret

### Storage (S3 Compatible)
- `S3_ENDPOINT` - Your S3 endpoint URL
- `S3_ACCESS_KEY` - S3 access key
- `S3_SECRET_KEY` - S3 secret key
- `S3_BUCKET` - S3 bucket name
- `S3_PUBLIC_URL` - Public S3 URL for file access

### Payment (Optional)
- `STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret

### Analytics (Optional)
- `GOOGLE_ANALYTICS_ID` - Google Analytics tracking ID
- `PLAUSIBLE_DOMAIN` - Plausible Analytics domain
- `ADSENSE_CLIENT_ID` - Google AdSense client ID

### OAuth (Optional)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

---

Ready for production! 🎉