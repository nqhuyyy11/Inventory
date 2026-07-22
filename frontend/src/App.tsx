import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/auth/Login';

// Placeholder for Dashboard
const DashboardPlaceholder = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
    <p className="text-gray-600">This is the main dashboard placeholder. Role-based content will appear here.</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes inside MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPlaceholder />} />
        
        {/* Placeholder for future role-based routes */}
        <Route path="admin/*" element={<div>Admin Module</div>} />
        <Route path="pos/*" element={<div>POS Module</div>} />
        <Route path="inventory/*" element={<div>Inventory Module</div>} />
        <Route path="store/*" element={<div>Store Module</div>} />
        <Route path="supplier/*" element={<div>Supplier Module</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
