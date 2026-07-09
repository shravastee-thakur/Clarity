import { useState, useEffect } from "react";
import {
  Plus,
  FolderKanban,
  Calendar,
  MoreHorizontal,
  X,
  Loader2,
  Edit,
} from "lucide-react";
import api from "../../utils/axiosinstance";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

const Projects = () => {
  const { activeWorkspaceId, isSessionRestored } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // Tracks edit mode
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!isSessionRestored || !activeWorkspaceId) return;

    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(
          `/api/v1/workspaces/${activeWorkspaceId}/projects`,
        );
        if (res.data.success) setProjects(res.data.data);
      } catch (error) {
        toast.error("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [activeWorkspaceId, isSessionRestored]);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({ name: "", description: "", startDate: "", endDate: "" });
    setShowModal(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || "",
      startDate: project.startDate
        ? new Date(project.startDate).toISOString().split("T")[0]
        : "",
      endDate: project.endDate
        ? new Date(project.endDate).toISOString().split("T")[0]
        : "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingProject) {
        // UPDATE
        const res = await api.patch(
          `/api/v1/workspaces/${activeWorkspaceId}/projects/${editingProject._id}`,
          formData,
        );
        if (res.data.success) {
          setProjects(
            projects.map((p) =>
              p._id === editingProject._id ? { ...p, ...res.data.data } : p,
            ),
          );
          toast.success("Project updated");
        }
      } else {
        // CREATE
        const res = await api.post(
          `/api/v1/workspaces/${activeWorkspaceId}/projects`,
          formData,
        );
        if (res.data.success) {
          setProjects([res.data.data, ...projects]);
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
      toast.error("Failed to update status");
      let message = "Something went wrong. Please try again.";
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err) {
        message = err.message;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0344a6]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172b4d]">Projects</h1>
          <p className="text-[#172b4d]/60 mt-1">
            Manage your team initiatives.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0344a6] text-white text-sm font-semibold rounded-lg hover:bg-[#0344a6]/90 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#39B1D1]/20 flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-[#0344a6]" />
                </div>
                <button
                  onClick={() => handleOpenEdit(project)}
                  className="text-[#172b4d]/40 hover:text-[#0344a6] transition-colors p-1"
                  aria-label="Edit project"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-[#172b4d] mb-1">
                {project.name}
              </h3>
              <p className="text-sm text-[#172b4d]/60 mb-4">
                {project.totalTasks || 0} tasks
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${project.status === "active" ? "bg-[#91D06C]/20 text-[#0344a6]" : "bg-slate-100 text-[#172b4d]"}`}
                >
                  {project.status === "active" ? "Active" : "Archived"}
                </span>
                <div className="flex items-center gap-1 text-xs text-[#172b4d]/60">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : "No deadline"}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200">
            <FolderKanban className="w-12 h-12 text-[#172b4d]/10 mx-auto mb-4" />
            <p className="text-[#172b4d]/60">
              No projects yet. Create one to get started.
            </p>
          </div>
        )}
      </div>

      {/* Modal (Shared for Create and Edit) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172b4d]/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-[#172b4d]">
                {editingProject ? "Edit Project" : "Create Project"}
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
                  Project Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent"
                  placeholder="e.g. Q3 Marketing"
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
                  placeholder="Project goals..."
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
                  ) : editingProject ? (
                    "Save Changes"
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
