import React, { useState, useEffect } from 'react';
import { Bell, Plus, RefreshCw, X, Pin, Calendar, Trash2, Edit3 } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import api from '../../services/api';

const NoticesPage: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [notices, setNotices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editNoticeId, setEditNoticeId] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium',
        isPinned: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchNotices = async () => {
        setLoading(true);
        try {
            const res = await api.get('/notice/feed').catch(() => ({ data: { data: [] } }));
            setNotices(res.data?.data || []);
        } catch (e) {
            console.error(e);
            toast.error('Failed to load notices');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const resetForm = () => {
        setFormData({ title: '', description: '', category: 'general', priority: 'medium', isPinned: false });
        setIsEditMode(false);
        setEditNoticeId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description) {
            toast.warning('Notice title and description body are required.');
            return;
        }

        setIsSubmitting(true);
        try {
            let res;
            if (isEditMode && editNoticeId) {
                res = await api.put(`/notice/${editNoticeId}`, formData);
            } else {
                res = await api.post('/notice', formData);
            }
            if (res.data?.success) {
                toast.success(isEditMode ? 'Notice updated successfully!' : 'Notice published to feed!');
                resetForm();
                fetchNotices();
                setTimeout(() => setIsModalOpen(false), 800);
            } else {
                toast.error(res.data?.message || 'Operation failed.');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error processing notice.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (notice: any) => {
        setFormData({
            title: notice.title || '',
            description: notice.description || '',
            category: notice.category || 'general',
            priority: notice.priority || 'medium',
            isPinned: notice.isPinned || false,
        });
        setEditNoticeId(notice._id);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/notice/${id}`);
            toast.success('Notice deleted successfully!');
            setDeleteConfirmId(null);
            fetchNotices();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete notice.');
        }
    };

    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

    const priorityPill = (priority: string) => {
        if (priority === 'high' || priority === 'urgent') return 'bg-rose-600 text-white';
        if (priority === 'medium') return 'bg-amber-400 text-slate-900';
        return 'bg-white text-slate-900 border-2 border-slate-900';
    };

    return (
        <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
            {/* Header Banner — flat, ink-bordered, squarish */}
            <div className="bg-white p-6 sm:p-8 rounded-[28px] border-2 border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-slate-900 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3 border-2 border-slate-900">
                        <Bell className="w-3.5 h-3.5" /> Official Broadcast Board
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.05]">Notices & Announcements</h1>
                    <p className="text-slate-500 text-sm mt-2 max-w-xl leading-relaxed">Stay updated with maintenance schedules, water supply alerts, and society events.</p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    {isAdmin && (
                        <button
                            onClick={() => { resetForm(); setIsModalOpen(true); }}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 border-2 border-slate-900"
                        >
                            <Plus className="w-4 h-4" /> Broadcast Notice
                        </button>
                    )}
                    <button
                        onClick={fetchNotices}
                        className="bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-extrabold px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 border-2 border-slate-900"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>
            </div>

            {/* Notices List */}
            {loading ? (
                <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-[28px] border-2 border-slate-900">
                    Loading notice board feed...
                </div>
            ) : notices.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-[28px] border-2 border-dashed border-slate-300">
                    <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-extrabold text-slate-900">No Active Announcements</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        There are currently no broadcast notices posted on the society board.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notices.map((n) => (
                        <div
                            key={n._id}
                            className={`bg-white p-6 rounded-[28px] border-2 transition-colors ${n.isPinned ? 'border-rose-600' : 'border-slate-900'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {n.isPinned && (
                                        <span className="p-1.5 bg-rose-600 text-white rounded-lg border-2 border-slate-900">
                                            <Pin className="w-4 h-4 fill-white" />
                                        </span>
                                    )}
                                    <span className={`px-2.5 py-1 text-xs font-extrabold rounded-full uppercase tracking-wider ${priorityPill(n.priority)}`}>
                                        {n.priority} priority
                                    </span>
                                    <span className="px-2.5 py-1 bg-white text-slate-900 text-xs font-extrabold rounded-full uppercase border-2 border-slate-900">
                                        {n.category}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(n.createdAt).toLocaleDateString()}
                                    </span>
                                    {isAdmin && (
                                        <>
                                            <button onClick={() => handleEdit(n)} className="p-1.5 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors rounded-lg border-2 border-slate-900" title="Edit Notice">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setDeleteConfirmId(n._id)} className="p-1.5 text-slate-900 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-colors rounded-lg border-2 border-slate-900" title="Delete Notice">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-xl font-extrabold text-slate-900 mb-2">{n.title}</h3>
                            <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{n.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal — flat, ink-bordered */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
                    <div className="bg-white rounded-[28px] max-w-lg w-full p-8 border-2 border-slate-900 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => { setIsModalOpen(false); resetForm(); }}
                            className="absolute top-6 right-6 w-8 h-8 rounded-lg border-2 border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">{isEditMode ? 'Edit Announcement' : 'Broadcast Announcement'}</h3>
                        <p className="text-xs text-slate-500 mb-6">{isEditMode ? 'Update notice details' : 'Post an official notice to all society residents'}</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Notice Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Water Supply Interruption on Sunday"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                    >
                                        <option value="general">General</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="event">Event</option>
                                        <option value="emergency">Emergency</option>
                                        <option value="billing">Billing / Maintenance</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Priority Level</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Notice Details / Content *
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    placeholder="Provide detailed announcement information..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isPinned"
                                    checked={formData.isPinned}
                                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                                    className="w-4 h-4 text-rose-600 rounded border-2 border-slate-900 focus:ring-rose-600"
                                />
                                <label htmlFor="isPinned" className="text-xs font-extrabold text-slate-700">
                                    Pin to top of society notice feed
                                </label>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setIsModalOpen(false); resetForm(); }}
                                    className="flex-1 bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-extrabold py-3.5 rounded-xl transition-colors border-2 border-slate-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3.5 rounded-xl transition-colors border-2 border-slate-900 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Processing...' : isEditMode ? 'Update Notice' : 'Publish Announcement'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal — flat, ink-bordered */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
                    <div className="bg-white rounded-[28px] max-w-sm w-full p-8 border-2 border-slate-900 text-center">
                        <div className="h-14 w-14 rounded-2xl bg-rose-600 border-2 border-slate-900 flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Delete Notice?</h3>
                        <p className="text-sm text-slate-500 mb-6">This action cannot be undone. The notice will be permanently removed from the society feed.</p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-extrabold py-3 rounded-xl transition-colors border-2 border-slate-900"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirmId)}
                                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 rounded-xl transition-colors border-2 border-slate-900"
                            >
                                Delete Forever
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoticesPage;