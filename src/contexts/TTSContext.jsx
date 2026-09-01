import React, { createContext, useState, useEffect, useRef } from 'react';
import { ALL_ARTICLES } from '../data/articles';

export const TTSContext = createContext(null);

export const TTSProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progress, setProgress] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const utteranceRef = useRef(null);
  const textLengthRef = useRef(0);

  // Initialize Speech Synthesis Voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;

    const populateVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        // Prefer natural / English voices
        const preferredVoice = availableVoices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))) || availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
        setSelectedVoice(preferredVoice);
      }
    };

    populateVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoices;
    }

    return () => {
      if (synth) synth.cancel();
    };
  }, []);

  const play = (article) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;

    // If already playing the same article and paused, resume
    if (currentArticle?.id === article.id && isPaused) {
      synth.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Stop current speech
    synth.cancel();

    // Prepare text to read
    const textToRead = `${article.title}. Published by ${article.author || 'Hoosha AI'}. ${article.snippet || ''}`;
    textLengthRef.current = textToRead.length;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = playbackRate;

    utterance.onboundary = (event) => {
      if (event.name === 'word' && textLengthRef.current > 0) {
        const currentPos = event.charIndex;
        setCharIndex(currentPos);
        const currentProg = Math.min(100, Math.round((currentPos / textLengthRef.current) * 100));
        setProgress(currentProg);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
    };

    utterance.onerror = (e) => {
      console.warn('TTS Utterance Error:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    setCurrentArticle(article);
    setIsPlaying(true);
    setIsPaused(false);
    setProgress(0);

    synth.speak(utterance);
  };

  const pause = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stop = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentArticle(null);
    setProgress(0);
  };

  const togglePlay = (article) => {
    if (currentArticle?.id === article.id) {
      if (isPlaying) {
        if (isPaused) {
          resume();
        } else {
          pause();
        }
      } else {
        play(article);
      }
    } else {
      play(article);
    }
  };

  const changeVoice = (voiceName) => {
    const voice = voices.find(v => v.name === voiceName);
    if (voice) {
      setSelectedVoice(voice);
      if (isPlaying && currentArticle) {
        play(currentArticle);
      }
    }
  };

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (isPlaying && currentArticle) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        play(currentArticle);
      }
    }
  };

  const next = () => {
    if (!currentArticle) return;
    const currentIndex = ALL_ARTICLES.findIndex(a => a.id === currentArticle.id);
    const nextIndex = (currentIndex + 1) % ALL_ARTICLES.length;
    play(ALL_ARTICLES[nextIndex]);
  };

  const prev = () => {
    if (!currentArticle) return;
    const currentIndex = ALL_ARTICLES.findIndex(a => a.id === currentArticle.id);
    const prevIndex = (currentIndex - 1 + ALL_ARTICLES.length) % ALL_ARTICLES.length;
    play(ALL_ARTICLES[prevIndex]);
  };

  return (
    <TTSContext.Provider
      value={{
        isPlaying,
        isPaused,
        currentArticle,
        voices,
        selectedVoice,
        playbackRate,
        progress,
        charIndex,
        play,
        pause,
        resume,
        stop,
        togglePlay,
        changeVoice,
        changePlaybackRate,
        next,
        prev,
      }}
    >
      {children}
    </TTSContext.Provider>
  );
};
