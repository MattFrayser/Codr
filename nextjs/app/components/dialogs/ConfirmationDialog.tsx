/**
 * Confirmation Dialog Component
 *
 * Reusable modal dialog for confirming destructive actions.
 * Includes accessibility features and "don't show again" option.
 */

"use client";

import { useState, useEffect, useRef } from 'react';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    showDontShowAgain?: boolean;
    onDontShowAgainChange?: (checked: boolean) => void;
    variant?: 'warning' | 'danger';
}

export function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    showDontShowAgain = false,
    onDontShowAgainChange,
    variant = 'warning'
}: ConfirmationDialogProps) {
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    // Focus confirm button when dialog opens
    useEffect(() => {
        if (isOpen && confirmButtonRef.current) {
            confirmButtonRef.current.focus();
        }
    }, [isOpen]);

    // ESC key handler
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (showDontShowAgain && dontShowAgain && onDontShowAgainChange) {
            onDontShowAgainChange(true);
        }
        onConfirm();
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-message"
        >
            <div
                className="bg-elevated rounded-lg shadow-xl w-96 max-w-[90vw] border-2 border-accent"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h3 id="dialog-title" className="text-text font-medium text-lg">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-text-muted hover:text-text p-1 rounded hover:bg-surface transition-colors"
                        aria-label="Close dialog"
                        type="button"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p id="dialog-message" className="text-text-muted">
                        {message}
                    </p>

                    {showDontShowAgain && (
                        <div className="flex items-center pt-2">
                            <input
                                type="checkbox"
                                id="dont-show-again"
                                checked={dontShowAgain}
                                onChange={(e) => setDontShowAgain(e.target.checked)}
                                className="mr-2 w-4 h-4 rounded border-border accent-accent"
                            />
                            <label
                                htmlFor="dont-show-again"
                                className="text-text-muted text-sm cursor-pointer"
                            >
                                Don't show this again
                            </label>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-border p-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded text-text hover:bg-surface hover:opacity-90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        type="button"
                    >
                        {cancelText}
                    </button>
                    <button
                        ref={confirmButtonRef}
                        onClick={handleConfirm}
                        className={`px-4 py-2 rounded text-text-inverse font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                            variant === 'danger'
                                ? 'bg-error hover:opacity-90'
                                : 'bg-accent hover:opacity-90'
                        }`}
                        type="button"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
