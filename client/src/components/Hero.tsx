import React from 'react';

interface HeroProps {
  onOpenDemo?: () => void;
  onOpenVideo?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDemo, onOpenVideo }) => {
  return (
    <section id="home" className="relative overflow-hidden bg-[#FAF9F6] pt-10 sm:pt-16 pb-20 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ---------------- LEFT: COPY ---------------- */}
          <div className="text-left">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border-2 border-slate-900 text-xs font-bold text-slate-900 mb-7">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
              </span>
              <span className="tracking-wide uppercase text-[11px] font-extrabold text-slate-900">Smarter communities</span>
              <span className="text-slate-300">•</span>
              <span className="tracking-wide uppercase text-[11px] text-slate-500 font-semibold">Better living</span>
            </div>

            {/* Headline — big, bold, solid ink color, no gradients */}
            <h1 className="text-6xl sm:text-7xl md:text-[80px] font-extrabold tracking-tight leading-[1.05] text-slate-900">
              Stop running your
              <br />
              society on paper
              <br />
              registers.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-lg font-normal leading-relaxed">
              Manage residents, security, billing and community services from one easy-to-use platform. A smarter, safer and more connected living experience for everyone.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenDemo}
                className="px-9 py-4 rounded-full text-base font-extrabold text-white bg-rose-600 hover:bg-rose-700 transition-colors duration-200 flex items-center gap-2 group"
              >
                <span>Get Started</span>
                <i className="ri-arrow-right-line text-lg group-hover:translate-x-1.5 transition-transform"></i>
              </button>

              <button
                onClick={onOpenVideo}
                className="px-8 py-4 rounded-full text-base font-extrabold text-white bg-teal-900 hover:bg-teal-950 transition-colors duration-200 flex items-center gap-3 group"
              >
                <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white group-hover:bg-white/25 transition-colors">
                  <i className="ri-play-fill text-sm ml-0.5"></i>
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-3 text-slate-600 text-sm">
              <div className="flex -space-x-2">
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Resident" />
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Resident" />
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Resident" />
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Resident" />
              </div>
              <span className="font-bold text-slate-900">Trusted by 100+ Residential Societies</span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <div className="flex items-center gap-1 text-amber-500">
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <span className="font-extrabold text-slate-900 ml-1">4.8/5</span>
              </div>
            </div>
          </div>

          {/* ---------------- RIGHT: DOODLE ILLUSTRATION ---------------- */}
          <div className="relative flex items-center justify-center">
            <svg
              viewBox="0 0 600 560"
              className="w-full max-w-[560px] h-auto"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* --- background color blocks --- */}
              <rect x="150" y="20" width="300" height="230" rx="24" fill="#0f3d3e" />
              <rect x="30" y="300" width="260" height="220" rx="24" fill="#fbbf24" />
              <rect x="330" y="270" width="250" height="250" rx="24" fill="#e11d48" />

              {/* squiggle connector line, Floto-style */}
              <path
                d="M480 250 C 560 260, 560 320, 500 340 C 440 360, 470 420, 540 440 C 590 455, 560 500, 500 510"
                stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none"
              />
              <circle cx="480" cy="250" r="4" fill="#0f172a" />

              {/* small decorative stars/sparkles */}
              <g stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
                <path d="M70 60 l0 20 M60 70 l20 0" />
                <path d="M470 60 l0 16 M462 68 l16 0" />
                <path d="M40 260 l0 18 M31 269 l18 0" />
              </g>

              {/* ============ TEAL BLOCK: building card ============ */}
              <g transform="translate(190,45)">
                <rect x="0" y="0" width="150" height="170" rx="6" fill="#fff" stroke="#0f172a" strokeWidth="3" transform="rotate(-6 75 85)" />
                {/* corner tape */}
                <rect x="-14" y="-6" width="30" height="14" rx="3" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" transform="rotate(-6 0 0)" />
                <rect x="128" y="-6" width="30" height="14" rx="3" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" transform="rotate(-6 150 0)" />
                <rect x="-14" y="150" width="30" height="14" rx="3" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" transform="rotate(-6 0 170)" />
                <rect x="128" y="150" width="30" height="14" rx="3" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" transform="rotate(-6 150 170)" />

                {/* building drawn on the card */}
                <g transform="rotate(-6 75 85)" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
                  <rect x="20" y="35" width="112" height="105" rx="4" fill="#f8fafc" />
                  <line x1="20" y1="60" x2="132" y2="60" />
                  <line x1="20" y1="85" x2="132" y2="85" />
                  <line x1="20" y1="110" x2="132" y2="110" />
                  <rect x="30" y="42" width="16" height="14" rx="2" fill="#0f3d3e" />
                  <rect x="55" y="42" width="16" height="14" rx="2" fill="#0f3d3e" />
                  <rect x="80" y="42" width="16" height="14" rx="2" fill="#0f3d3e" />
                  <rect x="105" y="42" width="16" height="14" rx="2" fill="#e11d48" />
                  <rect x="30" y="67" width="16" height="14" rx="2" fill="#0f3d3e" />
                  <rect x="55" y="67" width="16" height="14" rx="2" fill="#e11d48" />
                  <rect x="80" y="67" width="16" height="14" rx="2" fill="#0f3d3e" />
                  <rect x="105" y="67" width="16" height="14" rx="2" fill="#0f3d3e" />
                  <rect x="46" y="115" width="40" height="25" rx="2" fill="#0f3d3e" />
                  <path d="M20 35 L76 12 L132 35" />
                </g>
              </g>
              <text x="245" y="245" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontWeight="800" fontSize="13" fill="#fbbf24">SOCIETY TOWERS</text>

              {/* ============ AMBER BLOCK: security guard doodle ============ */}
              <g transform="translate(65,335)" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
                {/* head */}
                <circle cx="70" cy="35" r="26" fill="#fff" />
                {/* cap */}
                <path d="M44 28 A26 26 0 0 1 96 28 L96 24 Q70 8 44 24 Z" fill="#0f3d3e" />
                <line x1="44" y1="26" x2="96" y2="26" strokeWidth="3" />
                {/* body */}
                <path d="M30 145 C30 95 45 65 70 65 C95 65 110 95 110 145" fill="#fff" />
                {/* uniform stripe */}
                <path d="M70 65 L70 145" strokeDasharray="1 10" />
                {/* arm + walkie talkie */}
                <path d="M100 90 C118 95 122 108 118 118" />
                <rect x="112" y="112" width="12" height="22" rx="3" fill="#e11d48" />
                {/* whistle/lanyard */}
                <path d="M60 70 C60 85 80 85 80 70" />
                {/* legs */}
                <path d="M50 145 L46 175 M90 145 L94 175" />
                {/* speech bubble */}
                <g transform="translate(118,10)">
                  <path d="M0 18 C0 6 10 0 24 0 L74 0 C88 0 96 8 96 20 C96 32 88 40 74 40 L28 40 L10 54 L14 40 C4 38 0 30 0 18 Z" fill="#fff" />
                  <text x="20" y="26" fontFamily="ui-sans-serif, system-ui" fontWeight="800" fontSize="15" fill="#0f172a">Gate cleared ✓</text>
                </g>
              </g>
              <text x="160" y="500" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontWeight="800" fontSize="13" fill="#0f172a">AUTOMATED ANPR GATE</text>

              {/* ============ CORAL BLOCK: resident with phone doodle ============ */}
              <g transform="translate(370,305)" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
                {/* head + hair */}
                <circle cx="60" cy="40" r="25" fill="#fff" />
                <path d="M35 40 C33 12 87 12 85 40 C85 20 76 16 60 16 C44 16 35 20 35 40 Z" fill="#0f172a" />
                {/* body / chair */}
                <path d="M22 150 C22 100 38 72 60 72 C82 72 98 100 98 150" fill="#fff" />
                {/* arm holding phone */}
                <path d="M40 105 C25 112 18 130 22 145" />
                <rect x="6" y="132" width="24" height="40" rx="6" fill="#fff" stroke="#0f172a" strokeWidth="3" />
                <line x1="10" y1="162" x2="26" y2="162" />
                {/* other arm */}
                <path d="M82 105 C96 112 102 130 98 148" />
                {/* legs */}
                <path d="M42 150 L38 180 M80 150 L84 180" />
                {/* excited marks */}
                <g strokeWidth="4">
                  <path d="M115 20 L115 40" />
                  <circle cx="115" cy="52" r="3" fill="#0f172a" />
                  <path d="M150 40 L150 58" />
                  <circle cx="150" cy="70" r="3" fill="#0f172a" />
                </g>
                {/* "Yo!" bubble */}
                <path d="M92 -10 h60 a10 10 0 0 1 10 10 v18 a10 10 0 0 1 -10 10 h-40 l-12 12 2 -12 h0 a10 10 0 0 1 -10 -10 v-18 a10 10 0 0 1 10 -10 Z" fill="#fff" />
                <text x="108" y="8" fontFamily="ui-sans-serif, system-ui" fontWeight="800" fontSize="16" fill="#0f172a">Yo!</text>
              </g>
              <text x="460" y="500" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontWeight="800" fontSize="13" fill="#fff">RESIDENT APP</text>

            </svg>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;