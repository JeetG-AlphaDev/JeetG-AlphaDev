# NotesHub Frontend Application

A modern, responsive web application for sharing and discovering academic notes with AI-powered assistance.

## 🚀 Features

### Core Functionality
- **Homepage** with featured notes, search, and category navigation
- **Notes listing** with filtering, sorting, and pagination
- **Note reader** with AI chat integration and reading tools
- **Upload system** with drag-and-drop file support
- **User authentication** (login/signup with social providers)
- **User dashboard** with personal notes and analytics
- **Dark mode** support with system preference detection

### AI Integration
- AI chat assistant for note content questions
- Context-aware responses based on note content
- Quick question suggestions
- Real-time chat interface

### Design & UX
- Fully responsive design for mobile, tablet, and desktop
- Dark/light mode with smooth transitions
- Modern UI with Tailwind CSS
- Accessible components following WCAG guidelines
- Loading states and error handling

## 🛠 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Headless UI
- **Icons**: Heroicons
- **Theme**: next-themes for dark mode
- **Testing**: Jest + React Testing Library

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # User dashboard
│   ├── login/             # Authentication
│   ├── notes/             # Notes listing and reader
│   ├── signup/            # User registration
│   ├── upload/            # File upload
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── ai/               # AI chat components
│   ├── navigation/       # Header and footer
│   ├── notes/            # Note-related components
│   ├── reader/           # Reading tools
│   └── ui/               # Basic UI components
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## 🧪 Testing

- Unit tests for utility functions
- Component testing with React Testing Library
- Coverage for critical user interactions

## 🎨 Components

### Core UI Components
- **Button**: Multiple variants and sizes
- **Input**: Form inputs with validation
- **Card**: Content containers
- **Loading**: Spinners and loading states

### Feature Components
- **NoteCard**: Note preview with metadata
- **AIChat**: Interactive chat interface
- **ReaderToolbar**: Font size and theme controls
- **Navbar**: Responsive navigation with theme toggle

## 📱 Pages

1. **Homepage** (`/`)
   - Hero section with search
   - Featured notes grid
   - Category browsing
   - Feature highlights

2. **Notes Listing** (`/notes`)
   - Search and filtering
   - Category filters
   - Sort options
   - Pagination

3. **Note Reader** (`/notes/[id]`)
   - Full note content
   - AI chat sidebar
   - Reading tools
   - Related notes

4. **Upload** (`/upload`)
   - Drag-and-drop file upload
   - Form for note metadata
   - Progress tracking
   - File validation

5. **Authentication** (`/login`, `/signup`)
   - Email/password forms
   - Social provider options
   - Form validation
   - Responsive design

6. **Dashboard** (`/dashboard`)
   - User statistics
   - Personal notes management
   - Analytics overview
   - Bookmarks

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📝 Notes

- Mock data is used throughout for demonstration
- AI responses are simulated for the demo
- File uploads are processed client-side only
- Authentication is UI-only (no backend integration)

## 🎯 Future Enhancements

- Real backend API integration
- Actual AI/LLM integration
- File processing and OCR
- Advanced search capabilities
- User profiles and social features
- Mobile app companion