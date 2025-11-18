export const ttsService = {
  utterance: null as SpeechSynthesisUtterance | null,
  
  /**
   * Initialize and play text with HTML tag stripping
   */
  speak(text: string): SpeechSynthesisUtterance {
    if (!('speechSynthesis' in window)) {
      throw new Error('Text-to-speech not supported in this browser');
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Strip HTML tags from content
    const cleanText = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    this.utterance = new SpeechSynthesisUtterance(cleanText);
    this.utterance.rate = 1.0;
    this.utterance.pitch = 1.0;
    this.utterance.volume = 1.0;
    
    window.speechSynthesis.speak(this.utterance);
    return this.utterance;
  },

  /**
   * Pause speech playback
   */
  pause(): void {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  },

  /**
   * Resume speech playback
   */
  resume(): void {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  },

  /**
   * Stop speech playback
   */
  stop(): void {
    window.speechSynthesis.cancel();
  },

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return window.speechSynthesis.speaking;
  },

  /**
   * Check if currently paused
   */
  isPaused(): boolean {
    return window.speechSynthesis.paused;
  }
};
