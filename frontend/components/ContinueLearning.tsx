import Link from "next/link";
import {
  BookOpen,
  Clock3,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export default function ContinueLearning() {
  return (
    <div
      className="
        group
        rounded-3xl
        border border-zinc-800
        bg-zinc-900
        p-8
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500/40
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-blue-500">
            Continue Learning
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Physics
          </h2>

        </div>

        <span className="rounded-full bg-blue-600/15 px-3 py-1 text-xs font-medium text-blue-400">
          Intermediate
        </span>

      </div>

      {/* Lesson */}

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-600/15 p-3">
            <BookOpen className="text-blue-500" size={22} />
          </div>

          <div>

            <p className="font-semibold text-white">
              Newton's Second Law
            </p>

            <p className="text-sm text-zinc-400">
              Lesson 8 of 12
            </p>

          </div>

        </div>

      </div>

      {/* Stats */}

      <div className="mt-6 flex items-center justify-between text-sm text-zinc-400">

        <div className="flex items-center gap-2">

          <Clock3 size={16} />

          <span>12 min remaining</span>

        </div>

        <div className="flex items-center gap-2">

          <BarChart3 size={16} />

          <span>72% Completed</span>

        </div>

      </div>

      {/* Progress */}

      <div className="mt-5">

        <div className="h-3 overflow-hidden rounded-full bg-zinc-800">

          <div className="h-full w-[72%] rounded-full bg-blue-600 transition-all duration-500"></div>

        </div>

      </div>

      {/* Footer */}

      <div className="mt-8 flex items-center justify-between">

        <div>

          <p className="text-lg font-semibold text-white">
            Keep Going 🚀
          </p>

          <p className="text-sm text-zinc-400">
            Only 4 lessons left in this chapter.
          </p>

        </div>

        <Link
          href="/chat"
          className="
            flex items-center gap-2
            rounded-xl
            bg-blue-600
            px-6
            py-3
            font-semibold
            text-white
            transition-all
            duration-300
            hover:bg-blue-700
            hover:shadow-lg
          "
        >
          Continue

          <ArrowRight size={18} />
        </Link>

      </div>

    </div>
  );
}