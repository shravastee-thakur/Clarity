import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="bg-blue-100 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#172b4d] tracking-tight mb-6">
          Intelligent focus for busy minds
        </h1>

        <p className="text-lg sm:text-xl text-[#172b4d]/70 leading-relaxed mb-10">
          Experience a workspace that moves at the speed of thought. Clarity
          bridges the gap between complex planning and instant execution with
          real-time synchronization that feels like second nature.
        </p>

        <Link
          to={"/login"}
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
