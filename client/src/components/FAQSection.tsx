import React, { useState } from 'react';

export const FAQSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'security' | 'billing' | 'onboarding'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const categories = [
    { id: 'all', name: 'All Questions', icon: 'ri-apps-2-line' },
    { id: 'security', name: 'Gate & ANPR Security', icon: 'ri-shield-keyhole-line' },
    { id: 'billing', name: 'Maintenance & UPI', icon: 'ri-wallet-3-line' },
    { id: 'onboarding', name: 'Hardware & Migration', icon: 'ri-settings-4-line' },
  ];

  const faqs = [
    {
      id: 1,
      category: 'onboarding',
      q: 'How fast can our society be onboarded from an existing vendor?',
      a: 'We can migrate your entire residential society in as little as 24 to 48 hours. Our dedicated onboarding specialists handle complete bulk resident data imports, existing RFID boom barrier sync, and on-site security guard tablet training.',
      tag: '48-Hour Guarantee',
    },
    {
      id: 2,
      category: 'security',
      q: 'How does automated ANPR boom barrier integration work?',
      a: 'High-speed AI ANPR cameras scan authorized resident license plates as vehicles approach the gate. The boom barrier lifts automatically in 0.38 seconds without rolling down windows or swiping cards, while preventing tailgating.',
      tag: 'ANPR FastPass',
    },
    {
      id: 3,
      category: 'billing',
      q: 'Is there any transaction fee or commission on resident maintenance payments?',
      a: 'No! ResiFlow does not take any percentage cut or hidden commission on your society dues. Payments made via UPI, Google Pay, PhonePe, Paytm, or NetBanking go 100% directly into your society’s registered bank account.',
      tag: '0% Commission',
    },
    {
      id: 4,
      category: 'security',
      q: 'What happens if an incoming visitor does not have a smartphone?',
      a: 'Security guards use the ResiFlow Guard Console tablet to quickly register the guest with their name and vehicle number. A real-time 4-digit OTP approval and IVR phone call is instantly dispatched to the resident flat owner.',
      tag: 'Universal Access',
    },
    {
      id: 5,
      category: 'onboarding',
      q: 'Is our resident phone number and financial accounting data secure?',
      a: 'Yes, 100%. We employ bank-grade 256-bit AES encryption with ISO 27001 and SOC-2 Type II data compliance. Resident contact numbers are automatically masked for privacy, and daily cloud snapshots prevent any data loss.',
      tag: 'ISO 27001 Certified',
    },
    {
      id: 6,
      category: 'billing',
      q: 'Can the platform handle complex per-sqft calculations, sinking funds, and GST?',
      a: 'Absolutely. The automated billing engine supports slab-based per-sqft rates, fixed sinking fund reserves, water meter readings, penalty calculations for late dues, and instant digitally signed GST invoices.',
      tag: 'Automated Ledger',
    },
    {
      id: 7,
      category: 'onboarding',
      q: 'Do we need to buy expensive proprietary hardware from you?',
      a: 'No. ResiFlow is hardware-agnostic. Our platform seamlessly connects with your existing RFID boom barriers, biometric scanners, and CCTV cameras. Guard tablets work on any standard Android tablet.',
      tag: 'Zero Vendor Lock-In',
    },
  ];

  // Filter based on active category & search query
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-24 md:py-36 bg-[#F8FAFC] relative overflow-hidden bg-dot-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-brand-50 text-brand-600 border border-brand-200/70 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-faded-heading">
            Everything You Need to <span className="text-brand-gradient">Know</span>
          </h2>

          <p className="mt-4 text-slate-600 text-base sm:text-lg text-faded-sub">
            Clear answers about security, onboarding, billing automation, and hardware integrations.
          </p>

          {/* Live Search & Filter Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
            <div className="relative w-full">
              <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base"></i>
              <input
                type="text"
                placeholder="Search questions (e.g., ANPR, UPI, migration, hardware)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <i className="ri-close-circle-fill text-base"></i>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300 hover:text-slate-950'
                  }`}
                >
                  <i className={cat.icon}></i>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Bento FAQ Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Helpdesk & Support Bento Box */}
          <div className="lg:col-span-4 bento-card p-6 sm:p-8 space-y-6 text-left border-slate-200 shadow-xl bg-gradient-to-br from-white to-slate-50">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-2xl border border-brand-100 shadow-sm">
              <i className="ri-customer-service-2-fill"></i>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Still have questions?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Our society consultants are available 24/7 to review your complex's specific layout and hardware setup.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200/80 hover:border-brand-300 transition-colors shadow-sm group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                  <i className="ri-phone-fill"></i>
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">Direct Helpline</div>
                  <div className="text-xs font-bold text-slate-800">+91 98765 43210</div>
                </div>
              </a>

              <a
                href="mailto:support@resiflow.com"
                className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200/80 hover:border-brand-300 transition-colors shadow-sm group"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-brand-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                  <i className="ri-mail-fill"></i>
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">Email Onboarding</div>
                  <div className="text-xs font-bold text-slate-800">support@resiflow.com</div>
                </div>
              </a>
            </div>

            <div className="pt-2">
              <div className="p-3.5 bg-brand-50/60 rounded-2xl border border-brand-100/80 text-center">
                <span className="text-[11px] font-bold text-brand-800 block">
                  📄 Download Society Onboarding Guide
                </span>
                <span className="text-[10px] text-brand-600">Free PDF for RWA Management Committee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Accordion List */}
          <div className="lg:col-span-8 space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="bento-card p-10 text-center text-slate-500">
                <i className="ri-search-eye-line text-4xl text-slate-300 mb-2 block"></i>
                <div className="font-bold text-slate-700">No questions found matching "{searchQuery}"</div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-3 text-xs font-bold text-brand-600 underline"
                >
                  Clear search and show all FAQs
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIdx === idx;
                const formattedIndex = String(idx + 1).padStart(2, '0');

                return (
                  <div
                    key={faq.id}
                    className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? 'bg-white border-brand-300 shadow-xl shadow-brand-500/5 ring-2 ring-brand-500/10'
                        : 'bg-white/90 border-slate-200/80 shadow-soft-sm hover:border-slate-300'
                    }`}
                  >
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="w-full px-6 py-5 text-left flex items-start justify-between gap-4 focus:outline-none group"
                    >
                      <div className="flex items-start gap-3.5">
                        <span className="font-mono text-xs font-bold text-brand-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200/60 flex-shrink-0 mt-0.5">
                          {formattedIndex}
                        </span>
                        <div>
                          <span className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors block">
                            {faq.q}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 inline-block">
                            {faq.tag}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? 'bg-brand-600 text-white rotate-180 shadow-md' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <i className="ri-arrow-down-s-line text-xl"></i>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fadeIn pl-14">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
