"use client";

import { useState } from "react";
import { CodeEditor } from "./CodeEditor";
import { InteractiveTerminalOutput } from "./InteractiveTerminalOutput";
import { EditorSettings } from "./EditorSettings";
import { EditorToolbar } from "./EditorToolbar";
import { useWebSocketExecution } from "../hooks/useWebSocketExecution";
import { useEditorSettings } from "../hooks/useEditorSettings";
import { useFileOperations } from "../hooks/useFileOperations";
import {
  SUPPORTED_LANGUAGES,
  getDefaultCode,
  getFileExtension
} from "../config/languageConfig";

export default function IDE() {
  const [code, setCode] = useState('print("hello world")');
  const [language, setLanguage] = useState<string>("python");
  const [filename, setFilename] = useState("Main");
  const [fileExt, setFileExt] = useState(".py");
  const [showSettings, setShowSettings] = useState(false);

  // Custom hooks - delegate complex logic
  const {
    outputLines,
    isExecuting,
    execute,
    sendInput,
    clearOutput
  } = useWebSocketExecution();
  const {
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
  } = useEditorSettings();
  const { downloadFile, resetCode } = useFileOperations();

  // Event handlers
  const handleChange = (value: string = "") => {
    setCode(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await execute(code, language);
  };

  const handleDownload = () => {
    const fullFilename = `${filename}${fileExt}`;
    downloadFile(code, fullFilename);
  };

  const handleRestart = () => {
    resetCode(
      language,
      setCode,
      setFilename,
      setFileExt,
      () => clearOutput()
    );
  };

  const handleLanguageChange = (langValue: string) => {
    setLanguage(langValue);
    setCode(getDefaultCode(langValue));
    setFileExt(getFileExtension(langValue));
  };
      
  return (
    <div className="w-full max-w-6xl mx-auto my-4 rounded-lg overflow-hidden shadow-xl">
      {/* Toolbar */}
      <EditorToolbar
        onDownload={handleDownload}
        onRestart={handleRestart}
        onToggleTheme={toggleTheme}
        onToggleSettings={() => setShowSettings(!showSettings)}
      />

      {/* Settings Modal */}
      <EditorSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        fontSize={fontSize}
        onIncreaseFontSize={increaseFontSize}
        onDecreaseFontSize={decreaseFontSize}
        tabSize={tabSize}
        onTabSizeChange={setTabSize}
        enableAutocomplete={enableAutocomplete}
        onAutocompleteToggle={setEnableAutocomplete}
      />

      {/* Editor Bar - Filename and Language Selector */}
      <div className="flex justify-between bg-[#1d1d1d]">
        {/* File Name */}
        <div className="bg-[#0f0f0f] py-2 px-4 rounded-t-lg flex items-center">
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="bg-transparent text-white outline-none w-32"
          />
          <span className="text-gray-400">{fileExt}</span>
        </div>

        {/* Language Selector */}
        <div className="flex items-center py-2 bg-[#1d1d1d]">
          <div className="bg-[#3d3d3d] hover:bg-gray-600 rounded px-5 mx-4">
            <select
              className="text-gray-200 outline-none bg-transparent"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Editor */}
      <CodeEditor
        code={code}
        language={language}
        theme={theme}
        onChange={handleChange}
        editorOptions={editorOptions}
      />

      {/* Output Console */}
      <InteractiveTerminalOutput
        outputLines={outputLines}
        isExecuting={isExecuting}
        onRun={handleSubmit}
        onSendInput={sendInput}
      />
    </div>
  );
}
