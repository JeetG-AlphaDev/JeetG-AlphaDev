// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Note types
export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category: string;
  tags: string[];
  author: User;
  uploadedAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  featured: boolean;
  published: boolean;
  fileSize?: number;
  downloadUrl?: string;
}

// Search types
export interface SearchResult {
  notes: Note[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  author?: string;
  sortBy?: 'relevance' | 'date' | 'views' | 'likes';
  sortOrder?: 'asc' | 'desc';
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  noteContext?: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  noteId?: string;
  createdAt: Date;
}

// Component types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Upload types
export interface UploadProgress {
  progress: number;
  stage: 'uploading' | 'processing' | 'completed' | 'error';
  message?: string;
}

// Ad types
export interface AdSlot {
  id: string;
  position: 'header' | 'sidebar' | 'content' | 'footer';
  size: string;
  content?: string;
}