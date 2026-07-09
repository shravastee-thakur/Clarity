import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Filter,
  CheckSquare,
  Flag,
  Calendar,
  X,
  Loader2,
  Edit,
} from "lucide-react";
import api from "../../utils/axiosinstance";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

const Tasks = () => {
  const { activeWorkspaceId, isSessionRestored, activeWorkspaceRole } =
    useAuthStore();
  const isAdmin = activeWorkspaceRole === "admin";

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState("all");

  const [filters, setFilters] = useState({ status: "all", priority: "all" });
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assigneeId: "",
    priority: "medium",
    dueDate: "",
  });

  // 1. Fetch projects and members (Admin Only)
  useEffect(() => {
    if (!isSessionRestored || !activeWorkspaceId || !isAdmin) return;

    const fetchAdminData = async () => {
      try {
        const [projRes, memRes] = await Promise.all([
          api.get(`/api/v1/workspaces/${activeWorkspaceId}/projects`),
          api.get(`/api/v1/workspaces/${activeWorkspaceId}/members`),
        ]);
        if (projRes.data.success) setProjects(projRes.data.data);
        if (memRes.data.success) setMembers(memRes.data.data);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      }
    };
    fetchAdminData();
  }, [activeWorkspaceId, isSessionRestored, isAdmin]);

  useEffect(() => {
    if (isAdmin && !editingTask) {
      if (projects.length > 0 && !formData.projectId) {
        setFormData((prev) => ({ ...prev, projectId: projects[0]._id }));
      }
      if (members.length > 0 && !formData.assigneeId) {
        setFormData((prev) => ({
          ...prev,
          assigneeId: members[0].userId || members[0]._id,
        }));
      }
    }
  }, [projects, members, isAdmin, editingTask]);

  // 2. Fetch tasks
  useEffect(() => {
    if (!isSessionRestored || !activeWorkspaceId) return;
    if (isAdmin && projects.length === 0) return;

    const fetchTasks = async () => {
      setIsLoadingTasks(true);
      try {
        if (isAdmin) {
          let projectIds = projects.map((p) => p._id);
          if (selectedProjectId !== "all") projectIds = [selectedProjectId];
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
          setTasks(results.flatMap((res) => res.data.data || []));
        } else {
          const res = await api.get(
            `/api/v1/workspaces/${activeWorkspaceId}/tasks/me`,
          );
          setTasks(res.data.data || []);
        }
      } catch (error) {
        toast.error("Failed to load tasks");
      } finally {
        setIsLoadingTasks(false);
      }
    };
    fetchTasks();
  }, [
    activeWorkspaceId,
    projects,
    selectedProjectId,
    isSessionRestored,
    isAdmin,
  ]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.status !== "all" && task.status !== filters.status)
        return false;
      if (
        filters.priority !== "all" &&
        task.priority?.toLowerCase() !== filters.priority
      )
        return false;
      return true;
    });
  }, [tasks, filters]);

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Employee Status Update (Optimistic UI)
  const handleStatusChange = async (taskId, newStatus) => {
    const originalTasks = [...tasks];
    setTasks(
      tasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
    );

    try {
      const res = await api.patch(
        `/api/v1/workspaces/${activeWorkspaceId}/tasks/${taskId}`,
        { status: newStatus },
      );
      if (res.data.success) {
        toast.success(res.data.message, {
          style: { borderRadius: "10px", background: "#25671E", color: "#fff" },
        });
      }
    } catch (err) {
      setTasks(originalTasks);
      toast.error("Failed to update status");
      let message = "Something went wrong. Please try again.";
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err) {
        message = err.message;
      }
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      projectId: task.project?._id || task.project,
      assigneeId: task.assignee?._id || task.assignee,
      priority: task.priority || "medium",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.projectId || !formData.assigneeId) {
      toast.error("Please select a project and assignee");
      return;
    }
    setIsSubmitting(true);

    try {
      if (editingTask) {
        const res = await api.patch(
          `/api/v1/workspaces/${activeWorkspaceId}/tasks/${editingTask._id}`,
          formData,
        );
        if (res.data.success) {
          setTasks(
            tasks.map((t) => (t._id === editingTask._id ? res.data.data : t)),
          );
          toast.success(res.data.message, {
            style: {
              borderRadius: "10px",
              background: "#25671E",
              color: "#fff",
            },
          });
        }
      } else {
        const res = await api.post(
          `/api/v1/workspaces/${activeWorkspaceId}/tasks`,
          formData,
        );
        if (res.data.success) {
          setTasks([res.data.data, ...tasks]);
          toast.success(res.data.message, {
            style: {
              borderRadius: "10px",
              background: "#25671E",
              color: "#fff",
            },
          });
        }
      }
      handleCloseModal();
    } catch (err) {
      let message = "Something went wrong. Please try again.";
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err) {
        message = err.message;
      }
      toast.error(message, {
        style: { borderRadius: "10px", background: "#25671E", color: "#fff" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      projectId: projects[0]?._id || "",
      assigneeId: members[0]?.userId || members[0]?._id || "",
      priority: "medium",
      dueDate: "",
    });
  };

  // --- UI HELPERS ---

  // Converts backend enums ("in_progress") to display text ("In Progress")
  const formatStatus = (status) => {
    if (!status) return "To Do";
    return status
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatPriority = (priority) => {
    if (!priority) return "Medium";
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const getStatusClasses = (status) => {
    const s = status?.toLowerCase();
    if (s === "done") return "bg-[#0344a6]/10 text-[#0344a6]";
    if (s === "blocked") return "bg-[#172b4d]/10 text-[#172b4d]";
    return "bg-slate-100 text-[#172b4d]";
  };

  const getPriorityClasses = (priority) => {
    const p = priority?.toLowerCase();
    if (p === "high") return "text-[#172b4d]";
    if (p === "medium") return "text-[#172b4d]/60";
    return "text-[#172b4d]/40";
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#172b4d]">Tasks</h1>
          <p className="text-[#172b4d]/60 mt-1">
            {isAdmin
              ? "Manage workspace execution and team workload."
              : "Track your daily execution and deliverables."}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setEditingTask(null);
              setShowModal(true);
            }}
            disabled={projects.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0344a6] text-white text-sm font-semibold rounded-lg hover:bg-[#0344a6]/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" /> New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm font-medium text-[#172b4d]">
          <Filter className="h-4 w-4" /> Filters:
        </div>
        {isAdmin && (
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
        )}

        {/* UPDATED: Status filter uses backend enum values */}
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#172b4d] focus:outline-none focus:ring-2 focus:ring-[#0344a6]"
        >
          <option value="all">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="blocked">Blocked</option>
          <option value="done">Done</option>
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
      </div>

      {/* Tasks Table */}
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
                  {isAdmin && (
                    <th className="px-6 py-3 hidden lg:table-cell">Assignee</th>
                  )}
                  <th className="px-6 py-3 hidden sm:table-cell">Priority</th>
                  <th className="px-6 py-3 hidden md:table-cell">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                  {isAdmin && <th className="px-6 py-3 w-10"></th>}
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
                      {isAdmin && (
                        <td className="px-6 py-4 hidden lg:table-cell text-sm text-[#172b4d]/80">
                          {task.assignee?.name}
                        </td>
                      )}
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
                        {/* EMPLOYEE: Inline Status Dropdown */}
                        {!isAdmin ? (
                          <select
                            value={task.status}
                            onChange={(e) =>
                              handleStatusChange(task._id, e.target.value)
                            }
                            className={`text-xs font-semibold px-2 py-1 rounded border-none focus:ring-2 focus:ring-[#0344a6] cursor-pointer ${getStatusClasses(task.status)}`}
                          >
                            {/* UPDATED: Values match backend schema exactly */}
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="blocked">Blocked</option>
                            <option value="done">Done</option>
                          </select>
                        ) : (
                          /* ADMIN: Static Badge */
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${getStatusClasses(task.status)}`}
                          >
                            {formatStatus(task.status)}
                          </span>
                        )}
                      </td>

                      {isAdmin && (
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleEditClick(task)}
                            className="text-[#172b4d]/40 hover:text-[#0344a6] transition-colors p-1"
                            aria-label="Edit task"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={isAdmin ? 7 : 5}
                      className="px-6 py-12 text-center text-sm text-[#172b4d]/60"
                    >
                      {isAdmin && projects.length === 0
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

      {/* ADMIN: Create/Edit Modal */}
      {isAdmin && showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172b4d]/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-[#172b4d]">
                {editingTask ? "Edit Task" : "Create Task"}
              </h2>
              <button
                onClick={handleCloseModal}
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
                    {members.map((m) => (
                      <option key={m.userId || m._id} value={m.userId || m._id}>
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
                  onClick={handleCloseModal}
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
                  ) : editingTask ? (
                    "Update Task"
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
