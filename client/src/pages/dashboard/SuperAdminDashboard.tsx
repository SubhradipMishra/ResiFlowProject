import React, { useState, useEffect } from 'react';
import { 
    Shield, 
    Building, 
    Users, 
    RefreshCw, 
    KeyRound, 
    CheckCircle, 
    UserPlus, 
    Plus, 
    X, 
    Mail, 
    Lock, 
    Phone, 
    User, 
    AlertCircle, 
    MapPin, 
    Building2,
    Calendar,
    Link2
} from 'lucide-react';
import api from '../../services/api';

const SuperAdminDashboard: React.FC = () => {
    const [admins, setAdmins] = useState<any[]>([]);
    const [residences, setResidences] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ totalResidences: 0, totalAdmins: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'admins' | 'residences'>('admins');

    // Modals state
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isResidenceModalOpen, setIsResidenceModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    // Form data
    const [adminForm, setAdminForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        residenceId: '',
    });

    const [residenceForm, setResidenceForm] = useState({
        name: '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
        description: '',
        contactPhone: '',
        contactEmail: '',
        establishedYear: new Date().getFullYear(),
    });

    const [assignForm, setAssignForm] = useState({
        adminId: '',
        residenceId: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [adminRes, residenceRes, statsRes] = await Promise.all([
                api.get('/super-admin/admins').catch(() => ({ data: { data: [] } })),
                api.get('/super-admin/residences').catch(() => ({ data: { data: [] } })),
                api.get('/super-admin/stats').catch(() => ({ data: { data: { totalResidences: 0, totalAdmins: 0 } } })),
            ]);
            setAdmins(adminRes.data?.data || []);
            setResidences(residenceRes.data?.data || []);
            setStats(statsRes.data?.data || { totalResidences: 0, totalAdmins: 0 });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Create Admin Submit
    const handleAdminSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setSuccessMsg('');

        if (!adminForm.name || !adminForm.email || !adminForm.password) {
            setFormError('Name, email, and temporary password are required.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await api.post('/super-admin/create-admin', adminForm);
            if (res.data?.success) {
                setSuccessMsg('Admin account created! Activation email dispatched via Brevo.');
                setAdminForm({ name: '', email: '', password: '', phone: '', residenceId: '' });
                fetchData();
                setTimeout(() => {
                    setIsAdminModalOpen(false);
                    setSuccessMsg('');
                }, 2000);
            } else {
                setFormError(res.data?.message || 'Failed to create admin.');
            }
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Error creating admin account.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Create Residence Submit
    const handleResidenceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setSuccessMsg('');

        if (!residenceForm.name || !residenceForm.addressLine || !residenceForm.city || !residenceForm.state || !residenceForm.pincode) {
            setFormError('Residence name, address, city, state, and pincode are required.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await api.post('/super-admin/create-residence', residenceForm);
            if (res.data?.success) {
                setSuccessMsg('Residence created successfully!');
                setResidenceForm({
                    name: '',
                    addressLine: '',
                    city: '',
                    state: '',
                    pincode: '',
                    description: '',
                    contactPhone: '',
                    contactEmail: '',
                    establishedYear: new Date().getFullYear(),
                });
                fetchData();
                setTimeout(() => {
                    setIsResidenceModalOpen(false);
                    setSuccessMsg('');
                }, 1800);
            } else {
                setFormError(res.data?.message || 'Failed to create residence.');
            }
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Error creating residence instance.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Assign Residence Submit
    const handleAssignSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setSuccessMsg('');

        if (!assignForm.adminId || !assignForm.residenceId) {
            setFormError('Please select both Admin and Residence.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await api.post('/super-admin/assign-residence', assignForm);
            if (res.data?.success) {
                setSuccessMsg('Residence assigned to Admin & activation notice sent!');
                setAssignForm({ adminId: '', residenceId: '' });
                fetchData();
                setTimeout(() => {
                    setIsAssignModalOpen(false);
                    setSuccessMsg('');
                }, 1800);
            } else {
                setFormError(res.data?.message || 'Assignment failed.');
            }
        } catch (err: any) {
            setFormError(err.response?.data?.message || 'Error assigning residence.');
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
                        <Shield className="w-4 h-4" /> Platform Control Center
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight font-outfit">SuperAdmin Command Desk</h1>
                    <p className="text-slate-500 text-sm mt-1 max-w-xl leading-relaxed">
                        Create society instances, onboard admins, link residences, and dispatch activation credentials via Brevo.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 relative z-10">
                    <button
                        onClick={() => { setIsResidenceModalOpen(true); setFormError(''); }}
                        className="bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 border border-slate-200 shadow-sm"
                    >
                        <Building2 className="w-4 h-4 text-[#e11d48]" /> Create Residence
                    </button>
                    <button
                        onClick={() => { setIsAdminModalOpen(true); setFormError(''); }}
                        className="bg-[#e11d48] hover:bg-rose-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-rose-200"
                    >
                        <UserPlus className="w-4 h-4" /> Create Admin
                    </button>
                    <button
                        onClick={fetchData}
                        className="bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-semibold px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 border border-slate-200"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync
                    </button>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-[#0f172a]">
                        <Building className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Residences</p>
                        <h3 className="text-2xl font-extrabold text-[#0f172a]">{residences.length || stats.totalResidences || 0}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center text-[#e11d48]">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Society Admins</p>
                        <h3 className="text-2xl font-extrabold text-[#0f172a]">{admins.length}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Brevo Email Service</p>
                        <h3 className="text-2xl font-extrabold text-[#0f172a]">Active (OTP)</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <KeyRound className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">2FA Security</p>
                        <h3 className="text-2xl font-extrabold text-[#0f172a]">Enforced</h3>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                <button
                    onClick={() => setActiveTab('admins')}
                    className={`px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all flex items-center gap-2 ${
                        activeTab === 'admins' 
                            ? 'bg-[#0f172a] text-white shadow-md' 
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                    <Users className="w-4 h-4" /> Society Admins ({admins.length})
                </button>
                <button
                    onClick={() => setActiveTab('residences')}
                    className={`px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all flex items-center gap-2 ${
                        activeTab === 'residences' 
                            ? 'bg-[#0f172a] text-white shadow-md' 
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                    <Building2 className="w-4 h-4" /> Society Residences ({residences.length})
                </button>
            </div>

            {/* TAB 1: ADMINS TABLE */}
            {activeTab === 'admins' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-extrabold text-[#0f172a]">Registered Society Administrators</h2>
                            <p className="text-xs text-slate-500">Admins managing individual residence instances</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => { setIsAssignModalOpen(true); setFormError(''); }}
                                className="bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-bold px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 border border-slate-200"
                            >
                                <Link2 className="w-3.5 h-3.5" /> Assign Residence
                            </button>
                            <button
                                onClick={() => { setIsAdminModalOpen(true); setFormError(''); }}
                                className="bg-[#0f172a] hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm"
                            >
                                <UserPlus className="w-3.5 h-3.5" /> Add Admin
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-slate-400 text-sm">Loading administrators...</div>
                    ) : admins.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 text-sm">
                            No administrators created yet. Click <span className="font-bold text-[#e11d48]">Create Admin</span> above to onboard an admin.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Admin Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Phone</th>
                                        <th className="px-6 py-4">Assigned Residence</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {admins.map((adm) => (
                                        <tr key={adm._id || adm.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-[#0f172a]">{adm.name}</td>
                                            <td className="px-6 py-4">{adm.email}</td>
                                            <td className="px-6 py-4">{adm.phone || 'N/A'}</td>
                                            <td className="px-6 py-4 font-medium text-[#0f172a]">
                                                {adm.residence?.name ? (
                                                    <span className="capitalize px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">
                                                        {adm.residence.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-amber-600 text-xs font-semibold bg-amber-50 px-2.5 py-1 rounded-lg">
                                                        Unassigned
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full">
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: RESIDENCES TABLE */}
            {activeTab === 'residences' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-extrabold text-[#0f172a]">Society Residences</h2>
                            <p className="text-xs text-slate-500">Registered society instances across the platform</p>
                        </div>

                        <button
                            onClick={() => { setIsResidenceModalOpen(true); setFormError(''); }}
                            className="bg-[#0f172a] hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm"
                        >
                            <Building2 className="w-3.5 h-3.5" /> Add Residence
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-slate-400 text-sm">Loading residences...</div>
                    ) : residences.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 text-sm">
                            No residences registered. Click <span className="font-bold text-[#e11d48]">Create Residence</span> to create your first society.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Residence Name</th>
                                        <th className="px-6 py-4">Location</th>
                                        <th className="px-6 py-4">Address</th>
                                        <th className="px-6 py-4">Assigned Admin</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {residences.map((res) => (
                                        <tr key={res._id || res.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-[#0f172a] capitalize">{res.name}</td>
                                            <td className="px-6 py-4 capitalize">{res.city}, {res.state} ({res.pincode})</td>
                                            <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">{res.addressLine}</td>
                                            <td className="px-6 py-4 font-medium">
                                                {res.admin?.name ? (
                                                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg">
                                                        {res.admin.name} ({res.admin.email})
                                                    </span>
                                                ) : (
                                                    <span className="text-rose-600 text-xs font-semibold bg-rose-50 px-2.5 py-1 rounded-lg">
                                                        Unassigned Admin
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* MODAL 1: CREATE ADMIN */}
            {isAdminModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
                        <button
                            onClick={() => { setIsAdminModalOpen(false); setFormError(''); }}
                            className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-[#e11d48]">
                                <UserPlus className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#0f172a]">Create Society Admin</h3>
                                <p className="text-xs text-slate-500">Add admin, assign residence & dispatch Brevo email</p>
                            </div>
                        </div>

                        {formError && (
                            <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{formError}</span>
                            </div>
                        )}

                        {successMsg && (
                            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 shrink-0" />
                                <span>{successMsg}</span>
                            </div>
                        )}

                        <form onSubmit={handleAdminSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. John Doe"
                                        value={adminForm.name}
                                        onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="admin@society.com"
                                        value={adminForm.email}
                                        onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Temporary Password *
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={adminForm.password}
                                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Select Residence to Assign (Optional)
                                </label>
                                <select
                                    value={adminForm.residenceId}
                                    onChange={(e) => setAdminForm({ ...adminForm, residenceId: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a] capitalize"
                                >
                                    <option value="">-- No Residence Assigned Yet --</option>
                                    {residences.map((res) => (
                                        <option key={res._id || res.id} value={res._id || res.id}>
                                            {res.name} ({res.city})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Phone Number (Optional)
                                </label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="+1 234 567 890"
                                        value={adminForm.phone}
                                        onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-4 bg-[#0f172a] hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Creating & Sending Email...' : 'Create & Dispatch Activation Email'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: CREATE RESIDENCE */}
            {isResidenceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
                        <button
                            onClick={() => { setIsResidenceModalOpen(false); setFormError(''); }}
                            className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#0f172a]">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#0f172a]">Create Society Residence</h3>
                                <p className="text-xs text-slate-500">Register a new residential society instance</p>
                            </div>
                        </div>

                        {formError && (
                            <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{formError}</span>
                            </div>
                        )}

                        {successMsg && (
                            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 shrink-0" />
                                <span>{successMsg}</span>
                            </div>
                        )}

                        <form onSubmit={handleResidenceSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Residence / Society Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Green Valley Heights"
                                    value={residenceForm.name}
                                    onChange={(e) => setResidenceForm({ ...residenceForm, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="123 Main Avenue, Phase 2"
                                    value={residenceForm.addressLine}
                                    onChange={(e) => setResidenceForm({ ...residenceForm, addressLine: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Mumbai"
                                        value={residenceForm.city}
                                        onChange={(e) => setResidenceForm({ ...residenceForm, city: e.target.value })}
                                        className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Maharashtra"
                                        value={residenceForm.state}
                                        onChange={(e) => setResidenceForm({ ...residenceForm, state: e.target.value })}
                                        className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Pincode *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="400001"
                                        value={residenceForm.pincode}
                                        onChange={(e) => setResidenceForm({ ...residenceForm, pincode: e.target.value })}
                                        className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-4 bg-[#0f172a] hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Creating Residence...' : 'Create Residence Instance'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 3: ASSIGN RESIDENCE */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
                        <button
                            onClick={() => { setIsAssignModalOpen(false); setFormError(''); }}
                            className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <Link2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#0f172a]">Assign Residence to Admin</h3>
                                <p className="text-xs text-slate-500">Link an unassigned residence to an admin</p>
                            </div>
                        </div>

                        {formError && (
                            <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{formError}</span>
                            </div>
                        )}

                        {successMsg && (
                            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 shrink-0" />
                                <span>{successMsg}</span>
                            </div>
                        )}

                        <form onSubmit={handleAssignSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Select Admin *
                                </label>
                                <select
                                    required
                                    value={assignForm.adminId}
                                    onChange={(e) => setAssignForm({ ...assignForm, adminId: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                >
                                    <option value="">-- Choose Admin --</option>
                                    {admins.map((adm) => (
                                        <option key={adm._id || adm.id} value={adm._id || adm.id}>
                                            {adm.name} ({adm.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Select Residence *
                                </label>
                                <select
                                    required
                                    value={assignForm.residenceId}
                                    onChange={(e) => setAssignForm({ ...assignForm, residenceId: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a] capitalize"
                                >
                                    <option value="">-- Choose Residence --</option>
                                    {residences.map((res) => (
                                        <option key={res._id || res.id} value={res._id || res.id}>
                                            {res.name} ({res.city})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-4 bg-[#0f172a] hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Linking & Notifying...' : 'Assign Residence & Dispatch Notice'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;
