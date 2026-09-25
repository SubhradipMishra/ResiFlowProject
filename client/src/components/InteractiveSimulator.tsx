import React, { useState } from 'react';
import confetti from 'canvas-confetti';

interface InteractiveSimulatorProps {
  onSuccessNotice?: (msg: string) => void;
}

export const InteractiveSimulator: React.FC<InteractiveSimulatorProps> = () => {
  const [activeTab, setActiveTab] = useState<'visitor' | 'billing' | 'amenity' | 'sos'>('visitor');

  // Visitor Pass state
  const [guestName, setGuestName] = useState('Ankit Verma');
  const [guestType, setGuestType] = useState('Guest / Friend');
  const [validHours, setValidHours] = useState('6 Hours');

  // Billing state
  const [flatSize, setFlatSize] = useState(1450);
  const ratePerSqFt = 3.5;
  const [includeSinkingFund, setIncludeSinkingFund] = useState(true);
  const [includeClubhouse, setIncludeClubhouse] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Amenity state
  const [selectedAmenity, setSelectedAmenity] = useState('Tennis Court');
  const [selectedSlot, setSelectedSlot] = useState('06:00 PM - 07:00 PM');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // SOS state
  const [sosActive, setSosActive] = useState(false);

  // Calculations for billing
  const baseMaintenance = Math.round(flatSize * ratePerSqFt);
  const sinkingFund = includeSinkingFund ? 500 : 0;
  const clubhouseFee = includeClubhouse ? 350 : 0;
  const gst = Math.round((baseMaintenance + sinkingFund + clubhouseFee) * 0.18);
  const totalAmount = baseMaintenance + sinkingFund + clubhouseFee + gst;

  const handleSimulatePayment = () => {
    setPaymentSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#be123c', '#fb7185', '#10b981', '#3b82f6'],
    });
    setTimeout(() => {
      setPaymentSuccess(false);
    }, 4000);
  };

  const handleAmenityBooking = () => {
    setBookingConfirmed(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      setBookingConfirmed(false);
    }, 3500);
  };

  const triggerSOS = () => {
    setSosActive(true);
    setTimeout(() => {
      setSosActive(false);
    }, 4000);
  };

  return (
    <section id="simulator" className="py-24 md:py-36 bg-[#FAF9F6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white text-slate-900 border-2 border-slate-900 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            <span>Live interactive playground</span>
          </div>

          <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
            Experience the ResiFlow OS live
          </h2>

          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Test real-world resident, guard, and committee workflows interactively right from your browser.
          </p>

          {/* Floating Pill Switcher */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full border-2 border-slate-900 max-w-2xl mx-auto">
            <button
              onClick={() => setActiveTab('visitor')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors duration-200 flex items-center gap-1.5 ${activeTab === 'visitor'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <i className="ri-qr-code-line text-base"></i>
              <span>QR Visitor Pass</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors duration-200 flex items-center gap-1.5 ${activeTab === 'billing'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <i className="ri-calculator-line text-base"></i>
              <span>Maintenance Dues</span>
            </button>

            <button
              onClick={() => setActiveTab('amenity')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors duration-200 flex items-center gap-1.5 ${activeTab === 'amenity'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <i className="ri-calendar-check-line text-base"></i>
              <span>Amenity Booker</span>
            </button>

            <button
              onClick={() => setActiveTab('sos')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors duration-200 flex items-center gap-1.5 ${activeTab === 'sos'
                ? 'bg-red-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <i className="ri-alarm-warning-line text-base"></i>
              <span>Emergency SOS</span>
            </button>
          </div>
        </div>

        {/* Playground Display Card */}
        <div className="max-w-5xl mx-auto rounded-[28px] border-2 border-slate-900 p-6 sm:p-10 bg-white">

          {/* TAB 1: VISITOR PASS GENERATOR */}
          {activeTab === 'visitor' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 space-y-4">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                  <i className="ri-shield-keyhole-line text-base"></i>
                  <span>Instant Digital Gate Pass</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Pre-approve your guests in 5 seconds
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Generate a verified one-time gate QR code. Gate security scans the pass for instant barrier opening with SMS & WhatsApp sync.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Guest Full Name
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-white border-2 border-slate-200 rounded-xl focus:border-rose-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Visitor Type
                      </label>
                      <select
                        value={guestType}
                        onChange={(e) => setGuestType(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border-2 border-slate-200 rounded-xl focus:border-rose-600 outline-none font-semibold"
                      >
                        <option>Guest / Friend</option>
                        <option>Delivery (Amazon/Swiggy)</option>
                        <option>Cab / Driver</option>
                        <option>Home Service / Repair</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pass Validity
                      </label>
                      <select
                        value={validHours}
                        onChange={(e) => setValidHours(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border-2 border-slate-200 rounded-xl focus:border-rose-600 outline-none font-semibold"
                      >
                        <option>2 Hours</option>
                        <option>6 Hours</option>
                        <option>Full Day (24 Hrs)</option>
                        <option>Multiple Days</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => {
                        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
                      }}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <i className="ri-refresh-line"></i>
                      <span>Regenerate Pass</span>
                    </button>
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <i className="ri-checkbox-circle-fill"></i> Gate Terminal Synced
                    </span>
                  </div>
                </div>
              </div>

              {/* Digital Pass Preview Card */}
              <div className="md:col-span-6 flex justify-center">
                <div className="w-full max-w-[290px] bg-white rounded-3xl p-6 border-2 border-dashed border-slate-900 relative overflow-hidden">
                  <div className="bg-slate-900 text-white text-center py-2 -mx-6 -mt-6 mb-4 text-[11px] font-extrabold tracking-widest uppercase">
                    ResiFlow Gate Pass
                  </div>

                  <div className="text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">HOST APARTMENT</div>
                    <div className="text-base font-extrabold text-slate-900">Tower A • Flat 502</div>
                    <div className="text-xs text-slate-500 font-medium">Host: Rahul Sharma</div>
                  </div>

                  <div className="my-4 flex flex-col items-center justify-center p-3 bg-white rounded-2xl border-2 border-slate-200">
                    <div className="w-32 h-32 bg-white p-2 rounded-xl border-2 border-slate-200 flex items-center justify-center relative group">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RESIFLOW-PASS-${encodeURIComponent(guestName)}-502`}
                        alt="Gate QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-600 mt-2">CODE: SR-2026-A502</span>
                  </div>

                  <div className="space-y-1.5 text-xs border-t-2 border-slate-100 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Visitor:</span>
                      <span className="font-bold text-slate-800">{guestName || 'Guest'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type:</span>
                      <span className="font-semibold text-slate-700">{guestType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className="font-extrabold text-emerald-600">APPROVED ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MAINTENANCE CALCULATOR */}
          {activeTab === 'billing' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                  <i className="ri-wallet-3-line text-base"></i>
                  <span>Automated Society Dues Engine</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Zero reconciliation friction. Instant UPI payment.
                </h3>

                <div className="pt-2">
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>Apartment Carpet Area</span>
                    <span className="text-rose-600 font-extrabold">{flatSize} sq.ft</span>
                  </div>
                  <input
                    type="range"
                    min="600"
                    max="4500"
                    step="50"
                    value={flatSize}
                    onChange={(e) => setFlatSize(Number(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                    <span>1 BHK (600 sqft)</span>
                    <span>3 BHK (1450 sqft)</span>
                    <span>Penthouse (4500 sqft)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-3 rounded-2xl border-2 border-slate-200 cursor-pointer hover:border-rose-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeSinkingFund}
                      onChange={(e) => setIncludeSinkingFund(e.target.checked)}
                      className="accent-rose-600 rounded"
                    />
                    <span>Sinking Fund (₹500)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-3 rounded-2xl border-2 border-slate-200 cursor-pointer hover:border-rose-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeClubhouse}
                      onChange={(e) => setIncludeClubhouse(e.target.checked)}
                      className="accent-rose-600 rounded"
                    />
                    <span>Clubhouse Pass (₹350)</span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-900">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                    Invoice Breakdown
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Area Rate ({flatSize} × ₹{ratePerSqFt})</span>
                      <span className="font-bold text-slate-800">₹{baseMaintenance.toLocaleString()}</span>
                    </div>
                    {includeSinkingFund && (
                      <div className="flex justify-between">
                        <span>Sinking Fund Reserve</span>
                        <span className="font-bold text-slate-800">₹500</span>
                      </div>
                    )}
                    {includeClubhouse && (
                      <div className="flex justify-between">
                        <span>Clubhouse & Gym Access</span>
                        <span className="font-bold text-slate-800">₹350</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>GST (18%)</span>
                      <span className="font-bold text-slate-800">₹{gst.toLocaleString()}</span>
                    </div>

                    <div className="border-t-2 border-slate-200 pt-3 mt-2 flex justify-between items-center">
                      <span className="text-sm font-extrabold text-slate-900">Total Due</span>
                      <span className="text-2xl font-black text-rose-600">₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-5">
                    {paymentSuccess ? (
                      <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl text-center text-xs font-bold border-2 border-emerald-600 flex items-center justify-center gap-1.5">
                        <i className="ri-checkbox-circle-fill text-base"></i>
                        <span>Payment Received! Receipt Generated</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleSimulatePayment}
                        className="w-full py-3 bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-2"
                      >
                        <i className="ri-secure-payment-line text-base"></i>
                        <span>Simulate 1-Click UPI Payment</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AMENITY BOOKING */}
          {activeTab === 'amenity' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">Clubhouse & Sports Slot Booking</h3>
                  <p className="text-xs sm:text-sm text-slate-500">Pick a facility, reserve your exclusive slot without conflicts.</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Amenity:</span>
                  <select
                    value={selectedAmenity}
                    onChange={(e) => setSelectedAmenity(e.target.value)}
                    className="px-3.5 py-2 text-xs bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
                  >
                    <option>Tennis Court</option>
                    <option>Swimming Pool</option>
                    <option>Badminton Hall</option>
                    <option>Banquet & Party Lawn</option>
                    <option>Snooker Lounge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {[
                  { time: '06:00 AM - 07:00 AM', status: 'Booked', color: 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200' },
                  { time: '07:00 AM - 08:00 AM', status: 'Available', color: 'bg-white hover:border-rose-600 cursor-pointer border-slate-200' },
                  { time: '05:00 PM - 06:00 PM', status: 'Booked', color: 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200' },
                  { time: '06:00 PM - 07:00 PM', status: 'Available', color: 'bg-white hover:border-rose-600 cursor-pointer border-slate-200' },
                ].map((slot, idx) => (
                  <div
                    key={idx}
                    onClick={() => slot.status === 'Available' && setSelectedSlot(slot.time)}
                    className={`p-4 rounded-2xl border-2 text-center transition-colors ${slot.color} ${selectedSlot === slot.time && slot.status === 'Available' ? 'border-rose-600 bg-rose-50' : ''
                      }`}
                  >
                    <div className="text-xs font-extrabold text-slate-800">{slot.time}</div>
                    <div className={`text-[10px] font-bold mt-1 ${slot.status === 'Available' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {slot.status === 'Available' ? '● Available' : '✖ Reserved'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-slate-200">
                <div className="text-xs text-slate-600">
                  Selected: <span className="font-bold text-slate-900">{selectedAmenity}</span> on <span className="font-bold text-slate-900">{selectedSlot}</span>
                </div>

                {bookingConfirmed ? (
                  <div className="px-6 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border-2 border-emerald-600 flex items-center gap-1.5">
                    <i className="ri-checkbox-circle-fill text-base"></i>
                    <span>Slot Confirmed! Pass sent to WhatsApp</span>
                  </div>
                ) : (
                  <button
                    onClick={handleAmenityBooking}
                    className="px-8 py-3 bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Reserve Selected Slot
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SOS SIMULATOR */}
          {activeTab === 'sos' && (
            <div className="text-center max-w-lg mx-auto space-y-5 py-6">
              <div className="w-16 h-16 rounded-3xl bg-white text-red-600 border-2 border-red-600 flex items-center justify-center text-3xl mx-auto">
                <i className="ri-alarm-warning-fill animate-pulse"></i>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">1-Tap Emergency Guard Dispatch</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  In case of medical, fire, or lift emergency, residents trigger instant haptic siren at Main Gate Security tablet.
                </p>
              </div>

              {sosActive ? (
                <div className="p-5 bg-red-600 text-white rounded-2xl font-bold text-sm animate-pulse flex flex-col items-center gap-1">
                  <div className="text-base font-extrabold">🚨 EMERGENCY DISPATCH ACTIVE!</div>
                  <div className="text-xs font-normal text-red-100">
                    Main Gate Security & 3 on-duty guards alerted for Flat A-502. Guard arriving in ~90s.
                  </div>
                </div>
              ) : (
                <button
                  onClick={triggerSOS}
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <i className="ri-alarm-warning-line text-lg"></i>
                  <span>Test Emergency SOS Trigger</span>
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default InteractiveSimulator;