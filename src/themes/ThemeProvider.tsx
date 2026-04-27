import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { getTheme, type ThemeConfig } from "./themeConfig";

interface ThemeContextType {
  theme: ThemeConfig;
  themeId: number;
  setTheme: (id: number) => void;
  applyThemeStyles: () => React.CSSProperties;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children, initialTheme = 0 }: { children: ReactNode; initialTheme?: number }) {
  const [themeId, setThemeId] = useState(initialTheme);
  const theme = getTheme(themeId);

  const setTheme = useCallback((id: number) => {
    setThemeId(id);
  }, []);

  const applyThemeStyles = useCallback((): React.CSSProperties => {
    return {
      "--primary": theme.colors.primary,
      "--secondary": theme.colors.secondary,
      "--accent": theme.colors.accent,
      "--background": theme.colors.background,
      "--surface": theme.colors.surface,
      "--text": theme.colors.text,
      "--text-muted": theme.colors.textMuted,
      "--border": theme.colors.border,
      "--gradient": theme.colors.gradient,
    } as React.CSSProperties;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, themeId, setTheme, applyThemeStyles }}>
      <div
        style={{
          ...applyThemeStyles(),
          background: theme.colors.background,
          color: theme.colors.text,
          minHeight: "100vh",
          transition: "background 0.5s ease, color 0.5s ease",
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
