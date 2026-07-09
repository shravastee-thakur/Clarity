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

// Layouts & Guards
import MainLayout from "./components/MainLayout";
import WorkspaceLayout from "./pages/workspace/Layout";
import WorkspaceGuard from "./components/WorkspaceGuard";
import GuestGuard from "./components/GuestGuard"; 
import AdminGuard from "./components/AdminGuard"; 
import PageNotFound from "./pages/PageNotFound";

// Onboarding
import WorkspaceSetup from "./pages/workspace/WorkspaceSetup";

// Application
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

        {/* --- AUTH ROUTES (Protected by GuestGuard) --- */}
        <Route element={<GuestGuard />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-otp/:email" element={<VerifyResetOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* --- MAGIC LINKS (No Guard - allows session switching) --- */}
        <Route path="/verify-magic" element={<VerifyMagic />} />
        <Route path="/accept-invite" element={<AcceptInvite />} />

        {/* --- PROTECTED WORKSPACE ROUTES --- */}
        <Route element={<WorkspaceGuard />}>
          <Route path="/workspace/setup" element={<WorkspaceSetup />} />

          <Route path="/workspace" element={<WorkspaceLayout />}>
            <Route index element={<Dashboard />} />

            {/* EMPLOYEE ACCESSIBLE */}
            <Route path="tasks" element={<Tasks />} />

            {/* ADMIN ONLY ACCESSIBLE */}
            <Route element={<AdminGuard />}>
              <Route path="projects" element={<Projects />} />
              <Route path="members" element={<Members />} />
            </Route>
          </Route>
        </Route>

        {/* --- CATCH ALL --- */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
