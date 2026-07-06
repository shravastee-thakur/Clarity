import { useAuthStore } from "../../../store/authStore";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

const Dashboard = () => {
  const { role } = useAuthStore();

  if (role === "admin") {
    return <AdminDashboard />;
  }

  return <EmployeeDashboard />;
};

export default Dashboard;
