import { Bell } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="mb-10 flex items-start justify-between">

      <div>

        <h1 className="text-5xl font-extrabold tracking-tight">
          Good Evening, Mahmoud 👋
        </h1>

        <p className="mt-3 text-lg text-zinc-400">
         Your personalized AI learning workspace.
        </p>

        <p className="mt-2 text-sm text-zinc-500">
          Wednesday • 4 Active Courses
        </p>

      </div>

      <button
        className="
          flex h-12 w-12 items-center justify-center
          rounded-xl
          border border-zinc-800
          bg-zinc-900
          text-zinc-300
          transition
          hover:bg-zinc-800
          hover:text-white
        "
      >
        <Bell size={20} />
      </button>

    </div>
  );
}