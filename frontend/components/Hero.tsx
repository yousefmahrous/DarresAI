import Link from "next/link";
import { Bot, BookOpen, ChartColumn, Sparkles } from "lucide-react";

export default function Hero() {
  return (
<section
  id="home"
  className="relative overflow-hidden bg-transparent text-white"
>      {/* ================= Background ================= */}

      <div className="absolute inset-0">

{/* Egyptian Flag Background */}
<div
className="absolute inset-0 bg-cover bg-center opacity-100"  style={{
    backgroundImage: "url('/egypt-flag.jpg')",
  }}
/>

<div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/40 to-black/75"></div>
        <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-[#050816] via-[#050816]/90 to-transparent"></div>

<div className="absolute right-10 top-32 h-[420px] w-[420px] rounded-full bg-blue-500/15 blur-[120px]"></div>
      </div>

      {/* ================= Container ================= */}

      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-12 px-8 pt-36 pb-20">

        {/* ================= LEFT ================= */}

        <div className="max-w-xl">

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 backdrop-blur-xl">

            <span>🇪🇬</span>

            <span className="text-sm text-blue-300">
              Built for the Egyptian National Curriculum
            </span>

          </div>

          <h1 className="mt-8 text-7xl font-black leading-[1.05]">

            Learn Smarter

            <br />

            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              with AI by
            </span>

            <br />

            <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Your Side.
            </span>

          </h1>

          <p className="mt-8 text-lg leading-9 text-gray-300">

            Personalized AI tutoring designed specifically for Egyptian
            students. Learn faster, prepare for exams and improve
            your academic performance with intelligent learning.

          </p>

          <div className="mt-10 flex gap-5">

            <Link
              href="/login"
              className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold transition hover:scale-105 hover:bg-blue-700"
            >
              Start Learning →
            </Link>

            <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-xl transition hover:bg-white/10">
              Watch Demo
            </button>

          </div>

          {/* Stats */}

          <div className="mt-14 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">

            <div className="grid grid-cols-3 divide-x divide-white/10">

              <div className="py-6 text-center">

                <h2 className="text-4xl font-bold text-blue-400">
                  10K+
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Students
                </p>

              </div>

              <div className="py-6 text-center">

                <h2 className="text-4xl font-bold text-purple-400">
                  50+
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Subjects
                </p>

              </div>

              <div className="py-6 text-center">

                <h2 className="text-4xl font-bold text-green-400">
                  95%
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Success Rate
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ================= RIGHT ================= */}

<div className="relative -mt-12 ml-12">
          <div className="relative">

            {/* Main Card */}

<div className="relative overflow-hidden rounded-[38px] border border-white/10 bg-white/0 backdrop-blur-md shadow-[0_0_35px_rgba(59,130,246,0.12)]">              {/* Blue Glow */}

              <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[90px]" />

              {/* Top Highlight */}

       <img
  src="/student.png"
  alt="Student"
  className="relative z-10 w-[690px] object-contain"
/>

            </div>

            {/* AI Tutor */}

<div className="absolute left-5 top-5 flex items-center gap-2 rounded-xl border border-blue-500/30 bg-[#0b1226]/80 px-3 py-2 backdrop-blur-xl">
  <Bot className="h-8 w-8 text-blue-400" />

  <div>
    <p className="text-sm font-semibold text-white">
      AI Tutor
    </p>

    <p className="text-xs text-gray-300">
      24/7 Assistant
    </p>
  </div>
</div>

            {/* Study Plan */}

<div className="absolute bottom-24 left-4 flex items-center gap-2 rounded-xl border border-green-500/30 bg-[#0b1226]/95 px-3 py-2 backdrop-blur-xl z-30">
  <ChartColumn className="h-10 w-10 text-green-400" />

  <div>
    <p className="text-sm font-semibold text-white">
      Track
    </p>

    <p className="text-xs text-gray-300">
      Your Progress
    </p>
  </div>
</div>

            {/* Progress */}

<div className="absolute right-5 top-5 flex items-center gap-2 rounded-xl border border-blue-500/30 bg-[#0b1226]/80 px-3 py-2 backdrop-blur-xl">
  <ChartColumn className="h-7 w-7 text-green-400" />

  <div>
    <p className="text-sm font-semibold text-white">
      Progress
    </p>

    <p className="text-xs text-gray-300">
      +18%
    </p>
  </div>
</div>

            {/* Smart Quiz */}
<div className="absolute bottom-12 right-5 flex items-center gap-2 rounded-xl border border-purple-500/30 bg-[#0b1226]/95 px-3 py-2 backdrop-blur-xl z-30">
  <BookOpen className="h-10 w-10 text-purple-400" />

  <div>
    <p className="text-sm font-semibold text-white">
      Exam
    </p>

    <p className="text-xs text-gray-300">
      Preparation
    </p>
  </div>
</div>
          </div>

        </div>

      </div>

    </section>
  );
}