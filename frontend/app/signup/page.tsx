"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, Sparkles, GraduationCap, TrendingUp, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  
  // States الأساسية
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // States الجديدة للـ Role والسنة الدراسية
  const [role, setRole] = useState("student");
  const [schoolYear, setSchoolYear] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation سريع: لو طالب، لازم يختار سنة دراسية
    if (role === "student" && !schoolYear) {
      setError("Please select a school year");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name, 
          email: email, 
          password: password,
          role: role, 
          // بنبعت السنة الدراسية لو طالب، ولو ولي أمر بنبعتها فاضية أو null
          school_year: role === "student" ? schoolYear : null 
        }), 
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "حدث خطأ أثناء إنشاء الحساب");
      }

      router.push("/login");
      
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

      {/* Right Panel */}
      <div className="flex flex-1 items-center justify-center p-10">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-10 shadow-2xl">
          <p className="text-center text-sm font-medium text-blue-500">New Here?</p>
          <h2 className="mt-3 text-center text-4xl font-bold">Sign up</h2>
          <p className="mt-3 text-center text-zinc-400">Create your DARES-AI account.</p>

          <form onSubmit={handleSignup} className="mt-8 space-y-4">
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

            {/* دروب داون تحديد نوع الحساب */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none transition focus:border-blue-500 appearance-none"
            >
              <option value="student">Student</option>
              <option value="parent">Parent</option>
            </select>

            {/* دروب داون تحديد السنة الدراسية (بيظهر للطالب فقط) */}
            {role === "student" && (
              <select
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                required
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 p-4 text-white outline-none transition focus:border-blue-500 appearance-none"
              >
                <option value="" disabled>Select School Year</option>
                
                <optgroup label="Primary Stage">
                  <option value="prim_1">Primary 1 (أولى ابتدائي)</option>
                  <option value="prim_2">Primary 2 (تانية ابتدائي)</option>
                  <option value="prim_3">Primary 3 (تالتة ابتدائي)</option>
                  <option value="prim_4">Primary 4 (رابعة ابتدائي)</option>
                  <option value="prim_5">Primary 5 (خامسة ابتدائي)</option>
                  <option value="prim_6">Primary 6 (ساتة ابتدائي)</option>
                </optgroup>
                
                <optgroup label="Preparatory Stage">
                  <option value="prep_1">Prep 1 (أولى إعدادي)</option>
                  <option value="prep_2">Prep 2 (تانية إعدادي)</option>
                  <option value="prep_3">Prep 3 (تالتة إعدادي)</option>
                </optgroup>
                
                <optgroup label="Secondary Stage">
                  <option value="sec_1">Secondary 1 (أولى ثانوي)</option>
                  <option value="sec_2">Secondary 2 (تانية ثانوي)</option>
                  <option value="sec_3">Secondary 3 (تالتة ثانوي)</option>
                </optgroup>
              </select>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-semibold transition-all duration-300 hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

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