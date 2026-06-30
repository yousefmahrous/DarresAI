import { LucideIcon } from "lucide-react";

interface ActivityItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  color: string;
}

export default function ActivityItem({
  icon: Icon,
  title,
  description,
  time,
  color,
}: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 transition-all duration-300 hover:border-blue-500/40">

      <div className={`rounded-xl p-3 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>

      <div className="flex-1">

        <h3 className="font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm text-zinc-400">
          {description}
        </p>

        <p className="mt-3 text-xs text-zinc-500">
          {time}
        </p>

      </div>

    </div>
  );
}