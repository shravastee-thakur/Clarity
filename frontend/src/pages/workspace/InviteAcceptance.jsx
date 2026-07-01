import { useState } from "react";
import { UserCheck, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosinstance";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

const InviteAcceptance = () => {
  const navigate = useNavigate();
  const { userInfo, setWorkspaceStatus } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await api.post("/api/v1/users/invites/accept");

      setWorkspaceStatus("active");
      toast.success("Welcome to the workspace!", {
        style: { borderRadius: "10px", background: "#25671E", color: "#fff" },
      });

      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to accept invite.";
      toast.error(message, {
        style: { borderRadius: "10px", background: "#B91C1C", color: "#fff" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-300 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0344a6]/10 text-[#0344a6] mb-4">
            <UserCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-[#172b4d] mb-2">
            You are invited
          </h1>
          <p className="text-[#172b4d]/60 text-sm">
            An administrator has invited{" "}
            <span className="font-semibold text-[#172b4d]">
              {userInfo?.email}
            </span>{" "}
            to join their workspace.
          </p>
        </div>

        <button
          onClick={handleAccept}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-all duration-200 bg-[#0344a6] hover:bg-[#0344a6]/90 text-white shadow-lg shadow-[#0344a6]/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:ring-offset-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Joining...
            </>
          ) : (
            "Accept Invitation"
          )}
        </button>

        <p className="mt-6 text-center text-xs text-[#172b4d]/50">
          By accepting, you agree to your company workspace terms.
        </p>
      </div>
    </div>
  );
};

export default InviteAcceptance;
