import { useState, useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { ttsService } from '../../services/ttsService';

interface AudioReaderProps {
  content: string;
}

export function AudioReader({ content }: AudioReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check browser compatibility
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }

    // Cleanup on unmount
    return () => {
      ttsService.stop();
    };
  }, []);

  const handlePlay = () => {
    try {
      if (isPaused) {
        ttsService.resume();
        setIsPaused(false);
        setIsPlaying(true);
      } else {
        const utterance = ttsService.speak(content);
        
        utterance.onstart = () => {
          setIsPlaying(true);
          setIsPaused(false);
        };
        
        utterance.onend = () => {
          setIsPlaying(false);
          setIsPaused(false);
        };
        
        utterance.onerror = () => {
          setIsPlaying(false);
          setIsPaused(false);
        };
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsSupported(false);
    }
  };

  const handlePause = () => {
    ttsService.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    ttsService.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Text-to-speech is not supported in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Listen to this article
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {!isPlaying && !isPaused && (
            <button
              type="button"
              onClick={handlePlay}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
              aria-label="Play audio"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play</span>
            </button>
          )}
          
          {isPlaying && (
            <button
              type="button"
              onClick={handlePause}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 animate-pulse"
              aria-label="Pause audio"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
          )}
          
          {isPaused && (
            <button
              type="button"
              onClick={handlePlay}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
              aria-label="Resume audio"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume</span>
            </button>
          )}
          
          {(isPlaying || isPaused) && (
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
              aria-label="Stop audio"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Stop</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
