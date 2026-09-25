import React, { useState } from 'react';

interface PricingSectionProps {
  onSelectPlan?: (planName: string, price: string) => void;
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
      icon: 'ri-building-line',
      iconBg: 'bg-amber-400',
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
      ctaStyle: 'bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900',
    },
    {
      id: 'pro',
      name: 'Smart Community Pro',
      badge: 'Most Popular Choice',
      monthlyPrice: '₹5,999',
      annualPrice: '₹4,799',
      period: '/month',
      isPopular: true,
      icon: 'ri-sparkling-fill',
      iconBg: 'bg-rose-600',
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
      ctaStyle: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
    {
      id: 'enterprise',
      name: 'Township Federation',
      badge: 'Mega Complexes & RWAs',
      monthlyPrice: 'Custom',
      annualPrice: 'Custom',
      period: '',
      isPopular: false,
      icon: 'ri-team-fill',
      iconBg: 'bg-teal-900',
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
      ctaStyle: 'bg-slate-900 hover:bg-slate-800 text-white',
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
    <section id="pricing" className="py-24 md:py-36 bg-[#FAF9F6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white text-slate-900 border-2 border-slate-900 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            <span>Transparent society pricing</span>
          </div>

          <h2 className="text-5xl sm:text-6xl md:text-[64px] font-extrabold tracking-tight text-slate-900">
            Simple, predictable plans for every society
          </h2>

          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Zero hidden charges. No per-transaction commission on society dues. Upgrade anytime as your community grows.
          </p>

          {/* Billing Switcher */}
          <div className="mt-8 inline-flex items-center gap-2 p-1.5 rounded-full border-2 border-slate-900">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-colors ${!isAnnual ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${isAnnual ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              <span>Annual Billing</span>
              <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-extrabold">
                SAVE 20%
              </span>
            </button>
          </div>

          {/* Micro Cost Estimator Badge */}
          <div className="mt-6 inline-block bg-white border-2 border-slate-200 rounded-2xl px-5 py-2 text-xs text-slate-600">
            <span>For a typical 250-flat society, ResiFlow costs approx. </span>
            <span className="font-extrabold text-rose-600">
              ₹{calculatedMonthlyPerFlat} / flat / month
            </span>
            <span className="text-slate-400"> (less than a single cup of tea!)</span>
          </div>
        </div>

        {/* 3 Flat, Ink-Outlined Tier Cards — matching the Floto pricing card layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan) => {
            const displayPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-colors duration-200 relative bg-white border-2 ${plan.isPopular ? 'border-rose-600 lg:-translate-y-2' : 'border-slate-300'
                  }`}
              >
                <div>
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl ${plan.iconBg} text-white flex items-center justify-center text-2xl mb-5`}>
                    <i className={plan.icon}></i>
                  </div>

                  {plan.isPopular && (
                    <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-white bg-rose-600 px-2.5 py-1 rounded-full mb-2">
                      {plan.badge}
                    </span>
                  )}

                  {/* Category Header */}
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{plan.name}</h3>
                  <p className="text-sm font-bold text-slate-500 mt-1">{plan.badge}</p>
                  <p className="text-xs text-slate-500 mt-2 min-h-[34px] leading-relaxed">{plan.description}</p>

                  {/* Price Tag */}
                  <div className="mt-6 mb-6 pb-6 border-b-2 border-slate-100">
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

                  {/* Feature Checklist — plain outline check icons, no colored badge backgrounds */}
                  <div className="space-y-3 mb-8">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                      What's included
                    </div>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                        <i className="ri-checkbox-circle-line text-lg text-slate-900 flex-shrink-0"></i>
                        <span className="font-semibold">{feat}</span>
                      </div>
                    ))}

                    {/* Excluded items if any */}
                    {plan.notIncluded.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-400">
                        <i className="ri-close-circle-line text-lg text-slate-300 flex-shrink-0"></i>
                        <span className="line-through">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Action Button */}
                <div>
                  <button
                    onClick={() => onSelectPlan(plan.name, displayPrice)}
                    className={`w-full py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-colors duration-200 text-center ${plan.ctaStyle}`}
                  >
                    {plan.cta}
                  </button>
                  <p className="text-xs text-slate-400 text-center mt-2.5 font-medium">
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
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 hover:text-rose-600 bg-white border-2 border-slate-900 px-6 py-3 rounded-full transition-colors"
          >
            <span>{showFeatureMatrix ? 'Hide Full Technical Feature Matrix' : 'Compare All Technical Features in Detail'}</span>
            <i className={`ri-arrow-${showFeatureMatrix ? 'up' : 'down'}-s-line text-lg`}></i>
          </button>

          {showFeatureMatrix && (
            <div className="mt-8 rounded-[28px] border-2 border-slate-900 bg-white p-6 sm:p-8 text-left overflow-x-auto animate-fadeIn">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-400 text-[11px] font-extrabold uppercase">
                    <th className="pb-3 text-left">Feature / Capability</th>
                    <th className="pb-3 text-center">Essential</th>
                    <th className="pb-3 text-center text-rose-600">Smart Pro</th>
                    <th className="pb-3 text-center">Township</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {fullFeatureComparison.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-3 font-semibold text-slate-900">{row.feature}</td>
                      <td className="py-3 text-center text-slate-500">{row.essential}</td>
                      <td className="py-3 text-center font-bold text-rose-600 bg-rose-50">{row.pro}</td>
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

export default PricingSection;