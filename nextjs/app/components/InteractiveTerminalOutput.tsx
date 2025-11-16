/**
 * Interactive Terminal Output Component
 *
 * Displays code execution output with real-time streaming and interactive input support
 */

"use client";

import { useState, useRef, useEffect } from 'react';
import { OutputLine } from '../hooks/useWebSocketExecution';

interface InteractiveTerminalOutputProps {
  outputLines: OutputLine[];
  isExecuting: boolean;
  onRun: (e: React.FormEvent) => void;
  onSendInput: (input: string) => void;
}

export function InteractiveTerminalOutput({
  outputLines,
  isExecuting,
  onRun,
  onSendInput
}: InteractiveTerminalOutputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output arrives
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputLines]);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendInput(inputValue);
      setInputValue('');
    }
  };

  const getLineColor = (type: OutputLine['type']): string => {
    switch (type) {
      case 'stdout':
        return 'text-gray-300';
      case 'stderr':
        return 'text-red-400';
      case 'system':
        return 'text-blue-400';
      case 'input':
        return 'text-green-400';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="h-56 bg-[#1e1e1e] border-t-10 border-[#0f0f0f] flex flex-col">
      {/* Console Tools */}
      <div className="flex items-center border-b-10 border-[#0f0f0f] bg-[#0f0f0f]">
        <form onSubmit={onRun} className="flex w-full">
          <button
            type="submit"
            className="flex items-center px-4 mx-4 py-1 text-sm bg-green-700 hover:bg-green-800 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isExecuting}
          >
            {isExecuting ? 'Running...' : 'Run'}
          </button>
          <span className="flex-grow px-4 py-1 text-sm text-gray-500">
            Output
          </span>
        </form>
      </div>

      {/* Console Output */}
      <div className="flex-1 overflow-auto p-4 text-sm">
        {outputLines.length === 0 ? (
          <div className="text-gray-500">Run your code to see output here</div>
        ) : (
          <div>
            {outputLines.map((line, i) => (
              <div key={i} className="mb-1">
                {line.type === 'input' ? (
                  <div className="flex">
                    <span className="text-gray-500 mr-2">&gt;</span>
                    <pre className={`${getLineColor(line.type)} whitespace-pre-wrap font-mono text-sm`}>
                      {line.content}
                    </pre>
                  </div>
                ) : (
                  <pre className={`${getLineColor(line.type)} whitespace-pre-wrap font-mono text-sm`}>
                    {line.content}
                  </pre>
                )}
              </div>
            ))}
            <div ref={outputEndRef} />
          </div>
        )}

        {/* Always-On Input Field - Industry Standard */}
        {isExecuting && (
          <form onSubmit={handleInputSubmit} className="mt-2 flex items-center">
            <span className="text-gray-500 mr-2">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-[#2a2a2a] text-green-400 font-mono text-sm px-2 py-1 border border-gray-700 focus:outline-none focus:border-green-500"
              placeholder="Type input and press Enter..."
            />
            <button
              type="submit"
              className="ml-2 px-3 py-1 text-xs bg-green-700 hover:bg-green-800 text-white font-medium"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
