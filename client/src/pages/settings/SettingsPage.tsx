import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { User, Key, Save, AlertCircle, Building2, UserCircle, Shield, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const SettingsPage: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Password Form State
    const [pwdForm, setPwdForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (pwdForm.newPassword !== pwdForm.confirmPassword) {
            toast.warning('New passwords do not match');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await api.patch('/auth/change-password', {
                currentPassword: pwdForm.currentPassword,
                newPassword: pwdForm.newPassword
            });
            if (res.data?.success) {
                toast.success('Password updated successfully');
                setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast.error(res.data?.message || 'Failed to update password');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error changing password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
            {/* Header Section — flat, squarish */}
            <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-slate-900 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3 border-2 border-slate-900">
                    <User className="w-3.5 h-3.5" /> Account
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.05]">Account Settings</h1>
                <p className="text-sm text-slate-500 mt-2">Manage your profile details and security preferences.</p>
            </div>

            <div className="bg-white rounded-[28px] border-2 border-slate-900 overflow-hidden flex flex-col md:flex-row min-h-[500px]">

                {/* Side Navigation — flat, ink-bordered active state */}
                <div className="w-full md:w-64 bg-white border-b-2 md:border-b-0 md:border-r-2 border-slate-900 p-4 shrink-0 flex md:flex-col gap-2 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors whitespace-nowrap border-2 ${activeTab === 'profile'
                            ? 'bg-rose-600 text-white border-slate-900'
                            : 'text-slate-600 border-transparent hover:bg-slate-100'
                            }`}
                    >
                        <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-white' : 'text-slate-400'}`} />
                        My Profile
                    </button>

                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors whitespace-nowrap border-2 ${activeTab === 'security'
                            ? 'bg-rose-600 text-white border-slate-900'
                            : 'text-slate-600 border-transparent hover:bg-slate-100'
                            }`}
                    >
                        <Shield className={`w-4 h-4 ${activeTab === 'security' ? 'text-white' : 'text-slate-400'}`} />
                        Security
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-8">
                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-fadeIn">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900">Profile Information</h2>
                                <p className="text-xs text-slate-500 mt-1">Your registered personal details.</p>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="h-20 w-20 rounded-2xl bg-rose-600 border-2 border-slate-900 flex items-center justify-center text-white shrink-0">
                                    {user?.name ? (
                                        <span className="text-3xl font-extrabold">{user.name.charAt(0).toUpperCase()}</span>
                                    ) : (
                                        <UserCircle className="w-10 h-10" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold text-slate-900">{user?.name || 'Unknown User'}</h3>
                                    <p className="text-sm font-semibold text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full">
                                        <CheckCircle2 className="w-3 h-3" /> Active Account
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t-2 border-slate-100">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                                    <div className="px-4 py-3 bg-[#FAF9F6] border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-900">
                                        {user?.name || '-'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                                    <div className="px-4 py-3 bg-[#FAF9F6] border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-900">
                                        {user?.email || '-'}
                                    </div>
                                </div>

                                {user?.role === 'resident' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Flat Number</label>
                                            <div className="px-4 py-3 bg-white border-2 border-slate-900 rounded-xl text-sm font-extrabold text-rose-600 flex items-center gap-2">
                                                <Building2 className="w-4 h-4" />
                                                {user?.flat?.flatNumber || user?.flat?.number || 'Unit Details Pending'}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Residence Society</label>
                                            <div className="px-4 py-3 bg-[#FAF9F6] border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-900">
                                                {user?.residence?.name || 'Smart Residence'}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="pt-4 flex items-start gap-3 p-4 bg-white border-2 border-slate-900 rounded-2xl">
                                <div className="w-8 h-8 rounded-lg bg-amber-400 border-2 border-slate-900 flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="w-4 h-4 text-slate-900" />
                                </div>
                                <div>
                                    <p className="text-sm font-extrabold text-slate-900">Need to update profile details?</p>
                                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                        For security reasons, email and core profile changes must be requested through the society admin desk or via a maintenance ticket.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900">Change Password</h2>
                                <p className="text-xs text-slate-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
                            </div>

                            <form onSubmit={handlePasswordUpdate} className="space-y-5 max-w-md pt-4">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Key className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={pwdForm.currentPassword}
                                            onChange={e => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-900 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={pwdForm.newPassword}
                                        onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-900 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                        placeholder="Min. 6 characters"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={pwdForm.confirmPassword}
                                        onChange={e => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-900 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                        placeholder="Re-type new password"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 rounded-xl transition-colors border-2 border-slate-900 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                                >
                                    {isSubmitting ? 'Updating...' : <><Save className="w-4 h-4" /> Update Password</>}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;