import { createContext, useContext, useState } from "react";

type Theme = "light" | "dark";

type ThemeContext = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContext | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme") as unknown;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    let theme: Theme;
    if (stored === "light" || stored === "dark") {
      theme = stored;
    } else {
      theme = prefersDark ? "dark" : "light";
    }

    const root = document.documentElement;
    root.classList.add(theme);

    return theme;
  });

  const value = {
    theme,
    setTheme: (theme: "light" | "dark") => {
      localStorage.setItem("theme", theme);
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)!;
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};
