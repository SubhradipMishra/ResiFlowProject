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
      iconFill: 'bg-amber-400 text-slate-900',
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
      iconFill: 'bg-teal-900 text-white',
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
      iconFill: 'bg-rose-600 text-white',
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
      iconFill: 'bg-slate-900 text-white',
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

  const pillars = [
    {
      icon: 'ri-shield-keyhole-line',
      fill: 'bg-rose-600 text-white',
      tag: 'ISO 27001 & SOC-2',
      tagFill: 'bg-white border-2 border-slate-900 text-slate-900',
      title: 'Ironclad security & data privacy',
      desc: 'Resident phone numbers are masked for privacy. Gate visitor logs are end-to-end encrypted with zero third-party telemetry selling.',
      border: 'border-slate-900',
    },
    {
      icon: 'ri-heart-pulse-line',
      fill: 'bg-teal-900 text-white',
      tag: 'Universal design',
      tagFill: 'bg-amber-400 text-slate-900',
      title: 'Zero learning curve for all ages',
      desc: 'Designed specifically for senior citizens and security personnel with high-contrast buttons, voice assistance, and large-touch approval buttons.',
      border: 'border-rose-600',
    },
    {
      icon: 'ri-line-chart-line',
      fill: 'bg-amber-400 text-slate-900',
      tag: '50 to 5,000+ units',
      tagFill: 'bg-white border-2 border-slate-900 text-slate-900',
      title: 'Township-scale microservices',
      desc: 'Whether managing a standalone 40-flat building or a multi-tower 5,000 unit mega township, our cloud architecture guarantees 99.98% uptime SLA.',
      border: 'border-slate-900',
    },
  ];

  return (
    <section id="why-us" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white text-slate-900 border-2 border-slate-900 mb-5">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <span className="uppercase tracking-wide">Experience the difference</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-[54px] font-extrabold tracking-tight leading-[1.05] text-slate-900">
            A day in the life of a
            <br />
            smarter community.
          </h2>

          <p className="mt-5 text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
            See how ResiFlow removes everyday residential friction from sunrise to midnight.
          </p>

          {/* Interactive Timeline Tabs */}
          <div className="mt-9 inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full border-2 border-slate-900 max-w-3xl mx-auto">
            {storyTimeline.map((item) => {
              const isActive = activeStoryTime === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveStoryTime(item.id as any)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors duration-200 flex items-center gap-2 ${isActive
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-rose-600' : 'bg-slate-100 text-slate-700'}`}>
                    {item.time}
                  </span>
                  <span>{item.tag.split('&')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Story Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-6xl mx-auto">

          {/* Left Storyteller Panel — flat card, solid icon fill, no pastel badge */}
          <div className="lg:col-span-6 rounded-[28px] border-2 border-slate-900 p-8 sm:p-10 flex flex-col justify-between bg-white">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 border-slate-900 ${currentStory.iconFill}`}>
                  <i className={currentStory.icon}></i>
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 font-mono">
                    Scenario • {currentStory.time}
                  </span>
                  <div className="text-xs font-bold text-rose-600">{currentStory.tag}</div>
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug pt-2">
                {currentStory.title}
              </h3>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {currentStory.narrative}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-slate-900/10 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-extrabold text-white bg-emerald-600 px-3.5 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <span>{currentStory.uiBadge}</span>
              </div>

              <button
                onClick={onLearnMore}
                className="text-xs font-extrabold text-slate-900 hover:text-rose-600 flex items-center gap-1.5 group transition-colors"
              >
                <span>Live walkthrough</span>
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>

          {/* Right Terminal Panel — flat teal block, matches Hero's teal doodle block */}
          <div className="lg:col-span-6 rounded-[28px] border-2 border-slate-900 p-8 sm:p-10 flex flex-col justify-between relative bg-teal-900 text-white overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-slate-300 ml-2">RESIFLOW-TERMINAL-OS</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-950 bg-emerald-400 px-2 py-0.5 rounded font-extrabold">
                  REAL-TIME SYNC
                </span>
              </div>

              <div className="bg-teal-950 rounded-2xl p-5 border-2 border-white/10 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-extrabold text-rose-300 uppercase tracking-wider font-mono">
                      Event triggered
                    </div>
                    <div className="text-base font-extrabold text-white mt-0.5">
                      {currentStory.uiVisual.title}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono whitespace-nowrap">{currentStory.time}</span>
                </div>

                <div className="p-3 bg-black/25 rounded-xl border border-white/10 text-xs font-mono space-y-1.5">
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

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-teal-950 p-3 rounded-xl border-2 border-white/10">
                  <div className="text-slate-400 text-[10px] font-mono">ENCRYPTION PROTOCOL</div>
                  <div className="text-white font-bold mt-0.5 flex items-center gap-1.5">
                    <i className="ri-lock-2-line text-emerald-400"></i>
                    <span>256-Bit AES E2E</span>
                  </div>
                </div>

                <div className="bg-teal-950 p-3 rounded-xl border-2 border-white/10">
                  <div className="text-slate-400 text-[10px] font-mono">SYSTEM LATENCY</div>
                  <div className="text-white font-bold mt-0.5 flex items-center gap-1.5">
                    <i className="ri-flashlight-line text-amber-400"></i>
                    <span>18ms Gate Response</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Active across 100+ gated townships</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">v2.4.8-PROD</span>
            </div>
          </div>

        </div>

        {/* Pillars — flat cards, solid tag fills instead of pastel bg+border */}
        <div className="mt-20 pt-16 border-t-2 border-slate-100">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h3 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Why committees & RWAs
              <br />
              choose <span className="text-rose-600">ResiFlow</span>
            </h3>
            <p className="text-slate-500 text-base mt-4">
              Three uncompromised engineering pillars that safeguard your residential ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {pillars.map((p) => (
              <div
                key={p.title}
                className={`rounded-[28px] border-2 ${p.border} p-8 text-left flex flex-col bg-white h-full`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 border-2 border-slate-900 ${p.fill}`}>
                  <i className={p.icon}></i>
                </div>
                <span className={`text-[11px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block mb-4 self-start ${p.tagFill}`}>
                  {p.tag}
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 leading-snug">
                  {p.title}
                </h4>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;