"use client";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // ضروري عشان الستايل بتاع المعادلات

import { useState, useEffect } from "react";
import { Bot, User, Sparkles } from "lucide-react";
import ChatInput from "./ChatInput";
import { BoardState } from "./LessonPanel";

interface Message {
  role: "user" | "ai";
  content: string;
}

interface ChatPanelProps {
  setBoardState: (state: BoardState) => void;
  widgetMessage?: string | null;
  setWidgetMessage?: (msg: string | null) => void;
}

export default function ChatPanel({ setBoardState, widgetMessage, setWidgetMessage }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "أهلاً بيك! أنا المدرس الذكي بتاعك، تحب تسأل في إيه النهارده؟ 👋" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (overrideMessage?: string) => {
    const userMessage = typeof overrideMessage === 'string' ? overrideMessage : inputValue;
    
    if (!userMessage.trim()) return;

    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      setMessages((prev) => [...prev, { role: "ai", content: "" }]);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const lessonId = 1; 
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/api/courses/lessons/${lessonId}/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content: userMessage }),
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const text = line.replace("data: ", "").trim();

            if (text === "[DONE]") {
              setIsLoading(false);
              continue;
            }

            try {
              const parsedData = JSON.parse(text);

              if (parsedData.event === "message" && parsedData.data) {
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastIndex = newMessages.length - 1;
                  newMessages[lastIndex] = {
                    ...newMessages[lastIndex],
                    content: newMessages[lastIndex].content + parsedData.data,
                  };
                  return newMessages;
                });
              } 
              else if (parsedData.event === "board_update" && parsedData.data) {
                setBoardState(parsedData.data);
              }
            } catch (e) {
              console.error("Error parsing JSON chunk", e, text);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error calling AI:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "عذراً، حدث خطأ في الاتصال بالسيرفر. ❌" }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (widgetMessage) {
      handleSendMessage(widgetMessage);
      if (setWidgetMessage) setWidgetMessage(null); 
    }
  }, [widgetMessage]);

  return (
    // التعديل هنا: ضفنا max-h-[800px] و overflow-hidden عشان نقفل حجم الشات
    <div className="flex flex-1 flex-col rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg h-[800px] max-h-[800px] overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-blue-600/15 p-3">
            <Bot className="text-blue-500" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">DARES-AI Tutor</h2>
            <p className="text-sm text-zinc-400">Your personalized AI learning assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-green-600/15 px-3 py-1 text-sm text-green-400">
          <Sparkles size={16} />
          Online
        </div>
      </div>

      {/* التعديل هنا: ضفنا flex-1 و overflow-y-auto عشان السكرول يشتغل هنا بس */}
      <div className="mt-8 flex-1 space-y-8 overflow-y-auto pr-2 scroll-smooth">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-2xl items-${msg.role === "user" ? "end" : "start"} gap-3`}>
              {msg.role === "ai" && (
                <div className="rounded-full bg-blue-600/15 p-3 shrink-0">
                  <Bot className="text-blue-500" size={20} />
                </div>
              )}
              <div
                className={
                  msg.role === "user"
                    ? "rounded-2xl bg-blue-600 px-5 py-4 text-white shadow-lg"
                    : "rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-zinc-300 leading-8"
                }
              >
                <div className="overflow-x-auto text-sm md:text-base leading-8">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
              {msg.role === "user" && (
                <div className="rounded-full bg-zinc-800 p-3 shrink-0">
                  <User size={18} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="shrink-0 mt-6">
        <ChatInput input={inputValue} setInput={setInputValue} onSend={() => handleSendMessage()} isLoading={isLoading} />
      </div>
    </div>
  );
}