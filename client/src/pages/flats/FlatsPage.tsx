import React, { useState, useEffect } from 'react';
import { Home, Plus, RefreshCw, AlertCircle, CheckCircle2, Building2, Search, Edit3, Trash2 } from 'lucide-react';
import api from '../../services/api';

const FlatsPage: React.FC = () => {
    const [flats, setFlats] = useState<any[]>([]);
    const [buildings, setBuildings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingFlat, setEditingFlat] = useState<any | null>(null);
    const [deletingFlat, setDeletingFlat] = useState<any | null>(null);

    const [formData, setFormData] = useState({
        flatNumber: '',
        buildingId: '',
        floor: 1,
        type: '2BHK',
        area: 1200,
        facing: 'East',
        status: 'vacant',
        monthlyMaintenance: 3500,
        parkingSpaces: 1,
        description: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [flatRes, bldRes] = await Promise.all([
                api.get('/flat').catch(() => ({ data: { data: [] } })),
                api.get('/building').catch(() => ({ data: { data: [] } })),
            ]);
            setFlats(flatRes.data?.data || []);
            setBuildings(bldRes.data?.data || []);
            if (bldRes.data?.data?.length > 0 && !formData.buildingId) {
                setFormData(prev => ({ ...prev, buildingId: bldRes.data.data[0]._id }));
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
        setEditingFlat(null);
        setDeletingFlat(null);
        setErrorMsg('');
        setSuccessMsg('');
        setFormData({
            flatNumber: '',
            buildingId: buildings[0]?._id || '',
            floor: 1,
            type: '2BHK',
            area: 1200,
            facing: 'East',
            status: 'vacant',
            monthlyMaintenance: 3500,
            parkingSpaces: 1,
            description: '',
        });
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsSubmitting(true);
        try {
            const res = await api.post('/flat', formData);
            if (res.data?.success) {
                setSuccessMsg('Flat unit added successfully!');
                fetchData();
                setTimeout(resetModalState, 1200);
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Error creating flat unit.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingFlat) return;
        setErrorMsg('');
        setIsSubmitting(true);
        try {
            const res = await api.put(`/flat/${editingFlat._id}`, formData);
            if (res.data?.success) {
                setSuccessMsg('Flat details updated!');
                fetchData();
                setTimeout(resetModalState, 1200);
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Error updating flat.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingFlat) return;
        setErrorMsg('');
        setIsSubmitting(true);
        try {
            const res = await api.delete(`/flat/${deletingFlat._id}`);
            if (res.data?.success) {
                setSuccessMsg('Flat unit deactivated!');
                fetchData();
                setTimeout(resetModalState, 1200);
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Cannot delete flat.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEdit = (f: any) => {
        setEditingFlat(f);
        setFormData({
            flatNumber: f.flatNumber || '',
            buildingId: f.building?._id || f.building || '',
            floor: f.floor || 1,
            type: f.type || '2BHK',
            area: f.area || 1200,
            facing: f.facing || 'East',
            status: f.status || 'vacant',
            monthlyMaintenance: f.monthlyMaintenance || 3500,
            parkingSpaces: f.parkingSpaces || 1,
            description: f.description || '',
        });
        setErrorMsg('');
        setSuccessMsg('');
    };

    const filteredFlats = flats.filter((f) => {
        const matchesSearch = f.flatNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.building?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || f.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header Banner */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-rose-500/5 rounded-bl-full pointer-events-none" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-[#e11d48] rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                        <Home className="w-3.5 h-3.5" /> Society Units Inventory
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight font-outfit">Flats & Apartments</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage occupancy status, maintenance fees, and parking allocations across all towers.</p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <button
                        onClick={() => { resetModalState(); setIsAddModalOpen(true); }}
                        className="bg-[#e11d48] hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-rose-200"
                    >
                        <Plus className="w-4 h-4" /> Add Flat Unit
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
                        placeholder="Search by flat number or building..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                    >
                        <option value="">All Statuses</option>
                        <option value="vacant">Vacant</option>
                        <option value="occupied">Occupied</option>
                        <option value="rented">Rented</option>
                        <option value="under_maintenance">Maintenance</option>
                    </select>
                </div>
            </div>

            {/* Flats Grid */}
            {loading ? (
                <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-3xl border border-slate-200">
                    Loading society flats inventory...
                </div>
            ) : filteredFlats.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                    <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-[#0f172a]">No Flats Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                        Add flat units under your created building towers.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFlats.map((f) => (
                        <div key={f._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-10 w-10 bg-rose-50 text-[#e11d48] rounded-xl flex items-center justify-center font-bold">
                                        <Home className="w-5 h-5" />
                                    </div>
                                    <span className={`px-2.5 py-1 text-xs font-extrabold rounded-lg uppercase tracking-wider ${
                                        f.status === 'occupied' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                        f.status === 'rented' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' :
                                        'bg-amber-50 text-amber-600 border border-amber-200'
                                    }`}>
                                        {f.status}
                                    </span>
                                </div>

                                <div className="flex items-baseline justify-between mb-1">
                                    <h3 className="text-2xl font-extrabold text-[#0f172a]">Flat {f.flatNumber}</h3>
                                    <span className="text-xs font-bold text-slate-400">{f.type}</span>
                                </div>

                                <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5 font-medium">
                                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                    {f.building?.name || 'Building Tower'} • Floor {f.floor}
                                </p>

                                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl text-xs mb-4">
                                    <div>
                                        <span className="text-slate-400 font-semibold block">Area</span>
                                        <span className="font-bold text-[#0f172a]">{f.area} sq.ft</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 font-semibold block">Maintenance</span>
                                        <span className="font-bold text-[#e11d48]">₹{f.monthlyMaintenance || 0}/mo</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Row */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                                <button
                                    onClick={() => startEdit(f)}
                                    className="text-slate-600 hover:text-[#0f172a] flex items-center gap-1 hover:underline"
                                >
                                    <Edit3 className="w-3.5 h-3.5 text-slate-400" /> Edit Unit
                                </button>
                                <button
                                    onClick={() => { setDeletingFlat(f); setErrorMsg(''); setSuccessMsg(''); }}
                                    className="text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
                                >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-500" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-[#0f172a] mb-1">Add Flat Unit</h3>
                        <p className="text-xs text-slate-500 mb-6">Create flat unit and assign to a building tower</p>

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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Building Tower *</label>
                                    <select
                                        required
                                        value={formData.buildingId}
                                        onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
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
                                        value={formData.flatNumber}
                                        onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Floor</label>
                                    <input
                                        type="number"
                                        value={formData.floor}
                                        onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                                        value={formData.area}
                                        onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
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
                                    {isSubmitting ? 'Creating...' : 'Proceed & Add Flat'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingFlat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-[#0f172a] mb-1">Edit Flat Unit {editingFlat.flatNumber}</h3>
                        <p className="text-xs text-slate-500 mb-6">Update flat configuration and maintenance settings</p>

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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    >
                                        <option value="vacant">Vacant</option>
                                        <option value="occupied">Occupied</option>
                                        <option value="rented">Rented</option>
                                        <option value="under_maintenance">Under Maintenance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Monthly Maintenance (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.monthlyMaintenance}
                                        onChange={(e) => setFormData({ ...formData, monthlyMaintenance: Number(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
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
                                    {isSubmitting ? 'Updating...' : 'Proceed & Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingFlat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative">
                        <h3 className="text-xl font-bold text-[#0f172a] mb-1">Deactivate Flat Unit</h3>
                        <p className="text-xs text-slate-500 mb-6">Are you sure you want to deactivate Flat <strong>{deletingFlat.flatNumber}</strong>?</p>

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
                                {isSubmitting ? 'Deactivating...' : 'Proceed & Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlatsPage;
