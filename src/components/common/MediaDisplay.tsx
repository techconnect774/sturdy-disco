import ResponsiveImage from './ResponsiveImage';
import VideoPlayer from './VideoPlayer';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
  source: 'upload' | 'url';
}

interface MediaDisplayProps {
  media: MediaItem;
  className?: string;
}

export default function MediaDisplay({ media, className = '' }: MediaDisplayProps) {
  if (media.type === 'image') {
    return (
      <ResponsiveImage
        src={media.url}
        alt={media.caption || 'Article image'}
        caption={media.caption}
        className={className}
      />
    );
  }

  if (media.type === 'video') {
    return (
      <VideoPlayer
        src={media.url}
        caption={media.caption}
        className={className}
      />
    );
  }

  return null;
}
