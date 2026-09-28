import React, { useState, useEffect } from 'react';
import { Building2, Users, ShieldCheck, AlertCircle, Bell, Plus, RefreshCw, CheckCircle2, X, FileText } from 'lucide-react';
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
    const [noticeForm, setNoticeForm] = useState({ title: '', content: '', category: 'general', priority: 'medium', isPinned: false });

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

    const openModal = (modal: typeof activeModal) => {
        setErrorMsg('');
        setSuccessMsg('');
        setActiveModal(modal);
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

    const handleBroadcastNotice = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsSubmitting(true);
        try {
            const res = await api.post('/notice', noticeForm);
            if (res.data?.success) {
                toast.success('Notice broadcast to all residents!');
                setSuccessMsg('Notice broadcast successfully!');
                setNoticeForm({ title: '', content: '', category: 'general', priority: 'medium', isPinned: false });
                loadData();
                setTimeout(resetForms, 1200);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to broadcast notice.';
            toast.error(msg);
            setErrorMsg(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold focus:outline-none focus:border-slate-900 transition-colors bg-white";
    const labelClass = "block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5";

    const ModalWrapper: React.FC<{ title: string; subtitle: string; onClose: () => void; children: React.ReactNode }> = ({ title, subtitle, onClose, children }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
            <div className="bg-white rounded-[28px] max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-slate-900 relative my-4">
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 rounded-xl border-2 border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <h3 className="text-xl font-black text-slate-900 mb-0.5 pr-10">{title}</h3>
                <p className="text-xs text-slate-500 mb-5">{subtitle}</p>

                {errorMsg && (
                    <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl flex items-center gap-2 border border-rose-200">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}
                {successMsg && (
                    <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2 border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{successMsg}</span>
                    </div>
                )}

                {children}
            </div>
        </div>
    );

    const FormFooter: React.FC<{ submitLabel: string; processingLabel?: string }> = ({ submitLabel, processingLabel = 'Processing...' }) => (
        <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-slate-100 mt-4">
            <button
                type="button"
                onClick={resetForms}
                className="px-5 py-2.5 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 transition-all border-2 border-slate-200"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 transition-all border-2 border-slate-900 shadow-sm disabled:opacity-50"
            >
                {isSubmitting ? processingLabel : submitLabel}
            </button>
        </div>
    );

    return (
        <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">

            {/* Header Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-[28px] border-2 border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden shadow-sm">
                <div className="absolute right-0 top-0 w-64 h-64 bg-rose-500/5 rounded-bl-full pointer-events-none" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-50 text-rose-700 rounded-full text-xs font-black uppercase tracking-wider mb-3 border-2 border-slate-900">
                        <Building2 className="w-3.5 h-3.5" /> Society Administration Workspace
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Residence Management Hub</h1>
                    <p className="text-slate-500 text-sm mt-1.5 max-w-xl leading-relaxed">
                        Create building towers, assign flat units, onboard residents with Brevo emails, and manage society security.
                    </p>
                </div>
                <button
                    onClick={loadData}
                    className="bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-black px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 border-2 border-slate-900 relative z-10 flex-shrink-0"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync Metrics
                </button>
            </div>

            {/* Quick Actions Toolbar */}
            <div className="bg-white p-5 sm:p-6 rounded-[28px] border-2 border-slate-900 shadow-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Quick Creation Tools</h3>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => openModal('building')}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all border-2 border-slate-900 shadow-sm"
                    >
                        <Plus className="w-4 h-4 text-rose-400" /> Create Building Tower
                    </button>
                    <button
                        onClick={() => openModal('flat')}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all border-2 border-slate-900 shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Flat Unit
                    </button>
                    <button
                        onClick={() => openModal('resident')}
                        className="bg-white hover:bg-slate-50 text-slate-900 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all border-2 border-slate-900"
                    >
                        <Users className="w-4 h-4 text-rose-600" /> Onboard Resident
                    </button>
                    <button
                        onClick={() => openModal('staff')}
                        className="bg-white hover:bg-slate-50 text-slate-900 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all border-2 border-slate-900"
                    >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Onboard Staff
                    </button>
                    <button
                        onClick={() => openModal('notice')}
                        className="bg-white hover:bg-slate-50 text-slate-900 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all border-2 border-slate-900"
                    >
                        <Bell className="w-4 h-4 text-indigo-600" /> Broadcast Notice
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-[20px] border-2 border-slate-900 shadow-sm flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-rose-600 border-2 border-slate-900 flex items-center justify-center text-white shrink-0">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Towers & Flats</p>
                        <h3 className="text-lg font-black text-slate-900 leading-tight truncate">
                            {stats.buildingsCount} Towers · {stats.flatsCount} Units
                        </h3>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-[20px] border-2 border-slate-900 shadow-sm flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-indigo-600 border-2 border-slate-900 flex items-center justify-center text-white shrink-0">
                        <Users className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Residents</p>
                        <h3 className="text-2xl font-black text-slate-900">{stats.residentsCount}</h3>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-[20px] border-2 border-slate-900 shadow-sm flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-amber-500 border-2 border-slate-900 flex items-center justify-center text-white shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">On-Duty Staff</p>
                        <h3 className="text-2xl font-black text-slate-900">{stats.staffCount} <span className="text-sm font-bold text-slate-400">Personnel</span></h3>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-[20px] border-2 border-slate-900 shadow-sm flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-emerald-600 border-2 border-slate-900 flex items-center justify-center text-white shrink-0">
                        <Bell className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Notices</p>
                        <h3 className="text-2xl font-black text-slate-900">{stats.noticesCount} <span className="text-sm font-bold text-slate-400">Broadcasts</span></h3>
                    </div>
                </div>
            </div>

            {/* Secondary stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[20px] border-2 border-slate-900 shadow-sm flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-rose-50 border-2 border-slate-900 flex items-center justify-center text-rose-600 shrink-0">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Open Complaints</p>
                        <h3 className="text-2xl font-black text-slate-900">{stats.complaintsCount}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-[20px] border-2 border-slate-900 shadow-sm flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-slate-900 border-2 border-slate-900 flex items-center justify-center text-white shrink-0">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Occupancy Rate</p>
                        <h3 className="text-2xl font-black text-slate-900">
                            {stats.flatsCount > 0 ? Math.round((stats.residentsCount / stats.flatsCount) * 100) : 0}%
                            <span className="text-sm font-bold text-slate-400 ml-1">Units Occupied</span>
                        </h3>
                    </div>
                </div>
            </div>

            {/* ========================= MODALS ========================= */}

            {/* 1. Create Building Modal */}
            {activeModal === 'building' && (
                <ModalWrapper
                    title="Create Building Block"
                    subtitle="Register a new tower or block in your society"
                    onClose={resetForms}
                >
                    <form onSubmit={handleCreateBuilding} className="space-y-4">
                        <div>
                            <label className={labelClass}>Building Name *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Amber Tower"
                                value={buildingForm.name}
                                onChange={(e) => setBuildingForm({ ...buildingForm, name: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Building / Block Code *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Block A"
                                value={buildingForm.buildingNumber}
                                onChange={(e) => setBuildingForm({ ...buildingForm, buildingNumber: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Total Floors</label>
                            <input
                                type="number"
                                min="1"
                                value={buildingForm.totalFloors}
                                onChange={(e) => setBuildingForm({ ...buildingForm, totalFloors: Number(e.target.value) })}
                                className={inputClass}
                            />
                        </div>
                        <FormFooter submitLabel="Proceed & Save" processingLabel="Creating..." />
                    </form>
                </ModalWrapper>
            )}

            {/* 2. Create Flat Unit Modal */}
            {activeModal === 'flat' && (
                <ModalWrapper
                    title="Add Flat Unit to Building"
                    subtitle="Create flat unit and assign to existing building block"
                    onClose={resetForms}
                >
                    <form onSubmit={handleCreateFlat} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Building Tower *</label>
                                <select
                                    required
                                    value={flatForm.buildingId}
                                    onChange={(e) => setFlatForm({ ...flatForm, buildingId: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="">Select Building</option>
                                    {buildings.map((b) => (
                                        <option key={b._id} value={b._id}>{b.name} ({b.buildingNumber})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Flat Number *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 101 or A-302"
                                    value={flatForm.flatNumber}
                                    onChange={(e) => setFlatForm({ ...flatForm, flatNumber: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className={labelClass}>Floor</label>
                                <input
                                    type="number"
                                    value={flatForm.floor}
                                    onChange={(e) => setFlatForm({ ...flatForm, floor: Number(e.target.value) })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Type</label>
                                <select
                                    value={flatForm.type}
                                    onChange={(e) => setFlatForm({ ...flatForm, type: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="1BHK">1 BHK</option>
                                    <option value="2BHK">2 BHK</option>
                                    <option value="3BHK">3 BHK</option>
                                    <option value="4BHK">4 BHK</option>
                                    <option value="penthouse">Penthouse</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Area (sqft)</label>
                                <input
                                    type="number"
                                    value={flatForm.area}
                                    onChange={(e) => setFlatForm({ ...flatForm, area: Number(e.target.value) })}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <FormFooter submitLabel="Proceed & Add Flat" processingLabel="Processing..." />
                    </form>
                </ModalWrapper>
            )}

            {/* 3. Onboard Resident Modal */}
            {activeModal === 'resident' && (
                <ModalWrapper
                    title="Onboard Resident"
                    subtitle="Assign flat and send login credentials via Brevo email"
                    onClose={resetForms}
                >
                    <form onSubmit={handleCreateResident} className="space-y-4">
                        <div>
                            <label className={labelClass}>Full Name *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Rahul Sharma"
                                value={residentForm.name}
                                onChange={(e) => setResidentForm({ ...residentForm, name: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Email *</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="rahul@gmail.com"
                                    value={residentForm.email}
                                    onChange={(e) => setResidentForm({ ...residentForm, email: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Phone *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="9876543210"
                                    value={residentForm.phone}
                                    onChange={(e) => setResidentForm({ ...residentForm, phone: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Flat Assignment *</label>
                                <select
                                    required
                                    value={residentForm.flatId}
                                    onChange={(e) => setResidentForm({ ...residentForm, flatId: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="">Select Flat</option>
                                    {flats.map((f) => (
                                        <option key={f._id} value={f._id}>Flat {f.flatNumber} ({f.building?.name})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Type *</label>
                                <select
                                    value={residentForm.residentType}
                                    onChange={(e) => setResidentForm({ ...residentForm, residentType: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="owner">Owner</option>
                                    <option value="tenant">Tenant</option>
                                    <option value="family_member">Family Member</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className={`${labelClass} flex items-center justify-between`}>
                                <span>Initial Password (Optional)</span>
                                <span className="text-[10px] text-emerald-600 font-medium lowercase">auto-generated (6 chars) if blank</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Leave blank to auto-generate & email"
                                value={residentForm.password}
                                onChange={(e) => setResidentForm({ ...residentForm, password: e.target.value })}
                                className={inputClass}
                            />
                            <p className="text-[11px] text-slate-400 mt-1">A 6-character temporary password will be auto-generated and emailed to resident.</p>
                        </div>
                        <FormFooter submitLabel="Proceed & Onboard" processingLabel="Dispatching Email..." />
                    </form>
                </ModalWrapper>
            )}

            {/* 4. Onboard Staff Modal */}
            {activeModal === 'staff' && (
                <ModalWrapper
                    title="Onboard Staff Member"
                    subtitle="Add security or maintenance personnel to the system"
                    onClose={resetForms}
                >
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setErrorMsg('');
                            setIsSubmitting(true);
                            try {
                                const formData = new FormData(e.currentTarget);
                                const name = (formData.get('name') as string)?.trim();
                                const phone = (formData.get('phone') as string)?.trim();
                                const employeeId = (formData.get('employeeId') as string)?.trim();
                                const role = (formData.get('role') as string)?.trim();
                                const email = (formData.get('email') as string)?.trim();
                                const department = (formData.get('department') as string)?.trim();
                                const password = (formData.get('password') as string)?.trim();

                                if (!name || !phone || !role || !employeeId) {
                                    setErrorMsg('Name, phone, role, and employeeId are required');
                                    setIsSubmitting(false);
                                    return;
                                }

                                const payload: any = {
                                    name,
                                    phone,
                                    employeeId,
                                    role,
                                    department: department || 'Security Operations',
                                };

                                if (email) payload.email = email;
                                if (password) payload.password = password;

                                const res = await api.post('/staff', payload);
                                if (res.data?.success) {
                                    toast.success('Staff member onboarded!');
                                    setSuccessMsg('Staff member added!');
                                    loadData();
                                    setTimeout(resetForms, 1200);
                                }
                            } catch (err: any) {
                                const msg = err.response?.data?.message || 'Failed to onboard staff.';
                                toast.error(msg);
                                setErrorMsg(msg);
                            } finally {
                                setIsSubmitting(false);
                            }
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className={labelClass}>Full Name *</label>
                            <input name="name" type="text" required placeholder="e.g. Suresh Kumar" className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Phone *</label>
                                <input name="phone" type="text" required placeholder="9876543210" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Employee ID *</label>
                                <input name="employeeId" type="text" required placeholder="EMP-101" className={inputClass} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Role / Skill *</label>
                                <select name="role" required className={inputClass} defaultValue="security">
                                    <option value="security">Security Guard</option>
                                    <option value="plumber">Plumber</option>
                                    <option value="electrician">Electrician</option>
                                    <option value="cleaner">Cleaner</option>
                                    <option value="gardener">Gardener</option>
                                    <option value="receptionist">Receptionist</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Department</label>
                                <select name="department" className={inputClass} defaultValue="Security Operations">
                                    <option value="Security Operations">Security</option>
                                    <option value="Maintenance Department">Maintenance</option>
                                    <option value="Housekeeping & Sanitation">Housekeeping</option>
                                    <option value="Plumbing Department">Plumbing</option>
                                    <option value="Electrical Department">Electrical</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Email (Optional)</label>
                                <input name="email" type="email" placeholder="suresh@res.com" className={inputClass} />
                            </div>
                            <div>
                                <label className={`${labelClass} flex items-center justify-between`}>
                                    <span>Password</span>
                                    <span className="text-[10px] text-emerald-600 font-medium lowercase">auto-6 char</span>
                                </label>
                                <input name="password" type="password" placeholder="Leave blank to auto-generate" className={inputClass} />
                            </div>
                        </div>
                        <FormFooter submitLabel="Add Staff Member" processingLabel="Processing..." />
                    </form>
                </ModalWrapper>
            )}

            {/* 5. Broadcast Notice Modal */}
            {activeModal === 'notice' && (
                <ModalWrapper
                    title="Broadcast Notice"
                    subtitle="Post an announcement visible to all residents"
                    onClose={resetForms}
                >
                    <form onSubmit={handleBroadcastNotice} className="space-y-4">
                        <div>
                            <label className={labelClass}>Notice Title *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Water Supply Shutdown on 15th Oct"
                                value={noticeForm.title}
                                onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Notice Content *</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Write the detailed notice content for residents..."
                                value={noticeForm.content}
                                onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                                className={`${inputClass} resize-none`}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Category</label>
                                <select
                                    value={noticeForm.category}
                                    onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="general">General</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="security">Security</option>
                                    <option value="event">Event</option>
                                    <option value="emergency">Emergency</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Priority</label>
                                <select
                                    value={noticeForm.priority}
                                    onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </div>
                        <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-slate-200 cursor-pointer hover:border-slate-900 transition-colors">
                            <input
                                type="checkbox"
                                checked={noticeForm.isPinned}
                                onChange={(e) => setNoticeForm({ ...noticeForm, isPinned: e.target.checked })}
                                className="w-4 h-4 accent-rose-600"
                            />
                            <span className="text-xs font-bold text-slate-700">Pin this notice to the top of the feed</span>
                        </label>
                        <FormFooter submitLabel="Broadcast Now" processingLabel="Broadcasting..." />
                    </form>
                </ModalWrapper>
            )}
        </div>
    );
};

export default AdminDashboard;
