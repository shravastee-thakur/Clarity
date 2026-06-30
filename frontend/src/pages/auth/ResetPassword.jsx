import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp } = location.state || {};

  useEffect(() => {
    if (!email || !otp) navigate("/forgot-password");
  }, [email, otp, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    // Simulate API call to update password with email, otp, newPassword
    setTimeout(() => {
      setIsLoading(false);
      navigate("/login", {
        state: { message: "Password reset successfully. Please log in." },
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#0344a6]/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-7 w-7 text-[#0344a6]" />
          </div>
          <h1 className="text-xl font-semibold text-[#172b4d]">
            Set new password
          </h1>
          <p className="text-sm text-[#172b4d]/60 mt-1 text-center">
            Your identity is verified. Create a strong new password.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-slate-50 border border-slate-200 text-[#172b4d] text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-[#172b4d] mb-1.5"
            >
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#172b4d]/40" />
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-10 pr-12 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] placeholder-[#172b4d]/40 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#172b4d]/40 hover:text-[#172b4d] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#172b4d] mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#172b4d]/40" />
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] placeholder-[#172b4d]/40 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={
              isLoading || !newPassword || newPassword !== confirmPassword
            }
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#0344a6] text-white font-semibold rounded-lg hover:bg-[#0344a6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:ring-offset-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Updating...
              </>
            ) : (
              <>
                <span>Update Password</span>
                <CheckCircle className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
