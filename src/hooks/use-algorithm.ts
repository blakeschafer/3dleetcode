"use client";

import { useState, useEffect } from "react";
import { Algorithm, Step } from "@/algorithms/types";
import { getAlgorithm } from "@/algorithms/registry";

export function useAlgorithm(slug: string) {
  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
  const [presetIndex, setPresetIndex] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAlgorithm(slug).then((algo) => {
      setAlgorithm(algo);
      if (algo) {
        const initialSteps = algo.generateSteps(algo.presets[0].data);
        setSteps(initialSteps);
      }
      setLoading(false);
    });
  }, [slug]);

  const selectPreset = (index: number) => {
    if (!algorithm) return;
    setPresetIndex(index);
    const newSteps = algorithm.generateSteps(algorithm.presets[index].data);
    setSteps(newSteps);
  };

  return { algorithm, steps, presetIndex, selectPreset, loading };
}
