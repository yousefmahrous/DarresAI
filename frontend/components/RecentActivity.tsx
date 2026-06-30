import {
  CheckCircle2,
  Bot,
  BookOpen,
  Trophy,
} from "lucide-react";

import ActivityItem from "./ActivityItem";

export default function RecentActivity() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-blue-500">
            Timeline
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Recent Activity
          </h2>

        </div>

      </div>

      <div className="space-y-5">

        <ActivityItem
          icon={CheckCircle2}
          title="Physics Quiz Completed"
          description="Scored 18/20 on Newton's Laws quiz."
          time="2 hours ago"
          color="bg-green-600"
        />

        <ActivityItem
          icon={Bot}
          title="AI Tutor Session"
          description="Asked about Newton's Second Law."
          time="Yesterday"
          color="bg-blue-600"
        />

        <ActivityItem
          icon={BookOpen}
          title="Lesson Completed"
          description="Finished Newton's First Law."
          time="Yesterday"
          color="bg-indigo-600"
        />

        <ActivityItem
          icon={Trophy}
          title="Study Streak"
          description="You've studied for 3 consecutive days."
          time="Today"
          color="bg-yellow-500"
        />

      </div>

    </div>
  );
}