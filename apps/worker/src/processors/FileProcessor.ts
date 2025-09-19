import AWS from 'aws-sdk';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import sharp from 'sharp';
import logger from '../utils/logger';

export interface ProcessingResult {
  text: string;
  html: string;
  thumbnailUrl?: string;
}

export class FileProcessor {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
      accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
      secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
      region: process.env.S3_REGION || 'us-east-1',
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  async processFile(fileKey: string, mimeType: string, filename: string): Promise<ProcessingResult> {
    logger.info(`Processing file: ${filename} (${mimeType})`);

    try {
      // Download file from S3
      const fileBuffer = await this.downloadFile(fileKey);
      
      let result: ProcessingResult;

      switch (mimeType) {
        case 'application/pdf':
          result = await this.processPDF(fileBuffer);
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          result = await this.processDocx(fileBuffer);
          break;
        case 'text/plain':
          result = await this.processTextFile(fileBuffer);
          break;
        case 'text/markdown':
          result = await this.processMarkdownFile(fileBuffer);
          break;
        default:
          throw new Error(`Unsupported file type: ${mimeType}`);
      }

      // Generate thumbnail for visual files
      if (mimeType === 'application/pdf') {
        try {
          result.thumbnailUrl = await this.generateThumbnail(fileKey, fileBuffer);
        } catch (error) {
          logger.warn(`Failed to generate thumbnail for ${filename}:`, error);
        }
      }

      logger.info(`Successfully processed file: ${filename}`);
      return result;
    } catch (error) {
      logger.error(`Error processing file ${filename}:`, error);
      throw error;
    }
  }

  private async downloadFile(fileKey: string): Promise<Buffer> {
    const bucket = process.env.S3_BUCKET || 'noteshub-files';
    
    try {
      const response = await this.s3.getObject({
        Bucket: bucket,
        Key: `uploads/${fileKey}`,
      }).promise();

      return response.Body as Buffer;
    } catch (error) {
      logger.error(`Failed to download file ${fileKey}:`, error);
      throw new Error(`File not found: ${fileKey}`);
    }
  }

  private async processPDF(buffer: Buffer): Promise<ProcessingResult> {
    try {
      const data = await pdf(buffer);
      const text = data.text;
      
      // Convert text to basic HTML
      const html = this.textToHtml(text);

      return {
        text: text.trim(),
        html,
      };
    } catch (error) {
      logger.error('Error processing PDF:', error);
      throw new Error('Failed to process PDF file');
    }
  }

  private async processDocx(buffer: Buffer): Promise<ProcessingResult> {
    try {
      const result = await mammoth.convertToHtml({ buffer });
      const html = result.value;
      
      // Extract plain text from HTML
      const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

      return {
        text,
        html,
      };
    } catch (error) {
      logger.error('Error processing DOCX:', error);
      throw new Error('Failed to process DOCX file');
    }
  }

  private async processTextFile(buffer: Buffer): Promise<ProcessingResult> {
    try {
      const text = buffer.toString('utf-8');
      const html = this.textToHtml(text);

      return {
        text: text.trim(),
        html,
      };
    } catch (error) {
      logger.error('Error processing text file:', error);
      throw new Error('Failed to process text file');
    }
  }

  private async processMarkdownFile(buffer: Buffer): Promise<ProcessingResult> {
    try {
      const text = buffer.toString('utf-8');
      
      // For markdown, we'll convert it to HTML
      // In a real implementation, you'd use a markdown parser like marked
      const html = this.markdownToHtml(text);
      
      // Extract plain text for search
      const plainText = text.replace(/[#*_`\[\]()]/g, '').replace(/\s+/g, ' ').trim();

      return {
        text: plainText,
        html,
      };
    } catch (error) {
      logger.error('Error processing markdown file:', error);
      throw new Error('Failed to process markdown file');
    }
  }

  private async generateThumbnail(fileKey: string, buffer: Buffer): Promise<string> {
    try {
      // For PDFs, we'd typically use pdf2pic or similar to generate an image
      // For now, we'll create a placeholder thumbnail
      const thumbnailBuffer = await sharp({
        create: {
          width: 200,
          height: 280,
          channels: 3,
          background: { r: 255, g: 255, b: 255 }
        }
      })
      .png()
      .toBuffer();

      // Upload thumbnail to S3
      const thumbnailKey = `thumbnails/${fileKey.replace(/\.[^/.]+$/, '.png')}`;
      const bucket = process.env.S3_BUCKET || 'noteshub-files';

      await this.s3.putObject({
        Bucket: bucket,
        Key: thumbnailKey,
        Body: thumbnailBuffer,
        ContentType: 'image/png',
      }).promise();

      const publicUrl = process.env.S3_PUBLIC_URL || 'http://localhost:9000/noteshub-files';
      return `${publicUrl}/${thumbnailKey}`;
    } catch (error) {
      logger.error('Error generating thumbnail:', error);
      throw error;
    }
  }

  private textToHtml(text: string): string {
    // Convert plain text to basic HTML with paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    const html = paragraphs
      .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('\n');
    
    return `<div class="prose">\n${html}\n</div>`;
  }

  private markdownToHtml(markdown: string): string {
    // Basic markdown to HTML conversion
    // In production, use a proper markdown parser like marked or remark
    let html = markdown;
    
    // Headers
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    
    // Bold and italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');
    
    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
    
    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    return `<div class="prose"><p>${html}</p></div>`;
  }
}