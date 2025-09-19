# NotesHub Worker

Background worker service for NotesHub.

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

- Background job processing
- Email sending capabilities
- Notification processing
- Redis queue management with Bull
- Cron job scheduling

## Job Queues

- **Email Queue**: Handles email sending (welcome emails, notifications, etc.)
- **Notification Queue**: Handles in-app notifications

## Development

The worker service connects to Redis and processes background jobs from the main application.

## Environment Variables

```env
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://username:password@localhost:5432/noteshub
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```