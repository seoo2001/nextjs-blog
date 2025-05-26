import { create } from 'zustand';

interface LayoutState {
  isWideLayout: boolean;
  isInitialized: boolean;
  setWideLayout: (isWide: boolean) => void;
  initializeFromStorage: () => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  isWideLayout: false,
  isInitialized: false,
  setWideLayout: (isWide: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isWideLayout', JSON.stringify(isWide));
    }
    set({ isWideLayout: isWide });
  },
  initializeFromStorage: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('isWideLayout');
      if (saved) {
        set({ isWideLayout: JSON.parse(saved), isInitialized: true });
      } else {
        set({ isInitialized: true });
      }
    }
  },
}));