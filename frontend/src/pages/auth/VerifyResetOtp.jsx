import { useState, useEffect } from "react";
import { Shield, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyResetOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [expiryTime, setExpiryTime] = useState(300);
  const [isExpiring, setIsExpiring] = useState(false);

  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

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

  // Auto-navigate when 6 digits are entered
  useEffect(() => {
    if (otp.length === 6) {
      const timer = setTimeout(() => {
        navigate("/reset-password", { state: { email, otp } });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [otp, email, navigate]);

  const handleChange = (e) => {
    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0344a6]/10 text-[#0344a6] mb-4">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-[#172b4d] mb-2">
            Enter verification code
          </h1>
          <p className="text-[#172b4d]/60 text-sm">
            We sent a 6-digit code to <br />
            <span className="font-semibold text-[#172b4d]">{email}</span>
          </p>
        </div>

        <div
          className={`mb-6 flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border ${isExpiring ? "bg-[#172b4d]/5 text-[#172b4d] border-[#172b4d]/20" : "bg-[#0344a6]/5 text-[#0344a6] border-[#0344a6]/20"}`}
        >
          {isExpiring ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <Shield className="w-4 h-4" />
          )}
          <span>Code expires in {formatTime(expiryTime)}</span>
        </div>

        <div className="space-y-6">
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

          <button
            type="button"
            disabled={otp.length !== 6}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-all duration-200 ${otp.length === 6 ? "bg-[#0344a6] hover:bg-[#0344a6]/90 text-white shadow-lg shadow-[#0344a6]/20" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
          >
            Continue
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/forgot-password")}
            className="inline-flex items-center gap-1.5 text-sm text-[#0344a6] hover:underline font-semibold"
          >
            <ArrowLeft className="h-4 w-4" /> Change email
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetOtp;
