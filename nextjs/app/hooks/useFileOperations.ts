/**
 * File Operations Hook
 *
 * Handles file download and code reset operations.
 */

import { getDefaultCode, getFileExtension } from '../config/languageConfig';

export interface UseFileOperationsResult {
  downloadFile: (code: string, filename: string) => void;
  resetCode: (
    language: string,
    onCodeChange: (code: string) => void,
    onFilenameChange: (filename: string) => void,
    onFileExtChange: (ext: string) => void,
    onOutput: (message: string) => void
  ) => void;
}

export function useFileOperations(): UseFileOperationsResult {
  /**
   * Download the current code as a file
   */
  const downloadFile = (code: string, filename: string): void => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Reset code to default template for the current language
   */
  const resetCode = (
    language: string,
    onCodeChange: (code: string) => void,
    onFilenameChange: (filename: string) => void,
    onFileExtChange: (ext: string) => void,
    onOutput: (message: string) => void
  ): void => {
    const defaultLanguageCode = getDefaultCode(language);
    const fileExtension = getFileExtension(language);

    onCodeChange(defaultLanguageCode);
    onFilenameChange("main");
    onFileExtChange(fileExtension);
    onOutput("Code reset to default");
  };

  return {
    downloadFile,
    resetCode
  };
}
