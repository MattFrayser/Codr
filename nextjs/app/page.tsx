"use client";

import { useState } from "react";
import IDE from "./components/ide"
import Header from "./components/layout/Header"

export default function Home() {
  const [ideHandlers, setIdeHandlers] = useState<{
    onDownload?: () => void;
    onRestart?: () => void;
    onShare?: () => void;
    onSettings?: () => void;
  }>({});

  return (
    <div className="bg-background h-screen flex flex-col">
      <Header
        onDownload={ideHandlers.onDownload}
        onRestart={ideHandlers.onRestart}
        onShare={ideHandlers.onShare}
        onSettings={ideHandlers.onSettings}
      />
      <div className="flex-1 overflow-hidden">
        <IDE onRegisterHandlers={setIdeHandlers} />
      </div>
    </div>
  )
}
