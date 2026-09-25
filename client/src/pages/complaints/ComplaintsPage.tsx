import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { Wrench, Plus, RefreshCw, CheckCircle2, X, Trash2, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const ComplaintsPage: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [complaints, setComplaints] = useState<any[]>([]);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [resolveConfirmId, setResolveConfirmId] = useState<string | null>(null);

    const [createForm, setCreateForm] = useState({
        title: '',
        category: 'plumbing',
        priority: 'medium',
        description: '',
    });

    const [assignForm, setAssignForm] = useState({
        staffId: '',
        note: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const isResident = user?.role === 'resident';
            const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

            const reqs = [];
            reqs.push(api.get(isResident ? '/complaint/my-complaints' : '/complaint').catch(() => ({ data: { data: [] } })));

            if (isAdmin) {
                reqs.push(api.get('/staff').catch(() => ({ data: { data: [] } })));
            } else {
                reqs.push(Promise.resolve({ data: { data: [] } }));
            }

            const [compRes, staffRes] = await Promise.all(reqs);

            setComplaints(compRes.data?.data || []);
            setStaffList(staffRes.data?.data || []);
        } catch (e) {
            console.error(e);
            toast.error('Failed to load complaints');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    // Create Complaint Submit (Resident)
    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!createForm.title || !createForm.description) {
            toast.warning('Complaint title and description are required.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await api.post('/complaint', createForm);
            if (res.data?.success) {
                toast.success('Complaint ticket raised successfully!');
                setCreateForm({ title: '', category: 'plumbing', priority: 'medium', description: '' });
                fetchComplaints();
                setTimeout(() => setIsCreateModalOpen(false), 800);
            } else {
                toast.error(res.data?.message || 'Failed to raise complaint.');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error submitting complaint.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Assign Staff Submit (Admin)
    const handleAssignSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedComplaint || !assignForm.staffId) {
            toast.warning('Please select a staff member.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await api.patch(`/complaint/${selectedComplaint._id || selectedComplaint.id}/assign`, assignForm);
            if (res.data?.success) {
                toast.success('Complaint assigned to staff successfully!');
                setAssignForm({ staffId: '', note: '' });
                fetchComplaints();
                setTimeout(() => {
                    setIsAssignModalOpen(false);
                    setSelectedComplaint(null);
                }, 800);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to assign staff.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Staff Resolve Action
    const handleResolve = async (complaintId: string) => {
        try {
            await api.patch(`/complaint/${complaintId}/status`, { status: 'resolved', note: 'Issue resolved.' });
            toast.success('Complaint resolved successfully!');
            setResolveConfirmId(null);
            fetchComplaints();
        } catch (e) {
            toast.error('Failed to resolve complaint.');
        }
    };

    // Delete Complaint
    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/complaint/${id}`);
            toast.success('Complaint deleted successfully!');
            setDeleteConfirmId(null);
            fetchComplaints();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete complaint.');
        }
    };

    const filteredComplaints = statusFilter === 'all'
        ? complaints
        : complaints.filter(c => c.status === statusFilter);

    const canManage = user?.role === 'admin' || user?.role === 'super_admin';

    const statusPill = (status: string) => {
        if (status === 'resolved') return 'bg-emerald-500 text-white';
        if (status === 'assigned' || status === 'in_progress') return 'bg-rose-600 text-white';
        return 'bg-amber-400 text-slate-900';
    };

    return (
        <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
            {/* Header Banner — flat, ink-bordered, squarish */}
            <div className="bg-white p-6 sm:p-8 rounded-[28px] border-2 border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-slate-900 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3 border-2 border-slate-900">
                        <Wrench className="w-3.5 h-3.5" /> Maintenance Helpdesk
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.05]">Complaints & Repairs</h1>
                    <p className="text-slate-500 text-sm mt-2 max-w-xl leading-relaxed">File tickets, route issues to staff, track repair progress, and log resolutions.</p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    {user?.role === 'resident' && (
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 border-2 border-slate-900"
                        >
                            <Plus className="w-4 h-4" /> Raise Complaint
                        </button>
                    )}
                    <button
                        onClick={fetchComplaints}
                        className="bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-extrabold px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 border-2 border-slate-900"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>
            </div>

            {/* Status Filter Bar — flat pills */}
            <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 mr-2">
                    <Filter className="w-3.5 h-3.5" /> Filter:
                </div>
                {['all', 'pending', 'assigned', 'in_progress', 'resolved'].map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold capitalize transition-colors border-2 ${statusFilter === status
                                ? 'bg-rose-600 text-white border-slate-900'
                                : 'bg-white text-slate-600 border-slate-900 hover:bg-slate-100'
                            }`}
                    >
                        {status === 'all' ? `All (${complaints.length})` : `${status.replace('_', ' ')} (${complaints.filter(c => c.status === status).length})`}
                    </button>
                ))}
            </div>

            {/* Complaints List — flat card, no shadow */}
            <div className="bg-white rounded-[28px] border-2 border-slate-900 overflow-hidden">
                <div className="p-6 border-b-2 border-slate-900 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900">Active Helpdesk Tickets</h2>
                        <p className="text-xs text-slate-500">Showing {filteredComplaints.length} ticket{filteredComplaints.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-400 text-sm">Loading complaints...</div>
                ) : filteredComplaints.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-sm">
                        <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        No maintenance complaints found.
                    </div>
                ) : (
                    <div className="divide-y-2 divide-slate-100">
                        {filteredComplaints.map((c) => (
                            <div key={c._id || c.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-extrabold text-base text-slate-900">{c.title}</span>
                                        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full uppercase bg-white text-slate-900 border-2 border-slate-900">
                                            {c.category || 'General'}
                                        </span>
                                        <span className={`px-2.5 py-0.5 text-[11px] font-extrabold rounded-full uppercase ${c.priority === 'urgent' || c.priority === 'high' ? 'bg-rose-600 text-white' : 'bg-white text-slate-900 border-2 border-slate-900'
                                            }`}>
                                            {c.priority} Priority
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 max-w-2xl">{c.description}</p>
                                    {c.assignedStaff && (
                                        <p className="text-xs font-semibold text-slate-400">
                                            Assigned: <span className="text-slate-900 font-extrabold">{c.assignedStaff.name || 'Technician'}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 flex-wrap shrink-0">
                                    <span className={`px-3 py-1 text-xs font-extrabold rounded-full ${statusPill(c.status)}`}>
                                        {c.status || 'Pending'}
                                    </span>

                                    {canManage && c.status === 'pending' && (
                                        <button
                                            onClick={() => { setSelectedComplaint(c); setIsAssignModalOpen(true); }}
                                            className="bg-slate-900 hover:bg-slate-700 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs border-2 border-slate-900"
                                        >
                                            Assign Staff
                                        </button>
                                    )}

                                    {user?.role === 'staff' && c.status !== 'resolved' && (
                                        <button
                                            onClick={() => setResolveConfirmId(c._id || c.id)}
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs border-2 border-slate-900"
                                        >
                                            Mark Resolved
                                        </button>
                                    )}

                                    {canManage && (
                                        <button
                                            onClick={() => setDeleteConfirmId(c._id || c.id)}
                                            className="p-1.5 text-slate-900 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-colors rounded-lg border-2 border-slate-900"
                                            title="Delete Complaint"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Complaint Modal (Resident) — flat */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
                    <div className="bg-white rounded-[28px] max-w-md w-full p-8 border-2 border-slate-900 relative">
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute top-6 right-6 w-8 h-8 rounded-lg border-2 border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Raise Maintenance Ticket</h3>
                        <p className="text-xs text-slate-500 mb-6">Describe the issue for admin & technician routing</p>

                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Issue Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Water Leakage in Bathroom"
                                    value={createForm.title}
                                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Category
                                    </label>
                                    <select
                                        value={createForm.category}
                                        onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                                        className="w-full px-3 py-3 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                    >
                                        <option value="plumbing">Plumbing</option>
                                        <option value="electrical">Electrical</option>
                                        <option value="security">Security</option>
                                        <option value="carpentry">Carpentry</option>
                                        <option value="cleaning">Cleaning</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Priority
                                    </label>
                                    <select
                                        value={createForm.priority}
                                        onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                                        className="w-full px-3 py-3 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                    >
                                        <option value="urgent">Urgent</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Description *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Explain the problem in detail..."
                                    value={createForm.description}
                                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-extrabold py-3.5 rounded-xl transition-colors border-2 border-slate-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3.5 rounded-xl transition-colors border-2 border-slate-900 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Submitting...' : 'File Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Staff Modal (Admin) — flat */}
            {isAssignModalOpen && selectedComplaint && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
                    <div className="bg-white rounded-[28px] max-w-md w-full p-8 border-2 border-slate-900 relative">
                        <button
                            onClick={() => setIsAssignModalOpen(false)}
                            className="absolute top-6 right-6 w-8 h-8 rounded-lg border-2 border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Assign Staff Member</h3>
                        <p className="text-xs text-slate-500 mb-6">Route ticket: <strong className="text-slate-900">{selectedComplaint.title}</strong></p>

                        <form onSubmit={handleAssignSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Select Staff / Technician *
                                </label>
                                <select
                                    required
                                    value={assignForm.staffId}
                                    onChange={(e) => setAssignForm({ ...assignForm, staffId: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                >
                                    <option value="">-- Choose Staff Member --</option>
                                    {staffList.map(s => (
                                        <option key={s._id || s.id} value={s._id || s.id}>
                                            {s.name} ({s.department || s.role || 'Staff'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Admin Note (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Add instructions for the staff member..."
                                    value={assignForm.note}
                                    onChange={(e) => setAssignForm({ ...assignForm, note: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAssignModalOpen(false)}
                                    className="flex-1 bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-extrabold py-3.5 rounded-xl transition-colors border-2 border-slate-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-slate-900 hover:bg-slate-700 text-white font-extrabold py-3.5 rounded-xl transition-colors border-2 border-slate-900 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Assigning...' : 'Assign & Notify'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal — flat */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
                    <div className="bg-white rounded-[28px] max-w-sm w-full p-8 border-2 border-slate-900 text-center">
                        <div className="h-14 w-14 rounded-2xl bg-rose-600 border-2 border-slate-900 flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Delete Complaint?</h3>
                        <p className="text-sm text-slate-500 mb-6">This will permanently remove the complaint ticket.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirmId(null)} className="flex-1 bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-extrabold py-3 rounded-xl transition-colors border-2 border-slate-900">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 rounded-xl transition-colors border-2 border-slate-900">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Resolve Confirmation Modal — flat */}
            {resolveConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
                    <div className="bg-white rounded-[28px] max-w-sm w-full p-8 border-2 border-slate-900 text-center">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-500 border-2 border-slate-900 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Resolve Complaint?</h3>
                        <p className="text-sm text-slate-500 mb-6">Mark this maintenance ticket as resolved and close it.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setResolveConfirmId(null)} className="flex-1 bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-extrabold py-3 rounded-xl transition-colors border-2 border-slate-900">
                                Cancel
                            </button>
                            <button onClick={() => handleResolve(resolveConfirmId)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3 rounded-xl transition-colors border-2 border-slate-900">
                                Resolve
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintsPage;