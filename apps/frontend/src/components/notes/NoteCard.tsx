import React from 'react';
import Link from 'next/link';
import { Note } from '@/types';
import { formatRelativeTime, getSubjectColor, truncate } from '@/utils';
import { EyeIcon, ArrowDownTrayIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface NoteCardProps {
  note: Note;
  showActions?: boolean;
  className?: string;
}

export function NoteCard({ note, showActions = true, className = '' }: NoteCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link 
              href={`/notes/${note.slug}`}
              className="block group"
            >
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 mb-2">
                {note.title}
              </h3>
            </Link>
            
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubjectColor(note.subject)}`}>
                {note.subject}
              </span>
              {note.class && (
                <span className="text-sm text-gray-500">
                  {note.class}
                </span>
              )}
            </div>
            
            {note.description && (
              <p className="text-sm text-gray-600 mb-3">
                {truncate(note.description, 120)}
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{note.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats and metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <EyeIcon className="h-4 w-4" />
              <span>{note.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>{note.downloads.toLocaleString()}</span>
            </div>
            {note._count && (
              <div className="flex items-center space-x-1">
                <ChatBubbleLeftIcon className="h-4 w-4" />
                <span>{note._count.aiQueries}</span>
              </div>
            )}
          </div>
          
          <div className="text-right">
            <div className="font-medium text-gray-700">
              {note.owner.name}
            </div>
            <div>
              {formatRelativeTime(note.createdAt)}
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <Link 
                href={`/notes/${note.slug}`}
                className="btn btn-primary btn-sm"
              >
                Read Note
              </Link>
              
              <div className="flex space-x-2">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    // Handle bookmark/save
                  }}
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    // Handle share
                  }}
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}