import React, { useState, useRef, useEffect } from "react";
import {
  CheckSquare,
  ChevronDown,
  User,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Briefcase, label: "Workspace", path: "/workspace" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: LogOut, label: "Logout", path: "/logout" },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-7 w-7 text-[#0344a6]" />
            <span className="text-xl font-bold text-[#172b4d] tracking-tight">
              Clarity
            </span>
          </div>

          {/* Desktop User Dropdown */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              <span className="text-sm font-medium text-[#172b4d]">
                Alex Morgan
              </span>
              <ChevronDown
                className={`h-4 w-4 text-[#172b4d] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-[#172b4d] hover:bg-slate-50 hover:text-[#0344a6] transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-[#172b4d] hover:bg-slate-50 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-[#172b4d]">Alex Morgan</p>
            <p className="text-xs text-slate-500">alex.morgan@clarity.com</p>
          </div>
          <div className="px-2 py-2 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm text-[#172b4d] hover:bg-slate-50 hover:text-[#0344a6] transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
