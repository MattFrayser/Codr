/**
 * Editor Configuration
 *
 * Configuration for Monaco editor settings, themes, and options.
 */

export interface EditorSettings {
  theme: string;
  fontSize: number;
  tabSize: number;
  enableAutocomplete: boolean;
}

// Default editor settings
export const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  theme: "vs-dark",
  fontSize: 18,
  tabSize: 2,
  enableAutocomplete: true
};

// Available themes
export const THEMES = {
  DARK: "vs-dark",
  LIGHT: "light"
} as const;

// Font size constraints
export const FONT_SIZE = {
  MIN: 8,
  MAX: 32,
  STEP: 2
} as const;

// Available tab sizes
export const TAB_SIZES = [2, 4, 8] as const;

/**
 * Build Monaco editor options based on settings
 */
export function buildEditorOptions(settings: EditorSettings) {
  return {
    minimap: { enabled: false },
    fontSize: settings.fontSize,
    lineNumbers: "on" as const,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: settings.tabSize,
    wordWrap: "on" as const,
    suggestOnTriggerCharacters: settings.enableAutocomplete,
    quickSuggestions: {
      other: settings.enableAutocomplete,
      comments: false,
      strings: settings.enableAutocomplete,
    },
    wordBasedSuggestions: settings.enableAutocomplete ? ('currentDocument' as const) : ('off' as const)
  };
}

/**
 * Toggle theme between dark and light
 */
export function toggleTheme(currentTheme: string): string {
  return currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
}

/**
 * Adjust font size with constraints
 */
export function adjustFontSize(currentSize: number, direction: 'increase' | 'decrease'): number {
  if (direction === 'increase') {
    return Math.min(FONT_SIZE.MAX, currentSize + FONT_SIZE.STEP);
  } else {
    return Math.max(FONT_SIZE.MIN, currentSize - FONT_SIZE.STEP);
  }
}
