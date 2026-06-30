import Sidebar from "../../components/Sidebar";
import CourseCard from "../../components/CourseCard";
import { Search, SlidersHorizontal } from "lucide-react";

export default function Courses() {
  return (
    <div className="flex min-h-screen bg-black text-white">

      <Sidebar />

      <main className="flex-1 p-10">

        {/* Header */}

        <div className="flex items-end justify-between">

          <div>

            <p className="text-sm font-medium text-blue-500">
              Learning Hub
            </p>

            <h1 className="mt-2 text-5xl font-extrabold tracking-tight">
              My Courses
            </h1>

            <p className="mt-3 text-zinc-400">
              Continue your personalized AI learning journey.
            </p>

          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3">
            <span className="text-zinc-400">4 Active Courses</span>
          </div>

        </div>

        {/* Search */}

        <div className="mt-10 flex gap-4">

          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-5">

            <Search className="text-zinc-500" size={20} />

            <input
              type="text"
              placeholder="Search courses..."
              className="w-full bg-transparent py-4 outline-none placeholder:text-zinc-500"
            />

          </div>

          <button
            className="
              flex
              items-center
              gap-2
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-900
              px-5
              hover:border-blue-500/40
              transition
            "
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>

        </div>

        {/* Categories */}

        <div className="mt-8 flex gap-3">

          <button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium">
            All
          </button>

          <button className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-zinc-400 hover:bg-zinc-800">
            Physics
          </button>

          <button className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-zinc-400 hover:bg-zinc-800">
            AI
          </button>

          <button className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-zinc-400 hover:bg-zinc-800">
            Mathematics
          </button>

        </div>

        {/* Courses */}

        <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-2">

          <CourseCard
            title="Physics"
            lesson="Newton's Second Law"
            progress={72}
            duration="12 min left"
            level="Intermediate"
          />

          <CourseCard
            title="Machine Learning"
            lesson="Decision Trees"
            progress={20}
            duration="35 min left"
            level="Beginner"
          />

          <CourseCard
            title="Mathematics"
            lesson="Integral Calculus"
            progress={48}
            duration="18 min left"
            level="Intermediate"
          />

          <CourseCard
            title="Deep Learning"
            lesson="Neural Networks"
            progress={2}
            duration="45 min left"
            level="Advanced"
          />

        </div>

      </main>

    </div>
  );
}