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
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer overflow-hidden group border border-gray-200/50 dark:border-gray-800/50 hover:border-blue-400/50 dark:hover:border-blue-500/50 transform hover:-translate-y-2"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 overflow-hidden relative">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600">
              <ImageIcon className="w-12 h-12 text-blue-400 dark:text-gray-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
          {article.title}
        </h2>

        {article.excerpt && (
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed text-sm">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30">
              <Calendar className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            </div>
            <time dateTime={article.published_at || undefined} className="font-medium">
              {formatDate(article.published_at)}
            </time>
          </div>
          <span className="text-blue-600 dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">Read more →</span>
        </div>
      </div>
    </article>
  );
}
