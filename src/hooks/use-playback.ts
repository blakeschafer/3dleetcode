"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Step } from "@/algorithms/types";
import { DEFAULT_SPEED } from "@/lib/constants";

interface PlaybackState {
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  steps: Step[];
}

export function usePlayback(steps: Step[]) {
  const [state, setState] = useState<PlaybackState>({
    currentStep: 0,
    isPlaying: false,
    speed: DEFAULT_SPEED,
    steps,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setState((prev) => ({ ...prev, steps, currentStep: 0, isPlaying: false }));
  }, [steps]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    clearTimer();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, [clearTimer]);

  const stepForward = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep >= prev.steps.length - 1) return prev;
      return { ...prev, currentStep: prev.currentStep + 1 };
    });
  }, []);

  const stepBackward = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep <= 0) return prev;
      return { ...prev, currentStep: prev.currentStep - 1 };
    });
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setState((prev) => ({ ...prev, currentStep: 0, isPlaying: false }));
  }, [clearTimer]);

  const setSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, speed }));
  }, []);

  useEffect(() => {
    clearTimer();
    if (state.isPlaying) {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.currentStep >= prev.steps.length - 1) {
            return { ...prev, isPlaying: false };
          }
          return { ...prev, currentStep: prev.currentStep + 1 };
        });
      }, 1000 / state.speed);
    }
    return clearTimer;
  }, [state.isPlaying, state.speed, clearTimer]);

  const currentStepData = state.steps[state.currentStep] ?? null;

  return {
    currentStep: state.currentStep,
    totalSteps: state.steps.length,
    isPlaying: state.isPlaying,
    speed: state.speed,
    currentStepData,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    setSpeed,
  };
}
