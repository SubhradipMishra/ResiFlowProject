import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import {
    Wrench,
    Plus,
    RefreshCw,
    CheckCircle2,
    X,
    Filter,
    Sparkles,
    Clock,
    Printer,
    Image as ImageIcon,
    ShieldCheck,
    Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { JobSheetModal } from '../../components/common/JobSheetModal';
import { StaffResolveModal } from '../../components/common/StaffResolveModal';
import { ResolutionProofModal } from '../../components/common/ResolutionProofModal';
import { AdminAssignSlotModal } from '../../components/common/AdminAssignSlotModal';

const ComplaintsPage: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isJobSheetModalOpen, setIsJobSheetModalOpen] = useState(false);
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
    const [isProofModalOpen, setIsProofModalOpen] = useState(false);

    const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

    // Create Complaint Form & AI Preview State
    const [createDescription, setCreateDescription] = useState('');
    const [createTitle, setCreateTitle] = useState('');
    const [preferredDate, setPreferredDate] = useState(new Date().toISOString().split('T')[0]);
    const [aiPreview, setAiPreview] = useState<any>(null);
    const [isAiScanning, setIsAiScanning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const isResident = user?.role === 'resident';
            const isStaff = user?.role === 'staff';

            let endpoint = '/complaint';
            if (isResident) endpoint = '/complaint/my-complaints';
            if (isStaff) endpoint = '/complaint/staff-tasks';

            const res = await api.get(endpoint);
            setComplaints(res.data?.data || []);
        } catch (e) {
            console.error(e);
            toast.error('Failed to load complaints');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [user?.role]);

    // Resident Action: Scan Description with Gemini AI in real-time
    const handleAiScan = async () => {
        if (!createDescription || createDescription.trim().length < 5) {
            toast.warning('Please enter a brief description first (at least 5 characters).');
            return;
        }

        setIsAiScanning(true);
        try {
            const res = await api.post('/complaint/analyze-draft', {
                description: createDescription,
                title: createTitle,
            });
            if (res.data?.success) {
                setAiPreview(res.data.data);
                if (!createTitle && res.data.data.title) {
                    setCreateTitle(res.data.data.title);
                }
                toast.success('Gemini AI analyzed your issue successfully!');
            }
        } catch (err: any) {
            console.error(err);
            toast.error('AI scan error; you can still submit normally.');
        } finally {
            setIsAiScanning(false);
        }
    };

    // Resident Action: Submit Complaint
    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!createDescription.trim()) {
            toast.warning('Please describe the maintenance issue.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                description: createDescription,
                title: createTitle || undefined,
                preferredDate,
            };

            const res = await api.post('/complaint', payload);
            if (res.data?.success) {
                toast.success('Complaint filed & classified by Gemini AI!');
                setCreateDescription('');
                setCreateTitle('');
                setAiPreview(null);
                setIsCreateModalOpen(false);
                fetchComplaints();
            } else {
                toast.error(res.data?.message || 'Failed to file complaint.');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error creating complaint.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredComplaints = statusFilter === 'all'
        ? complaints
        : complaints.filter((c) => c.status === statusFilter);

    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
    const isStaff = user?.role === 'staff';
    const isResident = user?.role === 'resident';

    const statusPill = (status: string) => {
        if (status === 'resolved') return 'bg-emerald-500 text-white';
        if (status === 'assigned' || status === 'in_progress') return 'bg-rose-600 text-white';
        return 'bg-amber-400 text-slate-900';
    };

    return (
        <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
            
            {/* Header Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-[28px] border-2 border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-50 text-rose-700 rounded-full text-xs font-black uppercase tracking-wider mb-3 border-2 border-slate-900">
                        <Sparkles className="w-3.5 h-3.5 text-rose-600" /> AI-Powered Facility Helpdesk
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-[1.05]">
                        Complaints & Smart Dispatch
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
                        Gemini AI issue diagnosis, conflict-free staff slot scheduling, offline dual-signed job sheets, and Cloudinary multi-photo verification.
                    </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    {isResident && (
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2 border-2 border-slate-900 shadow-sm"
                        >
                            <Plus className="w-4 h-4" /> Raise AI Complaint
                        </button>
                    )}
                    <button
                        onClick={fetchComplaints}
                        className="bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2 border-2 border-slate-900"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>
            </div>

            {/* Status Filter Bar */}
            <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-500 mr-2">
                    <Filter className="w-3.5 h-3.5" /> Filter:
                </div>
                {['all', 'pending', 'assigned', 'in_progress', 'resolved'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold capitalize transition-colors border-2 ${
                            statusFilter === status
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-600 border-slate-900 hover:bg-slate-100'
                        }`}
                    >
                        {status === 'all'
                            ? `All (${complaints.length})`
                            : `${status.replace('_', ' ')} (${complaints.filter((c) => c.status === status).length})`}
                    </button>
                ))}
            </div>

            {/* Complaints List Container */}
            <div className="bg-white rounded-[28px] border-2 border-slate-900 overflow-hidden shadow-sm">
                <div className="p-6 border-b-2 border-slate-900 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">Maintenance & Repair Tickets</h2>
                        <p className="text-xs text-slate-500">Showing {filteredComplaints.length} ticket{filteredComplaints.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-slate-900" /> Loading tickets...
                    </div>
                ) : filteredComplaints.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-sm">
                        <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        No maintenance tickets found in this view.
                    </div>
                ) : (
                    <div className="divide-y-2 divide-slate-100">
                        {filteredComplaints.map((c) => {
                            const cid = c._id || c.id;
                            const slotTime = c.scheduledSlot
                                ? `${c.scheduledSlot.startTime} - ${c.scheduledSlot.endTime}`
                                : null;

                            return (
                                <div
                                    key={cid}
                                    className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50 transition-colors"
                                >
                                    {/* Left Details */}
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-extrabold text-base text-slate-900">{c.title}</span>
                                            <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase bg-white text-slate-900 border-2 border-slate-900">
                                                {c.category}
                                            </span>
                                            <span
                                                className={`px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase border-2 border-slate-900 ${
                                                    c.priority === 'urgent' || c.priority === 'high'
                                                        ? 'bg-rose-600 text-white'
                                                        : 'bg-white text-slate-900'
                                                }`}
                                            >
                                                {c.priority} Priority
                                            </span>

                                            {c.aiAnalysis?.requiredSkill && (
                                                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                                                    <Sparkles className="w-2.5 h-2.5" /> {c.aiAnalysis.requiredSkill}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">{c.description}</p>

                                        {/* Assigned Personnel & Slot Info */}
                                        <div className="flex items-center gap-4 text-xs flex-wrap pt-1">
                                            {c.assignedTo ? (
                                                <span className="text-slate-600 flex items-center gap-1.5 font-semibold">
                                                    <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
                                                    Technician: <strong className="text-slate-900">{c.assignedTo.name}</strong> ({c.assignedTo.role})
                                                </span>
                                            ) : (
                                                <span className="text-amber-600 text-[11px] font-bold">⚠️ Unassigned (Pending Dispatch)</span>
                                            )}

                                            {c.scheduledDate && slotTime && (
                                                <span className="text-slate-600 flex items-center gap-1.5 font-semibold bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                                                    <Clock className="w-3 h-3 text-rose-600" />
                                                    {c.scheduledDate} ({slotTime})
                                                </span>
                                            )}

                                            {c.jobSheetNumber && (
                                                <span className="text-slate-500 font-mono text-[11px]">
                                                    Order #{c.jobSheetNumber}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Actions */}
                                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                                        <span className={`px-3 py-1 text-xs font-black rounded-full uppercase tracking-wider ${statusPill(c.status)}`}>
                                            {c.status || 'Pending'}
                                        </span>

                                        {/* Admin Action: Assign Staff with Slot */}
                                        {isAdmin && c.status === 'pending' && (
                                            <button
                                                onClick={() => {
                                                    setSelectedComplaint(c);
                                                    setIsAssignModalOpen(true);
                                                }}
                                                className="bg-rose-600 hover:bg-rose-700 text-white font-black px-3.5 py-1.5 rounded-xl text-xs border-2 border-slate-900 flex items-center gap-1.5 shadow-sm"
                                            >
                                                <Sparkles className="w-3.5 h-3.5" /> AI Dispatch & Slot
                                            </button>
                                        )}

                                        {/* Printable Job Sheet Button (Available when assigned or resolved) */}
                                        {c.status !== 'pending' && (
                                            <button
                                                onClick={() => {
                                                    setSelectedComplaint(c);
                                                    setIsJobSheetModalOpen(true);
                                                }}
                                                className="bg-white hover:bg-slate-100 text-slate-900 font-black px-3 py-1.5 rounded-xl text-xs border-2 border-slate-900 flex items-center gap-1.5"
                                                title="View/Print Work Order"
                                            >
                                                <Printer className="w-3.5 h-3.5" /> Job Sheet
                                            </button>
                                        )}

                                        {/* Staff Action: Resolve with 3 Cloudinary Proofs */}
                                        {isStaff && (c.status === 'assigned' || c.status === 'in_progress') && (
                                            <button
                                                onClick={() => {
                                                    setSelectedComplaint(c);
                                                    setIsResolveModalOpen(true);
                                                }}
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-3.5 py-1.5 rounded-xl text-xs border-2 border-slate-900 flex items-center gap-1.5 shadow-sm"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Complete Task (3 Proofs)
                                            </button>
                                        )}

                                        {/* Resolved: View Proofs Button */}
                                        {c.status === 'resolved' && (
                                            <button
                                                onClick={() => {
                                                    setSelectedComplaint(c);
                                                    setIsProofModalOpen(true);
                                                }}
                                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1.5 rounded-xl text-xs border border-emerald-300 flex items-center gap-1.5"
                                            >
                                                <ImageIcon className="w-3.5 h-3.5" /> View Proofs
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Resident: Create Complaint Modal with Real-Time Gemini AI Scan */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 overflow-y-auto animate-fadeIn">
                    <div className="bg-white rounded-[28px] max-w-xl w-full p-6 sm:p-8 border-2 border-slate-900 shadow-2xl relative">
                        <button
                            onClick={() => {
                                setIsCreateModalOpen(false);
                                setAiPreview(null);
                            }}
                            className="absolute top-6 right-6 w-8 h-8 rounded-xl border-2 border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center">
                                <Sparkles className="w-3.5 h-3.5" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Complaint Intake</h3>
                        </div>
                        <p className="text-xs text-slate-500 mb-5">
                            Just describe your problem. Gemini AI classifies priority, category, and dispatches the right technician.
                        </p>

                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                                    Describe the issue in your own words *
                                </label>
                                <textarea
                                    rows={4}
                                    value={createDescription}
                                    onChange={(e) => setCreateDescription(e.target.value)}
                                    placeholder="e.g. Major water leak under the kitchen sink, flooding the kitchen cabinet rapidly..."
                                    className="w-full bg-white border-2 border-slate-900 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    required
                                />
                            </div>

                            {/* Scan with Gemini AI Button */}
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={handleAiScan}
                                    disabled={isAiScanning || createDescription.trim().length < 5}
                                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border-2 border-slate-900 transition-colors"
                                >
                                    {isAiScanning ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing with Gemini...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-3.5 h-3.5 text-rose-400" /> Scan with Gemini AI
                                        </>
                                    )}
                                </button>
                                <span className="text-[11px] text-slate-400">Optional live preview</span>
                            </div>

                            {/* AI Live Insight Card */}
                            {aiPreview && (
                                <div className="bg-rose-50/70 border-2 border-slate-900 p-3.5 rounded-2xl space-y-2 text-xs animate-fadeIn">
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-slate-900 flex items-center gap-1.5 uppercase text-[10px]">
                                            <Sparkles className="w-3 h-3 text-rose-600" /> AI Diagnosis Result
                                        </span>
                                        <span className="px-2 py-0.5 bg-rose-600 text-white font-black rounded-full uppercase text-[9px]">
                                            {aiPreview.priority} Priority
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-rose-200">
                                        <div>
                                            <span className="text-slate-400 font-bold block">Category</span>
                                            <span className="font-extrabold text-slate-900 uppercase">{aiPreview.category}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 font-bold block">Required Specialist</span>
                                            <span className="font-extrabold text-rose-700 capitalize">{aiPreview.requiredSkill}</span>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-600 italic">
                                        "{aiPreview.reasoning}"
                                    </p>
                                </div>
                            )}

                            {/* Optional Title Override & Preferred Date */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div>
                                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                                        Title (Auto-filled by AI)
                                    </label>
                                    <input
                                        type="text"
                                        value={createTitle}
                                        onChange={(e) => setCreateTitle(e.target.value)}
                                        placeholder="Brief title"
                                        className="w-full bg-white border-2 border-slate-900 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                                        Preferred Service Date
                                    </label>
                                    <input
                                        type="date"
                                        value={preferredDate}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setPreferredDate(e.target.value)}
                                        className="w-full bg-white border-2 border-slate-900 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Submit Actions */}
                            <div className="flex items-center justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border-2 border-slate-900 text-xs font-extrabold text-slate-700 hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !createDescription.trim()}
                                    className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 border-2 border-slate-900 transition-colors shadow-sm"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" /> Submit Complaint
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Admin AI Staff & Slot Dispatch Modal */}
            <AdminAssignSlotModal
                isOpen={isAssignModalOpen}
                onClose={() => {
                    setIsAssignModalOpen(false);
                    setSelectedComplaint(null);
                }}
                complaint={selectedComplaint}
                onSuccess={fetchComplaints}
            />

            {/* Printable Job Sheet Work Order Modal */}
            <JobSheetModal
                isOpen={isJobSheetModalOpen}
                onClose={() => {
                    setIsJobSheetModalOpen(false);
                    setSelectedComplaint(null);
                }}
                complaint={selectedComplaint}
            />

            {/* Staff 3-Photo Cloudinary Resolution Modal */}
            <StaffResolveModal
                isOpen={isResolveModalOpen}
                onClose={() => {
                    setIsResolveModalOpen(false);
                    setSelectedComplaint(null);
                }}
                complaint={selectedComplaint}
                onSuccess={fetchComplaints}
            />

            {/* Resolution Multi-Photo Proof Inspector Modal */}
            <ResolutionProofModal
                isOpen={isProofModalOpen}
                onClose={() => {
                    setIsProofModalOpen(false);
                    setSelectedComplaint(null);
                }}
                complaint={selectedComplaint}
            />
        </div>
    );
};

export default ComplaintsPage;