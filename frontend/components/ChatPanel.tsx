"use client"; // مهمة جداً في Next.js عشان نستخدم State

import { useState } from "react";
import { Bot, User, Sparkles } from "lucide-react";
import ChatInput from "./ChatInput"; // تأكد إن مسار الاستدعاء صح

// تعريف شكل الرسالة
interface Message {
  role: "user" | "ai";
  content: string;
}

export default function ChatPanel() {
  // حالة الرسايل (State)
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "أهلاً بيك! أنا المدرس الذكي بتاعك، تحب تسأل في إيه النهارده؟ 👋" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // دالة الإرسال والربط بالباك إند (Streaming)
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue(""); // تفريغ مربع النص
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // 1. إضافة مكان فاضي لرسالة الـ AI اللي هتيجي
      setMessages((prev) => [...prev, { role: "ai", content: "" }]);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const lessonId = 1; // رقم الدرس (هيتغير ديناميكياً بعدين)
      
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/api/courses/lessons/${lessonId}/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      // 2. قراءة الرد حرف بحرف
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const text = line.replace("data: ", "");

            if (text === "[DONE]") {
              setIsLoading(false);
              break;
            }

            // 3. تحديث آخر رسالة (بتاعة الـ AI) بالحرف الجديد
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastIndex = newMessages.length - 1;
              newMessages[lastIndex] = {
                ...newMessages[lastIndex],
                content: newMessages[lastIndex].content + text,
              };
              return newMessages;
            });
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

  return (
    <div className="flex flex-1 flex-col rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg h-[800px]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
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

      {/* Messages Area */}
      <div className="mt-8 flex-1 space-y-8 overflow-y-auto pr-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-2xl items-${msg.role === "user" ? "end" : "start"} gap-3`}>
              
              {/* أيقونة الـ AI */}
              {msg.role === "ai" && (
                <div className="rounded-full bg-blue-600/15 p-3 shrink-0">
                  <Bot className="text-blue-500" size={20} />
                </div>
              )}

              {/* فقاعة النص */}
              <div
                className={
                  msg.role === "user"
                    ? "rounded-2xl bg-blue-600 px-5 py-4 text-white shadow-lg"
                    : "rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-zinc-300 leading-8"
                }
              >
                {/* استخدام whitespace-pre-wrap عشان يحافظ على المسافات والسطور الجديدة من السيرفر */}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>

              {/* أيقونة اليوزر */}
              {msg.role === "user" && (
                <div className="rounded-full bg-zinc-800 p-3 shrink-0">
                  <User size={18} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <ChatInput 
        input={inputValue} 
        setInput={setInputValue} 
        onSend={handleSendMessage} 
        isLoading={isLoading} 
      />

    </div>
  );
}