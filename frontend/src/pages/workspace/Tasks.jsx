import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Filter,
  CheckSquare,
  Flag,
  Calendar,
  X,
  Loader2,
} from "lucide-react";
import api from "../../utils/axiosinstance";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

const Tasks = () => {
  const { activeWorkspaceId, userInfo, isSessionRestored } = useAuthStore();

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState("all");

  const [filters, setFilters] = useState({ status: "all", priority: "all" });
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assigneeId: "",
    priority: "medium",
    dueDate: "",
  });

  // 1. Fetch projects
  useEffect(() => {
    if (!isSessionRestored || !activeWorkspaceId) return;

    const fetchProjects = async () => {
      if (!activeWorkspaceId) return;
      try {
        const res = await api.get(
          `/api/v1/workspaces/${activeWorkspaceId}/projects`,
        );

        if (res.data.success) {
          setProjects(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    fetchProjects();
  }, [activeWorkspaceId, isSessionRestored]);

  // 2. Fetch members for the assignee dropdown
  useEffect(() => {
    if (!isSessionRestored || !activeWorkspaceId) return;

    const fetchMembers = async () => {
      if (!activeWorkspaceId) return;
      try {
        const res = await api.get(
          `/api/v1/workspaces/${activeWorkspaceId}/members`,
        );
        console.log("Member", res);

        if (res.data.success) {
          setMembers(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to load members");
      }
    };
    fetchMembers();
  }, [activeWorkspaceId, userInfo, isSessionRestored]);

  // Set default projectId and assigneeId when data loads
  useEffect(() => {
    if (projects.length > 0 && !formData.projectId) {
      setFormData((prev) => ({ ...prev, projectId: projects[0]._id }));
    }
  }, [projects]);

  useEffect(() => {
    if (members.length > 0 && !formData.assigneeId) {
      setFormData((prev) => ({ ...prev, assigneeId: members[0].userId }));
    }
  }, [members]);

  // 3. Fetch tasks
  useEffect(() => {
    if (!isSessionRestored || !activeWorkspaceId) return;

    const fetchTasks = async () => {
      if (!activeWorkspaceId) {
        setTasks([]);
        setIsLoadingTasks(false);
        return;
      }

      setIsLoadingTasks(true);
      try {
        let projectIds = projects.map((p) => p._id);
        if (selectedProjectId !== "all") {
          projectIds = [selectedProjectId];
        }

        if (projectIds.length === 0) {
          setTasks([]);
          setIsLoadingTasks(false);
          return;
        }

        const promises = projectIds.map((id) =>
          api.get(
            `/api/v1/workspaces/${activeWorkspaceId}/projects/${id}/tasks`,
          ),
        );

        const results = await Promise.all(promises);
        const allTasks = results.flatMap((res) => res.data.data || []);
        setTasks(allTasks);
      } catch (error) {
        toast.error("Failed to load tasks");
      } finally {
        setIsLoadingTasks(false);
      }
    };

    fetchTasks();
  }, [activeWorkspaceId, projects, selectedProjectId, isSessionRestored]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.status !== "all" && task.status !== filters.status)
        return false;
      // Compare lowercase to match backend schema
      if (
        filters.priority !== "all" &&
        task.priority?.toLowerCase() !== filters.priority
      )
        return false;
      return true;
    });
  }, [tasks, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.projectId || !formData.assigneeId) {
      toast.error("Please select a project and assignee");
      return;
    }
    setIsSubmitting(true);

    try {
      // Payload now perfectly matches your required JSON schema
      const res = await api.post(
        `/api/v1/workspaces/${activeWorkspaceId}/tasks`,
        formData,
      );

      if (res.data.success) {
        setTasks([res.data.data, ...tasks]);
        setShowModal(false);
        setFormData({
          title: "",
          description: "",
          projectId: projects[0]?._id || "",
          assigneeId: members[0]?.userId,
          priority: "medium",
          dueDate: "",
        });
        toast.success("Task created successfully");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create task";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusClasses = (status) => {
    if (status === "Done") return "bg-[#0344a6]/10 text-[#0344a6]";
    if (status === "Blocked") return "bg-[#172b4d]/10 text-[#172b4d]";
    return "bg-slate-100 text-[#172b4d]";
  };

  const getPriorityClasses = (priority) => {
    const p = priority?.toLowerCase();
    if (p === "high") return "text-[#172b4d]";
    if (p === "medium") return "text-[#172b4d]/60";
    return "text-[#172b4d]/40";
  };

  const formatPriority = (priority) => {
    if (!priority) return "Medium";
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#172b4d]">Tasks</h1>
          <p className="text-[#172b4d]/60 mt-1">
            Track daily execution and team workload.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={projects.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0344a6] text-white text-sm font-semibold rounded-lg hover:bg-[#0344a6]/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" /> New Task
        </button>
      </div>

      {/* Functional Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm font-medium text-[#172b4d]">
          <Filter className="h-4 w-4" /> Filters:
        </div>

        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#172b4d] focus:outline-none focus:ring-2 focus:ring-[#0344a6]"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#172b4d] focus:outline-none focus:ring-2 focus:ring-[#0344a6]"
        >
          <option value="all">All Statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Blocked">Blocked</option>
          <option value="Done">Done</option>
        </select>

        <select
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#172b4d] focus:outline-none focus:ring-2 focus:ring-[#0344a6]"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {(filters.status !== "all" ||
          filters.priority !== "all" ||
          selectedProjectId !== "all") && (
          <button
            onClick={() => {
              setFilters({ status: "all", priority: "all" });
              setSelectedProjectId("all");
            }}
            className="text-sm text-[#0344a6] hover:underline font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoadingTasks ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-[#0344a6]" />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[#172b4d]/60 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Task</th>
                  <th className="px-6 py-3 hidden md:table-cell">Project</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Assignee</th>
                  <th className="px-6 py-3 hidden sm:table-cell">Priority</th>
                  <th className="px-6 py-3 hidden md:table-cell">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr
                      key={task._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <CheckSquare className="w-4 h-4 text-[#172b4d]/40 flex-shrink-0" />
                          <span className="text-sm font-medium text-[#172b4d]">
                            {task.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#172b4d]/60 hidden md:table-cell">
                        {task.project?.name || task.project}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="w-6 h-6 rounded-full bg-[#0344a6]/10 text-[#0344a6] text-xs font-bold flex items-center justify-center">
                          {task.assignee?.name?.charAt(0) || "U"}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <div
                          className={`flex items-center gap-1.5 text-sm font-medium ${getPriorityClasses(task.priority)}`}
                        >
                          <Flag className="w-3 h-3" />
                          {formatPriority(task.priority)}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-[#172b4d]/60">
                          <Calendar className="w-3 h-3" />
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "TBD"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${getStatusClasses(task.status)}`}
                        >
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-sm text-[#172b4d]/60"
                    >
                      {projects.length === 0
                        ? "Create a project first to start adding tasks."
                        : "No tasks match your current filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172b4d]/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-[#172b4d]">Create Task</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#172b4d]/40 hover:text-[#172b4d]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#172b4d] mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent"
                  placeholder="e.g. Design new homepage hero section"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#172b4d] mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent resize-none"
                  placeholder="Add more details about this task..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#172b4d] mb-1.5">
                    Project
                  </label>
                  <select
                    name="projectId"
                    required
                    value={formData.projectId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent"
                  >
                    <option value="" disabled>
                      Select a project
                    </option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#172b4d] mb-1.5">
                    Assignee
                  </label>
                  <select
                    name="assigneeId"
                    required
                    value={formData.assigneeId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent"
                  >
                    <option value="" disabled>
                      Select a member
                    </option>
                    {members.map((m) => (
                      <option key={m.userId} value={m.userId}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#172b4d] mb-1.5">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#172b4d] mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-[#172b4d] font-semibold rounded-lg border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-2.5 bg-[#0344a6] hover:bg-[#0344a6]/90 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Create Task"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
