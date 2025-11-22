/**
 * Code Editor Component
 *
 * Pure editor component that wraps Monaco Editor.
 * Handles only the code editing interface.
 */

"use client";

import Editor, { type EditorProps } from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  language: string;
  theme: string;
  onChange: (value: string | undefined) => void;
  editorOptions: EditorProps['options']; 
}

export function CodeEditor({
  code,
  language,
  theme,
  onChange,
  editorOptions
}: CodeEditorProps) {
  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage="python"
        language={language.toLowerCase()}
        theme={theme}
        value={code}
        onChange={onChange}
        options={editorOptions}
      />
    </div>
  );
}
