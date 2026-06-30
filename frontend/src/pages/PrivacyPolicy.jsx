import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowUp,
  Shield,
  Mail,
  ExternalLink,
  CheckSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const sections = [
    { id: "data-collected", title: "1. Data We Collect" },
    { id: "data-usage", title: "2. How We Use Your Data" },
    { id: "third-party", title: "3. Third-Party Infrastructure" },
    { id: "security", title: "4. Data Security & Encryption" },
    { id: "your-rights", title: "5. Your Rights (GDPR & CCPA)" },
    { id: "contact", title: "6. Contact & Compliance" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 400);

      // Update active section based on scroll position
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileTocOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* --- SKIP LINK FOR ACCESSIBILITY --- */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* --- TOP NAVBAR (Simplified) --- */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-7 w-7 text-[#0344a6]" />
              <span className="text-xl font-bold text-[#172b4d] tracking-tight">
                Clarity
              </span>
            </div>
          </div>

          <Link
            to={"/"}
            className="text-sm text-slate-600 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-1"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main id="main-content" className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-12 md:py-16 border-b border-slate-200">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full mb-4">
                <Shield className="w-3.5 h-3.5" />
                Protocol v2.6-Stable
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Privacy Policy
              </h1>
              <p className="text-lg text-slate-600 mb-2">
                Last Updated:{" "}
                <time dateTime="2026-02-22">February 22, 2026</time>
              </p>
              <p className="text-slate-500 text-sm">
                Welcome to Clarity. We are committed to protecting your
                professional workspace data through advanced encryption and
                transparent data practices.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Mobile Table of Contents Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setMobileTocOpen(!mobileTocOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-100 transition-colors duration-200"
              >
                <span>Table of Contents</span>
                {mobileTocOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {mobileTocOpen && (
                <nav className="mt-3 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                  <ul className="divide-y divide-slate-100">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <button
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 ${
                            activeSection === section.id
                              ? "bg-indigo-50 text-indigo-700 font-medium"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          {section.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Desktop Table of Contents (Sidebar) */}
              <aside className="hidden lg:block lg:col-span-1">
                <nav className="sticky top-24 space-y-1">
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    On This Page
                  </h2>
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        activeSection === section.id
                          ? "bg-indigo-50 text-indigo-700 font-medium pl-4 border-l-2 border-indigo-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:pl-4"
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </aside>

              {/* Policy Content */}
              <article className="lg:col-span-3 prose prose-slate max-w-none">
                {/* Section 1 */}
                <section id="data-collected" className="scroll-mt-24 mb-12">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                    1. Data We Collect
                  </h2>
                  <p className="text-slate-600 mb-4">
                    To provide a high-velocity collaborative experience, we
                    collect the following:
                  </p>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-slate-900">
                          Account Information:
                        </strong>{" "}
                        Name, email address, and hashed authentication
                        credentials.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-slate-900">
                          Workspace Content:
                        </strong>{" "}
                        Tasks, board names, list titles, and comments created
                        within the Clarity ecosystem.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-slate-900">
                          Security Logs:
                        </strong>{" "}
                        IP addresses and device fingerprints (processed via
                        Arcjet) to protect against bot attacks and unauthorized
                        access.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-slate-900">
                          Transactional Metadata:
                        </strong>{" "}
                        Real-time presence data (Socket.io) to show who is
                        active in a workspace.
                      </div>
                    </li>
                  </ul>
                </section>

                {/* Section 2 */}
                <section id="data-usage" className="scroll-mt-24 mb-12">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                    2. How We Use Your Data
                  </h2>
                  <ul className="space-y-4 text-slate-600">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-indigo-600 text-xs font-bold">
                          1
                        </span>
                      </span>
                      <div>
                        <strong className="text-slate-900 block mb-1">
                          Synchronization
                        </strong>
                        To provide real-time updates across all your devices
                        using WebSockets.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-indigo-600 text-xs font-bold">
                          2
                        </span>
                      </span>
                      <div>
                        <strong className="text-slate-900 block mb-1">
                          Security
                        </strong>
                        To detect and prevent fraudulent logins using HMAC-SHA
                        hashed OTPs and 2FA.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-indigo-600 text-xs font-bold">
                          3
                        </span>
                      </span>
                      <div>
                        <strong className="text-slate-900 block mb-1">
                          Optimization
                        </strong>
                        To improve server performance on our Hostinger VPS by
                        analyzing anonymized traffic patterns.
                      </div>
                    </li>
                  </ul>
                </section>

                {/* Section 3 */}
                <section id="third-party" className="scroll-mt-24 mb-12">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                    3. Third-Party Infrastructure (The "Clarity Mesh")
                  </h2>
                  <p className="text-slate-600 mb-4">
                    Clarity utilizes high-performance cloud partners to ensure
                    99.9% uptime. Your data may be processed by:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        name: "MongoDB Atlas",
                        desc: "Secure, encrypted storage of your primary workspace data.",
                      },
                      {
                        name: "Upstash Redis",
                        desc: "Temporary storage of session states and security tokens.",
                      },
                      {
                        name: "Cloudinary",
                        desc: "Storage and delivery of project attachments and user avatars.",
                      },
                      {
                        name: "Arcjet",
                        desc: "Real-time security analysis to shield your data from malicious actors.",
                      },
                    ].map((partner) => (
                      <div
                        key={partner.name}
                        className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors duration-200"
                      >
                        <h4 className="font-semibold text-slate-900 mb-1">
                          {partner.name}
                        </h4>
                        <p className="text-sm text-slate-600">{partner.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 4 */}
                <section id="security" className="scroll-mt-24 mb-12">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                    4. Data Security & Encryption
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">
                          In-Transit Encryption
                        </h4>
                        <p className="text-sm text-slate-600">
                          All data is transmitted via TLS 1.3 encryption.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">
                          At-Rest Protection
                        </h4>
                        <p className="text-sm text-slate-600">
                          Sensitive tokens are hashed using SHA-256 before
                          storage.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                      <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-cyan-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">
                          Cookie Security
                        </h4>
                        <p className="text-sm text-slate-600">
                          We use HTTP-Only, Secure, and SameSite cookies to
                          prevent XSS and CSRF attacks.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5 */}
                <section id="your-rights" className="scroll-mt-24 mb-12">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                    5. Your Rights (GDPR & CCPA Compliance)
                  </h2>
                  <p className="text-slate-600 mb-4">
                    As an Clarity user, you have the right to:
                  </p>
                  <ul className="space-y-4">
                    {[
                      {
                        title: "Access",
                        desc: "Request a copy of all workspace data associated with your ID.",
                      },
                      {
                        title: "Deletion",
                        desc: 'Permanently delete your workspace and all associated tasks (the "Right to be Forgotten").',
                      },
                      {
                        title: "Portability",
                        desc: "Export your board data in JSON format for use in other tools.",
                      },
                    ].map((right) => (
                      <li key={right.title} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900">
                            {right.title}:
                          </strong>{" "}
                          <span className="text-slate-600">{right.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Section 6 */}
                <section id="contact" className="scroll-mt-24 mb-12">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                    6. Contact & Compliance
                  </h2>
                  <p className="text-slate-600 mb-4">
                    For any privacy-related inquiries or to report a security
                    vulnerability, please contact:
                  </p>
                  <a
                    href="mailto:security@Clarity.work"
                    className="inline-flex items-center gap-2 px-4 py-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-medium rounded-lg transition-colors duration-200"
                  >
                    <Mail className="w-4 h-4" />
                    security@Clarity.work
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </section>

                {/* Footer Note */}
                <div className="pt-8 border-t border-slate-200">
                  <p className="text-sm text-slate-500">
                    This Privacy Policy is part of Clarity's Terms of Service.
                    By using Clarity, you agree to the practices described
                    herein.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <Footer />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-[#0747a6] hover:bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }

        /* Print Styles */
        @media print {
          header,
          footer,
          button,
          aside {
            display: none !important;
          }
          main {
            padding: 0 !important;
          }
          a {
            text-decoration: none;
            color: inherit;
          }
          .prose {
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
};

// Helper component for checkmark icon
const CheckCircle = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default PrivacyPolicy;
