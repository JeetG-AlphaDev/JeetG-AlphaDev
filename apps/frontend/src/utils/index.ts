import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = (now.getTime() - target.getTime()) / 1000;

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = diffInSeconds / 60;
  if (diffInMinutes < 60) {
    return `${Math.floor(diffInMinutes)} minute${Math.floor(diffInMinutes) !== 1 ? 's' : ''} ago`;
  }

  const diffInHours = diffInMinutes / 60;
  if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`;
  }

  const diffInDays = diffInHours / 24;
  if (diffInDays < 7) {
    return `${Math.floor(diffInDays)} day${Math.floor(diffInDays) !== 1 ? 's' : ''} ago`;
  }

  return formatDate(date);
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function truncate(text: string, length: number) {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function getFileIcon(mimeType: string) {
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType.includes('text')) return '📄';
  if (mimeType.includes('markdown')) return '📄';
  return '📄';
}

export function getSubjectColor(subject: string) {
  const colors: Record<string, string> = {
    'Computer Science': 'bg-blue-100 text-blue-800',
    'Mathematics': 'bg-purple-100 text-purple-800',
    'Physics': 'bg-green-100 text-green-800',
    'Chemistry': 'bg-yellow-100 text-yellow-800',
    'Biology': 'bg-pink-100 text-pink-800',
    'History': 'bg-red-100 text-red-800',
    'Literature': 'bg-indigo-100 text-indigo-800',
    'Economics': 'bg-orange-100 text-orange-800',
    'Philosophy': 'bg-gray-100 text-gray-800',
  };

  return colors[subject] || 'bg-gray-100 text-gray-800';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers or non-HTTPS contexts
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    return new Promise((resolve, reject) => {
      if (document.execCommand('copy')) {
        resolve();
      } else {
        reject(new Error('Unable to copy to clipboard'));
      }
      document.body.removeChild(textArea);
    });
  }
}

export function shareNote(note: { title: string; slug: string }) {
  const url = `${window.location.origin}/notes/${note.slug}`;
  const text = `Check out this note: ${note.title}`;

  if (navigator.share) {
    return navigator.share({
      title: note.title,
      text,
      url,
    });
  } else {
    return copyToClipboard(url);
  }
}