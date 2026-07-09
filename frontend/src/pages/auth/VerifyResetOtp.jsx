import { useState, useEffect } from "react";
import { Shield, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../utils/axiosinstance";

const VerifyResetOtp = () => {
  const navigate = useNavigate();
  const { email } = useParams();

  const [otp, setOtp] = useState("");
  const [expiryTime, setExpiryTime] = useState(300);
  const [isExpiring, setIsExpiring] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) navigate("/forget-password");
  }, [email, navigate]);

  useEffect(() => {
    if (expiryTime > 0) {
      const timer = setTimeout(() => {
        setExpiryTime(expiryTime - 1);
        if (expiryTime <= 60) setIsExpiring(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [expiryTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsLoading(true);
    setError("");
    try {
      const res = await api.post("/api/v1/users/password-resets/verify", {
        email,
        otp,
      });
      const { resetToken } = res.data;

      navigate("/reset-password", { state: { email, resetToken } });
    } catch (err) {
      let message = "Something went wrong. Please try again.";
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
      toast.error(message, {
        style: { borderRadius: "10px", background: "#25671E", color: "#fff" },
      });
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setError("");
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(val);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-slate-300 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0344a6]/10 text-[#0344a6] mb-4">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-[#468432] mb-2">
            Enter verification code
          </h1>
          <p className="text-[#172b4d]/60 text-sm">
            We sent a 6-digit code to <br />
            <span className="font-semibold text-[#172b4d]">{email}</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border bg-slate-100 text-[#172b4d] border-slate-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={handleChange}
              placeholder="------"
              disabled={isLoading}
              className="w-full px-4 py-4 text-center text-3xl font-mono font-bold tracking-[0.5em] text-[#172b4d] bg-white border border-slate-300 rounded-lg placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent transition-shadow disabled:opacity-50"
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                <Loader2 className="h-6 w-6 animate-spin text-[#0344a6]" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={otp.length !== 6 || isLoading}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-all duration-200 ${
              otp.length === 6 && !isLoading
                ? "bg-[#0344a6] hover:bg-[#0344a6]/90 text-white shadow-lg shadow-[#0344a6]/20"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </button>
        </form>

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
