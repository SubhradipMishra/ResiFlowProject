import React, { useState, useEffect } from 'react';
import { Building2, Users, ShieldCheck, AlertCircle, Bell, Plus, RefreshCw, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        buildingsCount: 0,
        flatsCount: 0,
        residentsCount: 0,
        staffCount: 0,
        complaintsCount: 0,
        noticesCount: 0,
    });
    const [buildings, setBuildings] = useState<any[]>([]);
    const [flats, setFlats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [activeModal, setActiveModal] = useState<'building' | 'flat' | 'resident' | 'staff' | 'notice' | null>(null);

    // Form states
    const [buildingForm, setBuildingForm] = useState({ name: '', buildingNumber: '', totalFloors: 4, description: '' });
    const [flatForm, setFlatForm] = useState({ flatNumber: '', buildingId: '', floor: 1, type: '2BHK', area: 1200, status: 'vacant', monthlyMaintenance: 3500 });
    const [residentForm, setResidentForm] = useState({ name: '', email: '', phone: '', password: '', flatId: '', residentType: 'owner' });
    // const [noticeForm, setNoticeForm] = useState({ title: '', content: '', category: 'general', priority: 'medium', isPinned: false });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            const [bldRes, flatRes, resRes, staffRes, compRes, noticeRes] = await Promise.all([
                api.get('/building').catch(() => ({ data: { data: [] } })),
                api.get('/flat').catch(() => ({ data: { data: [] } })),
                api.get('/resident').catch(() => ({ data: { data: [] } })),
                api.get('/staff').catch(() => ({ data: { data: [] } })),
                api.get('/complaint').catch(() => ({ data: { data: [] } })),
                api.get('/notice/feed').catch(() => ({ data: { data: [] } })),
            ]);

            const bldData = bldRes.data?.data || [];
            const flatData = flatRes.data?.data || [];

            setBuildings(bldData);
            setFlats(flatData);

            setStats({
                buildingsCount: bldData.length,
                flatsCount: flatData.length,
                residentsCount: resRes.data?.data?.length || 0,
                staffCount: staffRes.data?.data?.length || 0,
                complaintsCount: compRes.data?.data?.length || 0,
                noticesCount: noticeRes.data?.data?.length || 0,
            });

            if (bldData.length > 0 && !flatForm.buildingId) {
                setFlatForm(prev => ({ ...prev, buildingId: bldData[0]._id }));
            }
            if (flatData.length > 0 && !residentForm.flatId) {
                setResidentForm(prev => ({ ...prev, flatId: flatData[0]._id }));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const resetForms = () => {
        setErrorMsg('');
        setSuccessMsg('');
        setActiveModal(null);
    };

    // Submissions
    const handleCreateBuilding = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsSubmitting(true);
        try {
            const res = await api.post('/building', buildingForm);
            if (res.data?.success) {
                toast.success('Building block created successfully!');
                setSuccessMsg('Building block created!');
                loadData();
                setTimeout(resetForms, 1000);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to create building.';
            toast.error(msg);
            setErrorMsg(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateFlat = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsSubmitting(true);
        try {
            const res = await api.post('/flat', flatForm);
            if (res.data?.success) {
                toast.success('Flat unit added to building tower!');
                setSuccessMsg('Flat unit added to building tower!');
                loadData();
                setTimeout(resetForms, 1000);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to create flat unit.';
            toast.error(msg);
            setErrorMsg(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateResident = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsSubmitting(true);
        try {
            const res = await api.post('/resident', residentForm);
            if (res.data?.success) {
                toast.success('Resident onboarded & credentials sent!');
                setSuccessMsg('Resident onboarded & Brevo email sent!');
                loadData();
                setTimeout(resetForms, 1200);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to onboard resident.';
            toast.error(msg);
            setErrorMsg(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Pure White + Raspberry Header Banner */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-80 h-80 bg-rose-500/5 rounded-bl-full pointer-events-none" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-50 text-[#e11d48] rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-rose-200/70">
                        <Building2 className="w-4 h-4" /> Society Administration Workspace
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight font-outfit">Residence Management Hub</h1>
                    <p className="text-slate-500 text-sm mt-1 max-w-xl leading-relaxed">
                        Create building towers, assign flat units, onboard residents with Brevo emails, and manage society security.
                    </p>
                </div>

                <button
                    onClick={loadData}
                    className="bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 border border-slate-200 relative z-10 shadow-sm"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync Metrics
                </button>
            </div>

            {/* Quick Actions Toolbar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Creation Tools</h3>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => { setActiveModal('building'); setErrorMsg(''); setSuccessMsg(''); }}
                        className="bg-[#0f172a] hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4 text-rose-400" /> Create Building Tower
                    </button>
                    <button
                        onClick={() => { setActiveModal('flat'); setErrorMsg(''); setSuccessMsg(''); }}
                        className="bg-[#e11d48] hover:bg-rose-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-rose-200"
                    >
                        <Plus className="w-4 h-4" /> Add Flat Unit (To Building)
                    </button>
                    <button
                        onClick={() => { setActiveModal('resident'); setErrorMsg(''); setSuccessMsg(''); }}
                        className="bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all border border-slate-200"
                    >
                        <Users className="w-4 h-4 text-rose-600" /> Onboard Resident
                    </button>
                    <button
                        onClick={() => { setActiveModal('staff'); setErrorMsg(''); setSuccessMsg(''); }}
                        className="bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all border border-slate-200"
                    >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Onboard Staff
                    </button>
                    <button
                        onClick={() => { setActiveModal('notice'); setErrorMsg(''); setSuccessMsg(''); }}
                        className="bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all border border-slate-200"
                    >
                        <Bell className="w-4 h-4 text-indigo-600" /> Broadcast Notice
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-rose-50 text-[#e11d48] flex items-center justify-center font-bold">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Towers & Flats</p>
                        <h3 className="text-2xl font-extrabold text-[#0f172a]">{stats.buildingsCount} Towers • {stats.flatsCount} Units</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Residents</p>
                        <h3 className="text-2xl font-extrabold text-[#0f172a]">{stats.residentsCount}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">On-Duty Staff</p>
                        <h3 className="text-2xl font-extrabold text-[#0f172a]">{stats.staffCount} Personnel</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <Bell className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Notices</p>
                        <h3 className="text-2xl font-extrabold text-[#0f172a]">{stats.noticesCount} Broadcasts</h3>
                    </div>
                </div>
            </div>

            {/* Modals with PROCEED & CANCEL Buttons */}

            {/* 1. Create Building Modal */}
            {activeModal === 'building' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative">
                        <h3 className="text-xl font-bold text-[#0f172a] mb-1">Create Building Block</h3>
                        <p className="text-xs text-slate-500 mb-6">Register a new tower or block in your society</p>

                        {errorMsg && (
                            <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{errorMsg}</span>
                            </div>
                        )}
                        {successMsg && (
                            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>{successMsg}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreateBuilding} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Building Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Amber Tower"
                                    value={buildingForm.name}
                                    onChange={(e) => setBuildingForm({ ...buildingForm, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Building / Block Code *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Block A"
                                    value={buildingForm.buildingNumber}
                                    onChange={(e) => setBuildingForm({ ...buildingForm, buildingNumber: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Floors</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={buildingForm.totalFloors}
                                    onChange={(e) => setBuildingForm({ ...buildingForm, totalFloors: Number(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={resetForms}
                                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all border border-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#e11d48] hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Processing...' : 'Proceed & Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. Create Flat Unit Modal */}
            {activeModal === 'flat' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-[#0f172a] mb-1">Add Flat Unit to Building</h3>
                        <p className="text-xs text-slate-500 mb-6">Create flat unit and assign to existing building block</p>

                        {errorMsg && (
                            <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{errorMsg}</span>
                            </div>
                        )}
                        {successMsg && (
                            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>{successMsg}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreateFlat} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Building Tower *</label>
                                    <select
                                        required
                                        value={flatForm.buildingId}
                                        onChange={(e) => setFlatForm({ ...flatForm, buildingId: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    >
                                        <option value="">Select Building</option>
                                        {buildings.map((b) => (
                                            <option key={b._id} value={b._id}>{b.name} ({b.buildingNumber})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Flat Number *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. 101 or A-302"
                                        value={flatForm.flatNumber}
                                        onChange={(e) => setFlatForm({ ...flatForm, flatNumber: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Floor</label>
                                    <input
                                        type="number"
                                        value={flatForm.floor}
                                        onChange={(e) => setFlatForm({ ...flatForm, floor: Number(e.target.value) })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Type</label>
                                    <select
                                        value={flatForm.type}
                                        onChange={(e) => setFlatForm({ ...flatForm, type: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    >
                                        <option value="1BHK">1 BHK</option>
                                        <option value="2BHK">2 BHK</option>
                                        <option value="3BHK">3 BHK</option>
                                        <option value="4BHK">4 BHK</option>
                                        <option value="penthouse">Penthouse</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Area (sqft)</label>
                                    <input
                                        type="number"
                                        value={flatForm.area}
                                        onChange={(e) => setFlatForm({ ...flatForm, area: Number(e.target.value) })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={resetForms}
                                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all border border-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#e11d48] hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Processing...' : 'Proceed & Add Flat'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 3. Onboard Resident Modal */}
            {activeModal === 'resident' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-[#0f172a] mb-1">Onboard Resident</h3>
                        <p className="text-xs text-slate-500 mb-6">Assign flat and send login credentials via Brevo email</p>

                        {errorMsg && (
                            <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{errorMsg}</span>
                            </div>
                        )}
                        {successMsg && (
                            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>{successMsg}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreateResident} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Rahul Sharma"
                                    value={residentForm.name}
                                    onChange={(e) => setResidentForm({ ...residentForm, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="rahul@gmail.com"
                                        value={residentForm.email}
                                        onChange={(e) => setResidentForm({ ...residentForm, email: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="9876543210"
                                        value={residentForm.phone}
                                        onChange={(e) => setResidentForm({ ...residentForm, phone: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Flat Assignment *</label>
                                    <select
                                        required
                                        value={residentForm.flatId}
                                        onChange={(e) => setResidentForm({ ...residentForm, flatId: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    >
                                        <option value="">Select Flat</option>
                                        {flats.map((f) => (
                                            <option key={f._id} value={f._id}>Flat {f.flatNumber} ({f.building?.name})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Type *</label>
                                    <select
                                        value={residentForm.residentType}
                                        onChange={(e) => setResidentForm({ ...residentForm, residentType: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    >
                                        <option value="owner">Owner</option>
                                        <option value="tenant">Tenant</option>
                                        <option value="family_member">Family Member</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Initial Password *</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={residentForm.password}
                                    onChange={(e) => setResidentForm({ ...residentForm, password: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={resetForms}
                                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all border border-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#e11d48] hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Dispatching Email...' : 'Proceed & Onboard'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
