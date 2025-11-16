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
  editorOptions: EditorProps['options']; // Monaco editor options
}

export function CodeEditor({
  code,
  language,
  theme,
  onChange,
  editorOptions
}: CodeEditorProps) {
  return (
    <div className="flex-grow">
      <Editor
        height="50vh"
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
