import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import SuperAdminDashboard from './SuperAdminDashboard';
import AdminDashboard from './AdminDashboard';
import StaffDashboard from './StaffDashboard';
import ResidentDashboard from './ResidentDashboard';

const Dashboard: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    if (!user) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#0f172a]"></div>
            </div>
        );
    }

    switch (user.role) {
        case 'super_admin':
            return <SuperAdminDashboard />;
        case 'admin':
            return <AdminDashboard />;
        case 'staff':
            return <StaffDashboard />;
        case 'resident':
            return <ResidentDashboard />;
        default:
            return <ResidentDashboard />;
    }
};

export default Dashboard;
