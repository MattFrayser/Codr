/**
 * Editor Toolbar Component
 *
 * Action buttons for file operations, theme toggle, and settings.
 */

"use client";

import { VscDebugRestart, VscShare, VscSettingsGear } from "react-icons/vsc";
import { MdOutlineFileDownload } from "react-icons/md";

interface EditorToolbarProps {
  onDownload: () => void;
  onRestart: () => void;
  onShare?: () => void;
  onToggleTheme: () => void;
  onToggleSettings: () => void;
}

export function EditorToolbar({
  onDownload,
  onRestart,
  onShare,
  onToggleTheme,
  onToggleSettings
}: EditorToolbarProps) {
  return (
    <div className="flex justify-between py-6">
      {/* Left side - File operations */}
      <div className="flex">
        <div className="flex bg-[#3d3d3d] rounded p-2">
          <button
            className="p-2 hover:bg-gray-600 rounded"
            onClick={onDownload}
            title="Download code"
          >
            <MdOutlineFileDownload />
          </button>
          <button
            className="p-2 hover:bg-gray-600 rounded"
            onClick={onRestart}
            title="Reset code"
          >
            <VscDebugRestart />
          </button>
          <button
            className="p-2 hover:bg-gray-600 rounded"
            onClick={onShare}
            title="Share code"
          >
            <VscShare />
          </button>
        </div>
      </div>

      {/* Right side - Theme and settings */}
      <div className="flex items-center">
        <div className="bg-[#3d3d3d] rounded">
          <button
            className="p-2 hover:bg-gray-600 rounded mr-1"
            onClick={onToggleTheme}
          >
            Theme
          </button>
          <button
            className="p-2 hover:bg-gray-600 rounded mr-1"
            onClick={onToggleSettings}
          >
            <VscSettingsGear />
          </button>
        </div>
      </div>
    </div>
  );
}
