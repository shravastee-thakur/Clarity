import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckSquare,
  ArrowLeft,
  MailCheck,
} from "lucide-react";
import api from "../../utils/axiosinstance";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { setUserEmail } = useAuthStore();

  const [step, setStep] = useState("email"); // 'email', 'password', 'magicSent'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Check Auth Method
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/api/v1/users/check-auth", { email });

      if (!res.data.exists) {
        toast.error("No account found with this email.");
        setIsLoading(false);
        return;
      }

      if (res.data.hasPassword) {
        setStep("password");
      } else {
        // Path B: Send Magic Link
        await api.post("/api/v1/users/magic-login", { email });
        setStep("magicSent");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit Password & Trigger OTP
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/api/v1/users/otp-requests", {
        email,
        password,
      });
      if (res.data.success) {
        setUserEmail(email);
        toast.success(res.data.message, {
          style: { borderRadius: "10px", background: "#25671E", color: "#fff" },
        });
        navigate("/verify-otp");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="h-8 w-8 text-[#0344a6]" />
            <span className="text-2xl font-bold text-[#172b4d] tracking-tight">
              Clarity
            </span>
          </div>
          <h1 className="text-xl font-semibold text-[#172b4d]">Welcome back</h1>
          <p className="text-sm text-[#172b4d]/60 mt-1">
            Sign in to your Clarity workspace
          </p>
        </div>

        {/* STEP 1: EMAIL ENTRY */}
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
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Continue"
              )}
            </button>
          </form>
        )}

        {/* STEP 2A: PASSWORD ENTRY */}
        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#172b4d]/60" />
              <span className="text-sm font-medium text-[#172b4d]">
                {email}
              </span>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="ml-auto text-xs text-[#0344a6] hover:underline font-medium"
              >
                Change
              </button>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#172b4d] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#172b4d]/40" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
            <div className="flex justify-end">
              <Link
                to="/forget-password"
                className="text-sm text-[#0344a6] hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#0344a6] text-white font-semibold rounded-lg hover:bg-[#0344a6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:ring-offset-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        )}

        {/* STEP 2B: MAGIC LINK SENT */}
        {step === "magicSent" && (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0344a6]/10 text-[#0344a6]">
              <MailCheck className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#172b4d]">
                Check your inbox
              </h2>
              <p className="text-sm text-[#172b4d]/60 mt-2">
                We sent a secure login link to{" "}
                <span className="font-semibold text-[#172b4d]">{email}</span>.
                Click the link in the email to sign in.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="inline-flex items-center gap-1.5 text-sm text-[#0344a6] hover:underline font-semibold"
            >
              <ArrowLeft className="h-4 w-4" /> Use a different email
            </button>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-[#172b4d]/60">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#0344a6] hover:underline font-semibold"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
