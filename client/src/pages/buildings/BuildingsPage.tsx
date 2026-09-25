import React, { useState, useEffect } from 'react';
import { Building2, Plus, RefreshCw, CheckCircle2, AlertCircle, Edit3, Trash2 } from 'lucide-react';
import api from '../../services/api';

const BuildingsPage: React.FC = () => {
    const [buildings, setBuildings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingBuilding, setEditingBuilding] = useState<any | null>(null);
    const [deletingBuilding, setDeletingBuilding] = useState<any | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        buildingNumber: '',
        totalFloors: 4,
        description: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchBuildings = async () => {
        setLoading(true);
        try {
            const res = await api.get('/building').catch(() => ({ data: { data: [] } }));
            setBuildings(res.data?.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuildings();
    }, []);

    const resetModalState = () => {
        setIsAddModalOpen(false);
        setEditingBuilding(null);
        setDeletingBuilding(null);
        setErrorMsg('');
        setSuccessMsg('');
        setFormData({ name: '', buildingNumber: '', totalFloors: 4, description: '' });
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsSubmitting(true);
        try {
            const res = await api.post('/building', formData);
            if (res.data?.success) {
                setSuccessMsg('Building added successfully!');
                fetchBuildings();
                setTimeout(resetModalState, 1200);
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Error creating building.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBuilding) return;
        setErrorMsg('');
        setIsSubmitting(true);
        try {
            const res = await api.put(`/building/${editingBuilding._id}`, formData);
            if (res.data?.success) {
                setSuccessMsg('Building details updated!');
                fetchBuildings();
                setTimeout(resetModalState, 1200);
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Error updating building.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingBuilding) return;
        setErrorMsg('');
        setIsSubmitting(true);
        try {
            const res = await api.delete(`/building/${deletingBuilding._id}`);
            if (res.data?.success) {
                setSuccessMsg('Building deactivated!');
                fetchBuildings();
                setTimeout(resetModalState, 1200);
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Cannot delete building.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEdit = (b: any) => {
        setEditingBuilding(b);
        setFormData({
            name: b.name || '',
            buildingNumber: b.buildingNumber || '',
            totalFloors: b.totalFloors || 4,
            description: b.description || '',
        });
        setErrorMsg('');
        setSuccessMsg('');
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header Banner */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-rose-500/5 rounded-bl-full pointer-events-none" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-[#e11d48] rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                        <Building2 className="w-3.5 h-3.5" /> Society Infrastructure
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight font-outfit">Buildings & Towers</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage society towers, block numbers, floor plans, and flat capacities.</p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <button
                        onClick={() => { resetModalState(); setIsAddModalOpen(true); }}
                        className="bg-[#e11d48] hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-rose-200"
                    >
                        <Plus className="w-4 h-4" /> Add Building
                    </button>
                    <button
                        onClick={fetchBuildings}
                        className="bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-semibold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 border border-slate-200"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync
                    </button>
                </div>
            </div>

            {/* Building Grid */}
            {loading ? (
                <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-3xl border border-slate-200">
                    Loading society buildings...
                </div>
            ) : buildings.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-[#0f172a]">No Buildings Registered</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                        Create building towers to organize flats, residents, and floor management.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {buildings.map((b) => (
                        <div key={b._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-10 w-10 bg-rose-50 text-[#e11d48] rounded-xl flex items-center justify-center font-bold">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg uppercase">
                                        Block {b.buildingNumber}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-[#0f172a] mb-1 capitalize">{b.name}</h3>
                                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{b.description || 'Standard residential tower'}</p>

                                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl text-xs mb-4">
                                    <div>
                                        <span className="text-slate-400 font-semibold block">Total Floors</span>
                                        <span className="font-extrabold text-[#0f172a] text-sm">{b.totalFloors || 4} Floors</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 font-semibold block">Flats Count</span>
                                        <span className="font-extrabold text-[#e11d48] text-sm">{b.actualFlatCount || 0} Units</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Row */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                                <button
                                    onClick={() => startEdit(b)}
                                    className="text-slate-600 hover:text-[#0f172a] flex items-center gap-1 hover:underline"
                                >
                                    <Edit3 className="w-3.5 h-3.5 text-slate-400" /> Edit Tower
                                </button>
                                <button
                                    onClick={() => { setDeletingBuilding(b); setErrorMsg(''); setSuccessMsg(''); }}
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
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative">
                        <h3 className="text-xl font-bold text-[#0f172a] mb-1">Add Building Tower</h3>
                        <p className="text-xs text-slate-500 mb-6">Register a new building block in your society</p>

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
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Building Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Amber Tower"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Building Number / Code *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Block A"
                                    value={formData.buildingNumber}
                                    onChange={(e) => setFormData({ ...formData, buildingNumber: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Floors</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.totalFloors}
                                    onChange={(e) => setFormData({ ...formData, totalFloors: Number(e.target.value) })}
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
                                    {isSubmitting ? 'Processing...' : 'Proceed & Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingBuilding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative">
                        <h3 className="text-xl font-bold text-[#0f172a] mb-1">Edit Building Tower</h3>
                        <p className="text-xs text-slate-500 mb-6">Update structure details for {editingBuilding.name}</p>

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
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Building Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Building Number / Code *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.buildingNumber}
                                    onChange={(e) => setFormData({ ...formData, buildingNumber: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Floors</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.totalFloors}
                                    onChange={(e) => setFormData({ ...formData, totalFloors: Number(e.target.value) })}
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
                                    {isSubmitting ? 'Updating...' : 'Proceed & Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deletingBuilding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative">
                        <div className="h-12 w-12 bg-rose-50 text-[#e11d48] rounded-2xl flex items-center justify-center mb-4 font-bold">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-[#0f172a] mb-1">Deactivate Building Tower</h3>
                        <p className="text-xs text-slate-500 mb-6">Are you sure you want to deactivate <strong>{deletingBuilding.name}</strong>?</p>

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

export default BuildingsPage;
