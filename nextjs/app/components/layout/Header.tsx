"use client";

import { VscDebugRestart, VscShare, VscSettingsGear } from "react-icons/vsc";
import { MdOutlineFileDownload } from "react-icons/md";

interface HeaderProps {
    onDownload?: () => void;
    onRestart?: () => void;
    onShare?: () => void;
    onSettings?: () => void;
}

export default function Header({ onDownload, onRestart, onShare, onSettings }: HeaderProps) {
    return(
        <div className="flex items-center justify-between bg-toolbar py-1 border-b border-border px-4">
            <div className="flex items-center font-[family-name:var(--font-stalinist-one)]">
                <span className="text-accent font-bold text-xl mr-1">{"<"}</span>
                <span className="text-text font-bold text-xl mr-1">Codr</span>
                <span className="text-accent font-bold text-xl mr-1">{"/>"}</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-1">
                {onDownload && (
                    <button
                        className="p-3 hover:bg-elevated active:bg-interactive-active rounded text-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-toolbar disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        onClick={onDownload}
                        title="Download code"
                        aria-label="Download code"
                    >
                        <MdOutlineFileDownload size={20} />
                    </button>
                )}
                {onRestart && (
                    <button
                        className="p-3 hover:bg-elevated active:bg-interactive-active rounded text-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-toolbar disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        onClick={onRestart}
                        title="Reset code"
                        aria-label="Reset code"
                    >
                        <VscDebugRestart size={20} />
                    </button>
                )}
                {/* TODO: Add share functions   

                {onShare && (
                    <button
                        className="p-3 hover:bg-elevated active:bg-interactive-active rounded text-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-toolbar disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        onClick={onShare}
                        title="Share code"
                        aria-label="Share code"
                    >
                        <VscShare size={20} />
                    </button>
                )}

                */}
                {onSettings && (
                    <button
                        className="p-3 hover:bg-elevated active:bg-interactive-active rounded text-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-toolbar disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        onClick={onSettings}
                        title="Settings"
                        aria-label="Settings"
                    >
                        <VscSettingsGear size={20} />
                    </button>
                )}
            </div>
        </div>

    );
}
