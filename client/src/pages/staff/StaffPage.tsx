import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, RefreshCw, AlertCircle, CheckCircle2, X, Search, Phone, UserCheck, Briefcase, Clock, Activity } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const StaffPage: React.FC = () => {
    const [staffList, setStaffList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [deptFilter, setDeptFilter] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'security',
        department: 'Security Operations',
        employeeId: '',
        password: '',
        salary: 18000,
        workingHoursStart: '09:00',
        workingHoursEnd: '18:00',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await api.get('/staff').catch(() => ({ data: { data: [] } }));
            setStaffList(res.data?.data || []);
        } catch (e) {
            console.error(e);
            toast.error('Failed to fetch staff list');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!formData.name || !formData.phone || !formData.employeeId) {
            setErrorMsg('Name, Phone, and Employee ID are required.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                workingHours: {
                    start: formData.workingHoursStart,
                    end: formData.workingHoursEnd,
                },
            };

            const res = await api.post('/staff', payload);
            if (res.data?.success) {
                setSuccessMsg('Staff member onboarded successfully!');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    role: 'security',
                    department: 'Security Operations',
                    employeeId: '',
                    password: '',
                    salary: 18000,
                    workingHoursStart: '09:00',
                    workingHoursEnd: '18:00',
                });
                fetchStaff();
                setTimeout(() => {
                    setIsModalOpen(false);
                    setSuccessMsg('');
                }, 1200);
            } else {
                setErrorMsg(res.data?.message || 'Failed to add staff member.');
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Error creating staff member.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAvailabilityChange = async (staffId: string, newStatus: string) => {
        try {
            await api.patch(`/staff/${staffId}/availability`, {
                availabilityStatus: newStatus,
            });
            toast.success(`Staff status updated to ${newStatus.replace('_', ' ')}`);
            fetchStaff();
        } catch (e) {
            toast.error('Failed to update availability');
        }
    };

    const toggleStatus = async (id: string) => {
        try {
            await api.patch(`/staff/${id}/status`);
            toast.success('Staff status updated');
            fetchStaff();
        } catch (e) {
            console.error(e);
            toast.error('Failed to toggle status');
        }
    };

    const filteredStaff = staffList.filter((s) => {
        const matchesSearch =
            s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.phone?.includes(searchTerm);
        const matchesDept = !deptFilter || s.department === deptFilter;
        return matchesSearch && matchesDept;
    });

    const getAvailabilityBadge = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-emerald-100 text-emerald-800 border-emerald-300';
            case 'busy':
                return 'bg-amber-100 text-amber-800 border-amber-300';
            case 'on_break':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'on_leave':
                return 'bg-rose-100 text-rose-800 border-rose-300';
            case 'off_duty':
            default:
                return 'bg-slate-100 text-slate-700 border-slate-300';
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
            
            {/* Header Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-[28px] border-2 border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-slate-900 rounded-full text-xs font-black uppercase tracking-wider mb-3 border-2 border-slate-900">
                        <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> Personnel & Facility Operations
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-[1.05]">
                        Staff Scheduling & Roster
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
                        Manage facility technicians, monitor active workloads, track shift hours, and manage real-time availability for AI dispatch.
                    </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2 border-2 border-slate-900 shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Onboard Staff
                    </button>
                    <button
                        onClick={fetchStaff}
                        className="bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2 border-2 border-slate-900"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border-2 border-slate-900">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search staff by name, emp ID, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none"
                    >
                        <option value="">All Departments</option>
                        <option value="Security Operations">Security</option>
                        <option value="Plumbing Department">Plumbing</option>
                        <option value="Electrical Department">Electrical</option>
                        <option value="Housekeeping & Sanitation">Cleaning / Housekeeping</option>
                        <option value="Facility Operations">Facility Operations</option>
                    </select>
                </div>
            </div>

            {/* Staff Grid */}
            {loading ? (
                <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-3xl border-2 border-slate-900">
                    Loading society staff roster...
                </div>
            ) : filteredStaff.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-300">
                    <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-900">No Staff Members Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                        Add security guards, plumbers, electricians, and cleaners to enable smart slotting and task dispatch.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStaff.map((s) => {
                        const currentAvail = s.availabilityStatus || 'available';

                        return (
                            <div
                                key={s._id}
                                className="bg-white p-6 rounded-[24px] border-2 border-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                            >
                                <div>
                                    {/* Top badge line */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="h-9 px-3 bg-slate-900 text-white rounded-xl flex items-center justify-center font-mono font-black text-xs">
                                            {s.employeeId || 'EMP'}
                                        </div>
                                        <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-[10px] font-black rounded-lg uppercase tracking-wider border border-rose-200">
                                            {s.role}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-black text-slate-900">{s.name}</h3>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 capitalize font-medium">
                                        <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {s.department || 'Operations'}
                                    </p>

                                    {/* Contact & Shift Box */}
                                    <div className="space-y-1.5 text-xs text-slate-700 p-3 bg-slate-50 rounded-xl border border-slate-200 mt-3">
                                        <p className="flex items-center gap-2 font-semibold">
                                            <Phone className="w-3.5 h-3.5 text-slate-400" /> {s.phone}
                                        </p>
                                        <p className="flex items-center gap-2 text-[11px] text-slate-600">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" /> Shift: {s.workingHours?.start || '09:00'} - {s.workingHours?.end || '18:00'}
                                        </p>
                                        <p className="flex items-center gap-2 text-[11px] text-slate-600">
                                            <Activity className="w-3.5 h-3.5 text-rose-600" /> Active Tasks: <strong className="text-slate-900">{s.activeTasksCount || 0}</strong>
                                        </p>
                                    </div>
                                </div>

                                {/* Availability Selector */}
                                <div className="space-y-2 pt-2 border-t-2 border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase text-slate-500">Live Status</span>
                                        <select
                                            value={currentAvail}
                                            onChange={(e) => handleAvailabilityChange(s._id, e.target.value)}
                                            className={`text-[11px] font-extrabold px-2 py-1 rounded-lg border focus:outline-none ${getAvailabilityBadge(currentAvail)}`}
                                        >
                                            <option value="available">🟢 Available</option>
                                            <option value="busy">🟡 Busy (On Task)</option>
                                            <option value="on_break">🔵 On Break</option>
                                            <option value="on_leave">🔴 On Leave</option>
                                            <option value="off_duty">⚪ Off Duty</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between pt-1 text-xs">
                                        <span className={`inline-flex items-center gap-1 font-bold ${s.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            <UserCheck className="w-3.5 h-3.5" /> {s.isActive ? 'Account Active' : 'Account Disabled'}
                                        </span>

                                        <button
                                            onClick={() => toggleStatus(s._id)}
                                            className="text-[11px] font-extrabold text-slate-600 hover:text-slate-900 underline"
                                        >
                                            {s.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Onboard Staff Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 overflow-y-auto animate-fadeIn">
                    <div className="bg-white rounded-[28px] max-w-md w-full p-6 sm:p-8 border-2 border-slate-900 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 w-8 h-8 rounded-xl border-2 border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <h3 className="text-xl font-black text-slate-900 mb-1">Onboard Staff Member</h3>
                        <p className="text-xs text-slate-500 mb-6">Register facility technicians and guards for smart slotting</p>

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

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Ramesh Kumar"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-900 font-bold focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">Phone *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="9876543210"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-900 font-bold focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">Emp ID *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="EMP-101"
                                        value={formData.employeeId}
                                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-900 font-bold focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">Department</label>
                                    <select
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-900 font-bold focus:outline-none"
                                    >
                                        <option value="Security Operations">Security</option>
                                        <option value="Plumbing Department">Plumbing</option>
                                        <option value="Electrical Department">Electrical</option>
                                        <option value="Housekeeping & Sanitation">Cleaning</option>
                                        <option value="Facility Operations">Facility</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">Role / Skill</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-900 font-bold focus:outline-none"
                                    >
                                        <option value="security">Security Guard</option>
                                        <option value="plumber">Plumber</option>
                                        <option value="electrician">Electrician</option>
                                        <option value="cleaner">Cleaner</option>
                                        <option value="maintenance">Maintenance Technician</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">Shift Start</label>
                                    <input
                                        type="time"
                                        value={formData.workingHoursStart}
                                        onChange={(e) => setFormData({ ...formData, workingHoursStart: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-900 font-bold focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">Shift End</label>
                                    <input
                                        type="time"
                                        value={formData.workingHoursEnd}
                                        onChange={(e) => setFormData({ ...formData, workingHoursEnd: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-900 font-bold focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">Email (Optional)</label>
                                <input
                                    type="email"
                                    placeholder="ramesh@gmail.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-900 font-bold focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">Password (Optional)</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-900 font-bold focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 rounded-xl transition-colors border-2 border-slate-900 shadow-sm disabled:opacity-50"
                            >
                                {isSubmitting ? 'Onboarding...' : 'Onboard Staff Member'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffPage;
