import { useState } from 'react';

const useTTSPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  
  const play = (article) => {
    setCurrentArticle(article);
    setIsPlaying(true);
    setIsPaused(false);
    // Real implementation would use window.speechSynthesis here
  };
  
  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);
  
  const stop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentArticle(null);
  };
  
  const next = () => {};
  const prev = () => {};

  return { isPlaying, isPaused, currentArticle, play, pause, resume, stop, next, prev };
};

export default useTTSPlayer;
