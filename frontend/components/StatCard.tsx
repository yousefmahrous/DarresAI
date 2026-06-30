import { LucideIcon, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: StatCardProps) {
  return (
    <div
      className="
      group
      rounded-3xl
      border border-zinc-800
      bg-zinc-900
      p-6
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-blue-500/40
      hover:shadow-xl
    "
    >
      <div className="flex items-center justify-between">

        <div className="rounded-2xl bg-blue-600/15 p-4">
          <Icon size={28} className="text-blue-500" />
        </div>

        <TrendingUp
          size={18}
          className="text-green-400 opacity-0 transition group-hover:opacity-100"
        />

      </div>

      <p className="mt-6 text-sm text-zinc-400">
        {title}
      </p>

      <h2 className="mt-2 text-5xl font-bold tracking-tight text-white">
        {value}
      </h2>

      <p className="mt-4 flex items-center gap-2 text-sm text-green-400">
        <span className="h-2 w-2 rounded-full bg-green-400"></span>
        {subtitle}
      </p>

    </div>
  );
}