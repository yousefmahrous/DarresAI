import Link from "next/link";
import {
  Bot,
  TrendingUp,
  Brain,
  ArrowRight,
} from "lucide-react";

export default function AIRecommendation() {
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
            AI Insight
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Personalized Recommendation
          </h2>

        </div>

        <div className="rounded-xl bg-blue-600/15 p-3">
          <Bot className="text-blue-500" size={24} />
        </div>

      </div>

      {/* Recommendation */}

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">

        <p className="font-semibold text-white">
          Review Newton's Second Law
        </p>

        <p className="mt-2 text-sm text-zinc-400">
          Your last quiz shows that this topic needs more practice.
        </p>

      </div>

      {/* AI Metrics */}

      <div className="mt-6 space-y-4">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2 text-zinc-400">
            <TrendingUp size={16} />
            <span>Expected Improvement</span>
          </div>

          <span className="font-semibold text-green-400">
            +18%
          </span>

        </div>

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2 text-zinc-400">
            <Brain size={16} />
            <span>AI Confidence</span>
          </div>

          <span className="font-semibold text-blue-400">
            92%
          </span>

        </div>

      </div>

      {/* Footer */}

      <div className="mt-8 flex items-center justify-between">

        <div>

          <p className="font-semibold text-white">
            Smart Study Tip
          </p>

          <p className="text-sm text-zinc-400">
            12 minutes of revision is recommended.
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
          "
        >
          Review

          <ArrowRight size={18} />

        </Link>

      </div>

    </div>
  );
}