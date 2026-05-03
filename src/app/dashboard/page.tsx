'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  DocumentIcon, 
  EyeIcon, 
  HeartIcon, 
  PlusIcon,
  ChartBarIcon,
  BookmarkIcon 
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NoteCard } from '@/components/notes/note-card';
import type { Note, User } from '@/types';

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '',
  role: 'user',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
};

// Mock user notes
const mockUserNotes: Note[] = [
  {
    id: '1',
    title: 'My Machine Learning Notes',
    content: 'Advanced concepts in ML...',
    summary: 'Personal notes on machine learning algorithms and techniques',
    category: 'Computer Science',
    tags: ['machine-learning', 'personal'],
    author: mockUser,
    views: 245,
    likes: 23,
    featured: false,
    published: true,
    uploadedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    fileSize: 1500000,
  },
  {
    id: '2',
    title: 'Statistics Cheat Sheet',
    content: 'Quick reference for statistics...',
    summary: 'Essential statistics formulas and concepts',
    category: 'Mathematics',
    tags: ['statistics', 'reference'],
    author: mockUser,
    views: 189,
    likes: 34,
    featured: false,
    published: true,
    uploadedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    fileSize: 800000,
  },
];

const stats = [
  {
    name: 'Total Notes',
    value: '12',
    icon: DocumentIcon,
    change: '+2 this month',
    changeType: 'positive',
  },
  {
    name: 'Total Views',
    value: '1,234',
    icon: EyeIcon,
    change: '+12% from last month',
    changeType: 'positive',
  },
  {
    name: 'Total Likes',
    value: '89',
    icon: HeartIcon,
    change: '+5 this week',
    changeType: 'positive',
  },
  {
    name: 'Bookmarks',
    value: '23',
    icon: BookmarkIcon,
    change: '+3 this week',
    changeType: 'positive',
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'notes' | 'bookmarks' | 'analytics'>('notes');

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                Welcome back, {mockUser.name}!
              </p>
            </div>
            <Link href="/upload">
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Upload Note
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm">
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {stat.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'notes'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                My Notes ({mockUserNotes.length})
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookmarks'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Bookmarks (23)
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <ChartBarIcon className="h-4 w-4 inline mr-1" />
                Analytics
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'notes' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Notes
              </h2>
              <Link href="/upload">
                <Button variant="outline" size="sm">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockUserNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div className="text-center py-12">
            <BookmarkIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No bookmarks yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Bookmark notes to save them for later reading.
            </p>
            <Link href="/notes">
              <Button variant="outline">Browse Notes</Button>
            </Link>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Views Over Time</CardTitle>
                  <CardDescription>
                    Your note views in the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <ChartBarIcon className="h-8 w-8 mr-2" />
                    Chart placeholder
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Popular Notes</CardTitle>
                  <CardDescription>
                    Your most viewed notes this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockUserNotes.map((note, index) => (
                      <div key={note.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-3">
                            {index + 1}.
                          </span>
                          <Link 
                            href={`/notes/${note.id}`}
                            className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {note.title}
                          </Link>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {note.views} views
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}