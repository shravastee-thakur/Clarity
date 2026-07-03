import { FolderKanban, CheckSquare, Users, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const stats = [
    { label: "Active Projects", value: "12", icon: FolderKanban },
    { label: "Open Tasks", value: "48", icon: CheckSquare },
    { label: "Team Members", value: "24", icon: Users },
    { label: "Completed Today", value: "7", icon: TrendingUp },
  ];

  const recentTasks = [
    {
      id: 1,
      title: "Fix authentication bug",
      project: "Backend API",
      priority: "High",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Design onboarding flow",
      project: "Mobile App",
      priority: "Medium",
      status: "To Do",
    },
    {
      id: 3,
      title: "Update database schema",
      project: "Backend API",
      priority: "Low",
      status: "Done",
    },
  ];

  const getStatusClasses = (status) => {
    if (status === "Done" || status === "Active")
      return "bg-[#0344a6]/10 text-[#0344a6]";
    if (status === "Blocked" || status === "Archived")
      return "bg-[#172b4d]/10 text-[#172b4d]";
    return "bg-slate-100 text-[#172b4d]";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#172b4d]">Dashboard</h1>
        <p className="text-[#172b4d]/60 mt-1">
          Welcome back. Here is what is happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => (
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

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#172b4d]">Recent Tasks</h2>
          <a
            href="/tasks"
            className="text-sm font-medium text-[#0344a6] hover:underline"
          >
            View all
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[#172b4d]/60 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Task</th>
                <th className="px-6 py-3 hidden sm:table-cell">Project</th>
                <th className="px-6 py-3 hidden md:table-cell">Priority</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentTasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-[#172b4d]">
                    {task.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#172b4d]/60 hidden sm:table-cell">
                    {task.project}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${getStatusClasses(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${getStatusClasses(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
