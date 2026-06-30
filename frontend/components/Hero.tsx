import Link from "next/link";
import {
  Sparkles,
  Brain,
  GraduationCap,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="mx-auto flex min-h-[88vh] max-w-7xl items-center justify-between px-8">

      {/* Left Side */}

      <div className="max-w-2xl">

        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-600/10 px-4 py-2 text-sm text-blue-400">

          <Sparkles size={16} />

          AI Personalized Learning Platform

        </div>

        <h1 className="mt-8 text-7xl font-black leading-tight tracking-tight">

          Learn Smarter

          <br />

          with your

          <span className="text-blue-500"> AI Tutor</span>

        </h1>

        <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">

          Experience adaptive learning powered by artificial intelligence.
          Get personalized lessons, real-time feedback, and an AI tutor that
          helps you master every concept.

        </p>

        <div className="mt-10 flex gap-4">

          <Link
            href="/login"
            className="
              flex
              items-center
              gap-2
              rounded-2xl
              bg-blue-600
              px-8
              py-4
              font-semibold
              transition
              hover:bg-blue-700
            "
          >
            Start Learning

            <ArrowRight size={18} />

          </Link>

          <button
            className="
              rounded-2xl
              border
              border-zinc-700
              px-8
              py-4
              font-semibold
              hover:bg-zinc-900
              transition
            "
          >
            Watch Demo
          </button>

        </div>

      </div>

      {/* Right Side */}

      <div className="hidden lg:block">

        <div className="rounded-[32px] border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">

          <div className="grid grid-cols-2 gap-5">

            <div className="rounded-2xl bg-zinc-950 p-6">

              <Brain className="text-blue-500" size={34} />

              <h3 className="mt-5 font-bold">
                AI Tutor
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                Personalized explanations
              </p>

            </div>

            <div className="rounded-2xl bg-zinc-950 p-6">

              <GraduationCap className="text-blue-500" size={34} />

              <h3 className="mt-5 font-bold">
                Smart Courses
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                Adaptive learning paths
              </p>

            </div>

            <div className="rounded-2xl bg-zinc-950 p-6">

              <TrendingUp className="text-blue-500" size={34} />

              <h3 className="mt-5 font-bold">
                Analytics
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                Track your progress
              </p>

            </div>

            <div className="rounded-2xl bg-blue-600 p-6">

              <Sparkles size={34} />

              <h3 className="mt-5 font-bold">
                AI Insights
              </h3>

              <p className="mt-2 text-sm text-blue-100">
                Study recommendations
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}