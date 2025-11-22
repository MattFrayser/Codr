/**
 * LocalStorage Utility
 *
 * Helper functions for managing user preferences in localStorage
 */

const STORAGE_PREFIX = 'codr-';

export const StorageKeys = {
    WARNING_RESET: `${STORAGE_PREFIX}warning-reset`,
    WARNING_LANGUAGE_CHANGE: `${STORAGE_PREFIX}warning-language-change`,
} as const;

/**
 * Get warning preference from localStorage
 * @param key Storage key
 * @returns true if warning should be shown, false if disabled
 */
export function getWarningPreference(key: string): boolean {
    if (typeof window === 'undefined') return true;
    try {
        const value = localStorage.getItem(key);
        return value !== 'disabled';
    } catch {
        return true; // Default to showing warnings if localStorage fails
    }
}

/**
 * Set warning preference in localStorage
 * @param key Storage key
 * @param enabled true to show warnings, false to disable
 */
export function setWarningPreference(key: string, enabled: boolean): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, enabled ? 'enabled' : 'disabled');
    } catch {
        // Fail silently if localStorage is unavailable
        console.warn('Failed to save warning preference');
    }
}
