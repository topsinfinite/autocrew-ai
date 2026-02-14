"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseTTSAudioOptions {
  enabled: boolean;
  src: string;
}

export function useTTSAudio({ enabled, src }: UseTTSAudioOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      stopAudio();
      return;
    }

    if (!src) return;

    stopAudio();
    setIsLoading(true);

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    audio.src = src;

    const onCanPlay = () => {
      setIsLoading(false);
      audio.play().catch(() => {});
    };
    const onError = () => setIsLoading(false);
    const onEnded = () => setIsLoading(false);

    audio.addEventListener("canplaythrough", onCanPlay, { once: true });
    audio.addEventListener("error", onError, { once: true });
    audio.addEventListener("ended", onEnded, { once: true });
    audio.load();

    return () => {
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
    };
  }, [src, enabled, stopAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoading };
}
