import {
  BookOpen,
  TrendingUp,
  Clock3,
  Sparkles,
} from "lucide-react";

import StatCard from "./StatCard";

export default function StatsCards() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Total Courses"
        value="06"
        subtitle="+2 this month"
        icon={BookOpen}
      />

      <StatCard
        title="Overall Progress"
        value="72%"
        subtitle="+8% this week"
        icon={TrendingUp}
      />

      <StatCard
        title="Study Time"
        value="27h"
        subtitle="4.2 hrs today"
        icon={Clock3}
      />

      <StatCard
        title="AI Score"
        value="91"
        subtitle="Excellent Performance"
        icon={Sparkles}
      />

    </div>
  );
}