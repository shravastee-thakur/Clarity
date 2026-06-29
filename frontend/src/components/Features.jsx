import React from "react";
import { Layout, Users, Bell, ArrowUpRight } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Adaptive Workspaces",
      description:
        "Drag, drop, and customize your workflow. From Kanban to Timeline, Clarity molds to your team's unique process without forcing a rigid structure.",
      icon: Layout,
      gradient: "from-indigo-500 to-purple-500",
      bg: "bg-indigo-50",
      color: "text-indigo-600",
    },
    {
      title: "Real-Time Sync",
      description:
        "Edit together, comment instantly, and stay aligned. No more version conflicts or 'did you see this?' moments. Everyone sees the same truth.",
      icon: Users,
      gradient: "from-cyan-500 to-blue-500",
      bg: "bg-cyan-50",
      color: "text-cyan-600",
    },
    {
      title: "Smart Nudges",
      description:
        "Notifications that respect your focus. Get alerted only when action is truly required, reducing noise and increasing deep work.",
      icon: Bell,
      gradient: "from-purple-500 to-pink-500",
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
  ];

  return (
    <section className="relative w-full py-16 bg-white overflow-hidden">
      {/* --- BACKGROUND CONTINUITY --- */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute top-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-slate-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0747a6] mb-4 tracking-tight">
            Built for the way you work.
          </h2>
          <p className="text-lg text-slate-600">
            Powerful features wrapped in a simple interface. Clarity removes the
            friction so you can focus on the flow.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              // Added 'group' class to control child elements on hover
              className="group relative p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 outline-none"
              tabIndex="0" // Makes the div focusable for keyboard users
            >
              {/* --- THE BRIGHT LINE (Energy Bar) --- */}
              {/* Positioned absolute top, scales from 0 to 1 on hover */}
              <div
                className={`absolute top-0 left-0 h-1 bg-gradient-to-r ${feature.gradient} w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out`}
              />

              {/* Icon Container */}
              <div
                className={`w-12 h-12 rounded-lg ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Optional: Glow Effect behind icon on hover */}
              <div
                className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 blur-2xl rounded-full transition-opacity duration-500`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
