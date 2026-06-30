import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckSquare,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/axiosinstance";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;

    setIsLoading(true);
    try {
      const res = await api.post("/api/v1/users/", formData);
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message, {
          style: {
            borderRadius: "10px",
            background: "#25671E",
            color: "#fff",
          },
        });
        navigate("/login");
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
          <h1 className="text-xl font-semibold text-[#760031]">
            Create your account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#172b4d] mb-1.5"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#172b4d] mb-1.5"
            >
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent transition-shadow"
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
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#172b4d] transition-colors"
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

          {/* Privacy Policy Agreement */}
          <div className="flex items-start gap-2">
            <input
              id="agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0344a6] focus:ring-[#0344a6] focus:ring-offset-0"
            />
            <label
              htmlFor="agree"
              className="text-sm text-[#172b4d] cursor-pointer"
            >
              I agree to the{" "}
              <Link
                to={"/privacy-policy"}
                className="text-[#0344a6] hover:underline font-medium"
              >
                Clarity Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !agreed}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#0344a6] text-white font-semibold rounded-lg hover:bg-[#0344a6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:ring-offset-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="mt-6 text-center text-sm text-[#172b4d]">
          Already have an account?
          <Link
            to={"/login"}
            className="text-[#0344a6] hover:underline font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
