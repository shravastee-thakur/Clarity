import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainLayout from "./components/MainLayout";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
// import WorkspaceGuard from "./components/WorkspaceGuard";

import Home from "./pages/Home";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyResetOtp from "./pages/auth/VerifyResetOtp";

import WorkspaceSetup from "./pages/workspace/WorkspaceSetup";
import InviteAcceptance from "./pages/workspace/InviteAcceptance";
import PendingAccess from "./pages/workspace/PendingAccess";
import Pricing from "./pages/Pricing";
import Layout from "./pages/workspace/Layout";
import Dashboard from "./pages/workspace/Dashboard";
import Projects from "./pages/workspace/Projects";
import Tasks from "./pages/workspace/Tasks";

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verifyOtp" element={<VerifyOtp />} />

        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/verifyResetOtp/:email" element={<VerifyResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* <Route element={<WorkspaceGuard />}> */}
        <Route path="/workspace/setup" element={<WorkspaceSetup />} />
        <Route path="/workspace/invite" element={<InviteAcceptance />} />
        <Route path="/workspace/pending" element={<PendingAccess />} />
        {/* </Route> */}

        <Route path="/workspace" element={<Layout />}>
          {/* Index route makes Dashboard show up by default at "/" */}
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
