import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainLayout from "./components/MainLayout";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";

import Home from "./pages/Home";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyResetOtp from "./pages/auth/VerifyResetOtp";

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verifyOtp" element={<VerifyOtp />} />

        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/verifyResetOtp" element={<VerifyResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
