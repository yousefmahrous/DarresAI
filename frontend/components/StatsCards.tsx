import { BookOpen, TrendingUp, Clock3, Sparkles } from "lucide-react";
import StatCard from "./StatCard";

interface StatsCardsProps {
  coursesCount: number;
  aiScore: number;
  streak: number;
}

export default function StatsCards({ coursesCount, aiScore, streak }: StatsCardsProps) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Courses"
        value={coursesCount < 10 ? `0${coursesCount}` : `${coursesCount}`}
        subtitle="Active Enrollments"
        icon={BookOpen}
      />

      {/* نسبة التقدم هنعملها Mocking مؤقتاً للـ Demo عشان مش راجعة من مسار الـ Profile */}
      <StatCard
        title="Overall Progress"
        value="72%"
        subtitle="+8% this week"
        icon={TrendingUp}
      />

      <StatCard
        title="Study Streak"
        value={`${streak} Days`}
        subtitle="Keep the momentum!"
        icon={Clock3}
      />

      <StatCard
        title="AI Score"
        value={`${aiScore}`}
        subtitle="Total Gamification Points"
        icon={Sparkles}
      />
    </div>
  );
}