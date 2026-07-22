import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { isMockMode } from '../../services/api';

export default function MainLayout() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const mockActive = isMockMode();

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex flex-col shadow-lg">
        <div className="p-4 text-xl font-bold border-b border-slate-700 bg-slate-900 flex flex-col gap-1">
          <span>Hệ Thống Kho Hàng</span>
          {mockActive && (
            <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded w-max uppercase tracking-wider">
              Offline Mode
            </span>
          )}
        </div>
        
        {/* User Card */}
        <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex flex-col gap-1">
          <div className="text-sm font-semibold text-slate-200">{user?.fullName}</div>
          <div className="text-xs text-indigo-400 font-mono tracking-wide uppercase">
            {user?.role === 'STORE_MANAGER' ? 'Cửa Hàng Trưởng' : 'Thủ Kho (Inventory Mgr)'}
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block py-2.5 px-4 rounded-lg transition duration-200 ${
                isActive ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-700'
              }`
            }
          >
            Dashboard
          </NavLink>

          {/* STORE_MANAGER links */}
          {(user?.role === 'STORE_MANAGER' || user?.role === 'ADMIN') && (
            <NavLink
              to="/store/dispatch"
              className={({ isActive }) =>
                `block py-2.5 px-4 rounded-lg transition duration-200 ${
                  isActive ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-700'
                }`
              }
            >
              Yêu Cầu Điều Chuyển
            </NavLink>
          )}

          {/* INVENTORY_MANAGER links */}
          {(user?.role === 'INVENTORY_MANAGER' || user?.role === 'ADMIN') && (
            <NavLink
              to="/inventory/requests"
              className={({ isActive }) =>
                `block py-2.5 px-4 rounded-lg transition duration-200 ${
                  isActive ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-700'
                }`
              }
            >
              Duyệt Điều Chuyển ({user?.role === 'ADMIN' ? 'Admin' : 'Thủ Kho'})
            </NavLink>
          )}

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `block py-2.5 px-4 rounded-lg transition duration-200 ${
                isActive ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-700'
              }`
            }
          >
            Cài đặt
          </NavLink>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-800">
              {user?.role === 'STORE_MANAGER' ? 'Store Manager Workspace' : 'Warehouse Inventory Workspace'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {mockActive && (
              <span className="hidden md:inline-flex items-center text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                ⚠️ Đang chạy Offline (Sử dụng dữ liệu Mock)
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 hover:text-red-800 transition px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
