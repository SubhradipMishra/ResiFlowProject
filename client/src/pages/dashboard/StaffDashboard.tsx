import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { ShieldCheck, UserCheck, Wrench, Clock, CheckCircle2, Plus, RefreshCw, Eye, ChevronRight, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const StaffDashboard: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [visitors, setVisitors] = useState<any[]>([]);
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [visRes, compRes] = await Promise.all([
                api.get('/visitor').catch(() => ({ data: { data: [] } })),
                api.get('/complaint').catch(() => ({ data: { data: [] } })),
            ]);
            setVisitors(visRes.data?.data || []);
            setComplaints(compRes.data?.data || []);
            toast.success('Dashboard refreshed');
        } catch (e) {
            console.error(e);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openComplaints = complaints.filter(c => c.status !== 'resolved');
    const resolvedComplaints = complaints.filter(c => c.status === 'resolved');
    const todayVisitors = visitors.filter(v => {
        const d = new Date(v.entryTime || v.createdAt);
        const today = new Date();
        return d.toDateString() === today.toDateString();
    });

    const handleResolve = async (id: string) => {
        try {
            await api.patch(`/complaint/${id}/status`, { status: 'resolved', note: 'Issue resolved by staff.' });
            toast.success('Complaint marked as resolved!');
            loadData();
        } catch (e) {
            toast.error('Failed to resolve complaint');
        }
    };

    const handleCheckout = async (id: string) => {
        try {
            await api.patch(`/visitor/${id}/checkout`, { exitTime: new Date().toISOString() });
            toast.success('Visitor checked out successfully!');
            loadData();
        } catch (e) {
            toast.error('Failed to check out visitor');
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* White Raspberry Header Banner */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-80 h-80 bg-rose-500/5 rounded-bl-full pointer-events-none" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-50 text-[#e11d48] rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-rose-200/70">
                        <ShieldCheck className="w-4 h-4" /> Staff & Operations Desk
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight font-outfit">
                        Security & Operations Hub
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 max-w-xl leading-relaxed">
                        Welcome, {user?.name || 'Staff'} — Log visitors, record vehicle entries, and manage assigned maintenance tickets.
                    </p>
                </div>

                <button
                    onClick={loadData}
                    className="bg-[#e11d48] hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-rose-200 relative z-10"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/visitors')}>
                    <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center text-[#e11d48]">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Visitors</p>
                        <h3 className="text-2xl font-extrabold text-[#0f172a]">{todayVisitors.length}</h3>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/assigned-tasks')}>
                    <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center text-[#e11d48]">
                        <Wrench className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Open Complaints</p>
                        <h3 className="text-2xl font-extrabold text-[#0f172a]">{openComplaints.length}</h3>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolved Tasks</p>
                        <h3 className="text-2xl font-extrabold text-[#0f172a]">{resolvedComplaints.length}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center text-[#e11d48]">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Visitors</p>
                        <h3 className="text-2xl font-extrabold text-[#0f172a]">{visitors.length}</h3>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => navigate('/visitors')} className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-[#e11d48] hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-lg bg-rose-50 flex items-center justify-center text-[#e11d48] group-hover:bg-[#e11d48] group-hover:text-white transition-colors">
                            <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-extrabold text-[#0f172a]">Log Gate Entry</span>
                    </div>
                    <p className="text-xs text-slate-500">Check-in a visitor at the security gate</p>
                </button>

                <button onClick={() => navigate('/assigned-tasks')} className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-[#e11d48] hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-lg bg-rose-50 flex items-center justify-center text-[#e11d48] group-hover:bg-[#e11d48] group-hover:text-white transition-colors">
                            <Wrench className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-extrabold text-[#0f172a]">View Assigned Tasks</span>
                    </div>
                    <p className="text-xs text-slate-500">Review and resolve maintenance complaints</p>
                </button>
            </div>

            {/* Two column: Visitor Log + Assigned Complaints */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visitor Log */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-extrabold text-[#0f172a]">Recent Gate Visitors</h2>
                            <p className="text-xs text-slate-500">Real-time visitor entries</p>
                        </div>
                        <button onClick={() => navigate('/visitors')} className="text-xs font-bold text-[#e11d48] hover:underline flex items-center gap-1">
                            View All <Eye className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-slate-400 text-sm">Loading gate entries...</div>
                    ) : visitors.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 text-sm">No visitor entries logged.</div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {visitors.slice(0, 5).map((v) => (
                                <div key={v._id || v.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div>
                                        <p className="font-bold text-sm text-[#0f172a]">{v.name}</p>
                                        <p className="text-xs text-slate-500">{v.phone} • {v.visitorType || 'Guest'}</p>
                                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(v.entryTime || v.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                            v.exitTime ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700'
                                        }`}>
                                            {v.exitTime ? 'Checked Out' : 'Inside'}
                                        </span>
                                        {!v.exitTime && (
                                            <button
                                                onClick={() => handleCheckout(v._id || v.id)}
                                                className="bg-[#e11d48] hover:bg-rose-600 text-white font-bold px-3 py-1 rounded-lg text-xs"
                                            >
                                                Checkout
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Assigned Complaints */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-extrabold text-[#0f172a]">My Assigned Tasks</h2>
                            <p className="text-xs text-slate-500">Pending and active maintenance tickets</p>
                        </div>
                        <button onClick={() => navigate('/assigned-tasks')} className="text-xs font-bold text-[#e11d48] hover:underline flex items-center gap-1">
                            View All <Eye className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-slate-400 text-sm">Loading assigned tasks...</div>
                    ) : openComplaints.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 text-sm">No pending tasks. All clear! ✅</div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {openComplaints.slice(0, 5).map((c) => (
                                <div key={c._id || c.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div>
                                        <p className="font-bold text-sm text-[#0f172a]">{c.title}</p>
                                        <p className="text-xs text-slate-500 capitalize">{c.category} • {c.priority} priority</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                            c.status === 'assigned' || c.status === 'in_progress' ? 'bg-rose-50 text-[#e11d48]' : 'bg-amber-50 text-amber-700'
                                        }`}>
                                            {c.status || 'Pending'}
                                        </span>
                                        <button
                                            onClick={() => handleResolve(c._id || c.id)}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-xs"
                                        >
                                            Resolve
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
