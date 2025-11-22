/**
 * Editor Settings Component
 *
 * Modal overlay for configuring editor settings.
 */

"use client";

import { TAB_SIZES } from '../../config/editorConfig';
import { useTheme } from '../../contexts/ThemeContext';

interface EditorSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    fontSize: number;
    onIncreaseFontSize: () => void;
    onDecreaseFontSize: () => void;
    tabSize: number;
    onTabSizeChange: (size: number) => void;
    enableAutocomplete: boolean;
    onAutocompleteToggle: (enabled: boolean) => void;
}

export function EditorSettings({
    isOpen,
    onClose,
    fontSize,
    onIncreaseFontSize,
    onDecreaseFontSize,
    tabSize,
    onTabSizeChange,
    enableAutocomplete,
    onAutocompleteToggle
}: EditorSettingsProps) {
    const { theme, toggleTheme } = useTheme();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-elevated rounded-lg shadow-xl w-96 border-2 border-accent">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h3 className="text-text font-medium">Editor Settings</h3>
                    <button
                        onClick={onClose}
                        className="text-text-muted hover:text-text"
                    >
                        ✕
                    </button>
                </div>

                {/* Settings Content */}
                <div className="p-6 space-y-6">
                    {/* Theme Toggle */}
                    <div className="space-y-2">
                        <label className="block text-text-muted text-sm">Theme</label>
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={toggleTheme}
                        >
                            <div className={`w-10 h-5 rounded-full flex items-center transition-colors duration-200 ease-in-out ${theme === 'dark' ? 'bg-surface opacity-90' : 'bg-accent'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-1' : 'translate-x-5'}`}></div>
                            </div>
                            <span className="ml-2 text-text-muted text-sm">
                                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                            </span>
                        </div>
                    </div>

                    {/* Font Size Control */}
                    <div className="space-y-2">
                        <label className="block text-text-muted text-sm">Font Size</label>
                        <div className="flex items-center">
                            <button
                                onClick={onDecreaseFontSize}
                                className="bg-surface opacity-80 hover:bg-surface hover:opacity-90 text-text w-8 h-8 flex items-center justify-center rounded-l"
                            >
                                −
                            </button>
                            <div className="bg-surface text-text px-4 py-1 w-16 text-center">
                                {fontSize}px
                            </div>
                            <button
                                onClick={onIncreaseFontSize}
                                className="bg-surface opacity-80 hover:bg-surface hover:opacity-90 text-text w-8 h-8 flex items-center justify-center rounded-r"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Tab Size */}
                    <div className="space-y-2">
                        <label className="block text-text-muted text-sm">Tab Size</label>
                        <div className="bg-surface opacity-80 rounded overflow-hidden">
                            <select
                                className="bg-surface opacity-80 text-text w-full p-2 outline-none"
                                value={tabSize}
                                onChange={(e) => onTabSizeChange(Number(e.target.value))}
                            >
                                {TAB_SIZES.map(size => (
                                    <option key={size} value={size}>
                                        {size} spaces
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Autocomplete Toggle */}
                    <div className="space-y-2">
                        <label className="block text-text-muted text-sm">Autocomplete</label>
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => onAutocompleteToggle(!enableAutocomplete)}
                        >
                            <div className={`w-10 h-5 rounded-full flex items-center transition-colors duration-200 ease-in-out ${enableAutocomplete ? 'bg-accent' : 'bg-surface opacity-90'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ease-in-out ${enableAutocomplete ? 'translate-x-5' : 'translate-x-1'}`}></div>
                            </div>
                            <span className="ml-2 text-text-muted text-sm">
                                {enableAutocomplete ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-border p-4 flex justify-end space-x-3">
                    <button
                        className="px-4 py-2 rounded text-text-muted hover:bg-surface hover:opacity-90"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-success hover:bg-surface hover:opacity-90 text-text-inverse rounded"
                        onClick={onClose}
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
