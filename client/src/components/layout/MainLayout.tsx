import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import api from '../../services/api';
import {
    LayoutDashboard,
    Building2,
    Users,
    ShieldAlert,
    Bell,
    LogOut,
    Menu,
    X,
    Car,
    FileText,
    MessageSquare,
    Settings
} from 'lucide-react';

const MainLayout = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            dispatch(logout());
            navigate('/login');
        }
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/notices', label: 'Notices', icon: Bell },
        { path: '/complaints', label: 'Complaints', icon: MessageSquare },
    ];

    if (user?.role === 'admin') {
        navItems.push({ path: '/buildings', label: 'Buildings', icon: Building2 });
        navItems.push({ path: '/flats', label: 'Flat Units', icon: FileText });
        navItems.push({ path: '/residents', label: 'Residents', icon: Users });
        navItems.push({ path: '/staff', label: 'Staff & Security', icon: ShieldAlert });
    } else if (user?.role === 'resident') {
        navItems.push({ path: '/my-vehicles', label: 'My Vehicles', icon: Car });
        navItems.push({ path: '/my-visitors', label: 'Visitors', icon: Users });
    } else if (user?.role === 'staff') {
        navItems.push({ path: '/visitors', label: 'Gate Visitors', icon: ShieldAlert });
        navItems.push({ path: '/assigned-tasks', label: 'My Tasks', icon: FileText });
    } else if (user?.role === 'super_admin') {
        navItems.push({ path: '/admins', label: 'Platform Admins', icon: Users });
        navItems.push({ path: '/reports', label: 'System Reports', icon: FileText });
    }

    navItems.push({ path: '/settings', label: 'Account & Settings', icon: Settings });

    return (
        <div className="min-h-screen bg-[#FAF9F6] flex">

            {/* Mobile backdrop when sidebar is open */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar — the single, shared sidebar for the whole app. Flat, ink-bordered, collapsible. */}
            <aside
                className={`fixed md:sticky top-0 left-0 h-screen z-40 bg-white border-r-2 border-slate-900 transition-all duration-300 flex-shrink-0 overflow-hidden ${sidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full md:w-0 md:translate-x-0'
                    }`}
            >
                <div className="w-72 h-full flex flex-col">
                    <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-rose-600 border-2 border-slate-900 rounded-xl flex items-center justify-center">
                                <Building2 className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-xl font-extrabold text-slate-900 tracking-tight">Resi<span className="text-rose-600">Flow</span></span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden w-8 h-8 rounded-lg border-2 border-slate-900 flex items-center justify-center text-slate-900 flex-shrink-0"
                            aria-label="Close sidebar"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                        <p className="px-3 text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">Main Menu</p>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors border-2 ${isActive
                                            ? 'bg-rose-600 text-white border-slate-900'
                                            : 'text-slate-600 border-transparent hover:bg-slate-100'
                                        }`}
                                >
                                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="p-4 border-t-2 border-slate-100">
                        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white border-2 border-slate-900 mb-3">
                            <div className="h-10 w-10 rounded-full bg-teal-900 border-2 border-slate-900 flex items-center justify-center text-white font-extrabold text-sm shrink-0">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-extrabold text-slate-900 truncate">{user?.name}</p>
                                <p className="text-xs text-slate-500 capitalize truncate">{user?.role?.replace('_', ' ')}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header — functional menu toggle */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b-2 border-slate-900 z-20 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-rose-600 border-2 border-slate-900 rounded-lg flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-extrabold text-slate-900">Resi<span className="text-rose-600">Flow</span></span>
                </div>
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="w-9 h-9 rounded-lg border-2 border-slate-900 flex items-center justify-center text-slate-900"
                    aria-label="Open sidebar"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 md:pt-0 pt-16">
                {/* Desktop-only collapse toggle, sits above the page content */}
                <div className="hidden md:flex items-center px-6 pt-6">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-10 h-10 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-900 hover:text-white flex items-center justify-center text-slate-900 transition-colors"
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
                    </button>
                </div>

                <div className="flex-1 p-4 md:px-8 md:pb-8 md:pt-4 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;