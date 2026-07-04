import { useState } from "react";
import {
  Loader2,
  CheckSquare,
  Layers,
  Users,
  ArrowRight,
  Link2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosinstance";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

const WorkspaceSetup = () => {
  const navigate = useNavigate();
  const { setWorkspaceStatus, setActiveWorkspaceId } = useAuthStore();

  const [formData, setFormData] = useState({ name: "", slug: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Auto-generate URL-friendly slug from the name
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, ""); // Remove special characters
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      name,
      slug: generateSlug(name), // Auto-updates slug as they type
    });
  };

  const handleSlugChange = (e) => {
    // Allows manual override, but enforces slug rules
    const slug = e.target.value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setFormData({ ...formData, slug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) return;

    setIsLoading(true);
    try {
      const res = await api.post("/api/v1/workspaces", formData);
      console.log(res);

      const workspaceId = res.data.data._id;
      setActiveWorkspaceId(workspaceId);
      setWorkspaceStatus("active");

      toast.success("Workspace created successfully!", {
        style: { borderRadius: "10px", background: "#25671E", color: "#fff" },
      });

      navigate("/workspace");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create workspace.";
      toast.error(message, {
        style: { borderRadius: "10px", background: "#B91C1C", color: "#fff" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Panel: Branding & Context */}
      <div className="bg-[#172b4d] text-white p-6 lg:p-12 relative overflow-hidden lg:w-2/5 lg:min-h-screen flex flex-col justify-between">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#0344a6] rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-[#0344a6] rounded-full blur-3xl opacity-20 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6 lg:mb-12">
            <CheckSquare className="h-7 w-7 text-white" />
            <span className="text-lg lg:text-xl font-bold tracking-tight text-white">
              Clarity
            </span>
          </div>

          <h1 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-4 leading-tight">
            Let's build your <br className="hidden lg:block" /> command center.
          </h1>
          <p className="text-white/70 text-sm lg:text-lg mb-6 lg:mb-10">
            Your workspace is the foundation of your team's productivity.
          </p>

          <div className="hidden lg:block space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Centralized Planning</h3>
                <p className="text-sm text-white/60">
                  Bring all your projects and tasks into one unified view.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Team Collaboration</h3>
                <p className="text-sm text-white/60">
                  Invite your team and assign roles seamlessly.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block mt-12 text-sm text-white/40">
          © 2026 Clarity. Smart. Simple. Secure.
        </div>
      </div>

      {/* Right Panel: The Setup Form */}
      <div className="lg:w-3/5 bg-slate-50 p-6 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#172b4d]">
              Create your workspace
            </h2>
            <p className="text-[#172b4d]/60 mt-2">
              Set up your organization's name and unique web address.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Workspace Name */}
            <div>
              <label
                htmlFor="workspaceName"
                className="block text-sm font-medium text-[#172b4d] mb-1.5"
              >
                Workspace Name
              </label>
              <input
                id="workspaceName"
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Acme Corporation"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-[#172b4d] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent transition-shadow"
              />
            </div>

            {/* Workspace Slug */}
            <div>
              <label
                htmlFor="workspaceSlug"
                className="block text-sm font-medium text-[#172b4d] mb-1.5"
              >
                Workspace URL
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="workspaceSlug"
                  type="text"
                  required
                  value={formData.slug}
                  onChange={handleSlugChange}
                  placeholder="acme-corporation"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-[#172b4d] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent transition-shadow font-mono text-sm"
                />
              </div>
              <p className="mt-1.5 text-xs text-[#172b4d]/50">
                This will be used in your dashboard URL:{" "}
                <span className="font-mono">
                  clarity.app/{formData.slug || "your-workspace"}
                </span>
              </p>
            </div>

            <button
              type="submit"
              disabled={
                isLoading || !formData.name.trim() || !formData.slug.trim()
              }
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-all duration-200 bg-[#0344a6] hover:bg-[#0344a6]/90 text-white shadow-lg shadow-[#0344a6]/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:ring-offset-2 mt-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  Create Workspace <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-[#172b4d]/50">
            By creating a workspace, you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSetup;
