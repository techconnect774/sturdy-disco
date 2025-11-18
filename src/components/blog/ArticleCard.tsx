import { useNavigate } from 'react-router-dom';
import type { ArticleWithMedia } from '../../services/articleService';
import { Calendar, Image as ImageIcon } from 'lucide-react';

interface ArticleCardProps {
  article: ArticleWithMedia;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const navigate = useNavigate();

  // Get the first image from media or use placeholder
  const thumbnail = article.media?.find((m) => m.type === 'image')?.url;

  // Format publication date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Draft';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleClick = () => {
    navigate(`/article/${article.id}`);
  };

  return (
    <article
      onClick={handleClick}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500 transform hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden relative">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-500 transition-colors" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {article.title}
        </h2>

        {article.excerpt && (
          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-800">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <time dateTime={article.published_at || undefined}>
            {formatDate(article.published_at)}
          </time>
        </div>
      </div>
    </article>
  );
}
