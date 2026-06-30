import {
  ClipboardCheck,
  Brain,
  Calculator,
} from "lucide-react";

import TaskItem from "./TaskItem";

export default function UpcomingTasks() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg">

      <div className="mb-8">

        <p className="text-sm font-medium text-blue-500">
          Planner
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Upcoming Tasks
        </h2>

      </div>

      <div className="space-y-5">

        <TaskItem
          icon={ClipboardCheck}
          title="Physics Quiz"
          time="Tomorrow • 10:00 AM"
          priority="High"
          color="bg-red-600"
        />

        <TaskItem
          icon={Brain}
          title="AI Assignment"
          time="Friday • 6:00 PM"
          priority="Medium"
          color="bg-blue-600"
        />

        <TaskItem
          icon={Calculator}
          title="Mathematics Revision"
          time="Sunday"
          priority="Low"
          color="bg-green-600"
        />

      </div>

      {/* Summary */}

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-zinc-400">
              Tasks This Week
            </p>

            <p className="mt-1 text-3xl font-bold text-white">
              3
            </p>

          </div>

          <div className="text-right">

            <p className="text-sm text-zinc-400">
              Completion Goal
            </p>

            <p className="mt-1 text-xl font-semibold text-blue-400">
              100%
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}