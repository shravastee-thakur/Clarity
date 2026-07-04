import { useState, useEffect } from "react";
import {
  Plus,
  FolderKanban,
  Calendar,
  MoreHorizontal,
  X,
  Loader2,
} from "lucide-react";
import api from "../../utils/axiosinstance";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

const Projects = () => {
  const { activeWorkspaceId } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      if (!activeWorkspaceId) return;
      setIsLoading(true);
      try {
        const res = await api.get(
          `/api/v1/workspaces/${activeWorkspaceId}/projects`,
        );
        if (res.data.success) {
          setProjects(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [activeWorkspaceId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.post(
        `/api/v1/workspaces/${activeWorkspaceId}/projects`,
        formData,
      );

      if (res.data.success) {
        setProjects([res.data.data, ...projects]);
        setShowModal(false);
        setFormData({ name: "", description: "", startDate: "", endDate: "" });
        toast.success("Project created successfully");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create project";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusClasses = (status) => {
    return status === "Active"
      ? "bg-[#0344a6]/10 text-[#0344a6]"
      : "bg-[#172b4d]/10 text-[#172b4d]";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0344a6]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#172b4d]">Projects</h1>
          <p className="text-[#172b4d]/60 mt-1">
            Manage your team initiatives.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0344a6] text-white text-sm font-semibold rounded-lg hover:bg-[#0344a6]/90 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
          <FolderKanban className="w-12 h-12 text-[#172b4d]/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#172b4d]">
            No projects yet
          </h3>
          <p className="text-[#172b4d]/60 mt-1">
            Create your first project to start tracking tasks.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#0344a6]/10 flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-[#0344a6]" />
                </div>
                <button className="text-[#172b4d]/40 hover:text-[#172b4d]">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-[#172b4d] mb-1">
                {project.name}
              </h3>
              <p className="text-sm text-[#172b4d]/60 mb-4">
                {project.taskCount || 0} tasks
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${getStatusClasses(project.status)}`}
                >
                  {project.status}
                </span>
                <div className="flex items-center gap-1 text-xs text-[#172b4d]/60">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : "No date"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172b4d]/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-[#172b4d]">
                Create Project
              </h2>
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
                  Project Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent"
                  placeholder="e.g. Q3 Marketing Campaign"
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
                  placeholder="What is the goal of this project?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#172b4d] mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#172b4d] mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
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
                    "Create Project"
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

export default Projects;
