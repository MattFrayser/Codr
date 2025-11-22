export interface OutputLine {
  type: 'stdout' | 'stderr' | 'system' | 'input';
  content: string;
  timestamp?: number;
}

export type TerminalState =
  | 'idle'           // Ready to run code
  | 'running'        // Code executing, no input expected
  | 'awaiting_input' // Program waiting for stdin
  | 'completed'      // Execution finished
  | 'error';         // Execution failed

export interface PromptConfig {
  symbol: string;
  placeholder: string;
  color: string;
  inputEnabled: boolean;
  showCursor: boolean;
}

export const PROMPT_CONFIGS: Record<TerminalState, PromptConfig> = {
  idle: {
    symbol: '$',
    placeholder: 'Ready to run (press Run button)',
    color: 'text-gray-400',
    inputEnabled: false,
    showCursor: false
  },
  running: {
    symbol: '⟳',
    placeholder: 'Running...',
    color: 'text-yellow-400',
    inputEnabled: false,
    showCursor: false
  },
  awaiting_input: {
    symbol: '>',
    placeholder: 'Type input and press Enter...',
    color: 'text-green-400',
    inputEnabled: true,
    showCursor: true
  },
  completed: {
    symbol: '✓',
    placeholder: 'Execution completed',
    color: 'text-blue-400',
    inputEnabled: false,
    showCursor: false
  },
  error: {
    symbol: '✗',
    placeholder: 'Execution failed',
    color: 'text-red-400',
    inputEnabled: false,
    showCursor: false
  }
};
