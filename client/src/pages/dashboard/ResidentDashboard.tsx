import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../redux/store';
import { Home, Car, Wrench, Bell, UserCheck, Plus, RefreshCw, Eye, Calendar, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const ResidentDashboard: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [complaints, setComplaints] = useState<any[]>([]);
    const [notices, setNotices] = useState<any[]>([]);
    const [visitors, setVisitors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [vehRes, compRes, notRes, visRes] = await Promise.all([
                api.get('/vehicle/my-vehicles').catch(() => ({ data: { data: [] } })),
                api.get('/complaint/my-complaints').catch(() => ({ data: { data: [] } })),
                api.get('/notice/feed').catch(() => ({ data: { data: [] } })),
                api.get('/visitor/my-visitors').catch(() => ({ data: { data: [] } })),
            ]);
            setVehicles(vehRes.data?.data || []);
            setComplaints(compRes.data?.data || []);
            setNotices(notRes.data?.data || []);
            setVisitors(visRes.data?.data || []);
            toast.success('Dashboard refreshed');
        } catch (e) {
            console.error(e);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openComplaints = complaints.filter(c => c.status !== 'resolved');

    const statusPill = (status: string) => {
        if (status === 'resolved') return 'bg-emerald-500 text-white';
        if (status === 'assigned' || status === 'in_progress') return 'bg-rose-600 text-white';
        return 'bg-amber-400 text-slate-900';
    };

    return (
        <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">

            {/* Header Banner — flat, off-white surface, squarish */}
            <div className="bg-white p-6 sm:p-8 rounded-[28px] border-2 border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-slate-900 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3 border-2 border-slate-900">
                        <Home className="w-3.5 h-3.5" /> Resident Portal
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.05]">
                        Welcome back, {user?.name || 'Resident'}!
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 max-w-xl leading-relaxed">
                        Flat {user?.flat?.flatNumber || user?.flat?.number || 'Unit'} • {user?.residence?.name || 'Smart Residence'}
                    </p>
                </div>

                <button
                    onClick={loadData}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 border-2 border-slate-900 flex-shrink-0"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            {/* Quick Stats — flat, squarish icon tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/my-vehicles')}>
                    <div className="h-12 w-12 rounded-xl bg-rose-600 border-2 border-slate-900 flex items-center justify-center text-white">
                        <Car className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">My Vehicles</p>
                        <h3 className="text-2xl font-extrabold text-slate-900">{vehicles.length}</h3>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                </div>

                <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/complaints')}>
                    <div className="h-12 w-12 rounded-xl bg-teal-900 border-2 border-slate-900 flex items-center justify-center text-white">
                        <Wrench className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Open Tickets</p>
                        <h3 className="text-2xl font-extrabold text-slate-900">{openComplaints.length}</h3>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                </div>

                <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/notices')}>
                    <div className="h-12 w-12 rounded-xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-slate-900">
                        <Bell className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Notices</p>
                        <h3 className="text-2xl font-extrabold text-slate-900">{notices.length}</h3>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                </div>

                <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/my-visitors')}>
                    <div className="h-12 w-12 rounded-xl bg-slate-900 border-2 border-slate-900 flex items-center justify-center text-white">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Visitor Passes</p>
                        <h3 className="text-2xl font-extrabold text-slate-900">{visitors.length}</h3>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                </div>
            </div>

            {/* Quick Actions — flat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button onClick={() => navigate('/complaints')} className="bg-white border-2 border-slate-900 rounded-2xl p-5 text-left hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-lg bg-white border-2 border-slate-900 flex items-center justify-center text-slate-900 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600 transition-colors">
                            <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-extrabold text-slate-900">Raise Complaint</span>
                    </div>
                    <p className="text-xs text-slate-500">Report a maintenance issue or concern</p>
                </button>

                <button onClick={() => navigate('/my-vehicles')} className="bg-white border-2 border-slate-900 rounded-2xl p-5 text-left hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-lg bg-white border-2 border-slate-900 flex items-center justify-center text-slate-900 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600 transition-colors">
                            <Car className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-extrabold text-slate-900">Register Vehicle</span>
                    </div>
                    <p className="text-xs text-slate-500">Add a new vehicle to your parking slot</p>
                </button>

                <button onClick={() => navigate('/my-visitors')} className="bg-white border-2 border-slate-900 rounded-2xl p-5 text-left hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-lg bg-white border-2 border-slate-900 flex items-center justify-center text-slate-900 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600 transition-colors">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-extrabold text-slate-900">Pre-Approve Visitor</span>
                    </div>
                    <p className="text-xs text-slate-500">Create a gate pass for expected visitors</p>
                </button>
            </div>

            {/* My Complaints & Society Notices Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Maintenance Complaints */}
                <div className="bg-white p-6 rounded-[28px] border-2 border-slate-900 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-extrabold text-slate-900">My Complaints</h2>
                            <button onClick={() => navigate('/complaints')} className="text-xs font-extrabold text-rose-600 hover:underline flex items-center gap-1">
                                View All <Eye className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {loading ? (
                            <p className="text-slate-400 text-sm py-4 text-center">Loading complaints...</p>
                        ) : complaints.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm bg-[#FAF9F6] rounded-2xl border-2 border-dashed border-slate-300">
                                No open complaints registered for your flat unit.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {complaints.slice(0, 4).map((c) => (
                                    <div key={c._id || c.id} className="p-4 bg-[#FAF9F6] rounded-2xl border-2 border-slate-200 flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-slate-900 truncate">{c.title}</p>
                                            <p className="text-xs text-slate-500 capitalize">{c.category} • Priority: {c.priority}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 text-xs font-extrabold rounded-full flex-shrink-0 ${statusPill(c.status)}`}>
                                            {c.status || 'Pending'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Society Notices */}
                <div className="bg-white p-6 rounded-[28px] border-2 border-slate-900 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-extrabold text-slate-900">Recent Society Notices</h2>
                            <button onClick={() => navigate('/notices')} className="text-xs font-extrabold text-rose-600 hover:underline flex items-center gap-1">
                                View All <Eye className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {loading ? (
                            <p className="text-slate-400 text-sm py-4 text-center">Loading notices...</p>
                        ) : notices.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm bg-[#FAF9F6] rounded-2xl border-2 border-dashed border-slate-300">
                                No broadcast notices posted at this time.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {notices.slice(0, 4).map((n) => (
                                    <div key={n._id || n.id} className="p-4 bg-[#FAF9F6] rounded-2xl border-2 border-slate-200">
                                        <div className="flex items-center justify-between mb-1 gap-2">
                                            <p className="font-bold text-sm text-slate-900 truncate">{n.title}</p>
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full flex-shrink-0">
                                                {n.priority || 'Notice'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 line-clamp-2">{n.content || n.description}</p>
                                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(n.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ResidentDashboard;