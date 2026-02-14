"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseTTSAudioOptions {
  enabled: boolean;
  text: string;
}

export function useTTSAudio({ enabled, text }: UseTTSAudioOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopAudio = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
  }, []);

  useEffect(() => {
    if (!enabled) {
      stopAudio();
      return;
    }

    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Strip surrounding quotes from transcript strings
    const cleanText = text.replace(/^"|"$/g, "");
    if (!cleanText) return;

    stopAudio();
    setIsLoading(true);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Try to pick a female English voice for consistency
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Samantha") ||
          v.name.includes("Karen") ||
          v.name.includes("Female")),
    );
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsLoading(false);
    utterance.onend = () => setIsLoading(false);
    utterance.onerror = () => setIsLoading(false);

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);

    return () => {
      stopAudio();
    };
  }, [text, enabled, stopAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoading };
}
