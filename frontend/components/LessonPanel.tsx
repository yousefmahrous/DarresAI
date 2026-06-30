import { BookOpen, Target, Clock3, ArrowRight } from "lucide-react";

export default function LessonPanel() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-blue-500">
            Current Lesson
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Newton's Second Law
          </h1>

        </div>

        <div className="rounded-xl bg-blue-600/15 p-3">
          <BookOpen className="text-blue-500" size={24} />
        </div>

      </div>

      {/* Lesson Info */}

      <div className="mt-8 flex gap-3">

        <span className="rounded-full bg-blue-600/15 px-3 py-1 text-sm font-medium text-blue-400">
          Physics
        </span>

        <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300">
          Lesson 8 / 12
        </span>

        <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300 flex items-center gap-2">
          <Clock3 size={14} />
          12 min
        </span>

      </div>

      {/* Formula */}

      <div className="mt-8 rounded-2xl border border-blue-500/30 bg-zinc-950 p-8">

        <p className="text-center text-5xl font-bold tracking-wide text-blue-500">
          F = m × a
        </p>

        <p className="mt-3 text-center text-sm text-zinc-500">
          Force = Mass × Acceleration
        </p>

      </div>

      {/* Objectives */}

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

        <div className="flex items-center gap-2">

          <Target className="text-blue-500" size={20} />

          <h3 className="text-lg font-semibold">
            Learning Objectives
          </h3>

        </div>

        <ul className="mt-5 space-y-3 text-zinc-400">

          <li>• Understand the relationship between force and acceleration.</li>

          <li>• Apply Newton's Second Law to real-world problems.</li>

          <li>• Solve numerical physics exercises.</li>

        </ul>

      </div>

      {/* Explanation */}

      <div className="mt-8">

        <h3 className="text-xl font-semibold">
          Explanation
        </h3>

        <p className="mt-4 leading-8 text-zinc-400">
          Newton's Second Law explains that an object's acceleration is directly
          proportional to the force applied and inversely proportional to its
          mass. Increasing the applied force increases acceleration, while
          increasing mass reduces acceleration if the force remains constant.
        </p>

      </div>

      {/* Button */}

      <button
        className="
          mt-8
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-2xl
          bg-blue-600
          py-4
          font-semibold
          transition-all
          duration-300
          hover:bg-blue-700
        "
      >
        Start Quiz

        <ArrowRight size={18} />

      </button>

    </div>
  );
}