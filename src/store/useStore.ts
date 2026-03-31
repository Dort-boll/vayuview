import { create } from 'zustand';

export type VisionMode = 'precision' | 'immersion' | 'reaction' | 'recovery';

interface PatternDNA {
  motion: number;
  blur: number;
  symmetry: number;
  distortion: number;
  colorShift: number;
}

interface VayuState {
  visionType: 'myopia' | 'hyperopia' | 'astigmatism' | 'normal';
  mode: VisionMode;
  patternName: string;
  patternStack: string[];
  intensity: number;
  focusLevel: number;
  sessionTime: number;
  isSafetyMode: boolean;
  cognitiveState: 'alert' | 'fatigued' | 'overstimulated';
  patternDNA: PatternDNA;
  setVisionType: (type: 'myopia' | 'hyperopia' | 'astigmatism' | 'normal') => void;
  setMode: (mode: VisionMode) => void;
  setPatternName: (name: string) => void;
  setPatternStack: (stack: string[]) => void;
  setIntensity: (intensity: number) => void;
  setFocusLevel: (focusLevel: number) => void;
  setSessionTime: (time: number) => void;
  setIsSafetyMode: (mode: boolean) => void;
  setCognitiveState: (state: 'alert' | 'fatigued' | 'overstimulated') => void;
  setPatternDNA: (dna: PatternDNA) => void;
}

export const useStore = create<VayuState>((set) => ({
  visionType: 'normal',
  mode: 'immersion',
  patternName: 'spiral',
  patternStack: ['spiral'],
  intensity: 5,
  focusLevel: 5,
  sessionTime: 0,
  isSafetyMode: true,
  cognitiveState: 'alert',
  patternDNA: { motion: 0.5, blur: 0.5, symmetry: 0.5, distortion: 0.5, colorShift: 0.5 },
  setVisionType: (visionType) => set({ visionType }),
  setMode: (mode) => set({ mode }),
  setPatternName: (patternName) => set({ patternName }),
  setPatternStack: (patternStack) => set({ patternStack }),
  setIntensity: (intensity) => set({ intensity }),
  setFocusLevel: (focusLevel) => set({ focusLevel }),
  setSessionTime: (sessionTime) => set({ sessionTime }),
  setIsSafetyMode: (isSafetyMode) => set({ isSafetyMode }),
  setCognitiveState: (cognitiveState) => set({ cognitiveState }),
  setPatternDNA: (patternDNA) => set({ patternDNA }),
}));
