import { useState } from "react";
import { Clock, RefreshCw, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosinstance";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

const PendingAccess = () => {
  const navigate = useNavigate();
  const { clearAuth, setWorkspaceStatus, setActiveWorkspaceId } =
    useAuthStore();
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const res = await api.get("/api/v1/users/context");
      const { workspaceStatus, activeWorkspaceId } = res.data.user;

      if (workspaceStatus === "active") {
        setWorkspaceStatus("active");
        setActiveWorkspaceId(activeWorkspaceId);
        toast.success("Access granted! Redirecting...", {
          style: { borderRadius: "10px", background: "#25671E", color: "#fff" },
        });
        navigate("/");
      } else if (workspaceStatus === "invited") {
        setWorkspaceStatus("invited");
        navigate("/workspace/invite");
      } else {
        toast("No updates yet. Please wait for an admin to invite you.", {
          icon: "⏳",
          style: { borderRadius: "10px", background: "#172b4d", color: "#fff" },
        });
      }
    } catch (error) {
      toast.error("Failed to check status.", {
        style: { borderRadius: "10px", background: "#B91C1C", color: "#fff" },
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-300 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0344a6]/10 text-[#0344a6] mb-4">
            <Clock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-[#172b4d] mb-2">
            Pending Access
          </h1>
          <p className="text-[#172b4d]/60 text-sm">
            Your account is created, but you need an invitation from your
            workspace administrator to proceed.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={checkStatus}
            disabled={isChecking}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-all duration-200 bg-[#0344a6] hover:bg-[#0344a6]/90 text-white shadow-lg shadow-[#0344a6]/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:ring-offset-2"
          >
            {isChecking ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" /> Checking...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5" /> Check for Updates
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-[#172b4d] hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingAccess;
