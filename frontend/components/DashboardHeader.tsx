"use function"; // ❌ ده غلط، هنكتب "use client"
"use client";

import { Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();

  // حركة برمجية بسيطة لتحديد وقت الترحيب
  const hour = new Date().getHours();
  const greeting = 
    hour < 12 ? "Good Morning" : 
    hour < 18 ? "Good Afternoon" : 
    "Good Evening";

  // لو مفيش اسم، هنكتب Student كبديل مؤقت
  const displayName = user?.name ? user.name.split(" ")[0] : "Student";

  return (
    <div className="mb-10 flex items-start justify-between">
      <div>
        <h1 className="text-5xl font-extrabold tracking-tight">
          {greeting}, {displayName} 👋
        </h1>
        <p className="mt-3 text-lg text-zinc-400">
          Your personalized AI learning workspace.
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          {/* ممكن نخلي عدد الكورسات Dynamic بعدين، هنسيبها دلوقتي عشان الـ Demo */}
          Today • Active Courses
        </p>
      </div>

      <button
        className="
          flex h-12 w-12 items-center justify-center
          rounded-xl
          border border-zinc-800
          bg-zinc-900
          text-zinc-300
          transition
          hover:bg-zinc-800
          hover:text-white
        "
      >
        <Bell size={20} />
      </button>
    </div>
  );
}