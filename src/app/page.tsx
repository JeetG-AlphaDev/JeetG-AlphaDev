import Link from 'next/link';
import { MagnifyingGlassIcon, CloudArrowUpIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveAdSlot } from '@/components/ui/ad-slot';

// Mock data for featured notes
const featuredNotes = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    summary: 'Comprehensive guide covering supervised and unsupervised learning algorithms.',
    category: 'Computer Science',
    author: { name: 'Dr. Sarah Johnson', avatar: '' },
    views: 2431,
    likes: 189,
    uploadedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Organic Chemistry Fundamentals',
    summary: 'Essential concepts and reactions in organic chemistry for beginners.',
    category: 'Chemistry',
    author: { name: 'Prof. Michael Chen', avatar: '' },
    views: 1876,
    likes: 156,
    uploadedAt: new Date('2024-01-12'),
  },
  {
    id: '3',
    title: 'Calculus II: Integration Techniques',
    summary: 'Advanced integration methods including substitution and integration by parts.',
    category: 'Mathematics',
    author: { name: 'Dr. Emma Wilson', avatar: '' },
    views: 3024,
    likes: 234,
    uploadedAt: new Date('2024-01-10'),
  },
];

const categories = [
  'Mathematics',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Engineering',
  'Business',
  'Literature',
];

export default function Home() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Share and Discover
              <span className="text-blue-600 dark:text-blue-400"> Academic Notes</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Access thousands of study materials from students worldwide. Upload your notes, 
              chat with AI about complex topics, and accelerate your learning.
            </p>
            
            {/* Search Bar */}
            <div className="mt-10 max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for notes, topics, or subjects..."
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button size="lg" className="h-12 px-6">
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                  Upload Notes
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                  AI Study Assistant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Browse by Category
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Find notes in your field of study
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link key={category} href={`/notes?category=${category.toLowerCase()}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {category}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Placement */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ResponsiveAdSlot position="content" className="mb-8" />
        </div>
      </section>

      {/* Featured Notes Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Featured Notes
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Popular and high-quality study materials
              </p>
            </div>
            <Link href="/notes">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredNotes.map((note) => (
              <Link key={note.id} href={`/notes/${note.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {note.category}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {note.views.toLocaleString()} views
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2">{note.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {note.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>By {note.author.name}</span>
                      <span>{note.likes} likes</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Why Choose NotesHub?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Everything you need for effective studying
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <CloudArrowUpIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Easy Upload
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Upload your notes in any format. We support PDFs, documents, images, and more.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI Assistant
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get instant help with our AI study assistant. Ask questions about any topic.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                <MagnifyingGlassIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Smart Search
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Find exactly what you need with our intelligent search and filtering system.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
