import { useState } from "react";
import {
  Building2,
  Loader2,
  CheckSquare,
  Layers,
  Users,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosinstance";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

const WorkspaceSetup = () => {
  const navigate = useNavigate();
  const { setWorkspaceStatus, setActiveWorkspaceId } = useAuthStore();

  const [workspaceName, setWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workspaceName.trim()) return;

    setIsLoading(true);
    try {
      const res = await api.post("/api/v1/workspaces", { name: workspaceName });

      const workspaceId = res.data.workspaceId;

      setActiveWorkspaceId(workspaceId);
      setWorkspaceStatus("active");

      toast.success("Workspace created successfully!", {
        style: { borderRadius: "10px", background: "#25671E", color: "#fff" },
      });

      navigate("/");
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
      {/* Left Panel: Branding & Context (The "New Territory" Vibe) */}
      <div className="bg-[#172b4d] text-white p-6 lg:p-12 relative overflow-hidden lg:w-2/5 lg:min-h-screen flex flex-col justify-between">
        {/* Subtle background accents using strict palette */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#0344a6] rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-[#0344a6] rounded-full blur-3xl opacity-20 pointer-events-none" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6 lg:mb-12">
            <CheckSquare className="h-7 w-7 text-white" />
            <span className="text-lg lg:text-xl font-bold tracking-tight text-white">
              Clarity
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-4 leading-tight">
            Let's build your <br className="hidden lg:block" /> command center.
          </h1>
          <p className="text-white/70 text-sm lg:text-lg mb-6 lg:mb-10">
            Your workspace is the foundation of your team's productivity.
          </p>

          {/* Feature Highlights - Hidden on mobile to keep the header compact */}
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

        {/* Footer - Hidden on mobile */}
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
              This is where your team will collaborate. You can always change
              these settings later.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="e.g. Acme Corporation"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-[#172b4d] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent transition-shadow"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !workspaceName.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-all duration-200 bg-[#0344a6] hover:bg-[#0344a6]/90 text-white shadow-lg shadow-[#0344a6]/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:ring-offset-2"
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
