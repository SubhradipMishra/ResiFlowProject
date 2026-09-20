import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setNewsletterEmail('');
    }
  };

  return (
    <footer id="contact" className="bg-[#070B14] text-slate-400 relative overflow-hidden border-t border-slate-800/80">
      {/* Background Radiant Glow Orbs */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Giant Ambient Background Watermark */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[140px] sm:text-[200px] md:text-[240px] font-black tracking-tighter text-slate-900/40 select-none pointer-events-none whitespace-nowrap -z-0">
        RESIFLOW
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative z-10">
        
        {/* Top Newsletter / Society Circulars Capsule Bar */}
        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl mb-16 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-brand-400 font-extrabold text-xs uppercase tracking-widest mb-1 font-mono">
              <i className="ri-mail-send-line text-sm"></i>
              <span>RWA & SOCIETY ADVISORY DISPATCH</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Get Monthly Society Legal Updates & Bye-Law Guides
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Curated compliance blueprints, AGM notice templates, and maintenance billing best practices.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2.5">
            {subscribed ? (
              <div className="px-6 py-3 bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <i className="ri-checkbox-circle-fill text-base"></i>
                <span>Subscribed! Check your inbox for the RWA Welcome Kit.</span>
              </div>
            ) : (
              <>
                <div className="relative w-full sm:w-80">
                  <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                  <input
                    type="email"
                    required
                    placeholder="Enter your committee or email..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/90 border border-slate-800 rounded-2xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-brand-700 via-brand-600 to-rose-500 hover:from-brand-800 hover:to-brand-600 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <span>Subscribe</span>
                  <i className="ri-arrow-right-line"></i>
                </button>
              </>
            )}
          </form>
        </div>

        {/* Main 5-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-slate-800/80">
          
          {/* Column 1: Brand & Certifications */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-rose-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-brand-500/30 border border-brand-400/30">
                <i className="ri-community-line"></i>
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white block leading-none">
                  Resi<span className="text-brand-500">Flow.</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5 block">
                  Community Operating System
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Next-generation prop-tech platform engineered to eliminate residential friction — powering automated ANPR gates, 1-click UPI billing, and complete committee audit governance.
            </p>

            {/* Live Operational Status Capsule */}
            <div className="inline-flex items-center gap-2 bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-slate-800 text-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-mono text-[11px]">System Status:</span>
              <span className="text-emerald-400 font-bold font-mono text-[11px]">99.98% Uptime SLA</span>
            </div>

            {/* Security Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                <i className="ri-shield-check-line text-brand-400"></i> ISO 27001
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                <i className="ri-lock-2-line text-brand-400"></i> SOC-2 Type II
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                <i className="ri-checkbox-circle-line text-emerald-400"></i> 256-Bit AES
              </span>
            </div>
          </div>

          {/* Column 2: Platform Capabilities */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-white text-xs font-black uppercase tracking-wider font-mono">
              Capabilities
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#features" className="hover:text-white transition-colors flex items-center gap-1.5"><span>Visitor QR Passes</span></a></li>
              <li><a href="#features" className="hover:text-white transition-colors flex items-center gap-1.5"><span>Automated ANPR Gates</span></a></li>
              <li><a href="#features" className="hover:text-white transition-colors flex items-center gap-1.5"><span>Maintenance & 1-Click UPI</span></a></li>
              <li><a href="#features" className="hover:text-white transition-colors flex items-center gap-1.5"><span>Clubhouse Slot Booking</span></a></li>
              <li><a href="#features" className="hover:text-white transition-colors flex items-center gap-1.5"><span>RFID Guard Patrolling</span></a></li>
              <li><a href="#features" className="hover:text-white transition-colors flex items-center gap-1.5"><span>Emergency 1-Tap SOS</span></a></li>
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-white text-xs font-black uppercase tracking-wider font-mono">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#why-us" className="hover:text-white transition-colors">For Housing Societies (RWAs)</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">For Apartment Owners</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">For Tenants & Renters</a></li>
              <li><a href="#why-us" className="hover:text-white transition-colors">For Security Agencies</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">For Township Federations</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">For Property Developers</a></li>
            </ul>
          </div>

          {/* Column 4: Resources & Trust */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-white text-xs font-black uppercase tracking-wider font-mono">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works Route</a></li>
              <li><a href="#simulator" className="hover:text-white transition-colors">Interactive OS Playground</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Calculator</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Whitepaper</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API & Webhooks Docs</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Society Case Studies</a></li>
            </ul>
          </div>

          {/* Column 5: Offices & 24/7 Hotline */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-white text-xs font-black uppercase tracking-wider font-mono">
              Contact & Hubs
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <div className="text-[10px] text-slate-500 font-mono uppercase">Direct 24/7 Helpline</div>
                <a href="tel:+919876543210" className="text-slate-200 hover:text-brand-400 font-bold flex items-center gap-1.5 mt-0.5">
                  <i className="ri-phone-fill text-brand-500"></i>
                  <span>+91 98765 43210</span>
                </a>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 font-mono uppercase">Onboarding Team</div>
                <a href="mailto:support@resiflow.com" className="text-slate-200 hover:text-brand-400 font-medium flex items-center gap-1.5 mt-0.5 truncate">
                  <i className="ri-mail-fill text-brand-500"></i>
                  <span>support@resiflow.com</span>
                </a>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 font-mono uppercase">Headquarters</div>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                  ResiFlow Tower, Tech Corridor Phase 2, Bengaluru, KA & HP Hub, India
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Metadata Bar & Social Links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex items-center gap-2">
            <span>© 2026 ResiFlow Technologies Inc. All rights reserved.</span>
          </div>

          {/* Social Icons with Magnetic Hover Glow */}
          <div className="flex items-center gap-2.5">
            {[
              { icon: 'ri-linkedin-fill', href: '#', label: 'LinkedIn' },
              { icon: 'ri-twitter-x-line', href: '#', label: 'X (Twitter)' },
              { icon: 'ri-instagram-line', href: '#', label: 'Instagram' },
              { icon: 'ri-youtube-fill', href: '#', label: 'YouTube' },
              { icon: 'ri-github-fill', href: '#', label: 'GitHub' },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                aria-label={social.label}
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-brand-600 hover:border-brand-500 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
              >
                <i className={social.icon}></i>
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <a href="#" className="hover:text-slate-200 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-200 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-200 transition-colors">Security Architecture</a>
          </div>

        </div>

      </div>
    </footer>
  );
};
