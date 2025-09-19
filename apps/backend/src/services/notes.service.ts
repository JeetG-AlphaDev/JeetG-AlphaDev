import { prisma } from '../db/client';
import { AppError } from '../middleware/error';
import { StorageService } from './storage.service';
import { getCachedData, setCachedData } from '../utils/redis';
import logger from '../utils/logger';
import slugify from 'slugify';

export interface CreateNoteData {
  title: string;
  subject: string;
  class?: string;
  tags: string[];
  description?: string;
  license?: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  ownerId: string;
}

export interface UpdateNoteData {
  title?: string;
  subject?: string;
  class?: string;
  tags?: string[];
  description?: string;
  license?: string;
  visibility?: 'PUBLIC' | 'PRIVATE';
}

export interface SearchFilters {
  query?: string;
  subject?: string;
  tags?: string[];
  visibility?: 'PUBLIC' | 'PRIVATE';
  ownerId?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'views' | 'downloads' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export class NotesService {
  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
  }

  async createNote(data: CreateNoteData) {
    const { title, ownerId } = data;

    // Generate unique slug
    const baseSlug = slugify(title, { lower: true, strict: true });
    const slug = await this.generateUniqueSlug(baseSlug);

    // Create note
    const note = await prisma.note.create({
      data: {
        ...data,
        slug,
        fileUrl: '', // Will be updated after file upload
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info(`Created note: ${note.id} - ${note.title}`);
    return note;
  }

  async updateNote(noteId: string, data: UpdateNoteData, userId: string) {
    // Check if note exists and user has permission
    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
      include: { owner: true },
    });

    if (!existingNote) {
      throw new AppError('Note not found', 404);
    }

    if (existingNote.ownerId !== userId) {
      throw new AppError('You can only edit your own notes', 403);
    }

    // Update slug if title changed
    let updateData: any = { ...data };
    if (data.title && data.title !== existingNote.title) {
      const baseSlug = slugify(data.title, { lower: true, strict: true });
      updateData.slug = await this.generateUniqueSlug(baseSlug, noteId);
    }

    // Create version entry for content changes
    if (data.title || data.description) {
      updateData.version = existingNote.version + 1;

      await prisma.noteVersion.create({
        data: {
          noteId,
          contentHtml: existingNote.contentHtml,
          contentText: existingNote.contentText,
          fileUrl: existingNote.fileUrl,
          version: existingNote.version,
          authorId: userId,
          changes: 'Updated note metadata',
        },
      });
    }

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Clear cache
    await this.clearNoteCache(noteId, updatedNote.slug);

    logger.info(`Updated note: ${noteId}`);
    return updatedNote;
  }

  async getNoteById(noteId: string, userId?: string) {
    const cacheKey = `note:${noteId}`;
    let note = await getCachedData(cacheKey);

    if (!note) {
      note = await prisma.note.findUnique({
        where: { id: noteId },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          versions: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          _count: {
            select: {
              annotations: true,
              aiQueries: true,
            },
          },
        },
      });

      if (note) {
        await setCachedData(cacheKey, note, 3600); // Cache for 1 hour
      }
    }

    if (!note) {
      throw new AppError('Note not found', 404);
    }

    // Check visibility
    if (note.visibility === 'PRIVATE' && note.ownerId !== userId) {
      throw new AppError('Note not found', 404);
    }

    // Increment view count (don't cache this)
    if (userId !== note.ownerId) {
      await prisma.note.update({
        where: { id: noteId },
        data: { views: { increment: 1 } },
      });
    }

    return note;
  }

  async getNoteBySlug(slug: string, userId?: string) {
    const cacheKey = `note:slug:${slug}`;
    let note = await getCachedData(cacheKey);

    if (!note) {
      note = await prisma.note.findUnique({
        where: { slug },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          versions: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          _count: {
            select: {
              annotations: true,
              aiQueries: true,
            },
          },
        },
      });

      if (note) {
        await setCachedData(cacheKey, note, 3600); // Cache for 1 hour
      }
    }

    if (!note) {
      throw new AppError('Note not found', 404);
    }

