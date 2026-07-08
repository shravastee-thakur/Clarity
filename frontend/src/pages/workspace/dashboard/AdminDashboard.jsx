import { useState, useEffect } from "react";
import {
  FolderKanban,
  CheckSquare,
  Users,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import api from "../../../utils/axiosinstance";
import { useAuthStore } from "../../../store/authStore";

const AdminDashboard = () => {
  const { activeWorkspaceId, isSessionRestored } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSessionRestored || !activeWorkspaceId) return;

    const fetchData = async () => {
      try {
        const [statsRes, projectsRes, membersRes] = await Promise.all([
          api.get(`/api/v1/workspaces/${activeWorkspaceId}/stats`),
          api.get(`/api/v1/workspaces/${activeWorkspaceId}/projects`),
          api.get(`/api/v1/workspaces/${activeWorkspaceId}/members`),
        ]);

        const rawStats = statsRes.data.data;
        const projectsData = projectsRes.data.data || [];
        const membersData = membersRes.data.data || [];

        const mappedStats = {
          activeProjects: projectsData.filter((p) => p.status === "active")
            .length,
          openTasks: rawStats.openTasks,
          teamMembers: membersData.length,
          completedToday: rawStats.completedToday,
          bottleneck: rawStats.topBottleneckUserId
            ? {
                name: rawStats.topBottleneckUserName || "Unknown User",
                count: rawStats.topBottleneckTaskCount,
              }
            : null,
        };

        setStats(mappedStats);
        setProjects(projectsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeWorkspaceId, isSessionRestored]);

  if (isLoading) return <AdminSkeleton />;

  const { activeProjects, openTasks, teamMembers, completedToday, bottleneck } =
    stats || {};
  console.log("stats", stats);

  const statItems = [
    {
      label: "Active Projects",
      value: activeProjects || 0,
      icon: FolderKanban,
    },
    { label: "Open Tasks", value: openTasks || 0, icon: CheckSquare },
    { label: "Team Members", value: teamMembers || 0, icon: Users },
    { label: "Completed Today", value: completedToday || 0, icon: TrendingUp },
  ];

  const activeProjectsList = projects.filter((p) => p.status === "active");
  console.log(activeProjectsList);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#172b4d]">Macro Dashboard</h1>
        <p className="text-[#172b4d]/60 mt-1">
          Workspace health and team execution metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statItems.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-[#0344a6]/10 text-[#0344a6]">
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-[#172b4d]/60">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-[#172b4d] mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {bottleneck && bottleneck.count > 0 && (
        <div className="bg-[#172b4d] p-6 rounded-xl shadow-lg flex items-center gap-5 text-white">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-1">
              Team Bottleneck Detected
            </h3>
            <p className="text-lg font-medium">
              <span className="font-bold text-white">{bottleneck.name}</span>{" "}
              has{" "}
              <span className="font-bold text-white">{bottleneck.count}</span>{" "}
              high priority task{bottleneck.count > 1 ? "s" : ""} assigned.
            </p>
            <p className="text-sm text-white/60 mt-1">
              Consider reassigning work to balance the team load.
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-2">
            <div className="w-12 h-12 rounded-full bg-[#0344a6] text-white flex items-center justify-center text-lg font-bold shadow-md">
              {bottleneck.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#172b4d]">Project Health</h2>
            <p className="text-xs text-[#172b4d]/50 mt-0.5">
              Track progress against deadlines
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0344a6]/10 text-[#0344a6]">
            {activeProjectsList.length} Active
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {activeProjectsList.length > 0 ? (
            activeProjectsList.map((project) => {
              const total = project.totalTasks || 0;
              const completed = project.completedTasks || 0;
              const progress = total > 0 ? (completed / total) * 100 : 0;

              return (
                <div
                  key={project._id}
                  className="px-6 py-5 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#172b4d]/60">
                        <FolderKanban className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-[#172b4d]">
                        {project.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-semibold text-[#172b4d]/70 bg-slate-100 px-2 py-1 rounded">
                        {completed}/{total} tasks
                      </span>
                      {project.endDate && (
                        <span className="text-xs text-[#172b4d]/50 hidden sm:block">
                          Due {new Date(project.endDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#0344a6] h-1.5 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-6 py-12 text-center">
              <FolderKanban className="w-10 h-10 text-[#172b4d]/10 mx-auto mb-3" />
              <p className="text-sm text-[#172b4d]/60">
                No active projects to display.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-8 w-48 bg-slate-200 rounded" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-slate-200 rounded-xl" />
      ))}
    </div>
    <div className="h-28 bg-slate-200 rounded-xl" />
    <div className="h-64 bg-slate-200 rounded-xl" />
  </div>
);

export default AdminDashboard;
