/**
 * Interactive Terminal Output Component
 *
 * Displays code execution output with real-time streaming and interactive input support
 */

"use client";

import { useState, useRef, useEffect } from 'react';
import { OutputLine } from '@/types/terminal';
import { VscClearAll, VscLoading } from 'react-icons/vsc';

interface TerminalProps {
    outputLines: OutputLine[];
    isExecuting: boolean;
    onRun: (e: React.FormEvent) => void;
    onSendInput: (input: string) => void;
    onClear?: () => void;
    fontSize?: number;
}

export function Terminal({
    outputLines,
    isExecuting,
    onRun,
    onSendInput,
    onClear,
    fontSize = 14
}: TerminalProps) {
    const [currentInput, setCurrentInput] = useState('');
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const terminalRef = useRef<HTMLDivElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    const outputEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [outputLines, currentInput]);

    // Auto-focus when execution starts
    useEffect(() => {
        if (isExecuting && hiddenInputRef.current) {
            hiddenInputRef.current.focus();
        }
    }, [isExecuting]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+Enter or Cmd+Enter to run code
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isExecuting) {
                e.preventDefault();
                onRun(e as unknown as React.FormEvent);
            }
            // Ctrl+L to clear output
            if ((e.ctrlKey || e.metaKey) && e.key === 'l' && onClear && !isExecuting) {
                e.preventDefault();
                onClear();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isExecuting, onRun, onClear]);

    // Click anywhere to focus
    const handleTerminalClick = () => {
        if (isExecuting && hiddenInputRef.current) {
            hiddenInputRef.current.focus();
        }
    };

    // Submit input
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentInput.trim()) {
            // Add to history
            setCommandHistory(prev => [...prev, currentInput]);
            setHistoryIndex(-1);

            // Send to backend
            onSendInput(currentInput);
            setCurrentInput('');
        }
    };

    // Keyboard shortcuts
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Arrow Up - Previous command
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length === 0) return;

            const newIndex = historyIndex === -1
                ? commandHistory.length - 1
                : Math.max(0, historyIndex - 1);

            setHistoryIndex(newIndex);
            setCurrentInput(commandHistory[newIndex]);
        }

        // Arrow Down - Next command
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex === -1) return;

            const newIndex = historyIndex + 1;

            if (newIndex >= commandHistory.length) {
                setHistoryIndex(-1);
                setCurrentInput('');
            } else {
                setHistoryIndex(newIndex);
                setCurrentInput(commandHistory[newIndex]);
            }
        }
    };

    const getLineColor = (type: OutputLine['type']): string => {
        switch (type) {
            case 'stdout': return 'text-text-muted';
            case 'stderr': return 'text-error';
            case 'system': return 'text-accent';
            case 'input': return 'text-success';
            default: return 'text-text-muted';
        }
    };

    // Helper functions for cursor positioning
    const lastLineEndsWithNewline = (): boolean => {
        if (outputLines.length === 0) return true;
        return outputLines[outputLines.length - 1]?.content.endsWith('\n') || false;
    };

    const shouldShowInlineCursor = (): boolean => {
        return outputLines.length > 0 && !lastLineEndsWithNewline();
    };

    const shouldShowNewLineCursor = (): boolean => {
        return outputLines.length === 0 || lastLineEndsWithNewline();
    };

    return (
        <div className="bg-terminal border-t border-border flex flex-col h-full min-h-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-border bg-toolbar px-4 py-1 flex-shrink-0">
                <form onSubmit={onRun} className="flex items-center gap-2">
                    <button
                        type="submit"
                        className="flex items-center gap-1.5 px-3 py-1 text-sm rounded bg-success hover:bg-success/90 active:bg-success/80 text-text-inverse font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-toolbar disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isExecuting}
                        aria-label={isExecuting ? "Running code" : "Run code (Ctrl+Enter)"}
                        title={isExecuting ? "Running code" : "Run code (Ctrl+Enter)"}
                    >
                        {isExecuting ? (
                            <>
                                <VscLoading className="w-3.5 h-3.5 animate-spin" />
                                Running...
                            </>
                        ) : (
                            'Run'
                        )}
                    </button>
                    {onClear && outputLines.length > 0 && !isExecuting && (
                        <button
                            type="button"
                            className="p-2 rounded text-text hover:bg-elevated active:bg-interactive-active transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-toolbar"
                            onClick={onClear}
                            aria-label="Clear output"
                            title="Clear output (Ctrl+L)"
                        >
                            <VscClearAll size={18} />
                        </button>
                    )}
                </form>
                <span className="text-sm text-text-muted">Output</span>
            </div>

            {/* Terminal Output - ALWAYS clickable when executing */}
            <div
                ref={terminalRef}
                className="flex-1 overflow-y-auto overflow-x-hidden p-4 font-mono cursor-text min-h-0"
                style={{ fontSize: `${fontSize * 0.875}px`, lineHeight: '1.6' }}
                onClick={handleTerminalClick}
            >
                {outputLines.length === 0 && !isExecuting ? (
                    <div className="text-text-muted">
                        See output here
                        <span className="inline-block w-2 animate-pulse ml-1">█</span>
                    </div>
                ) : (
                        <div>
                            {/* Output lines */}
                            {outputLines.map((line, i) => {
                                const isLastLine = i === outputLines.length - 1;
                                const endsWithNewline = line.content.endsWith('\n');

                                return (
                                    <div key={i} className="inline-block w-full">
                                        {line.type === 'input' ? (
                                            <div className="flex">
                                                <span className="text-success mr-2">&gt;</span>
                                                <pre className="text-success whitespace-pre-wrap m-0">
                                                    {line.content}
                                                </pre>
                                            </div>
                                        ) : (
                                                <div>
                                                    <pre className={`${getLineColor(line.type)} whitespace-pre-wrap m-0 inline`}>
                                                        {line.content}
                                                    </pre>
                                                    {/* Inline cursor when last line doesn't end with newline */}
                                                    {isLastLine && !endsWithNewline && (
                                                        <>
                                                            {isExecuting && (
                                                                <>
                                                                    <span className="text-success">{currentInput}</span>
                                                                    <span className="text-success inline-block w-2 animate-pulse ml-0.5">█</span>
                                                                </>
                                                            )}
                                                            {!isExecuting && (
                                                                <span className="text-text-muted inline-block w-2 animate-pulse ml-0.5">█</span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                );
                            })}

                            {/* New line cursor when last output ends with newline or no output */}
                            {shouldShowNewLineCursor() && (
                                <>
                                    {isExecuting && (
                                        <div className="flex items-baseline">
                                            <span className="text-success mr-2">&gt;</span>
                                            <span className="text-success">{currentInput}</span>
                                            <span className="text-success inline-block w-2 animate-pulse">█</span>
                                        </div>
                                    )}
                                    {!isExecuting && outputLines.length > 0 && (
                                        <div className="flex items-baseline">
                                            <span className="text-text-muted inline-block w-2 animate-pulse">█</span>
                                        </div>
                                    )}
                                </>
                            )}

                            <div ref={outputEndRef} />
                        </div>
                    )}
            </div>

            {/* HIDDEN INPUT - captures keyboard */}
            {isExecuting && (
                <form onSubmit={handleSubmit} className="h-0 overflow-hidden">
                    <input
                        ref={hiddenInputRef}
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-0 h-0 opacity-0 absolute"
                        aria-label="Terminal input"
                        autoComplete="off"
                        spellCheck="false"
                    />
                </form>
            )}

            {/* Help hint */}
            {isExecuting && (
                <div className="border-t border-border bg-toolbar px-4 py-1 text-xs text-text-muted flex-shrink-0">
                    Click to type • ↑↓ History • Enter to send
                </div>
            )}
        </div>
    );
}

