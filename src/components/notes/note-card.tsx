import Link from 'next/link';
import { EyeIcon, HeartIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatRelativeTime, truncateText, getInitials } from '@/utils';
import type { Note } from '@/types';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link href={`/notes/${note.id}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {note.category}
            </span>
            {note.featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Featured
              </span>
            )}
          </div>
          <CardTitle className="line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {note.title}
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {note.summary || truncateText(note.content, 150)}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Author */}
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              {note.author.avatar ? (
                <img
                  src={note.author.avatar}
                  alt={note.author.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                  {getInitials(note.author.name)}
                </div>
              )}
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {note.author.name}
              </p>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {formatRelativeTime(note.uploadedAt)}
              </div>
            </div>
          </div>

          {/* Tags */}
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {note.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                >
                  {tag}
                </span>
              ))}
              {note.tags.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{note.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <EyeIcon className="h-4 w-4 mr-1" />
                {note.views.toLocaleString()}
              </div>
              <div className="flex items-center">
                <HeartIcon className="h-4 w-4 mr-1" />
                {note.likes}
              </div>
            </div>
            {note.fileSize && (
              <span className="text-xs">
                {(note.fileSize / 1024 / 1024).toFixed(1)} MB
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}