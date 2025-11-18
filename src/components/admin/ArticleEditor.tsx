import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { articleService, type Article, type MediaItem } from '../../services/articleService';
import { MediaUploader, type MediaUpload } from './MediaUploader';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

export function ArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<MediaUpload[]>([]);
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      loadArticle(id);
    }
  }, [id, isEditMode]);

  const loadArticle = async (articleId: string) => {
    try {
      setLoading(true);
      const article = await articleService.getArticleById(articleId);
      setTitle(article.title);
      setExcerpt(article.excerpt || '');
      setContent(article.content);

      // Convert existing media to MediaUpload format
      const existingMedia: MediaUpload[] = article.media.map((m: MediaItem) => ({
        url: m.url,
        type: m.type,
        source: m.source,
        preview: m.url
      }));
      setMedia(existingMedia);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load article');
      console.error('Error loading article:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaAdded = (newMedia: MediaUpload) => {
    setMedia([...media, newMedia]);
    setShowMediaUploader(false);
  };

  const handleRemoveMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleSave = async (publish: boolean) => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const articleData: Partial<Article> = {
        title: title.trim(),
        excerpt: excerpt.trim() || content.replace(/<[^>]*>/g, '').substring(0, 200),
        content: content,
        is_published: publish,
        author_id: user?.id
      };

      if (publish) {
        articleData.published_at = new Date().toISOString();
      }

      let articleId: string;

      if (isEditMode && id) {
        // Update existing article
        await articleService.updateArticle(id, articleData);
        articleId = id;
        setSuccessMessage(`Article ${publish ? 'published' : 'saved as draft'} successfully!`);
      } else {
        // Create new article
        const newArticle = await articleService.createArticle(articleData);
        articleId = newArticle.id;
        setSuccessMessage(`Article ${publish ? 'published' : 'saved as draft'} successfully!`);
      }

      // Handle media uploads
      for (let i = 0; i < media.length; i++) {
        const mediaItem = media[i];
        let mediaUrl = mediaItem.url;

        // Upload file if it's a file upload
        if (mediaItem.source === 'upload' && mediaItem.file) {
          mediaUrl = await articleService.uploadMedia(mediaItem.file, articleId);
        }

        // Add media reference to article (only for new media)
        if (mediaUrl) {
          await articleService.addMediaToArticle({
            article_id: articleId,
            type: mediaItem.type,
            url: mediaUrl,
            source: mediaItem.source,
            order_index: i
          });
        }
      }

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
      console.error('Error saving article:', err);
    } finally {
      setSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      [{ align: [] }],
      ['link'],
      ['clean']
    ]
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isEditMode ? 'Edit Article' : 'Create New Article'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditMode ? 'Update your article content and settings' : 'Write and publish a new article'}
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <p className="text-sm text-green-800 dark:text-green-200">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8 space-y-8">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-shadow text-lg font-medium"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Enter a short excerpt (optional - will be auto-generated from content if left empty)"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-shadow"
          />
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Content *
          </label>
          <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden shadow-sm">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={quillModules}
              placeholder="Write your article content here..."
              className="h-64"
            />
          </div>
        </div>

        {/* Media Section */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Media (Images & Videos)
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Add images and videos to your article
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowMediaUploader(!showMediaUploader)}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg"
            >
              {showMediaUploader ? 'Cancel' : 'Add Media'}
            </button>
          </div>

          {/* Media Uploader */}
          {showMediaUploader && (
            <div className="mb-4">
              <MediaUploader
                onMediaAdded={handleMediaAdded}
                onCancel={() => setShowMediaUploader(false)}
              />
            </div>
          )}

          {/* Media List */}
          {media.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {media.map((item, index) => (
                <div
                  key={index}
                  className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-shadow"
                >
                  {/* Preview */}
                  <div className="mb-3">
                    {item.type === 'image' ? (
                      <img
                        src={item.preview || item.url}
                        alt={`Media ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={item.preview || item.url}
                        className="w-full h-32 object-cover rounded-lg"
                        controls
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-semibold capitalize text-gray-900 dark:text-white">{item.type}</p>
                    <p className="text-xs truncate mt-1">
                      {item.source === 'upload' ? item.file?.name : item.url}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(index)}
                    aria-label="Remove media"
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-md transition-all hover:scale-110"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={() => navigate('/admin')}
          disabled={saving}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => handleSave(false)}
          disabled={saving}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
        >
          {saving ? 'Saving...' : 'Save as Draft'}
        </button>
        <button
          type="button"
          onClick={() => handleSave(true)}
          disabled={saving}
          className="px-6 py-3 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {saving ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
