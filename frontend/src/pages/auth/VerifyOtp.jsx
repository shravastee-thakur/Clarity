import { useState, useEffect } from "react";
import { Shield, CheckCircle, ArrowLeft, AlertCircle } from "lucide-react";
import api from "../../utils/axiosinstance";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const {
    setIsVerified,
    setUserInfo,
    setRole,
    email,
    setAccessToken,
    setWorkspaceStatus,
    setActiveWorkspaceId,
  } = useAuthStore();
  const [otp, setOtp] = useState("");
  const [expiryTime, setExpiryTime] = useState(300); // 5 minutes
  const [isExpiring, setIsExpiring] = useState(false);

  // Handle Expiry Timer
  useEffect(() => {
    if (expiryTime > 0) {
      const timer = setTimeout(() => {
        setExpiryTime(expiryTime - 1);
        if (expiryTime <= 60) setIsExpiring(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [expiryTime]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    console.log(typeof otp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/v1/users/sessions", { email, otp });
      console.log(res);

      if (res.data.success) {
        if (res.data.success) {
          const { accessToken, user } = res.data;
          const { workspaceStatus, activeWorkspaceId } = user;

          setAccessToken(accessToken);
          setIsVerified(user.isVerified);
          setUserInfo(user);
          setRole(user.role);
          setWorkspaceStatus(workspaceStatus);
          setActiveWorkspaceId(activeWorkspaceId);

          toast.success(res.data.message, {
            style: {
              borderRadius: "10px",
              background: "#25671E",
              color: "#fff",
            },
          });

          if (workspaceStatus === "setup") navigate("/workspace/setup");
          else if (workspaceStatus === "invited") navigate("/workspace/invite");
          else if (workspaceStatus === "pending")
            navigate("/workspace/pending");
          else navigate("/");
        }
      }
    } catch (err) {
      let message = "Something went wrong. Please try again.";
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err) {
        message = err.message;
      }
      toast.error(message, {
        style: { borderRadius: "10px", background: "#25671E", color: "#fff" },
      });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-slate-300 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0344a6]/10 text-[#0344a6] mb-4">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-[#172b4d] mb-2">
            Enter verification code
          </h1>
          <p className="text-[#172b4d]/60 text-sm">
            We've sent a 6-digit code to your email
          </p>
        </div>

        {/* Expiry Timer Alert */}
        <div
          className={`mb-6 flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border ${
            isExpiring
              ? "bg-[#172b4d]/5 text-[#172b4d] border-[#172b4d]/20"
              : "bg-[#0344a6]/5 text-[#0344a6] border-[#0344a6]/20"
          }`}
        >
          {isExpiring ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <Shield className="w-4 h-4" />
          )}
          <span>Code expires in {formatTime(expiryTime)}</span>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={handleChange}
              placeholder="------"
              className="w-full px-4 py-4 text-center text-3xl font-mono font-bold tracking-[0.5em] text-[#172b4d] bg-white border border-slate-300 rounded-lg placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent transition-shadow"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={otp.length !== 6}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-all duration-200 ${
              otp.length === 6
                ? "bg-[#0344a6] hover:bg-[#0344a6]/90 text-white shadow-lg shadow-[#0344a6]/20 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:ring-offset-2"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <span>Verify Code</span>
            <CheckCircle className="w-5 h-5" />
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-4 text-center">
          <Link
            to={"/forgot-password"}
            className="inline-flex items-center gap-1.5 text-sm text-[#0344a6] hover:underline font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Change email
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
