import Sidebar from "../../components/Sidebar";
import DashboardHeader from "../../components/DashboardHeader";
import StatsCards from "../../components/StatsCards";
import ContinueLearning from "../../components/ContinueLearning";
import AIRecommendation from "../../components/AIRecommendation";
import RecentActivity from "../../components/RecentActivity";
import UpcomingTasks from "../../components/UpcomingTasks";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-black text-white">

      <Sidebar />

      <main className="flex-1 overflow-y-auto p-10">

        <DashboardHeader />

        <StatsCards />

        <div className="mt-10 grid grid-cols-2 gap-6">

          <ContinueLearning />

          <AIRecommendation />

          <RecentActivity />

          <UpcomingTasks />

        </div>

      </main>

    </div>
  );
}