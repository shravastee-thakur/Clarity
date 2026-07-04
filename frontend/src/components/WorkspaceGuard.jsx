import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const WorkspaceGuard = () => {
  const { accessToken, workspaceStatus } = useAuthStore();
  const location = useLocation();

  // 1. Block unauthenticated users
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Force admins to setup if they haven't created a workspace
  if (
    workspaceStatus === "setup" &&
    !location.pathname.startsWith("/workspace/setup")
  ) {
    return <Navigate to="/workspace/setup" replace />;
  }

  // 3. Force invited employees to the invite page
  if (
    workspaceStatus === "invited" &&
    !location.pathname.startsWith("/workspace/invite")
  ) {
    return <Navigate to="/workspace/invite" replace />;
  }

  // 4. Prevent active users from accessing onboarding pages
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
