import React, { useState } from "react";
import { Mail, Loader2, CheckSquare, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosinstance";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/api/v1/users/password-resets", { email });
      console.log(res);

      if (res.data.success) {
        toast.success(res.data.message, {
          style: { borderRadius: "10px", background: "#25671E", color: "#fff" },
        });
        navigate(`/verify-reset-otp/${email}`);
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
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-xl font-semibold text-[#760031]">
            Forgot password?
          </h1>
          <p className="text-sm text-[#172b4d]/60 mt-1 text-center">
            Enter your email to receive a reset code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-1.5 text-sm text-[#0344a6] hover:underline font-semibold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