    // Check visibility
    if (note.visibility === 'PRIVATE' && note.ownerId !== userId) {
      throw new AppError('Note not found', 404);
    }

    // Increment view count (don't cache this)
    if (userId !== note.ownerId) {
      await prisma.note.update({
        where: { id: note.id },
        data: { views: { increment: 1 } },
      });
    }

    return note;
  }

  async searchNotes(filters: SearchFilters, pagination: PaginationOptions, userId?: string) {
    const { query, subject, tags, visibility, ownerId } = filters;
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 100); // Max 100 per page

    const whereClause: any = {
      // Only show public notes unless user is looking at their own notes
      visibility: ownerId === userId ? undefined : 'PUBLIC',
    };

    if (ownerId) {
      whereClause.ownerId = ownerId;
    }

    if (subject) {
      whereClause.subject = { contains: subject, mode: 'insensitive' };
    }

    if (tags && tags.length > 0) {
      whereClause.tags = { hasSome: tags };
    }

    if (visibility && ownerId === userId) {
      whereClause.visibility = visibility;
    }

    // Full-text search
    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { contentText: { contains: query, mode: 'insensitive' } },
      ];
    }

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where: whereClause,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              annotations: true,
              aiQueries: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take,
      }),
      prisma.note.count({ where: whereClause }),
    ]);

    return {
      notes,
      pagination: {
        page,
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    };
  }

  async deleteNote(noteId: string, userId: string, isAdmin = false) {
    const note = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      throw new AppError('Note not found', 404);
    }

    if (!isAdmin && note.ownerId !== userId) {
      throw new AppError('You can only delete your own notes', 403);
    }

    // Delete file from storage
    if (note.fileUrl) {
      try {
        const fileKey = note.fileUrl.split('/').pop();
        if (fileKey) {
          await this.storageService.deleteFile(`uploads/${fileKey}`);
        }
      } catch (error) {
        logger.error(`Failed to delete file for note ${noteId}:`, error);
      }
    }

    // Delete note (cascade will handle related records)
    await prisma.note.delete({
      where: { id: noteId },
    });

    // Clear cache
    await this.clearNoteCache(noteId, note.slug);

    logger.info(`Deleted note: ${noteId}`);
  }

  async incrementDownloadCount(noteId: string) {
    await prisma.note.update({
      where: { id: noteId },
      data: { downloads: { increment: 1 } },
    });
  }

  async getPopularNotes(limit = 10) {
    const cacheKey = `popular:notes:${limit}`;
    let notes = await getCachedData(cacheKey);

    if (!notes) {
      notes = await prisma.note.findMany({
        where: { visibility: 'PUBLIC' },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              annotations: true,
              aiQueries: true,
            },
          },
        },
        orderBy: [
          { views: 'desc' },
          { downloads: 'desc' },
          { createdAt: 'desc' },
        ],
        take: limit,
      });

      await setCachedData(cacheKey, notes, 3600); // Cache for 1 hour
    }

    return notes;
  }

  async getRecentNotes(limit = 10) {
    const cacheKey = `recent:notes:${limit}`;
    let notes = await getCachedData(cacheKey);

    if (!notes) {
      notes = await prisma.note.findMany({
        where: { visibility: 'PUBLIC' },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              annotations: true,
              aiQueries: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      await setCachedData(cacheKey, notes, 1800); // Cache for 30 minutes
    }

    return notes;
  }

  private async generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.note.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existing || (excludeId && existing.id === excludeId)) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  private async clearNoteCache(noteId: string, slug?: string) {
    const keys = [`note:${noteId}`];
    if (slug) {
      keys.push(`note:slug:${slug}`);
    }
    keys.push('popular:notes:10', 'recent:notes:10');

    // Note: In a real app, you'd want to implement a proper cache invalidation strategy
    // For now, we'll just clear these specific keys
    for (const key of keys) {
      try {
        await setCachedData(key, null, 0); // Expire immediately
      } catch (error) {
        logger.error(`Failed to clear cache for key ${key}:`, error);
      }
    }
  }
}