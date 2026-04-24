import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const DEFAULT_ACCENT = { h: 265, s: 89, l: 62 }; // purple #8b5cf6-ish

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => localStorage.getItem("vx_theme") || "dark");
    const [accent, setAccent] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("vx_accent")) || DEFAULT_ACCENT;
        } catch {
            return DEFAULT_ACCENT;
        }
    });

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("theme-dark", "theme-light", "dark");
        root.classList.add(theme === "light" ? "theme-light" : "theme-dark");
        if (theme === "dark") root.classList.add("dark");
        localStorage.setItem("vx_theme", theme);
    }, [theme]);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty("--accent-h", accent.h);
        root.style.setProperty("--accent-s", `${accent.s}%`);
        root.style.setProperty("--accent-l", `${accent.l}%`);
        localStorage.setItem("vx_accent", JSON.stringify(accent));
    }, [accent]);

    const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, accent, setAccent }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);

export const ACCENT_PRESETS = [
    { name: "Vyntrix Purple", h: 265, s: 89, l: 62 },
    { name: "Electric Violet", h: 280, s: 95, l: 60 },
    { name: "Neon Magenta", h: 310, s: 90, l: 60 },
    { name: "Cyber Blue", h: 220, s: 95, l: 60 },
    { name: "Toxic Lime", h: 140, s: 85, l: 50 },
    { name: "Sunset Orange", h: 20, s: 95, l: 58 },
    { name: "Hot Pink", h: 340, s: 90, l: 62 },
    { name: "Aqua Mint", h: 170, s: 80, l: 50 },
];
