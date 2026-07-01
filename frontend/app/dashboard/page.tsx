"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import DashboardHeader from "../../components/DashboardHeader";
import StatsCards from "../../components/StatsCards";
import ContinueLearning from "../../components/ContinueLearning";
import AIRecommendation from "../../components/AIRecommendation";
import RecentActivity from "../../components/RecentActivity";
import UpcomingTasks from "../../components/UpcomingTasks";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const [profileData, setProfileData] = useState({ streak: 0, points: 0 });
  const [coursesCount, setCoursesCount] = useState(0);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // زناد التحديث بعد الاشتراك

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No token found! Please login.");
          setLoading(false);
          return;
        }

        const headers = {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        };

        // طلب الـ 3 مسارات مع بعض عشان السرعة
        const [profileRes, coursesRes, availableRes] = await Promise.all([
          fetch("http://localhost:8000/api/student/profile", { headers }),
          fetch("http://localhost:8000/api/courses/", { headers }),
          fetch("http://localhost:8000/api/courses/available", { headers }) 
        ]);

        if (profileRes.ok) {
          const pData = await profileRes.json();
          setProfileData({ streak: pData.streak || 0, points: pData.points || 0 });
        }

        if (coursesRes.ok) {
          const cData = await coursesRes.json();
          setCoursesCount(cData.length || 0);
        }

        if (availableRes.ok) {
          const aData = await availableRes.json();
          setAvailableCourses(aData);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [refreshTrigger]); // الـ Effect هيشتغل تاني لو الـ Trigger اتغير

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-10">
        <DashboardHeader />

        {loading ? (
          <div className="flex h-40 items-center justify-center mt-10">
            <Loader2 className="animate-spin text-blue-500" size={40} />
            <span className="ml-3 text-zinc-400">Loading Dashboard Metrics...</span>
          </div>
        ) : (
          <StatsCards 
            coursesCount={coursesCount} 
            aiScore={profileData.points} 
            streak={profileData.streak} 
          />
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* نمرر الكورسات المتاحة ودالة التحديث للكومبوننت */}
          <ContinueLearning 
            availableCourses={availableCourses} 
            onEnrollSuccess={() => setRefreshTrigger(prev => prev + 1)} 
          />
          {/* <AIRecommendation /> */}
          <RecentActivity />
          {/* <UpcomingTasks /> */}
        </div>
      </main>
    </div>
  );
}