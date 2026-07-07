import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const WorkspaceGuard = () => {
  const {
    accessToken,
    isVerified,
    workspaceStatus,
    setAccessToken,
    setIsSessionRestored,
    clearAuth,
  } = useAuthStore();

  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (accessToken) {
        setIsSessionRestored(true);
        setIsChecking(false);
        return;
      }

      if (isVerified) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/tokens`,
            {},
            { withCredentials: true },
          );

          const newAccessToken = res.data.accessToken;
          setAccessToken(newAccessToken);

          if (res.data.user) {
            const { workspaceStatus, activeWorkspaceId, activeWorkspaceRole } =
              res.data.user;
            useAuthStore.getState().setWorkspaceStatus(workspaceStatus);
            useAuthStore.getState().setActiveWorkspaceId(activeWorkspaceId);
            useAuthStore.getState().setWorkspaceRole(activeWorkspaceRole);
          }

          setIsSessionRestored(true); // <--- SIGNAL THAT SESSION IS READY
          setIsChecking(false);
        } catch (error) {
          console.error(
            "Silent refresh failed:",
            error.response?.data || error.message,
          );
          clearAuth();
          setIsSessionRestored(true); // <--- EVEN ON FAILURE, STOP WAITING
          setIsChecking(false);
        }
      } else {
        setIsSessionRestored(true);
        setIsChecking(false);
      }
    };

    checkSession();
  }, [
    accessToken,
    isVerified,
    setAccessToken,
    clearAuth,
    setIsSessionRestored,
  ]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#0344a6]" />
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    workspaceStatus === "setup" &&
    !location.pathname.startsWith("/workspace/setup")
  ) {
    return <Navigate to="/workspace/setup" replace />;
  }

  if (
    workspaceStatus === "active" &&
    (location.pathname.includes("/workspace/setup") ||
      location.pathname.includes("/workspace/invite"))
  ) {
    return <Navigate to="/workspace" replace />;
  }

  return <Outlet />;
};

export default WorkspaceGuard;
