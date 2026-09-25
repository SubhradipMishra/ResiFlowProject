import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './redux/store';
import { checkAuthSession } from './redux/slices/authSlice';
import LandingPage from './pages/landing/LandingPage';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import BuildingsPage from './pages/buildings/BuildingsPage';
import FlatsPage from './pages/flats/FlatsPage';
import ResidentsPage from './pages/residents/ResidentsPage';
import StaffPage from './pages/staff/StaffPage';
import NoticesPage from './pages/notices/NoticesPage';
import ComplaintsPage from './pages/complaints/ComplaintsPage';
import VisitorsPage from './pages/visitors/VisitorsPage';
import VehiclesPage from './pages/vehicles/VehiclesPage';
import SettingsPage from './pages/settings/SettingsPage';
import MainLayout from './components/layout/MainLayout';
import PlaceholderPage from './components/common/PlaceholderPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkAuthSession());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#0f172a]"></div>
          <p className="mt-4 text-sm font-medium text-[#475569]">Initializing ResiFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Route */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
        />
        
        {/* Protected Routes */}
        <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Sidebar Module Routes */}
          <Route path="/buildings" element={<BuildingsPage />} />
          <Route path="/flats" element={<FlatsPage />} />
          <Route path="/residence" element={<BuildingsPage />} />
          <Route path="/residents" element={<ResidentsPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/my-vehicles" element={<VehiclesPage />} />
          <Route path="/my-visitors" element={<VisitorsPage />} />
          <Route path="/visitors" element={<VisitorsPage />} />
          <Route path="/assigned-tasks" element={<ComplaintsPage />} />
          <Route path="/admins" element={<PlaceholderPage title="Platform Administrators" description="Manage society admin accounts" />} />
          <Route path="/reports" element={<PlaceholderPage title="System & Activity Reports" description="Society performance and security logs" />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback Catch-all */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
      </Routes>
    </>
  );
}

export default App;
