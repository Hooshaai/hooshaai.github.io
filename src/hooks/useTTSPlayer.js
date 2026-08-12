import { useContext } from 'react';
import { TTSContext } from '../contexts/TTSContext';

const useTTSPlayer = () => {
  const context = useContext(TTSContext);
  if (!context) {
    console.warn('useTTSPlayer must be used within a TTSProvider');
    return {
      isPlaying: false,
      isPaused: false,
      currentArticle: null,
      voices: [],
      selectedVoice: null,
      playbackRate: 1,
      progress: 0,
      play: () => {},
      pause: () => {},
      resume: () => {},
      stop: () => {},
      togglePlay: () => {},
      changeVoice: () => {},
      changePlaybackRate: () => {},
      next: () => {},
      prev: () => {},
    };
  }
  return context;
};

export default useTTSPlayer;

