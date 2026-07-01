"use client";

import { useState } from "react";
import { BookOpen, PlusCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

// تعريف شكل بيانات الكورس اللي جاية من الـ API
interface Course {
  id: number;
  title: string;
  description: string;
  school_year: string;
  language: string;
}

interface Props {
  availableCourses: Course[];
  onEnrollSuccess: () => void;
}

export default function ContinueLearning({ availableCourses, onEnrollSuccess }: Props) {
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const router = useRouter();

  const handleEnroll = async (courseId: number) => {
    setEnrollingId(courseId);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:8000/api/courses/${courseId}/enroll`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        // لو الاشتراك نجح، نحدث الداشبورد
        onEnrollSuccess();
      } else {
        const err = await res.json();
        alert(err.detail || "حدث خطأ أثناء الاشتراك");
      }
    } catch (error) {
      console.error("Enrollment failed", error);
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="group rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg transition-all duration-300 hover:border-blue-500/40 flex flex-col h-[400px]">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-blue-500">
            <Sparkles size={16} /> Discover
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">Available Courses</h2>
        </div>
        <span className="rounded-full bg-blue-600/15 px-4 py-2 text-xs font-medium text-blue-400">
          {availableCourses.length} Courses
        </span>
      </div>

      {/* Courses List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {availableCourses.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-center text-zinc-400">
            <CheckCircle2 className="mb-3 text-green-500" size={40} />
            <p className="font-medium text-white">You're all caught up!</p>
            <p className="mt-1 text-sm">You are enrolled in all available courses for your grade.</p>
          </div>
        ) : (
          availableCourses.map((course) => (
            <div 
              key={course.id} 
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 flex items-center justify-between transition duration-300 hover:border-zinc-600"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-600/15 p-3 hidden sm:block">
                  <BookOpen className="text-blue-500" size={24} />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">{course.title}</p>
                  <p className="text-sm text-zinc-400 line-clamp-1">
                    {course.description || "Start learning this subject today!"}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => handleEnroll(course.id)}
                disabled={enrollingId === course.id}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {enrollingId === course.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <PlusCircle size={16} />
                )}
                Enroll
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}