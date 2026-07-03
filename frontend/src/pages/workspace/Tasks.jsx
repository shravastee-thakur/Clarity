import { useState, useMemo } from "react";
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

const Tasks = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Fix authentication bug",
      project: "Backend API",
      assignee: "Alex",
      priority: "High",
      status: "In Progress",
      dueDate: "2026-07-05",
    },
    {
      id: 2,
      title: "Design onboarding flow",
      project: "Mobile App",
      assignee: "Sarah",
      priority: "Medium",
      status: "To Do",
      dueDate: "2026-07-10",
    },
    {
      id: 3,
      title: "Update database schema",
      project: "Backend API",
      assignee: "John",
      priority: "Low",
      status: "Done",
      dueDate: "2026-07-02",
    },
    {
      id: 4,
      title: "Write API documentation",
      project: "Backend API",
      assignee: "Alex",
      priority: "Medium",
      status: "Blocked",
      dueDate: "2026-07-08",
    },
  ]);

  const [filters, setFilters] = useState({ status: "all", priority: "all" });
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    project: "",
    priority: "Medium",
    dueDate: "",
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.status !== "all" && task.status !== filters.status)
        return false;
      if (filters.priority !== "all" && task.priority !== filters.priority)
        return false;
      return true;
    });
  }, [tasks, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Replace with actual API call: await api.post('/api/v1/tasks', formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newTask = {
        id: Date.now(),
        title: formData.title,
        project: formData.project || "Unassigned",
        assignee: "You",
        priority: formData.priority,
        status: "To Do",
        dueDate: formData.dueDate || "TBD",
      };

      setTasks([newTask, ...tasks]);
      setShowModal(false);
      setFormData({ title: "", project: "", priority: "Medium", dueDate: "" });
      toast.success("Task created successfully");
    } catch (error) {
      toast.error("Failed to create task");
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
    if (priority === "High") return "text-[#172b4d]";
    if (priority === "Medium") return "text-[#172b4d]/60";
    return "text-[#172b4d]/40";
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172b4d]">Tasks</h1>
          <p className="text-[#172b4d]/60 mt-1">
            Track daily execution and team workload.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0344a6] text-white text-sm font-semibold rounded-lg hover:bg-[#0344a6]/90 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> New Task
        </button>
      </div>

      {/* Functional Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-[#172b4d]">
          <Filter className="h-4 w-4" /> Filters:
        </div>
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
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        {(filters.status !== "all" || filters.priority !== "all") && (
          <button
            onClick={() => setFilters({ status: "all", priority: "all" })}
            className="text-sm text-[#0344a6] hover:underline font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
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
                    key={task.id}
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
                      {task.project}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="w-6 h-6 rounded-full bg-[#0344a6]/10 text-[#0344a6] text-xs font-bold flex items-center justify-center">
                        {task.assignee.charAt(0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div
                        className={`flex items-center gap-1.5 text-sm font-medium ${getPriorityClasses(task.priority)}`}
                      >
                        <Flag className="w-3 h-3" />
                        {task.priority}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-[#172b4d]/60">
                        <Calendar className="w-3 h-3" />
                        {task.dueDate}
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
                    No tasks match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                  placeholder="e.g. Fix login redirect issue"
                />
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
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
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
