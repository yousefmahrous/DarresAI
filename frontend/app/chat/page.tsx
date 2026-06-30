"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import LessonPanel, { BoardState } from "../../components/LessonPanel";
import ChatPanel from "../../components/ChatPanel";

export default function ChatPage() {
  const [boardState, setBoardState] = useState<BoardState | null>(null);
  
  // State التواصل المثالية بين السبورة والشات
  const [widgetMessage, setWidgetMessage] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold">AI Tutor</h1>
        <p className="mt-2 text-zinc-400">Learn with your personal AI tutor.</p>

        <div className="mt-8 grid grid-cols-2 gap-6">
          {/* بنمرر دالة الإرسال للسبورة */}
          <LessonPanel 
            boardState={boardState} 
            setWidgetMessage={setWidgetMessage} 
          />

          <div className="flex flex-col">
            {/* بنمرر الرسالة ودالة التفريغ للشات */}
            <ChatPanel 
              setBoardState={setBoardState} 
              widgetMessage={widgetMessage}
              setWidgetMessage={setWidgetMessage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}