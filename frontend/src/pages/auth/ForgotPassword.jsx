import React, { useState, useRef, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckSquare,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

const ForgotPassword = () => {
  const [step, setStep] = useState("email"); // 'email', 'verify', 'success'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const otpRefs = useRef([]);

  useEffect(() => {
    if (step === "verify" && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [step]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("verify");
    }, 1500);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, 6)
      .replace(/\D/g, "");
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      otpRefs.current[5].focus();
    }
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-300 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="h-8 w-8 text-[#0344a6]" />
            <span className="text-2xl font-bold text-[#172b4d] tracking-tight">
              Clarity
            </span>
          </div>

          {step === "email" && (
            <>
              <h1 className="text-xl font-semibold text-[#172b4d]">
                Forgot password?
              </h1>
              <p className="text-sm text-[#172b4d]/60 mt-1 text-center">
                Enter your email to receive a reset code.
              </p>
            </>
          )}
          {step === "verify" && (
            <>
              <div className="w-12 h-12 bg-[#0344a6]/10 rounded-full flex items-center justify-center mb-3">
                <ShieldCheck className="h-6 w-6 text-[#0344a6]" />
              </div>
              <h1 className="text-xl font-semibold text-[#172b4d]">
                Check your email
              </h1>
              <p className="text-sm text-[#172b4d]/60 mt-1 text-center">
                We sent a 6-digit code to <br />
                <span className="font-semibold text-[#172b4d]">{email}</span>
              </p>
            </>
          )}
          {step === "success" && (
            <>
              <h1 className="text-xl font-semibold text-[#172b4d]">
                Password Updated
              </h1>
              <p className="text-sm text-[#172b4d]/60 mt-1 text-center">
                You can now log in with your new credentials.
              </p>
            </>
          )}
        </div>

        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#172b4d] mb-1.5"
              >
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#172b4d]/40" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] placeholder-[#172b4d]/40 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent transition-shadow"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#0344a6] text-white font-semibold rounded-lg hover:bg-[#0344a6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Sending...
                </>
              ) : (
                "Send reset code"
              )}
            </button>
          </form>
        )}

        {step === "verify" && (
          <form onSubmit={handleVerifySubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#172b4d] mb-3 text-center">
                Verification Code
              </label>
              <div
                className="flex justify-center gap-2 sm:gap-3"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-white border border-slate-300 rounded-lg text-[#172b4d] focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent transition-shadow"
                  />
                ))}
              </div>
            </div>

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
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join("").length !== 6 || !newPassword}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#0344a6] text-white font-semibold rounded-lg hover:bg-[#0344a6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        {step === "success" && (
          <a
            href="/login"
            className="block w-full text-center py-3 bg-[#0344a6] text-white font-semibold rounded-lg hover:bg-[#0344a6]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:ring-offset-2"
          >
            Return to Log In
          </a>
        )}

        {step !== "success" && (
          <div className="mt-6 text-center">
            <button
              onClick={() =>
                step === "verify" ? setStep("email") : window.history.back()
              }
              className="inline-flex items-center gap-1.5 text-sm text-[#0344a6] hover:underline font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              {step === "verify" ? "Change email" : "Back to Log In"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
