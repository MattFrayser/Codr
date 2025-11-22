"use client";

import { useState, useEffect } from "react";
import { CodeEditor } from "./editor/CodeEditor";
import { Terminal } from "./terminal/Terminal";
import { EditorSettings } from "./editor/EditorSettings";
import { LanguageSidebar } from "./editor/LanguageSidebar";
import { ConfirmationDialog } from "./dialogs/ConfirmationDialog";
import { useWebSocketExecution } from "../hooks/useWebSocketExecution";
import { useEditorSettings } from "../hooks/useEditorSettings";
import { useFileOperations } from "../hooks/useFileOperations";
import { useTheme } from "../contexts/ThemeContext";
import {
    getDefaultCode,
    getFileExtension,
    getLanguageLabel
} from "../config/languageConfig";
import { getWarningPreference, setWarningPreference, StorageKeys } from "../lib/utils/localStorage";

interface IDEProps {
    onRegisterHandlers?: (handlers: {
        onDownload?: () => void;
        onRestart?: () => void;
        onShare?: () => void;
        onSettings?: () => void;
    }) => void;
}

export default function IDE({ onRegisterHandlers }: IDEProps) {
    const [code, setCode] = useState('print("hello world")');
    const [language, setLanguage] = useState<string>("python");
    const [filename, setFilename] = useState("Main");
    const [fileExt, setFileExt] = useState(".py");
    const [showSettings, setShowSettings] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [showLanguageDialog, setShowLanguageDialog] = useState(false);
    const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);

    // Custom hooks - delegate complex logic
    const {
        outputLines,
        isExecuting,
        execute,
        sendInput,
        clearOutput
    } = useWebSocketExecution();
    const {
        fontSize,
        tabSize,
        enableAutocomplete,
        increaseFontSize,
        decreaseFontSize,
        setTabSize,
        setEnableAutocomplete,
        editorOptions
    } = useEditorSettings();
    const { downloadFile, resetCode } = useFileOperations();
    const { theme: appTheme } = useTheme();

    // Helper function to detect if code has changed from default
    const hasCodeChanged = () => {
        const defaultCode = getDefaultCode(language);
        return code.trim() !== defaultCode.trim();
    };

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
        const shouldWarn = hasCodeChanged() && getWarningPreference(StorageKeys.WARNING_RESET);

        if (shouldWarn) {
            setShowResetDialog(true);
        } else {
            performReset();
        }
    };

    const performReset = () => {
        resetCode(
            language,
            setCode,
            setFilename,
            setFileExt,
            () => clearOutput()
        );
        setShowResetDialog(false);
    };

    const handleResetDontShowAgain = (dontShow: boolean) => {
        setWarningPreference(StorageKeys.WARNING_RESET, !dontShow);
    };

    const handleShare = () => {
        // TODO: Implement share functionality
        console.log("Share clicked");
    };

    const handleLanguageChange = (langValue: string) => {
        const shouldWarn = hasCodeChanged() && getWarningPreference(StorageKeys.WARNING_LANGUAGE_CHANGE);

        if (shouldWarn) {
            setPendingLanguage(langValue);
            setShowLanguageDialog(true);
        } else {
            performLanguageChange(langValue);
        }
    };

    const performLanguageChange = (langValue: string) => {
        setLanguage(langValue);
        setCode(getDefaultCode(langValue));
        setFileExt(getFileExtension(langValue));
        setShowLanguageDialog(false);
        setPendingLanguage(null);
    };

    const handleLanguageDontShowAgain = (dontShow: boolean) => {
        setWarningPreference(StorageKeys.WARNING_LANGUAGE_CHANGE, !dontShow);
    };

    // Register handlers with parent component
    useEffect(() => {
        if (onRegisterHandlers) {
            onRegisterHandlers({
                onDownload: handleDownload,
                onRestart: handleRestart,
                onShare: handleShare,
                onSettings: () => setShowSettings(!showSettings)
            });
        }
    }, [onRegisterHandlers, showSettings]);

    return (
        <div className="w-full h-full max-w-8xl mx-auto overflow-hidden shadow-xl">
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

            {/* Reset Code Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showResetDialog}
                onClose={() => setShowResetDialog(false)}
                onConfirm={performReset}
                title="Reset to Default Code?"
                message="Your current code will be replaced with the default template. This cannot be undone."
                confirmText="Reset Code"
                cancelText="Cancel"
                variant="danger"
                showDontShowAgain={true}
                onDontShowAgainChange={handleResetDontShowAgain}
            />

            {/* Language Change Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showLanguageDialog}
                onClose={() => {
                    setShowLanguageDialog(false);
                    setPendingLanguage(null);
                }}
                onConfirm={() => pendingLanguage && performLanguageChange(pendingLanguage)}
                title={`Switch to ${getLanguageLabel(pendingLanguage || '')}?`}
                message={`Your current code will be replaced with a ${getLanguageLabel(pendingLanguage || '')} template. This cannot be undone.`}
                confirmText="Switch Language"
                cancelText="Cancel"
                variant="warning"
                showDontShowAgain={true}
                onDontShowAgainChange={handleLanguageDontShowAgain}
            />

            {/* Main Layout: Language Sidebar + Editor Section */}
            <div className="flex h-full">
                {/* Language Sidebar */}
                <LanguageSidebar
                    currentLanguage={language}
                    onLanguageChange={handleLanguageChange}
                />

                {/* Editor Section */}
                <div className="flex-grow flex flex-col min-h-0 h-full">
                    {/* Editor Bar - Filename */}
                    <div className="flex flex-shrink-0">
                        {/* File Name */}
                        <div className="bg-elevated py-2 px-4 flex items-center">
                            <input
                                type="text"
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                className="bg-transparent text-text outline-none w-32"
                            />
                            <span className="text-text-muted">{fileExt}</span>
                        </div>
                    </div>

                    {/* Content area with fixed ratio */}
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Editor - 2/3 of available space */}
                        <div className="h-2/3 overflow-hidden flex-shrink-0">
                            <CodeEditor
                                code={code}
                                language={language}
                                theme={appTheme === 'dark' ? 'vs-dark' : 'light'}
                                onChange={handleChange}
                                editorOptions={editorOptions}
                            />
                        </div>

                        {/* Output Console - 1/3 of available space */}
                        <div className="h-1/3 overflow-hidden flex-shrink-0">
                            <Terminal
                                outputLines={outputLines}
                                isExecuting={isExecuting}
                                onRun={handleSubmit}
                                onSendInput={sendInput}
                                onClear={clearOutput}
                                fontSize={fontSize}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
