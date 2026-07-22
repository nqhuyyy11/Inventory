import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import { authService, isMockMode, setMockMode } from '../../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mockActive, setMockActive] = useState(isMockMode());

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMockToggle = (checked: boolean) => {
    setMockMode(checked);
    setMockActive(checked);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu.');
      return;
    }

    try {
      const response = await authService.login(username, password);
      const { token, user } = response.data;

      dispatch(setCredentials({ user, token }));
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập hoặc kết nối Database.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-slate-800 rounded-2xl shadow-xl border border-slate-700">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
            Hệ Thống Kho Hàng
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Đăng nhập để tiếp tục quản lý
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-500 text-red-200 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1">
                Tên đăng nhập
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="Ví dụ: ducanh, storemanager"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="Mật khẩu"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-700 pt-4">
            <div className="flex items-center">
              <input
                id="mock-mode"
                type="checkbox"
                checked={mockActive}
                onChange={(e) => handleMockToggle(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-600 rounded bg-slate-700"
              />
              <label htmlFor="mock-mode" className="ml-2 block text-sm text-slate-300">
                Chạy Offline (Mock Data)
              </label>
            </div>
            <div className="text-xs text-slate-500">
              Mật khẩu mặc định: <span className="font-mono text-slate-300">123456</span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600 text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">Tài khoản chạy thử:</p>
          <p>• Store Manager: <span className="font-mono text-indigo-300">storemanager</span></p>
          <p>• Inventory Manager: <span className="font-mono text-indigo-300">ducanh</span></p>
        </div>
      </div>
    </div>
  );
}
