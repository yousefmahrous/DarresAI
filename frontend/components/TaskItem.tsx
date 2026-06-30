import { LucideIcon } from "lucide-react";

interface TaskItemProps {
  icon: LucideIcon;
  title: string;
  time: string;
  priority: string;
  color: string;
}

export default function TaskItem({
  icon: Icon,
  title,
  time,
  priority,
  color,
}: TaskItemProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-4 transition-all duration-300 hover:border-blue-500/40">

      <div className="flex items-center gap-4">

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={20} className="text-white" />
        </div>

        <div>

          <h3 className="font-semibold text-white">
            {title}
          </h3>

          <p className="mt-1 text-sm text-zinc-400">
            {time}
          </p>

        </div>

      </div>

      <span className="rounded-full bg-blue-600/15 px-3 py-1 text-xs font-medium text-blue-400">
        {priority}
      </span>

    </div>
  );
}