/**
 * Theme Context
 *
 * Provides theme state management across the application.
 * Handles theme persistence, system preference detection, and theme switching.
 */

"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode, getTheme, ThemeColors } from '../config/theme';

interface ThemeContextType {
    theme: ThemeMode;
    themeColors: ThemeColors;
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'codr-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>('dark');
    const [mounted, setMounted] = useState(false);

    // Initialize theme on mount
    useEffect(() => {
        const initializeTheme = () => {
            // Try to get theme from localStorage
            const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;

            if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
                setThemeState(storedTheme);
            } else {
                // Fall back to system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setThemeState(prefersDark ? 'dark' : 'light');
            }

            setMounted(true);
        };

        initializeTheme();

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            // Only update if user hasn't manually set a preference
            const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            if (!storedTheme) {
                setThemeState(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (!mounted) return;

        // Set data-theme attribute on html element
        document.documentElement.setAttribute('data-theme', theme);

        // Update CSS variables with color palette
        const themeColors = getTheme(theme);
        const root = document.documentElement;

        root.style.setProperty('--toolbar', themeColors.toolbar);
        root.style.setProperty('--background', themeColors.background);
        root.style.setProperty('--terminal', themeColors.terminal);
        root.style.setProperty('--surface', themeColors.surface);
        root.style.setProperty('--elevated', themeColors.elevated);
        root.style.setProperty('--interactive-active', themeColors.interactiveActive);
        root.style.setProperty('--text', themeColors.text);
        root.style.setProperty('--text-muted', themeColors.textMuted);
        root.style.setProperty('--text-inverse', themeColors.textInverse);
        root.style.setProperty('--border', themeColors.border);
        root.style.setProperty('--accent', themeColors.accent);
        root.style.setProperty('--success', themeColors.success);
        root.style.setProperty('--error', themeColors.error);
    }, [theme, mounted]);

    const setTheme = (newTheme: ThemeMode) => {
        setThemeState(newTheme);
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const themeColors = getTheme(theme);

    // Prevent flash of unstyled content
    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, themeColors, setTheme, toggleTheme }}>
            <div className="h-full">
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
