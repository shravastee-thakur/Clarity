import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const GuestGuard = () => {
  const { accessToken } = useAuthStore();

  // If user is already logged in, kick them out of public auth pages
  if (accessToken) {
    return <Navigate to="/workspace" replace />;
  }

  return <Outlet />;
};

export default GuestGuard;
