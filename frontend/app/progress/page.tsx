"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { BarChart3, Target, BookOpen, Star, Link as LinkIcon, Loader2, AlertCircle } from "lucide-react";

export default function ParentProgress() {
  const [report, setReport] = useState<{ student_name?: string, total_points?: number, current_streak?: number, completed_lessons_count?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLinked, setIsLinked] = useState(true);
  const [inputCode, setInputCode] = useState("");
  const [linkError, setLinkError] = useState("");
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await fetch("http://localhost:8000/api/parent/student-report", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 400 || res.status === 404) {
        setIsLinked(false);
      } else if (res.ok) {
        const data = await res.json();
        setReport(data);
        setIsLinked(true);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinking(true);
    setLinkError("");

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:8000/api/parent/link-student", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ link_code: inputCode })
      });

      if (res.ok) {
        // لو الربط نجح، هنجيب التقرير فوراً
        await fetchReport();
      } else {
        const errorData = await res.json();
        setLinkError(errorData.detail || "Invalid code. Please try again.");
      }
    } catch (error) {
      setLinkError("Something went wrong. Check your connection.");
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-10">
        <div className="mb-10">
          <p className="text-sm font-medium text-blue-500">Parent Dashboard</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Student Progress</h1>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : !isLinked ? (
          /* شاشة الربط (لو ولي الأمر لسه مدخلش الكود) */
          <div className="mx-auto mt-20 max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/15">
              <LinkIcon size={32} className="text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold">Link Your Student</h2>
            <p className="mt-2 text-zinc-400">Enter the 6-character code from your student's profile to track their progress.</p>
            
            <form onSubmit={handleLinkStudent} className="mt-8 text-left">
              <input
                type="text"
                placeholder="e.g. A1B2C3"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-xl tracking-widest text-center text-white outline-none focus:border-blue-500"
                required
              />
              {linkError && (
                <p className="mt-3 flex items-center justify-center gap-2 text-sm text-red-400">
                  <AlertCircle size={16} /> {linkError}
                </p>
              )}
              <button
                type="submit"
                disabled={linking || inputCode.length < 6}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 p-4 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {linking ? <Loader2 className="animate-spin" /> : "Connect Account"}
              </button>
            </form>
          </div>
        ) : report ? (
          /* شاشة التقرير (لو الحساب مربوط) */
          <div>
            <div className="mb-8 rounded-2xl border border-blue-500/20 bg-blue-600/10 p-6">
              <h2 className="text-2xl font-bold text-blue-400">
                Tracking Progress for: <span className="text-white">{report.student_name}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-yellow-500/15 p-4">
                    <Star size={28} className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Total Points</p>
                    <h3 className="text-3xl font-bold">{report.total_points}</h3>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-orange-500/15 p-4">
                    <Target size={28} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Study Streak</p>
                    <h3 className="text-3xl font-bold">{report.current_streak} Days</h3>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-green-500/15 p-4">
                    <BookOpen size={28} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Lessons Completed</p>
                    <h3 className="text-3xl font-bold">{report.completed_lessons_count}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}