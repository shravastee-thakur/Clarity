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
  const { activeWorkspaceId } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!activeWorkspaceId) return;
      try {
        const [statsRes, projectsRes] = await Promise.all([
          api.get(`/api/v1/workspaces/${activeWorkspaceId}/stats`),
          api.get(`/api/v1/workspaces/${activeWorkspaceId}/projects`),
        ]);
        setStats(statsRes.data.data);
        setProjects(projectsRes.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeWorkspaceId]);

  if (isLoading) return <AdminSkeleton />;

  const { activeProjects, openTasks, teamMembers, completedToday, bottleneck } =
    stats || {};

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#172b4d]">Admin Dashboard</h1>
        <p className="text-[#172b4d]/60 mt-1">
          Workspace health and team execution metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statItems.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-xl border border-slate-200"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-[#0344a6]/10 text-[#0344a6]">
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-[#172b4d]/60">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-[#172b4d] mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {bottleneck && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#172b4d]/10 flex items-center justify-center text-[#172b4d] flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[#172b4d]">
              Team Bottleneck Detected
            </h3>
            <p className="text-sm text-[#172b4d]/60 mt-0.5">
              <span className="font-semibold text-[#172b4d]">
                {bottleneck.name}
              </span>{" "}
              has {bottleneck.count} high priority tasks assigned. Consider
              reassigning work to balance the load.
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#0344a6] text-white flex items-center justify-center font-bold flex-shrink-0">
            {bottleneck.name?.charAt(0) || "U"}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-[#172b4d]">
            Project Health
          </h2>
        </div>
        <div className="divide-y divide-slate-200">
          {projects.filter((p) => p.status === "Active").length > 0 ? (
            projects
              .filter((p) => p.status === "Active")
              .map((project) => {
                const progress =
                  project.totalTasks > 0
                    ? (project.completedTasks / project.totalTasks) * 100
                    : 0;
                return (
                  <div key={project._id} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-[#172b4d]">
                        {project.name}
                      </h3>
                      <span className="text-xs font-medium text-[#172b4d]/60">
                        {project.completedTasks}/{project.totalTasks} tasks
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-[#0344a6] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    {project.endDate && (
                      <p className="text-xs text-[#172b4d]/50 mt-2">
                        Deadline:{" "}
                        {new Date(project.endDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                );
              })
          ) : (
            <div className="px-6 py-8 text-center text-sm text-[#172b4d]/60">
              No active projects to display.
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
    <div className="h-24 bg-slate-200 rounded-xl" />
    <div className="h-64 bg-slate-200 rounded-xl" />
  </div>
);

export default AdminDashboard;
