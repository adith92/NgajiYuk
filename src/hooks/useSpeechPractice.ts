"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeArabic, stringSimilarity } from "@/lib/utils";

interface SpeechResultEvent {
  results: {
    [index: number]: {
      [index: number]: { transcript: string };
    };
  };
}

interface SpeechRecognitionController {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort?: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionController;

export interface SpeechPracticeFeedback {
  text: string;
  type: "info" | "success" | "error";
  score?: number;
  transcript?: string;
}

interface UseSpeechPracticeOptions {
  threshold?: number;
  language?: string;
  onMatched?: (score: number, transcript: string) => void;
}

export function useSpeechPractice({ threshold = 0.7, language = "ar-SA", onMatched }: UseSpeechPracticeOptions = {}) {
  const controllerRef = useRef<SpeechRecognitionController | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<SpeechPracticeFeedback | null>(null);

  const stop = useCallback(() => {
    controllerRef.current?.stop();
    controllerRef.current = null;
    setIsRecording(false);
  }, []);

  const clear = useCallback(() => setFeedback(null), []);

  const start = useCallback((targetText: string) => {
    const speechWindow = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setFeedback({ text: "Browser ini belum mendukung latihan mikrofon. Coba gunakan Chrome terbaru.", type: "error" });
      return;
    }

    controllerRef.current?.abort?.();
    const recognition = new SpeechRecognition();
    controllerRef.current = recognition;
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setIsRecording(true);
      setFeedback({ text: "Mendengarkan... baca perlahan ya 🎙️", type: "info" });
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const scoreValue = stringSimilarity(normalizeArabic(targetText), normalizeArabic(transcript));
      const score = Math.round(scoreValue * 100);
      if (scoreValue >= threshold) {
        setFeedback({
          text: "Bagus! Transkrip suara cukup mirip. Tetap belajar bersama pembimbing ya.",
          type: "success",
          score,
          transcript,
        });
        onMatched?.(score, transcript);
      } else {
        setFeedback({
          text: `Yuk coba lagi. Mikrofon menangkap: “${transcript}”`,
          type: "error",
          score,
          transcript,
        });
      }
    };
    recognition.onerror = () => {
      setFeedback({ text: "Suaranya belum tertangkap jelas. Dekatkan mikrofon lalu coba lagi.", type: "error" });
    };
    recognition.onend = () => {
      controllerRef.current = null;
      setIsRecording(false);
    };
    recognition.start();
  }, [language, onMatched, threshold]);

  useEffect(() => () => {
    controllerRef.current?.abort?.();
    controllerRef.current = null;
  }, []);

  return { isRecording, feedback, start, stop, clear };
}
