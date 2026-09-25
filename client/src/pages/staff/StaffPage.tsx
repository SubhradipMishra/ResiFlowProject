import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, RefreshCw, AlertCircle, CheckCircle2, X, Search, Phone, Mail, UserCheck, Briefcase } from 'lucide-react';
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
        role: 'security_guard',
        department: 'security',
        employeeId: '',
        password: '',
        salary: 18000,
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
            const res = await api.post('/staff', formData);
            if (res.data?.success) {
                setSuccessMsg('Staff member added successfully!');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    role: 'security_guard',
                    department: 'security',
                    employeeId: '',
                    password: '',
                    salary: 18000,
                });
                fetchStaff();
                setTimeout(() => {
                    setIsModalOpen(false);
                    setSuccessMsg('');
                }, 1500);
            } else {
                setErrorMsg(res.data?.message || 'Failed to add staff member.');
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Error creating staff member.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleStatus = async (id: string) => {
        try {
            await api.patch(`/staff/${id}/toggle-status`);
            fetchStaff();
        } catch (e) {
            console.error(e);
        }
    };

    const filteredStaff = staffList.filter((s) => {
        const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.phone?.includes(searchTerm);
        const matchesDept = !deptFilter || s.department === deptFilter;
        return matchesSearch && matchesDept;
    });

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header Banner */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-rose-500/5 rounded-bl-full pointer-events-none" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-[#e11d48] rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                        <ShieldCheck className="w-3.5 h-3.5" /> Security & Services Team
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight font-outfit">Staff Roster</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage security gate personnel, maintenance technicians, plumbers, and electricians.</p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <button
                        onClick={() => { setIsModalOpen(true); setErrorMsg(''); }}
                        className="bg-[#e11d48] hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-rose-200"
                    >
                        <Plus className="w-4 h-4" /> Onboard Staff
                    </button>
                    <button
                        onClick={fetchStaff}
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
                        placeholder="Search staff by name, emp ID, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                    >
                        <option value="">All Departments</option>
                        <option value="security">Security</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="electrical">Electrical</option>
                        <option value="cleaning">Cleaning / Housekeeping</option>
                        <option value="management">Management</option>
                    </select>
                </div>
            </div>

            {/* Staff Grid */}
            {loading ? (
                <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-3xl border border-slate-200">
                    Loading society staff roster...
                </div>
            ) : filteredStaff.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                    <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-[#0f172a]">No Staff Onboarded</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                        Add security guards and maintenance team members to assign gate duty and ticket tasks.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStaff.map((s) => (
                        <div key={s._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-extrabold text-xs">
                                    {s.employeeId || 'EMP'}
                                </div>
                                <span className="px-2.5 py-1 bg-rose-50 text-[#e11d48] text-xs font-bold rounded-lg uppercase tracking-wider">
                                    {s.department || s.role}
                                </span>
                            </div>

                            <h3 className="text-xl font-extrabold text-[#0f172a] mb-1">{s.name}</h3>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mb-3 capitalize">
                                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {s.role.replace('_', ' ')}
                            </p>

                            <div className="space-y-1 text-xs text-slate-600 p-3 bg-slate-50 rounded-2xl mb-4">
                                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {s.phone}</p>
                                {s.email && <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {s.email}</p>}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                                    s.isActive ? 'text-emerald-600' : 'text-slate-400'
                                }`}>
                                    <UserCheck className="w-4 h-4" /> {s.isActive ? 'On Duty / Active' : 'Off Duty'}
                                </span>

                                <button
                                    onClick={() => toggleStatus(s._id)}
                                    className="text-xs font-bold text-slate-500 hover:text-[#0f172a] underline"
                                >
                                    {s.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-xl font-bold text-[#0f172a] mb-1">Onboard Staff Member</h3>
                        <p className="text-xs text-slate-500 mb-6">Register security guards and maintenance staff</p>

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

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Ramesh Kumar"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Phone *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="9876543210"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Emp ID *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="EMP-101"
                                        value={formData.employeeId}
                                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Department</label>
                                    <select
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    >
                                        <option value="security">Security</option>
                                        <option value="plumbing">Plumbing</option>
                                        <option value="electrical">Electrical</option>
                                        <option value="cleaning">Cleaning</option>
                                        <option value="management">Management</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    >
                                        <option value="security_guard">Security Guard</option>
                                        <option value="plumber">Plumber</option>
                                        <option value="electrician">Electrician</option>
                                        <option value="cleaner">Cleaner</option>
                                        <option value="manager">Manager</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email (Optional)</label>
                                <input
                                    type="email"
                                    placeholder="ramesh@gmail.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password (Optional for Login)</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-4 bg-[#e11d48] hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-rose-200 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Adding...' : 'Add Staff Member'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffPage;
