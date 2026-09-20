import React, { useState } from 'react';

interface WhyChooseUsProps {
  onLearnMore?: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onLearnMore }) => {
  const [activeStoryTime, setActiveStoryTime] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  const storyTimeline = [
    {
      id: 'morning',
      time: '07:30 AM',
      tag: 'Morning Rush & Commute',
      title: 'Zero-Touch Gate Entry & Instant Staff Check-In',
      narrative:
        'Residents leave for work with automated ANPR license plate recognition lifting the boom barrier in under 0.4 seconds. Meanwhile, domestic staff and drivers check in via quick biometrics, sending instant arrival alerts to resident phones.',
      icon: 'ri-sun-cloudy-line',
      iconColor: 'text-amber-500 bg-amber-50 border-amber-200',
      uiBadge: 'ANPR Gate #1: CLEARED (0.38s)',
      uiVisual: {
        title: 'Gate #1 FastPass Active',
        user: 'Rahul Sharma • BMW 330i (KA-01-MJ-2024)',
        metric: 'Barrier Auto-Opened in 0.38s',
        status: 'Staff Check-In: Sunita (Maid) Arrived at Tower A',
      },
    },
    {
      id: 'afternoon',
      time: '01:15 PM',
      tag: 'Midday Packages & Guests',
      title: 'Secure Parcel Lockers & 1-Tap Delivery Clearance',
      narrative:
        'Deliveries from Amazon, Swiggy, and Blinkit are verified instantly at the gate terminal. Residents receive a secure 4-digit OTP or digital pass without having to pick up annoying calls while in office meetings.',
      icon: 'ri-gift-line',
      iconColor: 'text-sky-500 bg-sky-50 border-sky-200',
      uiBadge: 'Delivery Verified (Amazon)',
      uiVisual: {
        title: 'Delivery Fast-Track #SR-8841',
        user: 'Swiggy Food • Order for Flat A-502',
        metric: 'Gate Approved via 1-Tap Resident App',
        status: 'Digital OTP: 5821 • Security Verified',
      },
    },
    {
      id: 'evening',
      time: '06:45 PM',
      tag: 'Community Recreation',
      title: 'Conflict-Free Clubhouse & Sports Booking',
      narrative:
        'Families book the swimming pool, squash court, or banquet lawn directly from the app. Automated slot scheduling prevents double-bookings, while digital lights & access control activate automatically for reserved hours.',
      icon: 'ri-basketball-line',
      iconColor: 'text-brand-600 bg-rose-50 border-rose-200',
      uiBadge: 'Tennis Court #2: RESERVED',
      uiVisual: {
        title: 'Amenity Access Token Active',
        user: 'Rahul Sharma • Tennis Court Slot (07:00 PM)',
        metric: 'Clubhouse Smart Lock: UNLOCKED',
        status: 'Pass Shared with Guest: Ankit Verma ✓',
      },
    },
    {
      id: 'night',
      time: '11:30 PM',
      tag: 'Night Watch & Safety',
      title: 'RFID Guard Patrolling & 1-Tap Instant SOS',
      narrative:
        'Security guards scan geo-fenced RFID tags across the township perimeter during hourly night patrols. If a senior citizen or child triggers the SOS button, an instant haptic siren alerts on-duty guards and gate supervisors immediately.',
      icon: 'ri-shield-flash-line',
      iconColor: 'text-emerald-500 bg-emerald-50 border-emerald-200',
      uiBadge: 'Perimeter Guard Patrol: 100% On Track',
      uiVisual: {
        title: 'Township Perimeter Security',
        user: 'Guard Vikram Singh • RFID Checkpoint #14',
        metric: 'Patrol SLA: 100% Completed on Time',
        status: '24/7 Emergency Siren: Ready & Armed (0.0s)',
      },
    },
  ];

  const currentStory = storyTimeline.find((s) => s.id === activeStoryTime)!;

  return (
    <section id="why-us" className="py-24 md:py-36 bg-white relative overflow-hidden bg-dot-pattern">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-rose-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-sky-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-brand-50 text-brand-600 border border-brand-200/70 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
            <span>EXPERIENCE THE DIFFERENCE</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-[54px] font-extrabold tracking-tight leading-tight text-faded-heading">
            A Day in the Life of a{' '}
            <span className="text-brand-gradient">Smarter Community</span>
          </h2>

          <p className="mt-4 text-slate-600 text-base sm:text-lg text-faded-sub">
            See how ResiFlow eliminates everyday residential friction from sunrise to midnight.
          </p>

          {/* Interactive Timeline Tabs */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 p-1.5 island-capsule rounded-full max-w-3xl mx-auto">
            {storyTimeline.map((item) => {
              const isActive = activeStoryTime === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveStoryTime(item.id as any)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/20 scale-[1.03]'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isActive ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {item.time}
                  </span>
                  <span>{item.tag.split('&')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Story Visualizer Stage: Asymmetric Story Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Left Storyteller Panel */}
          <div className="lg:col-span-6 bento-card p-8 sm:p-10 flex flex-col justify-between border-slate-200 shadow-2xl relative overflow-hidden bg-gradient-to-br from-white via-slate-50/50 to-rose-50/30">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${currentStory.iconColor} shadow-sm`}>
                  <i className={currentStory.icon}></i>
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 font-mono">
                    SCENARIO • {currentStory.time}
                  </span>
                  <div className="text-xs font-bold text-brand-600">{currentStory.tag}</div>
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug pt-2">
                {currentStory.title}
              </h3>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {currentStory.narrative}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{currentStory.uiBadge}</span>
              </div>

              <button
                onClick={onLearnMore}
                className="text-xs font-bold text-slate-800 hover:text-brand-600 flex items-center gap-1 group transition-colors"
              >
                <span>Live Walkthrough</span>
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>

          {/* Right Live Device & Telemetry Simulator Panel */}
          <div className="lg:col-span-6 bento-card p-8 sm:p-10 flex flex-col justify-between border-slate-200 shadow-2xl relative bg-slate-950 text-white overflow-hidden">
            {/* Background glowing gradient orb */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-slate-400 ml-2">RESIFLOW-TERMINAL-OS</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  REAL-TIME SYNC
                </span>
              </div>

              {/* Dynamic Telemetry Box */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4 shadow-inner">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-brand-400 uppercase tracking-wider font-mono">
                      EVENT TRIGGERED
                    </div>
                    <div className="text-base font-extrabold text-white mt-0.5">
                      {currentStory.uiVisual.title}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{currentStory.time}</span>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
                  <div className="text-slate-300">
                    <span className="text-slate-500">TARGET:</span> {currentStory.uiVisual.user}
                  </div>
                  <div className="text-emerald-400 font-bold">
                    <span className="text-slate-500">BENCHMARK:</span> {currentStory.uiVisual.metric}
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-500">LOG:</span> {currentStory.uiVisual.status}
                  </div>
                </div>
              </div>

              {/* Live Status Indicators */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-slate-400 text-[10px] font-mono">ENCRYPTION PROTOCOL</div>
                  <div className="text-white font-bold mt-0.5 flex items-center gap-1.5">
                    <i className="ri-lock-2-line text-emerald-400"></i>
                    <span>256-Bit AES End-to-End</span>
                  </div>
                </div>

                <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-slate-400 text-[10px] font-mono">SYSTEM LATENCY</div>
                  <div className="text-white font-bold mt-0.5 flex items-center gap-1.5">
                    <i className="ri-flashlight-line text-amber-400"></i>
                    <span>18ms Gate Response</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Active across 100+ Gated Townships</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">v2.4.8-PROD</span>
            </div>
          </div>

        </div>

        {/* The 3 Core Architecture Pillars: Asymmetric Modern Bento Cards */}
        <div className="mt-20 pt-16 border-t border-slate-100">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Society Committees & RWAs Choose <span className="text-brand-600">ResiFlow</span>
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Three uncompromised engineering pillars that safeguard your residential ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bento-card p-8 text-left flex flex-col justify-between group hover:border-rose-300">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-brand-600 flex items-center justify-center text-2xl mb-5 border border-rose-100 group-hover:scale-110 transition-transform">
                  <i className="ri-shield-keyhole-line"></i>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60 inline-block mb-3">
                  ISO 27001 & SOC-2
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                  Ironclad Security & Data Privacy
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  Resident phone numbers are masked for privacy. Gate visitor logs are end-to-end encrypted with zero third-party telemetry selling.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bento-card p-8 text-left flex flex-col justify-between group hover:border-pink-300 md:-translate-y-2 border-brand-200/80 bg-white">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-2xl mb-5 border border-pink-100 group-hover:scale-110 transition-transform">
                  <i className="ri-heart-pulse-line"></i>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-700 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200/60 inline-block mb-3">
                  Universal Design
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                  Zero Learning Curve for All Ages
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  Designed specifically for senior citizens and security personnel with high-contrast buttons, voice assistance, and large-touch approval buttons.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bento-card p-8 text-left flex flex-col justify-between group hover:border-emerald-300">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-5 border border-emerald-100 group-hover:scale-110 transition-transform">
                  <i className="ri-line-chart-line"></i>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 inline-block mb-3">
                  50 to 5,000+ Units
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                  Township-Scale Microservices
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  Whether managing a standalone 40-flat building or a multi-tower 5,000 unit mega township, our cloud architecture guarantees 99.98% uptime SLA.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
