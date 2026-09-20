import React, { useState, useEffect, useRef } from 'react';

export const HowItWorks: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress from 0 (entering view) to 1 (passed through)
      const totalDistance = rect.height + windowHeight * 0.4;
      const currentScroll = windowHeight - rect.top;
      const rawProgress = currentScroll / totalDistance;
      const clamped = Math.max(0, Math.min(1, rawProgress));

      setScrollProgress(clamped);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      step: 1,
      num: '01',
      title: '48-Hour Society Setup & Sync',
      subtitle: 'ZERO DOWNTIME ONBOARDING',
      threshold: 0.12,
      description:
        'Our technical team uploads your society member database, maps apartment towers, and connects your existing RFID boom barriers & guard tablets in under 48 hours with zero hardware lock-in.',
      icon: 'ri-building-line',
      iconColor: 'text-brand-600 bg-rose-50 border-rose-200',
      badge: '48h Quick Deployment',
      align: 'left',
      telemetry: {
        label: 'DATA MIGRATION',
        val: '100% Bulk Resident Sync',
        sub: 'Existing RFID Barriers Connected',
      },
    },
    {
      step: 2,
      num: '02',
      title: 'Resident & Staff App Activation',
      subtitle: '1-TAP HOUSEHOLD CONFIGURATION',
      threshold: 0.35,
      description:
        'Residents download the app, add family members, register vehicle license plates for ANPR FastPass, and assign domestic staff with automated daily attendance tracking.',
      icon: 'ri-user-smile-line',
      iconColor: 'text-sky-600 bg-sky-50 border-sky-200',
      badge: 'Zero Learning Curve',
      align: 'right',
      telemetry: {
        label: 'MOBILE APP ACTIVATION',
        val: '1-Tap Resident FastPass',
        sub: 'Biometric Domestic Staff Sync',
      },
    },
    {
      step: 3,
      num: '03',
      title: 'Automated Daily Gate & Dues Engine',
      subtitle: 'AUTONOMOUS OPERATIONS',
      threshold: 0.58,
      description:
        'Visitors generate instant QR passes, deliveries are approved in 1 tap, boom barriers open automatically in 0.38s, and society maintenance dues are collected via direct UPI.',
      icon: 'ri-flashlight-line',
      iconColor: 'text-amber-600 bg-amber-50 border-amber-200',
      badge: '0.38s Gate Barrier SLA',
      align: 'left',
      telemetry: {
        label: 'REAL-TIME AUTOMATION',
        val: '0.38s Boom Barrier Response',
        sub: '1-Click Direct Bank UPI Dues',
      },
    },
    {
      step: 4,
      num: '04',
      title: 'Complete Committee Transparency',
      subtitle: 'FINANCIAL ACCURACY & PEACE OF MIND',
      threshold: 0.80,
      description:
        'RWA committees and treasurers enjoy zero-error audit ledgers, automated WhatsApp dues reminders, live night guard patrol tracking, and 24/7 emergency SOS dispatch.',
      icon: 'ri-shield-check-line',
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      badge: '99.98% Uptime SLA',
      align: 'right',
      telemetry: {
        label: 'AUDIT & GOVERNANCE',
        val: '100% Reconciled Bank Ledger',
        sub: 'Hourly Geo-Tagged Patrol Logs',
      },
    },
  ];

  // SVG total path length constant
  const totalPathLength = 1200;
  const strokeDashoffset = totalPathLength * (1 - Math.min(1, scrollProgress * 1.15));

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 md:py-36 bg-white relative overflow-hidden bg-dot-pattern transition-opacity duration-500"
    >
      {/* Radiant ambient glow */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-rose-100/35 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-sky-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-brand-50 text-brand-600 border border-brand-200/70 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
            <span>SCROLL-DRIVEN BLUEPRINT</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-[54px] font-extrabold tracking-tight text-faded-heading">
            How It Works: The <span className="text-brand-gradient">Frictionless Route</span>
          </h2>

          <p className="mt-4 text-slate-600 text-base sm:text-lg text-faded-sub">
            Scroll down to watch the autonomous society journey unfold milestone by milestone.
          </p>

          {/* Scroll percentage indicator pill */}
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100/80 rounded-full text-[11px] font-mono font-bold text-slate-700 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></span>
            <span>Route Progress: {Math.round(scrollProgress * 100)}% Completed</span>
          </div>
        </div>

        {/* Winding Road / Curly Route Timeline Container */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Progressively Drawn Curly SVG Road Path (Desktop & Tablet) */}
          <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 800 1200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              {/* Background Faint Road Guide */}
              <path
                d="M 400 40 C 650 160, 650 340, 400 440 C 150 540, 150 720, 400 820 C 620 900, 580 1060, 400 1140"
                stroke="#f1f5f9"
                strokeWidth="16"
                strokeLinecap="round"
              />
              <path
                d="M 400 40 C 650 160, 650 340, 400 440 C 150 540, 150 720, 400 820 C 620 900, 580 1060, 400 1140"
                stroke="#cbd5e1"
                strokeWidth="3"
                strokeDasharray="6 8"
                strokeLinecap="round"
              />

              {/* Progressively Drawn Glowing Animated Road Stroke */}
              <path
                d="M 400 40 C 650 160, 650 340, 400 440 C 150 540, 150 720, 400 820 C 620 900, 580 1060, 400 1140"
                stroke="url(#scrollRoadGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                style={{
                  strokeDasharray: totalPathLength,
                  strokeDashoffset: strokeDashoffset,
                  transition: 'stroke-dashoffset 0.15s ease-out',
                }}
              />

              {/* Gradient Definition */}
              <defs>
                <linearGradient id="scrollRoadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#be123c" />
                  <stop offset="40%" stopColor="#e11d48" />
                  <stop offset="70%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Stepper Cards with Scroll Reveal / Fade Out */}
          <div className="space-y-16 sm:space-y-24 relative z-10">
            {steps.map((item) => {
              const isLeft = item.align === 'left';
              const isReached = scrollProgress >= item.threshold;
              const isPassed = scrollProgress > item.threshold + 0.35;

              // Calculate card reveal opacity & transform dynamically
              let cardOpacity = 0.25;
              let cardTransform = 'translateY(30px) scale(0.96)';

              if (isReached && !isPassed) {
                cardOpacity = 1;
                cardTransform = 'translateY(0px) scale(1)';
              } else if (isPassed) {
                // Fades out softly as user continues scrolling down
                cardOpacity = 0.85;
                cardTransform = 'translateY(-6px) scale(0.99)';
              }

              return (
                <div
                  key={item.step}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${
                    isLeft ? '' : 'md:flex-row-reverse'
                  }`}
                  style={{
                    opacity: cardOpacity,
                    transform: cardTransform,
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Left-Aligned Card Position */}
                  <div
                    className={`md:col-span-5 ${
                      isLeft ? 'md:text-right' : 'md:order-2 md:text-left'
                    }`}
                  >
                    <div
                      className={`bento-card p-7 sm:p-9 shadow-xl border-slate-200 transition-all duration-300 group ${
                        isReached
                          ? 'border-brand-300 ring-4 ring-brand-500/15 shadow-2xl bg-white'
                          : 'bg-white/80'
                      }`}
                    >
                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:justify-end' : 'justify-start'}`}>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono">
                          {item.subtitle}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isReached
                              ? 'text-brand-700 bg-rose-50 border-rose-200'
                              : 'text-slate-400 bg-slate-100 border-slate-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-brand-600 transition-colors">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {item.description}
                      </p>

                      {/* Mini Live Telemetry Strip */}
                      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-slate-400">{item.telemetry.label}:</span>
                          <span className={`font-bold ${isReached ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {item.telemetry.val}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">{item.telemetry.sub}</div>
                      </div>
                    </div>
                  </div>

                  {/* Center Animated Milestone Node on the Curly Road */}
                  <div className="md:col-span-2 flex flex-col items-center justify-center relative">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center text-xl font-black transition-all duration-500 shadow-xl border-2 z-20 ${
                        isReached
                          ? 'bg-gradient-to-tr from-brand-700 to-rose-500 text-white border-white scale-110 shadow-brand-500/40 ring-4 ring-brand-500/20'
                          : 'bg-white text-slate-400 border-slate-200 shadow-slate-100'
                      }`}
                    >
                      <div className="flex flex-col items-center leading-none">
                        <span className="text-sm sm:text-base font-black font-mono">{item.num}</span>
                      </div>
                    </div>

                    <div className="mt-2 hidden md:flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span>Milestone {item.step}</span>
                    </div>
                  </div>

                  {/* Right-Aligned Live Telemetry Box */}
                  <div
                    className={`md:col-span-5 ${
                      isLeft ? 'md:order-3 md:text-left' : 'md:order-1 md:text-right'
                    }`}
                  >
                    <div
                      className={`hidden md:block p-6 rounded-3xl border transition-all duration-500 text-xs font-mono shadow-inner ${
                        isReached
                          ? 'bg-slate-900 text-white border-slate-800 shadow-2xl'
                          : 'bg-slate-50/60 text-slate-400 border-slate-200/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800/80">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isReached ? 'bg-emerald-400 animate-ping' : 'bg-slate-300'
                          }`}
                        ></span>
                        <span className="font-bold text-[10px] uppercase">
                          CHECKPOINT #{item.num} VERIFICATION
                        </span>
                      </div>
                      <div className="font-bold text-xs">
                        {isReached ? item.title : 'Approaching Checkpoint...'}
                      </div>
                      <div className={`text-[11px] mt-1 font-semibold ${isReached ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {isReached ? '✓ Milestone Activated in Real Time' : 'Waiting for Route Trigger'}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
