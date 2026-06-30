"use client";

import { Send, Paperclip, Mic } from "lucide-react";

// ضفنا الـ Props عشان الملف ده يكلم الـ ChatPanel
interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export default function ChatInput({ input = "", setInput, onSend, isLoading }: ChatInputProps) {
  return (
    <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
      <div className="flex items-center gap-3">
        <button className="rounded-xl p-3 text-zinc-400 transition hover:bg-zinc-800 hover:text-white">
          <Paperclip size={20} />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLoading) onSend();
          }}
          placeholder="Ask DARES-AI anything about this lesson..."
          disabled={isLoading}
          className="flex-1 bg-transparent px-2 py-3 text-white outline-none placeholder:text-zinc-500 disabled:opacity-50"
        />

        <button className="rounded-xl p-3 text-zinc-400 transition hover:bg-zinc-800 hover:text-white">
          <Mic size={20} />
        </button>

        <button
          onClick={onSend}
          disabled={isLoading || !input?.trim()}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}