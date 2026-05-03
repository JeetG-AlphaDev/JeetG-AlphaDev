'use client';

import { useState } from 'react';
import { 
  PencilIcon, 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ReaderToolbar() {
  const [fontSize, setFontSize] = useState(16);
  const { theme, setTheme } = useTheme();

  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 2);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 2);
    }
  };

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon className="h-4 w-4" />;
      case 'dark':
        return <MoonIcon className="h-4 w-4" />;
      default:
        return <ComputerDesktopIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Font Size Controls */}
          <div className="flex items-center space-x-2">
            <PencilIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Button
              variant="outline"
              size="sm"
              onClick={decreaseFontSize}
              disabled={fontSize <= 12}
            >
              A-
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[2rem] text-center">
              {fontSize}px
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={increaseFontSize}
              disabled={fontSize >= 24}
            >
              A+
            </Button>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {getThemeIcon()}
          </Button>
        </div>

        {/* Bookmark */}
        <Button variant="outline" size="sm">
          <BookmarkIcon className="h-4 w-4 mr-2" />
          Bookmark
        </Button>
      </div>

      {/* Apply font size to content */}
      <style jsx global>{`
        .prose {
          font-size: ${fontSize}px;
          line-height: ${fontSize * 1.6}px;
        }
      `}</style>
    </div>
  );
}