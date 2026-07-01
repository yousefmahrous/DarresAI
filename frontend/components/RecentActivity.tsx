"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Bot, BookOpen, Trophy, Loader2 } from "lucide-react";
import ActivityItem from "./ActivityItem";

// تعريف شكل الداتا اللي راجعة من السيرفر
interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  color: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const res = await fetch("http://localhost:8000/api/student/activity", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setActivities(data);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // دالة صغيرة عشان تختار الأيقونة المناسبة حسب نوع النشاط
  const getIcon = (type: string) => {
    switch (type) {
      case "chat": return Bot;
      case "lesson": return BookOpen;
      case "achievement": return Trophy;
      default: return CheckCircle2;
    }
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-blue-500">Timeline</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Recent Activity</h2>
        </div>
      </div>

      <div className="space-y-5">
        {loading ? (
          <div className="flex justify-center py-5">
            <Loader2 className="animate-spin text-zinc-500" size={24} />
          </div>
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              icon={getIcon(activity.type)}
              title={activity.title}
              description={activity.description}
              time={activity.time}
              color={activity.color}
            />
          ))
        ) : (
          <p className="text-sm text-zinc-500">No recent activity found.</p>
        )}
      </div>
    </div>
  );
}