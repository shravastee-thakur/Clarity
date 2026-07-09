import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, AlertCircle, CheckSquare } from "lucide-react";
import api from "../../utils/axiosinstance";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

const VerifyMagic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    setAccessToken,
    setIsVerified,
    setUserInfo,
    setWorkspaceStatus,
    setActiveWorkspaceId,
    setWorkspaceRole,
    setWorkspaceName,
  } = useAuthStore();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await api.post("/api/v1/users/magic-login/verify", {
          token,
        });
        const { accessToken, user } = res.data;
        const {
          workspaceStatus,
          activeWorkspaceId,
          activeWorkspaceRole,
          workspaceName,
        } = user;

        setAccessToken(accessToken);
        setIsVerified(user.isVerified);
        setUserInfo(user);
        setWorkspaceStatus(workspaceStatus);
        setActiveWorkspaceId(activeWorkspaceId);
        setWorkspaceRole(activeWorkspaceRole);
        setWorkspaceName(workspaceName);

        toast.success(res.data.message, {
          style: { borderRadius: "10px", background: "#25671E", color: "#fff" },
        });

        if (workspaceStatus === "setup") navigate("/workspace/setup");
        else if (workspaceStatus === "invited") navigate("/workspace/invite");
        else navigate("/workspace");
      } catch (err) {
        let message = "Something went wrong. Please try again.";
        if (error.response?.data?.message) {
          message = error.response.data.message;
        } else if (error) {
          message = error.message;
        }
        toast.error(message, {
          style: { borderRadius: "10px", background: "#25671E", color: "#fff" },
        });
      }
    };

    verifyToken();
  }, [location.search, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-300 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-bold text-[#172b4d] mb-2">
            Link Expired
          </h1>
          <p className="text-[#172b4d]/60 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-[#0344a6] text-white font-semibold rounded-lg hover:bg-[#0344a6]/90 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-300 flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-2 mb-8">
        <CheckSquare className="h-8 w-8 text-[#0344a6]" />
        <span className="text-2xl font-bold text-[#172b4d] tracking-tight">
          Clarity
        </span>
      </div>
      <Loader2 className="h-10 w-10 animate-spin text-[#0344a6] mb-4" />
      <p className="text-[#172b4d]/60 font-medium">
        Verifying your identity...
      </p>
    </div>
  );
};

export default VerifyMagic;
