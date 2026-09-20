import React, { useState } from 'react';
import { ThreeHeroCanvas } from './ThreeHeroCanvas';

interface HeroProps {
  onOpenDemo: () => void;
  onOpenVideo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDemo, onOpenVideo }) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const hotspots = [
    {
      id: 'gate',
      title: 'Automated ANPR Gate',
      subtitle: '99.98% Automatic QR & License Plate Verification',
      pos: 'top-24 left-6 sm:left-16',
      icon: 'ri-shield-keyhole-fill',
    },
    {
      id: 'clubhouse',
      title: 'Smart Clubhouse & Pool',
      subtitle: '1-Click Slot Booking & Guest Passes',
      pos: 'bottom-28 left-1/2 -translate-x-1/2',
      icon: 'ri-vip-diamond-fill',
    },
    {
      id: 'towers',
      title: 'Connected Residential Towers',
      subtitle: 'Instant App Announcements & SOS Dispatch',
      pos: 'top-14 right-6 sm:right-16',
      icon: 'ri-building-4-fill',
    },
  ];

  return (
    <section id="home" className="relative pt-10 sm:pt-16 pb-24 md:pb-36 overflow-hidden bg-[#FAFCFF] bg-dot-pattern">
      {/* 3D Three.js Interactive Particle Canvas */}
      <ThreeHeroCanvas />

      {/* Radiant Background Ambient Aura */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[500px] bg-gradient-to-b from-rose-200/40 via-brand-100/25 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-sky-200/30 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
        
        {/* Top Tagline Capsule Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-soft-sm text-xs font-bold text-slate-800 mb-8 backdrop-blur-md hover:border-brand-300 hover:shadow-md transition-all">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-600"></span>
          </span>
          <span className="tracking-widest uppercase text-[11px] font-extrabold text-slate-900">SMARTER COMMUNITIES</span>
          <span className="text-slate-300">•</span>
          <span className="tracking-widest uppercase text-[11px] text-slate-500 font-semibold">BETTER LIVING</span>
        </div>

        {/* Big Startup SaaS Typography Title with Faded Text */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[84px] font-extrabold tracking-tight leading-[1.05] max-w-5xl mx-auto text-faded-heading">
          Residential Community <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-700 via-brand-600 to-rose-500">
            Management Platform
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed text-faded-sub">
          Manage profiles, residents, security, billing and community services from one easy-to-use platform. A smarter, safer and more connected living experience for everyone.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenDemo}
            className="px-9 py-4 rounded-full text-base font-extrabold text-white bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 hover:from-brand-800 hover:to-brand-600 shadow-xl shadow-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center gap-2 group"
          >
            <span>Get Started</span>
            <i className="ri-arrow-right-line text-lg group-hover:translate-x-1.5 transition-transform"></i>
          </button>

          <button
            onClick={onOpenVideo}
            className="px-8 py-4 rounded-full text-base font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-md hover:shadow-lg hover:border-brand-300 transition-all duration-300 flex items-center gap-3 group"
          >
            <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
              <i className="ri-play-fill text-sm ml-0.5"></i>
            </div>
            <span>Watch Demo</span>
          </button>
        </div>

        {/* Social Proof Trust Badges */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-slate-600 text-xs sm:text-sm">
          <div className="flex -space-x-2">
            <img
              className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Resident"
            />
            <img
              className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="Resident"
            />
            <img
              className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
              alt="Resident"
            />
            <img
              className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
              alt="Resident"
            />
          </div>
          <span className="font-bold text-slate-800">Trusted by 100+ Residential Societies</span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center gap-1 text-amber-500 text-sm">
            <i className="ri-star-fill"></i>
            <i className="ri-star-fill"></i>
            <i className="ri-star-fill"></i>
            <i className="ri-star-fill"></i>
            <i className="ri-star-fill"></i>
            <span className="font-extrabold text-slate-800 ml-1">4.8/5</span>
          </div>
        </div>

        {/* Panoramic Vista Showcase with Zero Clutter & Fully Transparent Overlays */}
        <div className="mt-14 relative max-w-6xl mx-auto">
          
          {/* Main Community Photo Frame */}
          <div className="relative rounded-[36px] overflow-hidden border-4 border-white shadow-2xl shadow-slate-400/40 group bg-slate-950">
            <div className="aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden relative">
              <img
                src="/assets/community_hero.jpg"
                alt="Smart Residential Community Vista"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent pointer-events-none"></div>

              {/* Interactive Transparent Hotspot Pins on the Image */}
              {hotspots.map((spot) => (
                <div
                  key={spot.id}
                  className={`absolute ${spot.pos} z-20`}
                  onMouseEnter={() => setActiveHotspot(spot.id)}
                  onMouseLeave={() => setActiveHotspot(null)}
                >
                  <div className="relative cursor-pointer group/pin flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-600/80 text-white flex items-center justify-center shadow-lg border border-white/40 backdrop-blur-xl group-hover/pin:scale-125 transition-transform">
                      <i className={`${spot.icon} text-sm`}></i>
                    </div>

                    {/* Popover Card - Fully Transparent Frosted Glass */}
                    <div
                      className={`bg-slate-950/40 backdrop-blur-xl text-white px-3.5 py-2 rounded-2xl border border-white/20 shadow-2xl text-left text-xs transition-all ${
                        activeHotspot === spot.id ? 'opacity-100 scale-100' : 'opacity-90 scale-95 hidden sm:block'
                      }`}
                    >
                      <div className="font-bold text-slate-100 text-xs">{spot.title}</div>
                      <div className="text-[10px] text-slate-300 font-medium">{spot.subtitle}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bottom Integrated Transparent Telemetry Dock - Zero Overlaps */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-white z-10">
                {/* Metric 1 */}
                <div className="flex items-center gap-3 bg-slate-950/40 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/15 text-xs shadow-xl text-left">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-base border border-emerald-400/20 flex-shrink-0">
                    <i className="ri-shield-check-fill"></i>
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 text-xs">Automated Gate Security</div>
                    <div className="text-[10px] text-slate-300">142 Guests Verified Today (0.38s)</div>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="hidden sm:flex items-center gap-3 bg-slate-950/40 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/15 text-xs shadow-xl text-left">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-300 flex items-center justify-center text-base border border-brand-400/20 flex-shrink-0">
                    <i className="ri-wallet-3-fill"></i>
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 text-xs">Automated Dues Engine</div>
                    <div className="text-[10px] text-slate-300">₹45.2L Collected • 100% Reconciled</div>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="flex items-center justify-between sm:justify-center gap-2.5 bg-brand-950/40 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/15 text-xs shadow-xl">
                  <div className="flex items-center gap-2">
                    <i className="ri-sparkling-fill text-yellow-300 text-base"></i>
                    <span className="font-extrabold text-white text-xs">ResiFlow OS 2.0</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping sm:ml-1"></span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
