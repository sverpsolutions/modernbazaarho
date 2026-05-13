import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: localStorage.getItem('sv_dark_mode') === '1',
  toggleDarkMode: () => set((state) => {
    const newVal = !state.isDarkMode;
    localStorage.setItem('sv_dark_mode', newVal ? '1' : '0');
    if (newVal) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    return { isDarkMode: newVal };
  }),
}));
