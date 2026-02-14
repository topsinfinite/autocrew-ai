"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseTTSAudioOptions {
  enabled: boolean;
  text: string;
}

export function useTTSAudio({ enabled, text }: UseTTSAudioOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cacheRef = useRef<Map<string, string>>(new Map());
  const enabledRef = useRef(enabled);

  // Keep ref in sync so callbacks see latest value
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const fetchAudio = useCallback(
    async (textToSpeak: string): Promise<string | null> => {
      const cached = cacheRef.current.get(textToSpeak);
      if (cached) return cached;

      setIsLoading(true);
      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textToSpeak }),
        });

        if (!response.ok) return null;

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        cacheRef.current.set(textToSpeak, url);
        return url;
      } catch {
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // Play when text changes and enabled, or stop when disabled
  useEffect(() => {
    if (!enabled) {
      stopAudio();
      return;
    }

    let cancelled = false;

    async function play() {
      stopAudio();
      const url = await fetchAudio(text);
      if (cancelled || !url || !enabledRef.current) return;

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = url;
      audioRef.current.play().catch(() => {});
    }

    play();

    return () => {
      cancelled = true;
    };
  }, [text, enabled, fetchAudio, stopAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      cacheRef.current.forEach((url) => URL.revokeObjectURL(url));
      cacheRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoading };
}
