import { Suspense } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading';
import { NoteCard } from '@/components/notes/note-card';
import type { Note } from '@/types';

// Mock data - in real app, this would come from API
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    content: 'Comprehensive guide covering supervised and unsupervised learning algorithms with practical examples...',
    summary: 'Comprehensive guide covering supervised and unsupervised learning algorithms.',
    category: 'Computer Science',
    tags: ['machine-learning', 'ai', 'algorithms', 'data-science'],
    author: { 
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah@example.com',
      avatar: '',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    views: 2431,
    likes: 189,
    featured: true,
    published: true,
    uploadedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    fileSize: 2500000,
  },
  {
    id: '2',
    title: 'Organic Chemistry Fundamentals',
    content: 'Essential concepts and reactions in organic chemistry for beginners...',
    summary: 'Essential concepts and reactions in organic chemistry for beginners.',
    category: 'Chemistry',
    tags: ['organic-chemistry', 'reactions', 'molecules'],
    author: { 
      id: '2',
      name: 'Prof. Michael Chen',
      email: 'michael@example.com',
      avatar: '',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    views: 1876,
    likes: 156,
    featured: false,
    published: true,
    uploadedAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    fileSize: 1800000,
  },
  {
    id: '3',
    title: 'Calculus II: Integration Techniques',
    content: 'Advanced integration methods including substitution and integration by parts...',
    summary: 'Advanced integration methods including substitution and integration by parts.',
    category: 'Mathematics',
    tags: ['calculus', 'integration', 'mathematics', 'derivatives'],
    author: { 
      id: '3',
      name: 'Dr. Emma Wilson',
      email: 'emma@example.com',
      avatar: '',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    views: 3024,
    likes: 234,
    featured: true,
    published: true,
    uploadedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    fileSize: 3200000,
  },
  {
    id: '4',
    title: 'Introduction to Quantum Physics',
    content: 'Basic principles of quantum mechanics and their applications...',
    summary: 'Basic principles of quantum mechanics and their applications.',
    category: 'Physics',
    tags: ['quantum-physics', 'mechanics', 'physics'],
    author: { 
      id: '4',
      name: 'Dr. Robert Taylor',
      email: 'robert@example.com',
      avatar: '',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    views: 1653,
    likes: 98,
    featured: false,
    published: true,
    uploadedAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    fileSize: 2100000,
  },
  {
    id: '5',
    title: 'Database Design Principles',
    content: 'Comprehensive guide to designing efficient and scalable databases...',
    summary: 'Comprehensive guide to designing efficient and scalable databases.',
    category: 'Computer Science',
    tags: ['database', 'sql', 'design', 'normalization'],
    author: { 
      id: '5',
      name: 'Prof. Lisa Anderson',
      email: 'lisa@example.com',
      avatar: '',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    views: 2187,
    likes: 167,
    featured: false,
    published: true,
    uploadedAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    fileSize: 2800000,
  },
  {
    id: '6',
    title: 'Microeconomics Theory',
    content: 'Fundamental concepts in microeconomics including supply and demand...',
    summary: 'Fundamental concepts in microeconomics including supply and demand.',
    category: 'Economics',
    tags: ['microeconomics', 'supply-demand', 'economics'],
    author: { 
      id: '6',
      name: 'Dr. James Wilson',
      email: 'james@example.com',
      avatar: '',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    views: 1432,
    likes: 89,
    featured: false,
    published: true,
    uploadedAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    fileSize: 1600000,
  },
];

const categories = [
  'All Categories',
  'Mathematics',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Engineering',
  'Economics',
  'Literature',
];

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'date', label: 'Newest First' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'likes', label: 'Most Liked' },
];

function NotesGrid({ notes }: { notes: Note[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}

export default function NotesPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Browse Notes
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Discover thousands of study materials from students worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search notes, topics, or authors..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <FunnelIcon className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'All Categories' ? 'default' : 'outline'}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {mockNotes.length} results
            </p>
            <select className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm">
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes Grid */}
        <Suspense fallback={<LoadingState>Loading notes...</LoadingState>}>
          <NotesGrid notes={mockNotes} />
        </Suspense>

        {/* Pagination */}
        <div className="mt-12 flex items-center justify-center">
          <nav className="flex items-center gap-2">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button variant="default">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">
              Next
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}