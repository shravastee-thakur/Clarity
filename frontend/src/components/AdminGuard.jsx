import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const AdminGuard = () => {
  const { activeWorkspaceRole } = useAuthStore();

  if (activeWorkspaceRole !== "admin") {
    return <Navigate to="/workspace" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;
