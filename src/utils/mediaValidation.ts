// Media validation utilities for file uploads

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

// File size limits (in bytes)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Validate if a file is an allowed image type
 */
export function isValidImageType(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.includes(file.type);
}

/**
 * Validate if a file is an allowed video type
 */
export function isValidVideoType(file: File): boolean {
  return ALLOWED_VIDEO_TYPES.includes(file.type);
}

/**
 * Validate image file type and size
 */
export function validateImageFile(file: File): ValidationResult {
  if (!isValidImageType(file)) {
    return {
      isValid: false,
      error: 'Invalid image format. Please upload JPG, PNG, GIF, or WebP images.'
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `Image file is too large (${sizeMB}MB). Maximum size is 10MB.`
    };
  }

  return { isValid: true };
}

/**
 * Validate video file type and size
 */
export function validateVideoFile(file: File): ValidationResult {
  if (!isValidVideoType(file)) {
    return {
      isValid: false,
      error: 'Invalid video format. Please upload MP4 or WebM videos.'
    };
  }

  if (file.size > MAX_VIDEO_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `Video file is too large (${sizeMB}MB). Maximum size is 50MB.`
    };
  }

  return { isValid: true };
}

/**
 * Validate media file (image or video)
 */
export function validateMediaFile(file: File): ValidationResult {
  const isImage = isValidImageType(file);
  const isVideo = isValidVideoType(file);

  if (!isImage && !isVideo) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload an image (JPG, PNG, GIF, WebP) or video (MP4, WebM).'
    };
  }

  if (isImage) {
    return validateImageFile(file);
  }

  return validateVideoFile(file);
}

/**
 * Get human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get media type from file
 */
export function getMediaType(file: File): 'image' | 'video' | null {
  if (isValidImageType(file)) return 'image';
  if (isValidVideoType(file)) return 'video';
  return null;
}
