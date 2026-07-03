import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #dbeafe 0%, #f8fafc 50%, #f1f5f9 100%)",
      }}
    >
      {/* Responsive Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-20%] sm:left-[-10%] w-[90vw] sm:w-[50vw] h-[90vw] sm:h-[50vw] bg-blue-300/40 rounded-full blur-[100px] z-0" />
      <div className="absolute bottom-[-10%] right-[-20%] sm:right-[-10%] w-[90vw] sm:w-[50vw] h-[90vw] sm:h-[50vw] bg-indigo-400/30 rounded-full blur-[100px] z-0" />
      <div className="absolute top-[20%] right-[-10%] sm:right-[10%] w-[60vw] sm:w-[30vw] h-[60vw] sm:h-[30vw] bg-slate-400/20 rounded-full blur-[80px] z-0" />

      {/* Subtle technical grid overlay */}
      <div
        className="absolute inset-0 z-0 opacity-80"
        style={{
          backgroundImage: `linear-gradient(to right, #0f172a08 1px, transparent 1px), linear-gradient(to bottom, #0f172a08 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#172b4d] tracking-tight mb-6">
          Intelligent focus for{" "}
          <span className="whitespace-nowrap">busy minds</span>
        </h1>

        <p className="text-lg sm:text-xl text-[#172b4d] leading-relaxed mb-10">
          Experience a workspace that moves at the speed of thought. Clarity
          bridges the gap between complex planning and instant execution with
          real-time synchronization that feels like second nature.
        </p>

        <Link
          to="/login"
          className="inline-flex items-center px-8 py-3 bg-[#0344a6] text-white font-semibold rounded-lg hover:bg-[#0344a6]/90 transition-colors shadow-lg shadow-[#0344a6]/20"
        >
          Enter
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </section>
  );
};

export default Hero;
