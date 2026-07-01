import Link from "next/link";
import { BookOpen, Clock3, BarChart3, ArrowRight, Sparkles, GraduationCap } from "lucide-react";

interface CourseCardProps {
  courseId: number; // ضفنا الـ ID هنا
  title: string;
  lesson: string;
  progress: number;
  duration: string;
  level: string;
}

export default function CourseCard({ courseId, title, lesson, progress, duration, level }: CourseCardProps) {
  const levelColor = level === "Beginner" ? "bg-green-600/15 text-green-400" 
    : level === "Intermediate" ? "bg-blue-600/15 text-blue-400" : "bg-purple-600/15 text-purple-400";

  return (
    <div className="group rounded-3xl border border-zinc-800 bg-zinc-900 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-blue-600/15 p-4">
            <GraduationCap className="text-blue-500" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-1 text-zinc-400">{lesson}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm ${levelColor}`}>{level}</span>
      </div>

      {progress >= 60 && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-600/10 px-4 py-3">
          <Sparkles size={18} className="text-blue-400" />
          <span className="text-sm text-blue-300">AI Recommended to Continue</span>
        </div>
      )}

      <div className="mt-6 flex justify-between text-sm text-zinc-400">
        <div className="flex items-center gap-2"><Clock3 size={16} />{duration}</div>
        <div className="flex items-center gap-2"><BarChart3 size={16} />{progress}%</div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-blue-600 transition-all duration-700 group-hover:bg-blue-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex items-center gap-3">
          <BookOpen className="text-blue-500" size={20} />
          <div>
            <p className="font-medium">Current Lesson</p>
            <p className="text-sm text-zinc-400">Continue where you left off</p>
          </div>
        </div>
      </div>

      {/* التعديل هنا: تمرير الـ ID في مسار الشات */}
      <Link href={`/chat?courseId=${courseId}`} className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 font-semibold transition-all duration-300 hover:bg-blue-700">
        Continue Learning <ArrowRight size={18} />
      </Link>
    </div>
  );
}