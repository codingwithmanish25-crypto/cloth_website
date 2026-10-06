"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

const THEME_CHANGE_EVENT = "site-theme-change";

const getTheme = () =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

const subscribeToTheme = (callback) => {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, callback);
};

const getServerTheme = () => "light";

const ThemeChange = () => {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getTheme,
    getServerTheme,
  );

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const initialTheme = savedTheme === "dark" ? "dark" : "light";

    if (document.documentElement.dataset.theme !== initialTheme) {
      document.documentElement.dataset.theme = initialTheme;
      window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="theme-toggle fixed bottom-24 right-6 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border shadow-xl transition-transform hover:scale-110"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeChange;