import React from "react";
import {
  Twitter,
  Linkedin,
  Github,
  Mail,
  MapPin,
  Phone,
  CheckSquare,
} from "lucide-react";

const Footer = () => {
  const aboutLinks = ["Our Story", "Careers", "Blog", "Press Kit"];
  const platformLinks = ["Web App", "iOS & Android", "Desktop", "Integrations"];

  return (
    <footer className="bg-[#172b4d] text-slate-50 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top Section: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Column 1: Brand & Social */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0344a6] flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Clarity
              </span>
            </div>
            <p className="text-slate-50/80 text-sm leading-relaxed">
              The workspace that moves at the speed of thought. Bridging
              planning and execution for the teams of tomorrow.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="text-slate-50/80 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-50/80 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-50/80 hover:text-white transition-colors"
                aria-label="Github"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: About Clarity */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              About Clarity
            </h3>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-slate-50/80 hover:text-white text-sm transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-slate-50/80 hover:text-white text-sm transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#0344a6] mt-0.5" />
                <a
                  href="mailto:hello@clarity.work"
                  className="text-slate-50/80 hover:text-white text-sm transition-colors"
                >
                  hello@clarity.work
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#0344a6] mt-0.5" />
                <span className="text-slate-50/80 text-sm">
                  101 Maker Towers, Nariman Point,
                  <br />
                  Mumbai, India 400000
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#0344a6] mt-0.5" />
                <a
                  href="tel:+912211111111"
                  className="text-slate-50/80 hover:text-white text-sm transition-colors"
                >
                  +91 (22) 1111 1111
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="border-t border-white/10 pt-6 flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-slate-50/80 text-sm">
            Copyright © 2026 Shravastee Thakur.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-slate-50/80 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
