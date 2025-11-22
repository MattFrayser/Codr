/**
 * Editor Settings Hook
 *
 * Manages editor configuration including font size, tab size, and autocomplete.
 * Note: Theme is managed globally via ThemeContext.
 */

import { useState } from 'react';
import {
  DEFAULT_EDITOR_SETTINGS,
  EditorSettings,
  adjustFontSize as adjustFontSizeUtil,
  buildEditorOptions
} from '../config/editorConfig';

export interface UseEditorSettingsResult {
  fontSize: number;
  tabSize: number;
  enableAutocomplete: boolean;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  setTabSize: (size: number) => void;
  setEnableAutocomplete: (enabled: boolean) => void;
  editorOptions: ReturnType<typeof buildEditorOptions>;
}

export function useEditorSettings(): UseEditorSettingsResult {
  const [fontSize, setFontSize] = useState<number>(DEFAULT_EDITOR_SETTINGS.fontSize);
  const [tabSize, setTabSize] = useState<number>(DEFAULT_EDITOR_SETTINGS.tabSize);
  const [enableAutocomplete, setEnableAutocomplete] = useState<boolean>(
    DEFAULT_EDITOR_SETTINGS.enableAutocomplete
  );

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

  // Build Monaco editor options
  const editorOptions = buildEditorOptions({
    fontSize,
    tabSize,
    enableAutocomplete
  });

  return {
    fontSize,
    tabSize,
    enableAutocomplete,
    increaseFontSize,
    decreaseFontSize,
    setTabSize,
    setEnableAutocomplete,
    editorOptions
  };
}
