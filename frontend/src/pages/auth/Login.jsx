import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, CheckSquare } from "lucide-react";
import api from "../../utils/axiosinstance";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { setUserEmail } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/api/v1/users/otp-requests", formData);
      console.log(res);

      if (res.data.success) {
        setUserEmail(res.data.email);
        toast.success(res.data.message, {
          style: { borderRadius: "10px", background: "#25671E", color: "#fff" },
        });
        navigate("/verifyOtp");
      }
    } catch (error) {
      let message = "Something went wrong. Please try again.";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error) {
        message = error.message;
      }
      toast.error(message, {
        style: { borderRadius: "10px", background: "#25671E", color: "#fff" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-300 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="h-8 w-8 text-[#0344a6]" />
            <span className="text-2xl font-bold text-[#172b4d] tracking-tight">
              Clarity
            </span>
          </div>
          <h1 className="text-xl font-semibold text-[#760031]">Welcome back</h1>
          <p className="text-sm text-[#172b4d]/60 mt-1">
            Sign in to your Clarity workspace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
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
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] placeholder-[#172b4d]/40 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          {/* Password Input */}
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
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] placeholder-[#172b4d]/40 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#172b4d]/40 hover:text-[#172b4d] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
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
              className="text-sm text-[#760031] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#0344a6] text-white font-semibold rounded-lg hover:bg-[#0344a6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:ring-offset-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-sm text-[#172b4d]/60">
          Don't have an account?
          <a
            href="/signup"
            className="text-[#0344a6] hover:underline font-semibold"
          >
            Sign up for free
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
