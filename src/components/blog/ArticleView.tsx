import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import type { ArticleWithDetails } from '../../services/articleService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { AudioReader } from './AudioReader';
import { CommentSection } from './CommentSection';
import { ArrowLeft, Calendar } from 'lucide-react';
import { sanitizeArticleContent } from '../../utils/sanitize';
import { SEOMetaTags } from '../common/SEOMetaTags';
import { getArticleSEOData } from '../../utils/seo';

export function ArticleView() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (articleId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await articleService.getArticleById(articleId);
      setArticle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load article');
      console.error('Error loading article:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-800 dark:text-red-200 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => id && loadArticle(id)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-gray-800 dark:text-gray-200">
          <p className="text-xl font-medium">Article not found.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* SEO Meta Tags */}
      <SEOMetaTags {...getArticleSEOData(article)} />
      
      {/* Back to Home Link */}
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-all font-medium group bg-blue-50 dark:bg-blue-900/20 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      {/* Article Header */}
      <header className="mb-10 pb-8 border-b border-gray-200/50 dark:border-gray-800/50">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-gray-50 dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent mb-6 leading-tight">
          {article.title}
        </h1>
        {article.published_at && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30 mr-3">
              <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            </div>
            <time className="text-lg font-medium">
              {formatDate(article.published_at)}
            </time>
          </div>
        )}
      </header>

      {/* Audio Reader */}
      <div className="mb-10">
        <AudioReader content={article.content} />
      </div>

      {/* Article Content */}
      <div 
        className="prose prose-lg md:prose-xl dark:prose-invert max-w-none mb-12 prose-headings:font-bold prose-headings:bg-gradient-to-r prose-headings:from-gray-900 prose-headings:to-gray-700 dark:prose-headings:from-gray-50 dark:prose-headings:to-gray-300 prose-headings:bg-clip-text prose-headings:text-transparent prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-lg prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:rounded-xl prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:rounded-r-xl prose-blockquote:py-1"
        dangerouslySetInnerHTML={{ __html: sanitizeArticleContent(article.content) }}
      />

      {/* Embedded Media */}
      {article.media && article.media.length > 0 && (
        <div className="mb-12 space-y-8">
          {article.media
            .sort((a, b) => a.order_index - b.order_index)
            .map((mediaItem) => (
              <div key={mediaItem.id} className="rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-800">
                {mediaItem.type === 'image' ? (
                  <img
                    src={mediaItem.url}
                    alt={mediaItem.caption || ''}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={mediaItem.url}
                    controls
                    className="w-full h-auto bg-black"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                {mediaItem.caption && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 px-4 pb-4 text-center italic">
                    {mediaItem.caption}
                  </p>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Comment Section */}
      <div className="mt-16 pt-8 border-t-2 border-gray-200 dark:border-gray-800">
        <CommentSection articleId={article.id} />
      </div>
    </article>
  );
}
