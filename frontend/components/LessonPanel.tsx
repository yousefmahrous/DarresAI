"use client";

import { useState } from "react";
import { BookOpen, SlidersHorizontal, Send } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

export interface BoardState {
  type: "formula" | "image" | "widget" | "code" | null; // ضفنا code هنا
  payload: any;
}

interface LessonPanelProps {
  boardState: BoardState | null;
  // الـ Prop الشرعي لربط السبورة بالشات
  setWidgetMessage?: (msg: string) => void;
}

export default function LessonPanel({ boardState, setWidgetMessage }: LessonPanelProps) {
  const [sliderValue, setSliderValue] = useState<number>(0);

  const handleWidgetLoad = (min: number, max: number) => {
    if (sliderValue < min || sliderValue > max) {
      setSliderValue(Math.floor((min + max) / 2));
    }
  };

  return (
    <div className="flex h-[800px] flex-col rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-lg">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-6">
        <div className="rounded-xl bg-blue-600/15 p-3">
          <BookOpen className="text-blue-500" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Interactive Board</h2>
          <p className="text-sm text-zinc-400">DARES-AI Workspace</p>
        </div>
      </div>

      <div className="mt-8 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-8 relative overflow-hidden">
        
        {!boardState && (
          <p className="text-center text-zinc-500">
            اطلب من المدرس الذكي كتابة معادلة أو عرض صورة أو معمل لتظهر هنا...
          </p>
        )}

        {boardState?.type === "formula" && (
          <div className="max-w-full overflow-x-auto pb-4 text-2xl sm:text-3xl md:text-4xl text-blue-400 custom-scrollbar">
            <BlockMath math={boardState.payload} />
          </div>
        )}

                {/* رسم الأكواد البرمجية */}
        {boardState?.type === "code" && (
          <div className="w-full max-w-3xl rounded-xl border border-zinc-700 bg-[#1e1e1e] overflow-hidden shadow-2xl text-left" dir="ltr">
            <div className="flex items-center justify-between bg-zinc-800 px-4 py-3 border-b border-zinc-700">
              <span className="text-xs font-mono text-zinc-400">Code Snippet</span>
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="p-5 overflow-x-auto custom-scrollbar max-h-[500px]">
              <pre className="text-sm text-green-400 font-mono text-left leading-relaxed">
                <code>{boardState.payload}</code>
              </pre>
            </div>
          </div>
        )}

        {boardState?.type === "image" && (
          <img 
            src={boardState.payload} 
            alt="Board Content" 
            className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
          />
        )}

        {boardState?.type === "widget" && (
          <div className="flex w-full max-w-md flex-col items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800 p-8 shadow-2xl"
               onLoad={() => handleWidgetLoad(boardState.payload.min || 0, boardState.payload.max || 100)}>
            
            <div className="mb-6 flex items-center gap-3">
              <SlidersHorizontal className="text-blue-500" size={24} />
              <h3 className="text-xl font-bold text-white">
                {boardState.payload.label || "Interactive Slider"}
              </h3>
            </div>

            <input
              type="range"
              min={boardState.payload.min || 0}
              max={boardState.payload.max || 100}
              step={boardState.payload.step || 1}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-600 accent-blue-500 transition hover:accent-blue-400"
            />
            
            <div className="mt-8 flex items-baseline gap-2">
              <span className="text-5xl font-black text-blue-400">{sliderValue}</span>
              <span className="text-lg text-zinc-400">Unit</span>
            </div>

            {/* زرار الإرسال */}
            <button
              onClick={() => {
                const msg = `أنا ظبطت قيمة المؤشر (${boardState?.payload?.label || 'الكتلة'}) على ${sliderValue}، إيه تأثير ده على النتيجة؟`;
                if (setWidgetMessage) {
                  setWidgetMessage(msg);
                }
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600/20 py-3 font-semibold text-blue-400 transition-all duration-300 hover:bg-blue-600 hover:text-white"
            >
              <Send size={18} />
              شارك تجربتك مع المدرس
            </button>

            <p className="mt-6 text-center text-sm text-zinc-400">
              حرك المؤشر ولاحظ التغيير، وتناقش مع المدرس في الشات حول النتيجة.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}