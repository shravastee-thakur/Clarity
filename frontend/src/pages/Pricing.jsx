import { useState } from "react";
import {
  Check,
  X,
  HelpCircle,
  ArrowRight,
  Building2,
  ChevronDown,
} from "lucide-react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("annual"); // 'annual' or 'monthly'
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const plans = [
    {
      name: "Free",
      price: { annual: 0, monthly: 0 },
      period: "forever",
      description: "Free for up to 10 collaborators per Workspace",
      tagline: "Capture your to-dos, get organized.",
      features: [
        { text: "Unlimited cards", included: true },
        { text: "Up to 10 boards per Workspace", included: true },
        {
          text: "Quickly capture to-dos from email, Slack, and Teams",
          included: true,
        },
        { text: "Inbox", included: true },
        { text: "Unlimited Power-Ups per board", included: true },
        { text: "Unlimited storage (10MB/file)", included: true },
        { text: "250 Workspace command runs per month", included: true },
        { text: "Custom backgrounds & stickers", included: true },
        { text: "Unlimited activity log", included: true },
        { text: "Assignee and due dates", included: true },
        { text: "iOS and Android mobile apps", included: true },
        { text: "2-factor authentication", included: true },
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Standard",
      price: { annual: 2999, monthly: 300 },
      period: "per user/month",
      description:
        "Get more stuff done with unlimited boards, card mirroring, and more automation.",
      tagline: "Everything in Free, plus:",
      features: [
        { text: "Unlimited boards", included: true },
        { text: "Unlimited Power-Ups per board", included: true },
        { text: "Unlimited storage (250MB/file)", included: true },
        { text: "1,000 Workspace command runs per month", included: true },
        { text: "Custom backgrounds & stickers", included: true },
        { text: "Unlimited activity log", included: true },
        { text: "Assignee and due dates", included: true },
        { text: "iOS and Android mobile apps", included: true },
        { text: "2-factor authentication", included: true },
        { text: "Planner", included: true },
        { text: "Advanced checklists", included: true },
        { text: "Card mirroring", included: true },
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Premium",
      price: { annual: 5999, monthly: 600 },
      period: "per user/month",
      description: "Add AI to your boards and admin controls to your toolkit.",
      tagline: "Everything in Standard, plus:",
      features: [
        { text: "Unlimited Power-Ups per board", included: true },
        { text: "Unlimited Workspace command runs", included: true },
        { text: "Assignee and due dates", included: true },
        { text: "Custom Fields", included: true },
        { text: "List colors", included: true },
        { text: "Collapsible lists", included: true },
        { text: "Saved searches", included: true },
        { text: "Timeline view", included: true },
        { text: "Dashboard view", included: true },
        { text: "AI-powered insights", included: true },
        { text: "Admin controls & permissions", included: true },
        { text: "Priority 24/7 support", included: true },
        { text: "Advanced security (SSO, SCIM)", included: true },
      ],
      cta: "Start Free Trial",
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "Can I change plans later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes! Both Standard and Premium plans come with a 14-day free trial. No credit card required to start.",
    },
    {
      question: "What happens when I exceed my Workspace command runs?",
      answer:
        "Your automations will pause until the next billing cycle. You can also purchase additional command runs if needed.",
    },
    {
      question: "Do you offer discounts for nonprofits or education?",
      answer:
        "Yes! We offer special pricing for qualified nonprofits and educational institutions. Contact our sales team to learn more.",
    },
  ];
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-200">
      {/* --- HERO SECTION --- */}
      <section className="relative">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl md:text-5xl pt-16 font-bold text-slate-900 mb-4 tracking-tight">
            Simple, transparent pricing.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your team. All plans include a 14-day free
            trial.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 bg-slate-100 rounded-full">
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ₹{
                billingCycle === "annual"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Annual{" "}
              <span className="text-green-600 text-xs ml-1">(Save 17%)</span>
            </button>
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                billingCycle === "monthly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </section>

      {/* --- PRICING CARDS --- */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
                  plan.popular
                    ? "border-2 border-indigo-500 shadow-2xl shadow-indigo-200 z-10"
                    : "border border-slate-200 shadow-lg shadow-slate-200/50"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wide">
                    Most Popular
                  </div>
                )}

                {/* Card Content */}
                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-bold text-slate-900">
                        ₹{plan.price[billingCycle]}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 mt-4">
                      {plan.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100 my-6"></div>

                  {/* Tagline */}
                  <p className="text-sm font-medium text-slate-700 mb-4">
                    {plan.tagline}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-slate-200 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-sm ${feature.included ? "text-slate-600" : "text-slate-300"}`}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-3.5 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      plan.popular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30"
                        : plan.name === "Free"
                          ? "bg-slate-900 hover:bg-slate-800 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ ACCORDION SECTION --- */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-slate-600">
              Everything you need to know about Clarity pricing.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-200 transition-colors duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  aria-expanded={openFaqIndex === index}
                >
                  <div className="flex items-center gap-4">
                    <HelpCircle className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <span className="text-base font-semibold text-slate-900">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      openFaqIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Accordion Content with Animation */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === index
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-4 pt-6">
                    <div className="flex items-start gap-4 ml-9">
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className=" bg-slate-50">
        <div className="container mx-auto px-6 py-10 md:px-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Join thousands of teams who have already upgraded their workflow
            with Clarity.
          </p>
          <Link
            to={"/signup"}
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:scale-105"
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
