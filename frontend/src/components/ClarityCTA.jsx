import React from "react";
import { ArrowRight, Mail } from "lucide-react";

const ClarityCTA = () => {
  return (
    <section className="relative w-full py-10 bg-slate-50 overflow-hidden">
      {/* --- SUBTLE BACKGROUND DECORATION --- */}
      {/* Faint gradient orb to keep the "Aether" vibe alive */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Get started with Clarity today.
          </h2>

          {/* Subtext */}
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Join thousands of teams who have already upgraded their workflow. No
            credit card required for the 14-day trial.
          </p>

          {/* --- FORM CONTAINER --- */}
          <div className="w-full max-w-md mx-auto">
            <form
              className="flex flex-col md:flex-row gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Email Input */}
              <div className="relative flex-grow group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                  placeholder="Enter your work email"
                  required
                />
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#0747a6] hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-lg shadow-slate-900/20 hover:shadow-indigo-600/30 transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap"
              >
                <span>Sign Up Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Trust Micro-copy */}
            <p className="mt-4 text-xs text-slate-500">
              By signing up, you agree to our{" "}
              <a href="/privacy" className="underline hover:text-slate-700">
                Clarity Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClarityCTA;
