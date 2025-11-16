/**
 * Editor Settings Hook
 *
 * Manages all editor configuration including theme, font size, tab size, and autocomplete.
 */

import { useState } from 'react';
import {
  DEFAULT_EDITOR_SETTINGS,
  EditorSettings,
  toggleTheme as toggleThemeUtil,
  adjustFontSize as adjustFontSizeUtil,
  buildEditorOptions
} from '../config/editorConfig';

export interface UseEditorSettingsResult {
  settings: EditorSettings;
  theme: string;
  fontSize: number;
  tabSize: number;
  enableAutocomplete: boolean;
  toggleTheme: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  setTabSize: (size: number) => void;
  setEnableAutocomplete: (enabled: boolean) => void;
  editorOptions: ReturnType<typeof buildEditorOptions>;
}

export function useEditorSettings(): UseEditorSettingsResult {
  const [theme, setTheme] = useState<string>(DEFAULT_EDITOR_SETTINGS.theme);
  const [fontSize, setFontSize] = useState<number>(DEFAULT_EDITOR_SETTINGS.fontSize);
  const [tabSize, setTabSize] = useState<number>(DEFAULT_EDITOR_SETTINGS.tabSize);
  const [enableAutocomplete, setEnableAutocomplete] = useState<boolean>(
    DEFAULT_EDITOR_SETTINGS.enableAutocomplete
  );

  /**
   * Toggle between dark and light theme
   */
  const toggleTheme = () => {
    setTheme(currentTheme => toggleThemeUtil(currentTheme));
  };

  /**
   * Increase font size
   */
  const increaseFontSize = () => {
    setFontSize(current => adjustFontSizeUtil(current, 'increase'));
  };

  /**
   * Decrease font size
   */
  const decreaseFontSize = () => {
    setFontSize(current => adjustFontSizeUtil(current, 'decrease'));
  };

  // Build settings object
  const settings: EditorSettings = {
    theme,
    fontSize,
    tabSize,
    enableAutocomplete
  };

  // Build Monaco editor options
  const editorOptions = buildEditorOptions(settings);

  return {
    settings,
    theme,
    fontSize,
    tabSize,
    enableAutocomplete,
    toggleTheme,
    increaseFontSize,
    decreaseFontSize,
    setTabSize,
    setEnableAutocomplete,
    editorOptions
  };
}
