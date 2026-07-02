import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Plans = () => {
  const plans = [
    {
      name: "Free",
      description:
        "For individuals or small teams looking to keep work organized.",
    },
    {
      name: "Standard",
      description:
        "For teams that need to manage more work and scale collaboration.",
    },
    {
      name: "Premium",
      description:
        "Best for teams up to 100 that need to track multiple projects and visualize work.",
    },
  ];

  return (
    <section className="relative w-full py-10 bg-[#0344a6] overflow-hidden">
      {/* --- SUBTLE BACKGROUND PATTERN --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-400/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Choose your plan.
          </h2>
          <p className="text-lg text-blue-100">
            Flexible pricing for teams of all sizes. Start free, upgrade as you
            grow.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1"
            >
              {/* Plan Header */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-4">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-blue-200 text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-blue-100 leading-relaxed">
                  {plan.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Pricing Button */}
        <div className="text-center">
          <Link
            to={"/pricing"}
            className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-300 hover:bg-cyan-100 text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-900/20"
          >
            View Clarity Pricing
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Plans;
