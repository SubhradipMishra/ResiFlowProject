import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../redux/store';

interface NavbarProps {
  onOpenDemo?: () => void;
  onOpenPortal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemo, onOpenPortal }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
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
      {/* Top Micro Live Status Ticker — flat, no gradient */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[10px] bg-slate-800 px-2 py-0.5 rounded">
              System Active
            </span>
            <span className="text-slate-400 hidden sm:inline text-xs">
              AI-powered Automated Gate ANPR & 1-Click UPI Reconciliation live.
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <a href="tel:+919876543210" className="hover:text-white transition-colors flex items-center gap-1.5 group">
              <i className="ri-phone-fill text-rose-400 group-hover:scale-110 transition-transform"></i>
              <span className="hidden md:inline font-medium">+91 98765 43210</span>
            </a>
            <span className="hidden sm:inline text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span className="font-semibold text-rose-300">100+ Societies Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar — flat white, ink border, subtle fade-in blur on scroll (no glassmorphism/gradients) */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 border-b-2 ${isScrolled
          ? 'bg-white/90 backdrop-blur-md border-slate-900 py-3'
          : 'bg-white border-slate-900/0 py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

          {/* Brand Logo — flat ink-bordered mark, no gradient/glow */}
          <a href="#home" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white border-2 border-slate-900 group-hover:bg-rose-700 transition-colors">
              <i className="ri-community-line text-xl"></i>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none">
                Resi<span className="text-rose-600 font-black">Flow.</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">
                Community Management Platform
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links — flat pill, ink border, no inner shadow */}
          <nav className="hidden xl:flex items-center gap-1 bg-white p-1.5 rounded-full border-2 border-slate-900">
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
                  <span className="text-[9px] font-extrabold bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded-full leading-none tracking-wide uppercase">
                    {link.badge}
                  </span>
                )}
                {activeHoverNav === link.name && (
                  <span className="absolute inset-0 bg-slate-100 rounded-full -z-10" />
                )}
              </a>
            ))}
          </nav>

          {/* Fallback for lg screens if between lg and xl */}
          <nav className="hidden lg:flex xl:hidden items-center gap-0.5 bg-white p-1 rounded-full border-2 border-slate-900">
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
                  <span className="absolute inset-0 bg-slate-100 rounded-full -z-10" />
                )}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {isAuthenticated && user ? (
              // Flat profile card — ink border, solid avatar fill, no gradient/glow
              <div className="flex items-center gap-3 bg-white p-1.5 pl-3.5 rounded-2xl border-2 border-slate-900">
                <div className="h-8 w-8 rounded-full bg-teal-900 flex items-center justify-center text-white font-extrabold text-xs border-2 border-slate-900 shrink-0">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-extrabold text-slate-900 leading-none">{user.name}</span>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mt-0.5">{user.role.replace('_', ' ')}</span>
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors"
                >
                  Dashboard →
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onOpenPortal ? onOpenPortal() : navigate('/login')}
                  className="px-4 py-2 text-xs font-bold text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white rounded-xl bg-white transition-colors whitespace-nowrap"
                >
                  Resident Login
                </button>

                <button
                  onClick={() => onOpenDemo ? onOpenDemo() : navigate('/login')}
                  className="px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors duration-200 flex items-center gap-1.5 whitespace-nowrap group"
                >
                  <span>Get Started Free</span>
                  <i className="ri-arrow-right-line text-sm group-hover:translate-x-1 transition-transform"></i>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-900 rounded-xl focus:outline-none border-2 border-slate-900 bg-white"
            aria-label="Toggle Menu"
          >
            <i className={`text-2xl ${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-4-line'}`}></i>
          </button>
        </div>

        {/* Mobile Drawer — flat white, ink dividers */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t-2 border-slate-900 px-6 py-5 space-y-4">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-slate-700 hover:text-rose-600 py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] font-extrabold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t-2 border-slate-100 flex flex-col gap-2.5">
              {isAuthenticated && user ? (
                <>
                  {/* Flat mobile profile card */}
                  <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white border-2 border-slate-900">
                    <div className="h-9 w-9 rounded-full bg-teal-900 flex items-center justify-center text-white font-extrabold text-sm border-2 border-slate-900 shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-extrabold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">{user.role?.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                    className="w-full py-2.5 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors"
                  >
                    Go to Dashboard →
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenPortal ? onOpenPortal() : navigate('/login');
                    }}
                    className="w-full py-2.5 text-xs font-bold text-slate-900 border-2 border-slate-900 rounded-xl bg-white"
                  >
                    Resident Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDemo ? onOpenDemo() : navigate('/login');
                    }}
                    className="w-full py-2.5 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors"
                  >
                    Get Started Free →
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;