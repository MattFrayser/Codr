export type EditorTheme = 'vs-dark' | 'vs-light';
 
export interface EditorSettings {
  theme: EditorTheme;
  fontSize: number;
  tabSize: number;
  enableAutocomplete: boolean;
}
 
export interface Language {
  value: string;
  label: string;
  extension: string;
  defaultCode: string;
}
 
export interface MonacoEditorOptions {
  fontSize: number;
  tabSize: number;
  minimap: { enabled: boolean };
  automaticLayout: boolean;
  scrollBeyondLastLine: boolean;
  quickSuggestions: boolean;
}
