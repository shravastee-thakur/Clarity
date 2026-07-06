import { useState, useEffect } from "react";
import { Flag, Calendar, AlertCircle, CheckSquare } from "lucide-react";
import api from "../../../utils/axiosinstance";
import { useAuthStore } from "../../../store/authStore";
import toast from "react-hot-toast";

const EmployeeDashboard = () => {
  const { activeWorkspaceId } = useAuthStore();
  const [focusTasks, setFocusTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!activeWorkspaceId) return;
      try {
        const [focusRes, myTasksRes] = await Promise.all([
          api.get(`/api/v1/workspaces/${activeWorkspaceId}/tasks/focus`),
          api.get(`/api/v1/workspaces/${activeWorkspaceId}/tasks/me`),
        ]);
        setFocusTasks(focusRes.data.data || []);

        const allTasks = myTasksRes.data.data || [];
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const upcoming = allTasks
          .filter(
            (t) =>
              t.dueDate &&
              new Date(t.dueDate) <= nextWeek &&
              t.status !== "Done" &&
              t.status !== "Blocked",
          )
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        setUpcomingTasks(upcoming);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeWorkspaceId]);

  const handleReportBlocker = async (taskId) => {
    const originalTasks = [...focusTasks];
    setFocusTasks(
      focusTasks.map((t) =>
        t._id === taskId ? { ...t, status: "Blocked" } : t,
      ),
    );

    try {
      await api.patch(
        `/api/v1/workspaces/${activeWorkspaceId}/tasks/${taskId}/block`,
      );
      toast.success("Blocker reported. Your manager has been notified.");
    } catch (error) {
      setFocusTasks(originalTasks);
      toast.error("Failed to report blocker.");
    }
  };

  if (isLoading) return <EmployeeSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#172b4d]">Focus Mode</h1>
        <p className="text-[#172b4d]/60 mt-1">
          Your top priorities for today. Execute without distractions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {focusTasks.length > 0 ? (
          focusTasks.map((task) => (
            <div
              key={task._id}
              className={`bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-between transition-all ${task.status === "Blocked" ? "opacity-60 bg-slate-50" : ""}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${task.priority === "high" ? "bg-[#172b4d] text-white" : "bg-slate-100 text-[#172b4d]"}`}
                  >
                    {task.priority?.toUpperCase() || "MEDIUM"}
                  </span>
                  {task.status === "Blocked" && (
                    <span className="text-xs font-semibold text-[#172b4d] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Blocked
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[#172b4d] mb-2">
                  {task.title}
                </h3>
                <p className="text-sm text-[#172b4d]/60 mb-4 line-clamp-2">
                  {task.description || "No description provided."}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#172b4d]/50 mb-6">
                  <Calendar className="w-3 h-3" />
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"}
                </div>
              </div>

              {task.status !== "Blocked" && (
                <button
                  onClick={() => handleReportBlocker(task._id)}
                  className="w-full py-2.5 border border-slate-200 text-[#172b4d] text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  Report Blocker
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-12 rounded-xl border border-slate-200 text-center">
            <CheckSquare className="w-12 h-12 text-[#0344a6]/20 mx-auto mb-4" />
            <p className="text-[#172b4d]/60">
              You are all caught up. No high priority tasks right now.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-[#172b4d]">
            Upcoming Deadlines
          </h2>
          <p className="text-xs text-[#172b4d]/50 mt-1">
            Tasks due in the next 7 days
          </p>
        </div>
        <div className="divide-y divide-slate-200">
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map((task) => (
              <div
                key={task._id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Flag className="w-4 h-4 text-[#172b4d]/40" />
                  <span className="text-sm font-medium text-[#172b4d]">
                    {task.title}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#172b4d]/60">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-sm text-[#172b4d]/60">
              No deadlines in the next 7 days.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmployeeSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-8 w-48 bg-slate-200 rounded" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-64 bg-slate-200 rounded-xl" />
      ))}
    </div>
    <div className="h-48 bg-slate-200 rounded-xl" />
  </div>
);

export default EmployeeDashboard;
