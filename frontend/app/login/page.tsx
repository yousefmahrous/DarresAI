"use client";

import { useState } from "react";
import Link from "next/link"; // ضفنا الـ Link هنا
import { Brain, Sparkles, GraduationCap, TrendingUp, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const formData = new URLSearchParams();
      formData.append("username", email); 
      formData.append("password", password);

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData, 
      });

      if (!response.ok) {
        throw new Error("تأكد من صحة البريد الإلكتروني أو كلمة المرور");
      }

      const data = await response.json();
      const token = data.access_token;
      
      const userData = data.user ? {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role, 
      } : { 
        id: 1, 
        email: email, 
        school_year: "prep_3",
        role: "student" 
      };
      
      localStorage.setItem("access_token", token);
      
      login(token, userData);
      
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء الاتصال بالسيرفر");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-black text-white">
      {/* Left Panel */}
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
          <h2 className="mt-20 text-6xl font-black leading-tight">Learn Smarter.<br />Powered by AI.</h2>
          <p className="mt-8 max-w-lg text-lg leading-8 text-zinc-400">
            Your AI companion for personalized learning, instant explanations, adaptive quizzes, and real-time progress tracking.
          </p>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-4"><Brain className="text-blue-500" size={22} /><span>AI Personalized Tutor</span></div>
          <div className="flex items-center gap-4"><GraduationCap className="text-blue-500" size={22} /><span>Adaptive Learning Paths</span></div>
          <div className="flex items-center gap-4"><TrendingUp className="text-blue-500" size={22} /><span>Progress Analytics</span></div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 items-center justify-center p-10">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-10 shadow-2xl">
          <p className="text-center text-sm font-medium text-blue-500">Welcome Back</p>
          <h2 className="mt-3 text-center text-4xl font-bold">Sign in</h2>
          <p className="mt-3 text-center text-zinc-400">Continue your AI learning journey.</p>

          <form onSubmit={handleLogin} className="mt-10 space-y-5">
            {error && (
              <div className="rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-500 border border-red-500/20">
                {error}
              </div>
            )}
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
              {isLoading ? "Signing in..." : "Login"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* اللينك بتاع الـ Sign up انضاف هنا */}
          <p className="mt-6 text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-blue-500 transition-colors hover:text-blue-400">
              Sign up
            </Link>
          </p>

          <p className="mt-6 text-center text-sm text-zinc-500">Secure authentication powered by DARES-AI</p>
        </div>
      </div>
    </main>
  );
}