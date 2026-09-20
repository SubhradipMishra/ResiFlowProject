import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onOpenDemo: () => void;
  onOpenPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemo, onOpenPortal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHoverNav, setActiveHoverNav] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Live Simulator', href: '#simulator', badge: 'Interactive' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Micro Live Status Ticker */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800/80 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[10px] bg-slate-800/80 px-2 py-0.5 rounded">
              System Active
            </span>
            <span className="text-slate-400 hidden sm:inline text-xs">
              AI-powered Automated Gate ANPR & 1-Click UPI Reconciliation live.
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <a href="tel:+919876543210" className="hover:text-white transition-colors flex items-center gap-1.5 group">
              <i className="ri-phone-fill text-brand-400 group-hover:scale-110 transition-transform"></i>
              <span className="hidden md:inline font-medium">+91 98765 43210</span>
            </a>
            <span className="hidden sm:inline text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
              <span className="font-semibold text-brand-300">100+ Societies Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-200/50 py-3 border-b border-slate-200/80'
            : 'bg-white/85 backdrop-blur-md py-3.5 border-b border-slate-200/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Brand Logo with Layered Depth */}
          <a href="#home" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 group-hover:shadow-brand-500/40 transition-all duration-300 border border-brand-400/40">
              <i className="ri-community-line text-2xl group-hover:rotate-6 transition-transform"></i>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none group-hover:text-brand-700 transition-colors">
                Resi<span className="text-brand-600 font-black">Flow.</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">
                Community Management Platform
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links with Pill Hover Highlight */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80 backdrop-blur-sm shadow-inner">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onMouseEnter={() => setActiveHoverNav(link.name)}
                onMouseLeave={() => setActiveHoverNav(null)}
                className="relative px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors rounded-full flex items-center gap-1.5 whitespace-nowrap select-none"
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[9px] font-extrabold bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-full leading-none tracking-wide uppercase">
                    {link.badge}
                  </span>
                )}
                {activeHoverNav === link.name && (
                  <span className="absolute inset-0 bg-white shadow-sm rounded-full -z-10 animate-fadeIn" />
                )}
              </a>
            ))}
          </nav>

          {/* Fallback for lg screens if between lg and xl */}
          <nav className="hidden lg:flex xl:hidden items-center gap-0.5 bg-slate-100/80 p-1 rounded-full border border-slate-200/80 backdrop-blur-sm">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onMouseEnter={() => setActiveHoverNav(link.name)}
                onMouseLeave={() => setActiveHoverNav(null)}
                className="relative px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-950 transition-colors rounded-full flex items-center gap-1 whitespace-nowrap select-none"
              >
                <span>{link.name}</span>
                {activeHoverNav === link.name && (
                  <span className="absolute inset-0 bg-white shadow-sm rounded-full -z-10 animate-fadeIn" />
                )}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenPortal}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-brand-700 border border-slate-200 hover:border-brand-300 rounded-xl bg-white hover:bg-brand-50/40 transition-all duration-200 shadow-sm whitespace-nowrap"
            >
              Resident Login
            </button>

            <button
              onClick={onOpenDemo}
              className="px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-brand-700 via-brand-600 to-rose-500 hover:from-brand-800 hover:to-brand-600 rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap group"
            >
              <span>Get Started Free</span>
              <i className="ri-arrow-right-line text-sm group-hover:translate-x-1 transition-transform"></i>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-brand-600 rounded-xl focus:outline-none border border-slate-200 bg-white/80"
            aria-label="Toggle Menu"
          >
            <i className={`text-2xl ${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-4-line'}`}></i>
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-2xl border-b border-slate-200 px-6 py-5 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-slate-700 hover:text-brand-600 py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] font-bold bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPortal();
                }}
                className="w-full py-2.5 text-xs font-bold text-slate-700 border border-slate-200 rounded-xl bg-slate-50"
              >
                Resident Login
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemo();
                }}
                className="w-full py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-brand-700 to-brand-500 rounded-xl shadow-md shadow-brand-500/25"
              >
                Get Started Free →
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
