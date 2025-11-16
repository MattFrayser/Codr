/**
 * Terminal Output Component
 *
 * Displays code execution output and provides the Run button.
 */

"use client";

interface TerminalOutputProps {
  output: string[];
  isExecuting: boolean;
  onRun: (e: React.FormEvent) => void;
}

export function TerminalOutput({
  output,
  isExecuting,
  onRun
}: TerminalOutputProps) {
  return (
    <div className="h-56 bg-[#1e1e1e] border-t-10 border-[#0f0f0f]">
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
          <span className="flex-grow px-4 py-1 text-sm text-gray-500"> Output </span>
        </form>
      </div>

      {/* Console Output */}
      <div className="h-full overflow-auto p-4 text-sm">
        {output.length === 0 ? (
          <div className="text-gray-500">Run your code to see output here</div>
        ) : (
          output.map((line, i) => (
            <pre key={i} className="text-gray-300 whitespace-pre-wrap font-mono text-sm mb-1">
              {line}
            </pre>
          ))
        )}
      </div>
    </div>
  );
}
