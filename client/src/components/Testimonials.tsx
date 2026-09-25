import React from 'react';

export const Testimonials: React.FC = () => {
  const column1 = [
    {
      quote:
        'ResiFlow has made our society management so much easier. From visitor entry to maintenance payments, everything is now just a click away without WhatsApp chaos.',
      author: 'Rohit Mehta',
      role: 'Society President',
      society: 'Green Valley Residency',
      unit: 'Flat A-502 (420 Units)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      tag: 'Maintenance & Security',
    },
    {
      quote:
        'The maintenance collection rate in our township jumped from 72% to 98% within two months of adopting ResiFlow. The auto reminders and UPI receipts work like magic!',
      author: 'Ananya Deshmukh',
      role: 'Treasurer & RWA Member',
      society: 'Palm Heights Township',
      unit: 'Tower C-1204 (850 Units)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      tag: 'Automated Billing',
    },
    {
      quote:
        'The ANPR boom barrier integration is phenomenal. My car barrier lifts before I even reach the white line. No waiting, no rolling down windows in the rain.',
      author: 'Sameer Kulkarni',
      role: 'Resident & Tech Architect',
      society: 'Windsor Grande Township',
      unit: 'Villa #18',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      tag: 'ANPR FastPass',
    },
    {
      quote:
        'Pre-approved guest QR codes have eliminated all the morning delivery bottlenecks. Security guards are more relaxed and professional.',
      author: 'Dr. Priya Nambiar',
      role: 'Resident Doctor',
      society: 'Prestige Lakeside',
      unit: 'Tower 4-802',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      tag: 'Visitor Passes',
    },
  ];

  const column2 = [
    {
      quote:
        'Security guard patrolling with RFID checkpoints brought complete peace of mind to all families. We can see live patrol logs right in the management dashboard.',
      author: 'Col. Vikram Malhotra',
      role: 'Managing Committee Secretary',
      society: 'Skyline Royal Palms',
      unit: 'Tower B-301 (1,200 Flats)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      tag: 'Guard Patrols',
    },
    {
      quote:
        'Clubhouse booking used to cause arguments between residents every weekend. Now everything is visible on the live timetable and payments are instantaneous.',
      author: 'Sneha Kapoor',
      role: 'Cultural Committee Head',
      society: 'Sobha Silicon Oasis',
      unit: 'Flat 704 (600 Flats)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      tag: 'Clubhouse Scheduler',
    },
    {
      quote:
        'Our senior citizen residents found the large touch interface extremely simple to use. The 1-tap SOS trigger gives older couples living alone immense confidence.',
      author: 'Arunav Sengupta',
      role: 'RWA Vice President',
      society: 'Godrej Woods Residency',
      unit: 'Tower 2-1102',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      tag: 'Senior Friendly',
    },
    {
      quote:
        'Zero reconciliation hassle at month-end. Our accounting team saves over 40 hours every month on bank reconciliation.',
      author: 'Rajiv Chawla',
      role: 'Auditor & Committee Member',
      society: 'DLF Crest Park',
      unit: 'Tower 6-402',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      tag: 'Accounting SLA',
    },
  ];

  const column3 = [
    {
      quote:
        'The digital notice board and polling feature have boosted our AGM attendance and resolution pass rates to an all-time high.',
      author: 'Meenakshi Sundaram',
      role: 'Secretary',
      society: 'Purva Riviera Apartments',
      unit: 'Flat E-203 (350 Units)',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      tag: 'Digital Notices',
    },
    {
      quote:
        'Complaint ticketing with technician photo verification is top tier. Electricians arrive with OTP verification and close tickets in under 3 hours.',
      author: 'Karan Mehra',
      role: 'Managing Committee Member',
      society: 'Brigade Metropolis',
      unit: 'Tower Arcade 901',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      tag: 'Helpdesk SLA',
    },
    {
      quote:
        'We migrated 1,400 flats from an old legacy vendor in under 48 hours. The ResiFlow onboarding support team was with us on-site 24/7.',
      author: 'Siddharth Roy',
      role: 'Operations Director',
      society: 'Hiranandani Meadows',
      unit: 'Tower Iris 1502',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      tag: '48h Onboarding',
    },
    {
      quote:
        'Seamless multi-society management from a single master dashboard. We oversee 4 gated complexes from one central admin console.',
      author: 'Nandita Joshi',
      role: 'Estate Manager',
      society: 'Lodha Parklands Federation',
      unit: 'Central Command',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      tag: 'Multi-Society Hub',
    },
  ];

  // Helper card component
  const ReviewCard = ({ item }: { item: (typeof column1)[0] }) => (
    <div className="rounded-2xl border-2 border-slate-200 hover:border-rose-600 p-6 sm:p-7 text-left transition-colors duration-200 bg-white mb-5 group cursor-default">
      {/* Top Tag & Rating */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60">
          {item.tag}
        </span>
        <div className="flex items-center gap-0.5 text-amber-500 text-xs">
          {[...Array(item.rating)].map((_, i) => (
            <i key={i} className="ri-star-fill"></i>
          ))}
        </div>
      </div>

      {/* Quote */}
      <p className="text-slate-700 text-xs sm:text-sm font-normal leading-relaxed italic">
        "{item.quote}"
      </p>

      {/* User Info */}
      <div className="mt-5 pt-4 border-t-2 border-slate-100 flex items-center gap-3">
        <img
          src={item.avatar}
          alt={item.author}
          className="w-10 h-10 rounded-2xl object-cover border-2 border-slate-900 flex-shrink-0"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
              {item.author}
            </h4>
            <i className="ri-verified-badge-fill text-rose-600 text-xs flex-shrink-0"></i>
          </div>
          <p className="text-[11px] text-slate-500 font-medium truncate">
            {item.role}, <span className="text-rose-700 font-semibold">{item.society}</span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-24 md:py-36 bg-[#F8FAFC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white text-slate-900 border-2 border-slate-900 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            <span>Verified resident & RWA reviews</span>
          </div>

          <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
            Loved by over 50,000+ residents
          </h2>

          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Real feedback from society presidents, treasurers, and resident families across India.
          </p>
        </div>

        {/* Continuous Up-Down Moving Marquee Stage with Faded Screen Top/Bottom Masks */}
        <div className="relative h-[620px] sm:h-[680px] overflow-hidden rounded-[36px] p-2">

          {/* Top Faded Gradient Screen Mask */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent z-20 pointer-events-none" />

          {/* Bottom Faded Gradient Screen Mask */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent z-20 pointer-events-none" />

          {/* 3 Columns Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">

            {/* Column 1: Moves UP */}
            <div className="overflow-hidden relative h-full">
              <div className="animate-marquee-up hover:[animation-play-state:paused] space-y-0">
                {/* Original set */}
                {column1.map((item, idx) => (
                  <ReviewCard key={`col1-orig-${idx}`} item={item} />
                ))}
                {/* Cloned set for seamless infinite loop */}
                {column1.map((item, idx) => (
                  <ReviewCard key={`col1-clone-${idx}`} item={item} />
                ))}
              </div>
            </div>

            {/* Column 2: Moves DOWN */}
            <div className="overflow-hidden relative h-full">
              <div className="animate-marquee-down hover:[animation-play-state:paused] space-y-0">
                {/* Original set */}
                {column2.map((item, idx) => (
                  <ReviewCard key={`col2-orig-${idx}`} item={item} />
                ))}
                {/* Cloned set for seamless infinite loop */}
                {column2.map((item, idx) => (
                  <ReviewCard key={`col2-clone-${idx}`} item={item} />
                ))}
              </div>
            </div>

            {/* Column 3: Moves UP (Slow) */}
            <div className="hidden lg:block overflow-hidden relative h-full">
              <div className="animate-marquee-up-slow hover:[animation-play-state:paused] space-y-0">
                {/* Original set */}
                {column3.map((item, idx) => (
                  <ReviewCard key={`col3-orig-${idx}`} item={item} />
                ))}
                {/* Cloned set for seamless infinite loop */}
                {column3.map((item, idx) => (
                  <ReviewCard key={`col3-clone-${idx}`} item={item} />
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;