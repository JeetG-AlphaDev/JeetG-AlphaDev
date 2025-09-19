# NotesHub Frontend

Next.js 14+ frontend application for NotesHub.

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

- Modern React with Next.js 14+ App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Responsive design
- Authentication ready

## Development

The frontend runs on `http://localhost:3000` and communicates with the backend API on `http://localhost:3001`.

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```