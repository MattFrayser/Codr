/**
 * Language Configuration
 *
 * Central configuration for all supported programming languages.
 * Includes language metadata, file extensions, and default code templates.
 */

export interface LanguageOption {
  value: string;
  label: string;
}

// Supported languages based on the backend
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "rust", label: "Rust" }
];

// File extensions for each language
export const FILE_EXTENSIONS: Record<string, string> = {
  python: ".py",
  javascript: ".js",
  cpp: ".cpp",
  c: ".c",
  rust: ".rs"
};

// Default "Hello World" code templates for each language
export const DEFAULT_CODE: Record<string, string> = {
  python: '# Write your Python code here\nprint("Hello, World!")',
  javascript: '// Write your JavaScript code here\nconsole.log("Hello, World!");',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  rust: 'fn main() {\n    println!("Hello, World!");\n}'
};

/**
 * Get file extension for a given language
 */
export function getFileExtension(language: string): string {
  return FILE_EXTENSIONS[language] || ".txt";
}

/**
 * Get default code template for a given language
 */
export function getDefaultCode(language: string): string {
  return DEFAULT_CODE[language] || 'print("Hello, World!")';
}

/**
 * Check if a language is supported
 */
export function isLanguageSupported(language: string): boolean {
  return language in FILE_EXTENSIONS;
}

/**
 * Get language label for display
 */
export function getLanguageLabel(languageValue: string): string {
  const lang = SUPPORTED_LANGUAGES.find(l => l.value === languageValue);
  return lang?.label || languageValue;
}
