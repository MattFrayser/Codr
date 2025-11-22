/**
 * Simplified Theme Configuration
 *
 * Uses essential colors with clear visual hierarchy:
 * - Background shades (toolbar, background, terminal, surface, elevated)
 * - Text colors (text, textMuted, textInverse)
 * - Interactive states (interactiveActive)
 * - Border color
 * - Semantic colors (accent, success, error)
 */

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
    toolbar: string;       // Headers, filename bars (darkest/lightest)
    background: string;    // Main app background
    terminal: string;
    surface: string;       // Cards, panels, terminal
    elevated: string;      // Modals, dropdowns (needs to stand out)
    interactiveActive: string; // Active/selected state for buttons
    text: string;          // Primary text
    textMuted: string;     // Secondary/muted text, placeholders
    textInverse: string;   // Text on colored backgrounds (white/black)
    border: string;        // All borders
    accent: string;        // Links, info, branded elements
    success: string;       // Success states, run button, terminal prompts
    error: string;         // Error states, stderr
}

export const lightTheme: ThemeColors = {
    toolbar: '#e5e5e5',     // Light gray for headers
    background: '#ffffff',
    terminal: '#302B27',
    surface: '#f5f5f5',
    elevated: '#fafafa',    // Slightly lighter for modals
    interactiveActive: '#dbeafe', // Light blue tint for active states
    text: '#171717',
    textMuted: '#6b7280',
    textInverse: '#ffffff',
    border: '#e5e7eb',
    accent: '#2563eb',      // blue-600
    success: '#16a34a',     // green-600
    error: '#dc2626',       // red-600
};

export const darkTheme: ThemeColors = {
    toolbar: '#0f0f0f',
    background: '#0f0f0f',
    terminal: '#1e1e1e',
    surface: '#151515',
    elevated: '#2a2a2a',
    interactiveActive: '#1e293b', // Dark blue-gray tint for active states
    text: '#ededed',
    textMuted: '#9ca3af',
    textInverse: '#000000',
    border: '#3d444d',
    accent: '#60a5fa',      // blue-400 (lighter for dark mode)
    success: '#4ade80',     // green-400 (lighter for dark mode)
    error: '#f87171',       // red-400 (lighter for dark mode)
};

export const themes = {
    light: lightTheme,
    dark: darkTheme,
};

export const getTheme = (mode: ThemeMode): ThemeColors => {
    return themes[mode];
};
