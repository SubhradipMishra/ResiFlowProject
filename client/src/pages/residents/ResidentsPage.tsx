import React, { useState, useEffect } from 'react';
import { Users, Plus, RefreshCw, AlertCircle, CheckCircle2, Search, Mail, Phone, Home, BadgeCheck, Edit3, Trash2 } from 'lucide-react';
import api from '../../services/api';

const ResidentsPage: React.FC = () => {
    const [residents, setResidents] = useState<any[]>([]);
    const [flats, setFlats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingResident, setEditingResident] = useState<any | null>(null);
    const [deletingResident, setDeletingResident] = useState<any | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        flatId: '',
        residentType: 'owner',
        gender: 'male',
        emergencyContact: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resData, flatData] = await Promise.all([
                api.get('/resident').catch(() => ({ data: { data: [] } })),
                api.get('/flat').catch(() => ({ data: { data: [] } })),
            ]);
            setResidents(resData.data?.data || []);
            setFlats(flatData.data?.data || []);
            if (flatData.data?.data?.length > 0 && !formData.flatId) {
                setFormData(prev => ({ ...prev, flatId: flatData.data.data[0]._id }));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetModalState = () => {
        setIsAddModalOpen(false);
        setEditingResident(null);
        setDeletingResident(null);
        setErrorMsg('');
        setSuccessMsg('');
        setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            flatId: flats[0]?._id || '',
            residentType: 'owner',
            gender: 'male',
            emergencyContact: '',
        });
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsSubmitting(true);
        try {
            const res = await api.post('/resident', formData);
            if (res.data?.success) {
                setSuccessMsg('Resident onboarded & credentials dispatched!');
                fetchData();
                setTimeout(resetModalState, 1500);
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Error creating resident.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingResident) return;
        setErrorMsg('');
        setIsSubmitting(true);
        try {
            const res = await api.put(`/resident/${editingResident._id}`, {
                name: formData.name,
                phone: formData.phone,
                residentType: formData.residentType,
            });
            if (res.data?.success) {
                setSuccessMsg('Resident details updated!');
                fetchData();
                setTimeout(resetModalState, 1200);
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Error updating resident.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingResident) return;
        setErrorMsg('');
        setIsSubmitting(true);
        try {
            const res = await api.delete(`/resident/${deletingResident._id}`);
            if (res.data?.success) {
                setSuccessMsg('Resident account deactivated!');
                fetchData();
                setTimeout(resetModalState, 1200);
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Error deactivating resident.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEdit = (r: any) => {
        setEditingResident(r);
        setFormData({
            name: r.name || '',
            email: r.email || '',
            phone: r.phone || '',
            password: '',
            flatId: r.flat?._id || r.flat || '',
            residentType: r.residentType || 'owner',
            gender: r.gender || 'male',
            emergencyContact: r.emergencyContact || '',
        });
        setErrorMsg('');
        setSuccessMsg('');
    };

    const filteredResidents = residents.filter((r) => {
        const matchesSearch = r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.phone?.includes(searchTerm);
        const matchesType = !typeFilter || r.residentType === typeFilter;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header Banner */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-rose-500/5 rounded-bl-full pointer-events-none" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-[#e11d48] rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                        <Users className="w-3.5 h-3.5" /> Society Member Directory
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight font-outfit">Resident Directory</h1>
                    <p className="text-slate-500 text-sm mt-1">Onboard flat owners, tenants, and family members with Brevo activation emails.</p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <button
                        onClick={() => { resetModalState(); setIsAddModalOpen(true); }}
                        className="bg-[#e11d48] hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-rose-200"
                    >
                        <Plus className="w-4 h-4" /> Add Resident
                    </button>
                    <button
                        onClick={fetchData}
                        className="bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-semibold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 border border-slate-200"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                    >
                        <option value="">All Resident Types</option>
                        <option value="owner">Owners</option>
                        <option value="tenant">Tenants</option>
                        <option value="family_member">Family Members</option>
                    </select>
                </div>
            </div>

            {/* Resident Cards Grid */}
            {loading ? (
                <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-3xl border border-slate-200">
                    Loading resident directory...
                </div>
            ) : filteredResidents.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-[#0f172a]">No Residents Registered</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                        Onboard flat owners or tenants to give them access to the resident portal.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResidents.map((r) => (
                        <div key={r._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-10 w-10 bg-rose-50 text-[#e11d48] rounded-xl flex items-center justify-center font-extrabold text-sm uppercase">
                                        {r.name?.slice(0, 2) || 'RS'}
                                    </div>
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${
                                        r.residentType === 'owner' ? 'bg-rose-50 text-[#e11d48] border border-rose-200' :
                                        r.residentType === 'tenant' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {r.residentType}
                                    </span>
                                </div>

                                <h3 className="text-xl font-extrabold text-[#0f172a] mb-1">{r.name}</h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                                    <Home className="w-3.5 h-3.5 text-slate-400" />
                                    Flat {r.flat?.flatNumber || 'N/A'} • {r.flat?.building?.name || 'Building Tower'}
                                </p>

                                <div className="space-y-1.5 text-xs text-slate-600 p-3 bg-slate-50 rounded-2xl mb-4">
                                    <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {r.email}</p>
                                    <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {r.phone}</p>
                                </div>
                            </div>

                            {/* Actions Row */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                                <button
                                    onClick={() => startEdit(r)}
                                    className="text-slate-600 hover:text-[#0f172a] flex items-center gap-1 hover:underline"
                                >
                                    <Edit3 className="w-3.5 h-3.5 text-slate-400" /> Edit Profile
                                </button>
                                <button
                                    onClick={() => { setDeletingResident(r); setErrorMsg(''); setSuccessMsg(''); }}
                                    className="text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
                                >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-500" /> Deactivate
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-[#0f172a] mb-1">Onboard Resident</h3>
                        <p className="text-xs text-slate-500 mb-6">Assign flat and dispatch activation email via Brevo</p>

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

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Rahul Sharma"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="9876543210"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Flat Assignment *</label>
                                    <select
                                        required
                                        value={formData.flatId}
                                        onChange={(e) => setFormData({ ...formData, flatId: e.target.value })}
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
                                        value={formData.residentType}
                                        onChange={(e) => setFormData({ ...formData, residentType: e.target.value })}
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
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={resetModalState}
                                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all border border-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#e11d48] hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Dispatching...' : 'Proceed & Onboard'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingResident && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative">
                        <h3 className="text-xl font-bold text-[#0f172a] mb-1">Edit Resident Profile</h3>
                        <p className="text-xs text-slate-500 mb-6">Update contact info for {editingResident.name}</p>

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

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={resetModalState}
                                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all border border-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0f172a] hover:bg-slate-800 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Proceed & Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deletingResident && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative">
                        <h3 className="text-xl font-bold text-[#0f172a] mb-1">Deactivate Resident Account</h3>
                        <p className="text-xs text-slate-500 mb-6">Are you sure you want to deactivate <strong>{deletingResident.name}</strong>'s access?</p>

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

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={resetModalState}
                                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all border border-slate-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isSubmitting}
                                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Deactivating...' : 'Proceed & Deactivate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResidentsPage;
