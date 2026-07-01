import { BookOpen, TrendingUp, Clock3, Sparkles } from "lucide-react";
import StatCard from "./StatCard";

interface StatsCardsProps {
  coursesCount: number;
  aiScore: number;
  streak: number;
  progress?: number; // ضفناها هنا عشان نقرأها، والـ Default هيكون 0
}

export default function StatsCards({ coursesCount, aiScore, streak, progress = 0 }: StatsCardsProps) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Courses"
        value={coursesCount < 10 ? `0${coursesCount}` : `${coursesCount}`}
        subtitle="Active Enrollments"
        icon={BookOpen}
      />

      {/* التعديل هنا: خلينا التقدم يقرأ من الداتا الحقيقية أو يبدأ من 0 */}
      <StatCard
        title="Overall Progress"
        value={`${progress}%`}
        subtitle={progress === 0 ? "Let's start learning!" : "+8% this week"}
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