"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import CourseCard from "../../components/CourseCard";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";

// واجهة مؤقتة لشكل الداتا اللي جاية من الـ API
interface Course {
  id: number;
  title: string;
  description: string | null;
  school_year: string;
  language: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem("access_token"); // تأكد إن الاسم ده هو اللي بتسيف بيه
        
        // سطر للـ Debugging عشان نشوف الـ Token في الـ Console بتاع المتصفح
        console.log("Current Token in LocalStorage:", token);

        if (!token) {
          console.error("No token found! Please login first.");
          setLoading(false);
          return; // نوقف الـ Request لو مفيش Token عشان منضربش 401
        }

        const res = await fetch("http://localhost:8000/api/courses/", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        } else {
          // لو رجع 401 نطبع تفاصيل أكتر
          console.error(`Failed to fetch courses. Status: ${res.status}`);
          if (res.status === 401) {
            console.error("Token might be invalid or expired.");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-10">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-blue-500">
              Learning Hub
            </p>
            <h1 className="mt-2 text-5xl font-extrabold tracking-tight">
              My Courses
            </h1>
            <p className="mt-3 text-zinc-400">
              Continue your personalized AI learning journey.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3">
            <span className="text-zinc-400">{courses.length} Active Courses</span>
          </div>
        </div>

        {/* Search */}
        <div className="mt-10 flex gap-4">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-5">
            <Search className="text-zinc-500" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full bg-transparent py-4 outline-none placeholder:text-zinc-500"
            />
          </div>
          <button className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 hover:border-blue-500/40 transition">
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        {/* Categories */}
        <div className="mt-8 flex gap-3">
          <button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium">All</button>
          <button className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-zinc-400 hover:bg-zinc-800">Physics</button>
          <button className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-zinc-400 hover:bg-zinc-800">AI</button>
        </div>

        {/* Courses Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {loading ? (
            <div className="flex items-center justify-center col-span-full h-40">
              <Loader2 className="animate-spin text-blue-500" size={40} />
              <span className="ml-3 text-zinc-400">Loading your AI courses...</span>
            </div>
          ) : courses.length > 0 ? (
            courses.map((course) => {
              const levelMock = course.school_year.includes("1") ? "Beginner" : "Intermediate";
              
              return (
                <CourseCard
                  key={course.id}
                  courseId={course.id} // تمرير الـ ID للكومبوننت
                  title={course.title}
                  lesson={course.description || "Introduction Lesson"} 
                  progress={0} // تصفير الـ Progress كبداية لأي طالب جديد
                  duration="Not started yet" 
                  level={levelMock}
                />
              );
            })
          ) : (
            <div className="col-span-full rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">
              <p className="text-xl font-bold text-white">لا توجد كورسات متاحة</p>
              <p className="mt-2 text-zinc-400">يرجى الذهاب إلى لوحة التحكم (Dashboard) للاشتراك في كورسات السنة الدراسية الخاصة بك أولاً.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}