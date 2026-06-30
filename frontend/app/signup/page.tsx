"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, Sparkles, GraduationCap, TrendingUp, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  
  // States للبيانات
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      // هنبعت البيانات للباك إند (تأكد إن المسار ده صح عندك في الباك إند)
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name, 
          email: email, 
          password: password,
          role: "student",            // <--- ضفنا دي
          school_year: "sec_1"        // <--- وضفنا دي (اكتب السنة اللي تناسبك)
        }), 
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "حدث خطأ أثناء إنشاء الحساب");
      }

      // لو الحساب اتعمل بنجاح، هننقله لصفحة اللوجين عشان يدخل
      router.push("/login");
      
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء الاتصال بالسيرفر");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-black text-white">
      {/* Left Panel - نفس تصميم اللوجين */}
      <div className="hidden w-1/2 flex-col justify-between border-r border-zinc-800 bg-zinc-950 p-14 lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600/15 p-3">
              <Sparkles className="text-blue-500" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">DARES<span className="text-blue-500">-AI</span></h1>
              <p className="text-sm text-zinc-500">Personalized AI Learning</p>
            </div>
          </div>
          <h2 className="mt-20 text-6xl font-black leading-tight">Join Us.<br />Learn Smarter.</h2>
          <p className="mt-8 max-w-lg text-lg leading-8 text-zinc-400">
            Create an account to start your personalized AI learning journey today.
          </p>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-4"><Brain className="text-blue-500" size={22} /><span>AI Personalized Tutor</span></div>
          <div className="flex items-center gap-4"><GraduationCap className="text-blue-500" size={22} /><span>Adaptive Learning Paths</span></div>
          <div className="flex items-center gap-4"><TrendingUp className="text-blue-500" size={22} /><span>Progress Analytics</span></div>
        </div>
      </div>

      {/* Right Panel - فورم إنشاء الحساب */}
      <div className="flex flex-1 items-center justify-center p-10">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-10 shadow-2xl">
          <p className="text-center text-sm font-medium text-blue-500">New Here?</p>
          <h2 className="mt-3 text-center text-4xl font-bold">Sign up</h2>
          <p className="mt-3 text-center text-zinc-400">Create your DARES-AI account.</p>

          <form onSubmit={handleSignup} className="mt-10 space-y-5">
            {error && (
              <div className="rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-500 border border-red-500/20">
                {error}
              </div>
            )}
            
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 p-4 outline-none transition focus:border-blue-500"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 p-4 outline-none transition focus:border-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 p-4 outline-none transition focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-semibold transition-all duration-300 hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* لينك الرجوع للوجين */}
          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}