import { create } from 'zustand';

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  focusTime: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  timeLeft: 25 * 60,
  isRunning: false,
  focusTime: 25 * 60,
  startTimer: () => set({ isRunning: true }),
  pauseTimer: () => set({ isRunning: false }),
  resetTimer: () => set((state) => ({ isRunning: false, timeLeft: state.focusTime })),
  tickTimer: () => set((state) => {
    if (!state.isRunning || state.timeLeft <= 0) return state;
    return { timeLeft: state.timeLeft - 1 };
  }),
}));
