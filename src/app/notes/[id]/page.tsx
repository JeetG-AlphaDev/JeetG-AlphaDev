import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { EyeIcon, HeartIcon, ShareIcon, ArrowDownTrayIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading';
import { AIChat } from '@/components/ai/ai-chat';
import { ReaderToolbar } from '@/components/reader/reader-toolbar';
import { formatRelativeTime, getInitials } from '@/utils';
import type { Note } from '@/types';

// Mock note data - in real app, this would come from API
const mockNote: Note = {
  id: '1',
  title: 'Introduction to Machine Learning',
  content: `# Introduction to Machine Learning

Machine Learning (ML) is a subset of artificial intelligence (AI) that focuses on algorithms and statistical models that enable computer systems to improve their performance on a specific task through experience.

## What is Machine Learning?

Machine learning is the study of computer algorithms that can improve automatically through experience. It is seen as a part of artificial intelligence. Machine learning algorithms build a model based on sample data, known as training data, in order to make predictions or decisions without being explicitly programmed to do so.

## Types of Machine Learning

### 1. Supervised Learning
- Uses labeled training data
- Goal is to learn a mapping from inputs to outputs
- Examples: classification, regression

### 2. Unsupervised Learning
- Uses unlabeled data
- Goal is to discover hidden patterns
- Examples: clustering, dimensionality reduction

### 3. Reinforcement Learning
- Learns through interaction with environment
- Uses rewards and penalties
- Examples: game playing, robotics

## Key Concepts

### Training Data
The dataset used to teach the machine learning algorithm.

### Features
Individual measurable properties of observed phenomena.

### Model
The output of an algorithm when trained on data.

### Overfitting
When a model learns the training data too well and performs poorly on new data.

## Common Algorithms

1. **Linear Regression** - For continuous target variables
2. **Logistic Regression** - For binary classification
3. **Decision Trees** - Easy to interpret tree-like models
4. **Random Forest** - Ensemble of decision trees
5. **Support Vector Machines** - For classification and regression
6. **Neural Networks** - Inspired by biological neural networks

## Applications

- Image recognition
- Natural language processing
- Recommendation systems
- Fraud detection
- Autonomous vehicles
- Medical diagnosis

## Getting Started

To begin with machine learning:

1. Learn Python or R programming
2. Understand statistics and linear algebra
3. Practice with datasets
4. Use libraries like scikit-learn, TensorFlow, or PyTorch
5. Work on projects

## Conclusion

Machine learning is a powerful tool that's transforming industries and our daily lives. With the right foundation in mathematics, programming, and domain knowledge, anyone can start their journey in machine learning.`,
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
  downloadUrl: '/api/notes/1/download'
};

async function getNoteById(id: string): Promise<Note | null> {
  // Simulate API call
  if (id === '1') {
    return mockNote;
  }
  return null;
}

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const note = await getNoteById(id);

  if (!note) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {note.category}
                    </span>
                    {note.featured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {note.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {note.summary}
                  </p>
                </div>
              </div>

              {/* Author and Meta */}
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {note.author.avatar ? (
                      <img
                        src={note.author.avatar}
                        alt={note.author.name}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                        {getInitials(note.author.name)}
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {note.author.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Uploaded {formatRelativeTime(note.uploadedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    {note.views.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <HeartIcon className="h-4 w-4 mr-1" />
                    {note.likes}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <HeartIcon className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                  <Button variant="outline" size="sm">
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                <Button size="sm">
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            {/* Reader Toolbar */}
            <ReaderToolbar />

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: note.content.replace(/\n/g, '<br />') }} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* AI Chat */}
            <div className="sticky top-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <div className="flex items-center mb-4">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    AI Study Assistant
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Ask questions about this note or get help understanding the concepts.
                </p>
                <Suspense fallback={<LoadingState>Loading chat...</LoadingState>}>
                  <AIChat noteId={note.id} />
                </Suspense>
              </div>

              {/* Related Notes */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Related Notes
                </h3>
                <div className="space-y-3">
                  {/* Mock related notes */}
                  <div className="border-l-4 border-blue-500 pl-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Deep Learning Fundamentals
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Computer Science
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Neural Networks Explained
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Computer Science
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Statistics for Data Science
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Mathematics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}