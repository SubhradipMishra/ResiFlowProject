import React, { useState } from 'react';

interface PricingSectionProps {
  onSelectPlan: (planName: string, price: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const flatCountSlider = 250;
  const [showFeatureMatrix, setShowFeatureMatrix] = useState(false);

  // Per flat estimate calculation
  const calculatedMonthlyPerFlat = (5999 / flatCountSlider).toFixed(0);

  const plans = [
    {
      id: 'basic',
      name: 'Essential Gate',
      badge: 'Standalone Buildings',
      monthlyPrice: '₹2,999',
      annualPrice: '₹2,399',
      period: '/month',
      isPopular: false,
      description: 'Engineered for single-tower societies & boutique apartment complexes up to 100 units.',
      features: [
        'Up to 100 resident flats',
        'Digital QR visitor passes & OTP gate logs',
        'Complaint ticketing with photo uploads',
        'Staff & domestic maid attendance logs',
        'Basic accounting ledger & digital receipts',
        'Standard email & WhatsApp support',
      ],
      notIncluded: [
        'Automated ANPR boom barrier integration',
        'Amenity & clubhouse slot scheduler',
        'Multi-tower committee admin roles',
      ],
      cta: 'Start with Essential',
      ctaStyle: 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-sm',
    },
    {
      id: 'pro',
      name: 'Smart Community Pro',
      badge: 'Most Popular Choice',
      monthlyPrice: '₹5,999',
      annualPrice: '₹4,799',
      period: '/month',
      isPopular: true,
      description: 'The complete community operating system for modern societies seeking 100% automation.',
      features: [
        'Up to 600 resident flats & multiple towers',
        'Automated 1-click UPI & Card dues engine',
        'AI ANPR gate barrier & FastPass sync',
        'Interactive Clubhouse, Pool & Tennis booking',
        'Emergency 1-tap SOS guard dispatch',
        'Automated WhatsApp dues reminder bot',
        '24/7 Priority phone & on-site guard onboarding',
      ],
      notIncluded: [],
      cta: 'Get Started with Pro',
      ctaStyle: 'bg-gradient-to-r from-brand-700 via-brand-600 to-rose-500 hover:from-brand-800 hover:to-brand-600 text-white shadow-xl shadow-brand-500/30 hover:shadow-brand-500/40 hover:scale-[1.02]',
    },
    {
      id: 'enterprise',
      name: 'Township Federation',
      badge: 'Mega Complexes & RWAs',
      monthlyPrice: 'Custom',
      annualPrice: 'Custom',
      period: '',
      isPopular: false,
      description: 'Tailored enterprise architecture for 1,000+ unit townships, multi-society federations & developers.',
      features: [
        'Unlimited flats, towers & gated zones',
        'Multi-complex centralized master dashboard',
        'Custom IoT boom barriers & CCTV integration',
        'Full REST API, ERP & SAP accounting webhooks',
        'Dedicated on-premise relationship manager',
        'Custom white-labeled resident mobile app',
        'Strict 99.98% financial SLA guarantee',
      ],
      notIncluded: [],
      cta: 'Request Enterprise Proposal',
      ctaStyle: 'bg-slate-950 hover:bg-slate-900 text-white shadow-lg shadow-slate-950/20',
    },
  ];

  const fullFeatureComparison = [
    { feature: 'Visitor Pass Generation (QR / OTP / SMS)', essential: 'Included', pro: 'Included', enterprise: 'Unlimited + Voice' },
    { feature: 'Automated ANPR License Plate Barrier', essential: '—', pro: 'Included', enterprise: 'Multi-Gate ANPR' },
    { feature: 'Automated Invoicing & WhatsApp Reminders', essential: 'Basic', pro: '1-Click Auto Pay', enterprise: 'Custom ERP Sync' },
    { feature: 'Clubhouse & Sports Slot Booking', essential: '—', pro: 'Included', enterprise: 'Multi-Facility IoT' },
    { feature: 'Emergency SOS 1-Tap Guard Dispatch', essential: 'App Notification', pro: 'Haptic Gate Siren', enterprise: 'Direct Police/Fire SLA' },
    { feature: 'Guard Tablet & RFID Patrol Checkpoints', essential: '1 Gate', pro: 'Up to 4 Gates', enterprise: 'Unlimited Patrol Points' },
    { feature: 'Data Encryption & Masking', essential: '256-Bit AES', pro: '256-Bit AES + SOC2', enterprise: 'Dedicated Private Cloud' },
  ];

  return (
    <section id="pricing" className="py-24 md:py-36 bg-white relative overflow-hidden bg-dot-pattern">
      {/* Radiant Background Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-rose-100/30 via-brand-50/20 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-brand-50 text-brand-600 border border-brand-200/70 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
            <span>TRANSPARENT SOCIETY PRICING</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-[54px] font-extrabold tracking-tight text-faded-heading">
            Simple, Predictable Plans for <span className="text-brand-gradient">Every Society</span>
          </h2>

          <p className="mt-4 text-slate-600 text-base sm:text-lg text-faded-sub">
            Zero hidden charges. No per-transaction commission on society dues. Upgrade anytime as your community grows.
          </p>

          {/* Billing Switcher with Glow */}
          <div className="mt-8 inline-flex items-center gap-2 island-capsule p-1.5 rounded-full border border-slate-200/80 shadow-md">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                !isAnnual ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                isAnnual ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold shadow-sm">
                SAVE 20%
              </span>
            </button>
          </div>

          {/* Micro Cost Estimator Badge */}
          <div className="mt-6 inline-block bg-slate-50 border border-slate-200/70 rounded-2xl px-5 py-2 text-xs text-slate-600">
            <span>For a typical 250-flat society, ResiFlow costs approx. </span>
            <span className="font-extrabold text-brand-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              ₹{calculatedMonthlyPerFlat} / flat / month
            </span>
            <span className="text-slate-400"> (less than a single cup of tea!)</span>
          </div>
        </div>

        {/* 3 Ultra-Premium Tier Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan) => {
            const displayPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`rounded-[32px] p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.isPopular
                    ? 'bg-white border-2 border-brand-500 shadow-2xl shadow-brand-500/20 lg:-translate-y-4 ring-4 ring-brand-500/10'
                    : 'bento-card bg-white/90 shadow-lg'
                }`}
              >
                {/* Popular Choice Radiant Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-brand-700 via-brand-600 to-rose-500 text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-brand-500/30 border border-white/30 flex items-center gap-1.5">
                      <i className="ri-sparkling-fill text-yellow-300 text-xs"></i>
                      <span>{plan.badge}</span>
                    </span>
                  </div>
                )}

                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{plan.name}</h3>
                    {!plan.isPopular && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 min-h-[34px] leading-relaxed">{plan.description}</p>

                  {/* Price Tag */}
                  <div className="mt-6 mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                        {displayPrice}
                      </span>
                      {plan.period && (
                        <span className="text-sm font-bold text-slate-500">{plan.period}</span>
                      )}
                    </div>
                    {isAnnual && plan.period && (
                      <div className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                        <i className="ri-checkbox-circle-fill"></i>
                        <span>Includes 2 months free + on-site guard onboarding</span>
                      </div>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                      WHAT'S INCLUDED:
                    </div>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-rose-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-rose-200">
                          <i className="ri-check-line text-xs font-black"></i>
                        </div>
                        <span className="font-semibold">{feat}</span>
                      </div>
                    ))}

                    {/* Excluded items if any */}
                    {plan.notIncluded.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-400">
                        <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <i className="ri-close-line text-xs"></i>
                        </div>
                        <span className="line-through">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Action Button */}
                <div>
                  <button
                    onClick={() => onSelectPlan(plan.name, displayPrice)}
                    className={`w-full py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 text-center ${plan.ctaStyle}`}
                  >
                    {plan.cta}
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-2.5 font-medium">
                    ⚡ 30-Day Free Society Pilot • Cancel Anytime
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix Drawer Toggle */}
        <div className="mt-16 text-center max-w-4xl mx-auto">
          <button
            onClick={() => setShowFeatureMatrix(!showFeatureMatrix)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-brand-600 bg-white border border-slate-200/90 px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all"
          >
            <span>{showFeatureMatrix ? 'Hide Full Technical Feature Matrix' : 'Compare All Technical Features in Detail'}</span>
            <i className={`ri-arrow-${showFeatureMatrix ? 'up' : 'down'}-s-line text-lg`}></i>
          </button>

          {showFeatureMatrix && (
            <div className="mt-8 bento-card p-6 sm:p-8 text-left overflow-x-auto animate-fadeIn shadow-2xl">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-[11px] font-extrabold uppercase">
                    <th className="pb-3 text-left">Feature / Capability</th>
                    <th className="pb-3 text-center">Essential</th>
                    <th className="pb-3 text-center text-brand-600">Smart Pro</th>
                    <th className="pb-3 text-center">Township</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {fullFeatureComparison.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-semibold text-slate-900">{row.feature}</td>
                      <td className="py-3 text-center text-slate-500">{row.essential}</td>
                      <td className="py-3 text-center font-bold text-brand-600 bg-rose-50/40">{row.pro}</td>
                      <td className="py-3 text-center text-slate-900 font-semibold">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
