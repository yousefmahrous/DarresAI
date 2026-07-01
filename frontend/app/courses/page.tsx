"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import CourseCard from "../../components/CourseCard";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";

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
  
  // States للبحث والفلترة
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false); // State جديدة لزرار الفلاتر

  const categories = ["All", "Physics", "Math", "CS", "Science", "Arabic"];

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("token");
        
        if (!token) {
          setLoading(false);
          return;
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
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (course.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      activeCategory === "All" || 
      course.title.toLowerCase().includes(activeCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-10">
        <div className="mb-10">
          <p className="text-sm font-medium text-blue-500">Learning Hub</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">My Courses</h1>
          <p className="mt-2 text-zinc-400">Continue your personalized AI learning journey.</p>
        </div>

        {/* أدوات البحث والفلترة */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-4 pl-12 pr-4 text-white outline-none transition focus:border-blue-500"
            />
          </div>

          {/* التعديل هنا: ربط الزرار بالـ State وتغيير لونه عند التفعيل */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-2xl border px-6 py-4 font-medium transition duration-300 ${
              showFilters 
                ? "bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-white"
            }`}
          >
            <SlidersHorizontal size={20} />
            Filters
          </button>
        </div>

        {/* التعديل هنا: إظهار وإخفاء زراير التصنيفات بناءً على حالة الزرار */}
        {showFilters && (
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2 custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-300">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* شبكة الكورسات */}
        <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {loading ? (
            <div className="col-span-full flex h-40 items-center justify-center">
              <Loader2 className="animate-spin text-blue-500" size={40} />
              <span className="ml-3 text-zinc-400">Loading your AI courses...</span>
            </div>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => {
              const levelMock = course.school_year.includes("1") ? "Beginner" : "Intermediate";
              
              return (
                <CourseCard
                  key={course.id}
                  courseId={course.id} 
                  title={course.title}
                  lesson={course.description || "Introduction Lesson"} 
                  progress={0} 
                  duration="Not started yet" 
                  level={levelMock}
                />
              );
            })
          ) : (
            <div className="col-span-full rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">
              <p className="text-xl font-bold text-white">No courses found</p>
              <p className="mt-2 text-zinc-400">
                {searchQuery 
                  ? `We couldn't find any courses matching "${searchQuery}"` 
                  : `You don't have any ${activeCategory !== "All" ? activeCategory : ""} courses yet.`}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}