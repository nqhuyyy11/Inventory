import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from './store';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import StoreDispatch from './pages/StoreDispatch';
import ManageRequests from './pages/ManageRequests';

// Protected Route Guard
const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes inside MainLayout */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Store Manager Routes */}
          <Route element={<ProtectedRoute allowedRoles={['STORE_MANAGER', 'ADMIN']} />}>
            <Route path="store/dispatch" element={<StoreDispatch />} />
          </Route>

          {/* Inventory Manager Routes */}
          <Route element={<ProtectedRoute allowedRoles={['INVENTORY_MANAGER', 'ADMIN']} />}>
            <Route path="inventory/requests" element={<ManageRequests />} />
          </Route>

          {/* Placeholder for future routes */}
          <Route path="settings" element={<div className="bg-white p-6 rounded-lg shadow">Cài đặt hệ thống (Đang phát triển)</div>} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
