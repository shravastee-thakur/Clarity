import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Public & Auth
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyResetOtp from "./pages/auth/VerifyResetOtp";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Pricing from "./pages/Pricing";
import Home from "./pages/Home";

// Layouts
import MainLayout from "./components/MainLayout"; // Public Navbar
import WorkspaceLayout from "./pages/workspace/Layout"; // Sidebar
import WorkspaceGuard from "./components/WorkspaceGuard";

// Onboarding (No Sidebar)
import WorkspaceSetup from "./pages/workspace/WorkspaceSetup";

// Application (With Sidebar)
import Dashboard from "./pages/workspace/dashboard/Dashboard";
import Projects from "./pages/workspace/Projects";
import Tasks from "./pages/workspace/Tasks";
import VerifyMagic from "./pages/auth/VerifyMagic";
import AcceptInvite from "./pages/workspace/AcceptInvite";
import Members from "./pages/workspace/Members";

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
        </Route>

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* --- AUTH ROUTES --- */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-otp/:email" element={<VerifyResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/magic-link" element={<VerifyMagic />} />
        <Route path="/accept-invite" element={<AcceptInvite />} />

        {/* --- PROTECTED ROUTES --- */}
        <Route element={<WorkspaceGuard />}>
          <Route path="/workspace/setup" element={<WorkspaceSetup />} />

          {/* Active Workspace (Sidebar layout) */}
          <Route path="/workspace" element={<WorkspaceLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="members" element={<Members />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
