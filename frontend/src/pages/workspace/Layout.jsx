import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  Menu,
  X,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import api from "../../utils/axiosinstance";
import toast from "react-hot-toast";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo, workspaceName, clearAuth } = useAuthStore();

  const navItems = [
    { path: "/workspace", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/workspace/projects", icon: FolderKanban, label: "Projects" },
    { path: "/workspace/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/workspace/members", icon: Users, label: "Members" },
  ];

  const handleLogout = async () => {
    const res = await api.delete("/api/v1/users/sessions");
    if (res.data.success) {
      toast.success(res.data.message, {
        style: { borderRadius: "10px", background: "#25671E", color: "#fff" },
      });

      clearAuth();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <Link to={"/"} className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-[#0344a6]" />
            <span className="text-lg font-bold text-[#172b4d]">Clarity</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-[#172b4d]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#0344a6]/10 text-[#0344a6]"
                    : "text-[#172b4d]/70 hover:bg-blue-100 hover:text-[#172b4d]"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-[#172b4d]"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-[#172b4d]">
              {workspaceName}
            </h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#0344a6] flex items-center justify-center text-white text-sm font-bold">
                {userInfo?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="hidden sm:block text-sm font-medium text-[#172b4d]">
                {userInfo?.username || "User"}
              </span>
              <ChevronDown className="h-4 w-4 text-[#172b4d]/60" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#172b4d] hover:bg-slate-50">
                  <Users className="h-4 w-4" /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#172b4d] hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
