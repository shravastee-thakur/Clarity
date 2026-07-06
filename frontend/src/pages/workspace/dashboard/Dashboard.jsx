import { useAuthStore } from "../../../store/authStore";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

const Dashboard = () => {
  const { activeWorkspaceRole } = useAuthStore();

  if (activeWorkspaceRole === "admin") {
    return <AdminDashboard />;
  }

  return <EmployeeDashboard />;
};

export default Dashboard;
