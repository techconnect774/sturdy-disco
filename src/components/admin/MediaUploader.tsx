import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';

export interface MediaUpload {
  file?: File;
  url?: string;
  type: 'image' | 'video';
  source: 'upload' | 'url';
  preview?: string;
}

interface MediaUploaderProps {
  onMediaAdded: (media: MediaUpload) => void;
  onCancel?: () => void;
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export function MediaUploader({ onMediaAdded, onCancel }: MediaUploaderProps) {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
    const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return 'Invalid file type. Please upload an image (JPG, PNG, GIF, WebP) or video (MP4, WebM).';
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return 'Image file size must be less than 10MB.';
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return 'Video file size must be less than 50MB.';
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsProcessing(true);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUrlSubmit = () => {
    if (!mediaUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      // Basic URL validation
      new URL(mediaUrl);

      // Determine media type from URL
      const url = mediaUrl.toLowerCase();
      const isImage = /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url);
      const isVideo = /\.(mp4|webm)(\?|$)/i.test(url);

      if (!isImage && !isVideo) {
        setError('URL must point to an image (JPG, PNG, GIF, WebP) or video (MP4, WebM) file');
        return;
      }

      setError(null);
      onMediaAdded({
        url: mediaUrl,
        type: isImage ? 'image' : 'video',
        source: 'url',
        preview: mediaUrl
      });
    } catch (error) {
      if (error instanceof TypeError) {
        setError('Please enter a valid URL');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to add media');
      }
      console.error('Error adding media URL:', error);
    }
  };

  const handleFileConfirm = () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    try {
      const isImage = ACCEPTED_IMAGE_TYPES.includes(selectedFile.type);

      onMediaAdded({
        file: selectedFile,
        type: isImage ? 'image' : 'video',
        source: 'upload',
        preview: preview || undefined
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add media');
      console.error('Error adding media:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Add Media
      </h3>

      {/* Upload Method Toggle */}
      <div className="flex space-x-2 mb-4">
        <button
          type="button"
          onClick={() => {
            setUploadMethod('file');
            setError(null);
            setMediaUrl('');
          }}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
            uploadMethod === 'file'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => {
            setUploadMethod('url');
            setError(null);
            setSelectedFile(null);
            setPreview(null);
          }}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
            uploadMethod === 'url'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Use URL
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* File Upload */}
      {uploadMethod === 'file' && (
        <div>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={[...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES].join(',')}
              onChange={handleFileInputChange}
              className="hidden"
              title="Upload media file"
              aria-label="Upload media file"
            />
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Drag and drop a file here, or click to select
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Images: JPG, PNG, GIF, WebP (max 10MB) | Videos: MP4, WebM (max 50MB)
            </p>
          </div>

          {/* Preview */}
          {preview && selectedFile && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview:
              </p>
              {ACCEPTED_IMAGE_TYPES.includes(selectedFile.type) ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full h-auto max-h-64 rounded-lg border border-gray-200 dark:border-gray-700"
                />
              ) : (
                <video
                  src={preview}
                  controls
                  className="max-w-full h-auto max-h-64 rounded-lg border border-gray-200 dark:border-gray-700"
                />
              )}
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* URL Input */}
      {uploadMethod === 'url' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Media URL
          </label>
          <input
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            Enter a direct URL to an image or video file
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={uploadMethod === 'file' ? handleFileConfirm : handleUrlSubmit}
          disabled={uploadMethod === 'file' ? (!selectedFile || isProcessing) : !mediaUrl.trim()}
          className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Add Media'
          )}
        </button>
      </div>
    </div>
  );
}
