import { useState, useEffect } from 'react';
import { inventoryService } from '../services/api';

interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  unit: string;
}

interface RequestItem {
  id: number;
  status: string;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await inventoryService.getProducts();
        const reqRes = await inventoryService.getRequests();
        setProducts(prodRes.data);
        setRequests(reqRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-slate-500 font-medium">Đang tải dữ liệu hệ thống...</div>;
  }

  const pendingRequestsCount = requests.filter((r) => r.status === 'PENDING').length;

  // Extract unique categories
  const categories = ['ALL', ...Array.from(new Set(products.map((p) => p.category || 'Khác')))];

  // Filter products by search term & category
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border border-slate-100 flex flex-col gap-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng số sản phẩm</div>
          <div className="text-3xl font-black text-slate-800">{products.length}</div>
          <div className="text-xs font-semibold text-indigo-600">Danh mục sản phẩm đăng ký</div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-slate-100 flex flex-col gap-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hàng hết hạn / Cảnh báo</div>
          <div className="text-3xl font-black text-amber-600">2</div>
          <div className="text-xs font-semibold text-amber-600">Cần theo dõi & xử lý sớm</div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-slate-100 flex flex-col gap-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Yêu cầu chờ duyệt</div>
          <div className="text-3xl font-black text-indigo-600">{pendingRequestsCount}</div>
          <div className="text-xs font-semibold text-indigo-500">Đang chờ Thủ Kho xử lý</div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-slate-100 flex flex-col gap-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái hệ thống</div>
          <div className="text-3xl font-black text-emerald-600">Hoạt động</div>
          <div className="text-xs font-semibold text-emerald-600">Kết nối cơ sở dữ liệu ổn định</div>
        </div>
      </div>

      {/* Product List Table Section */}
      <div className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden">
        {/* Table Header & Search Filter Controls */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Danh Mục Sản Phẩm Trong Hệ Thống</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hiển thị toàn bộ <strong>{products.length}</strong> sản phẩm đăng ký quản lý điều chuyển (Trang {currentPage}/{totalPages || 1})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Tìm tên hoặc mã SP..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3.5 py-1.5 pl-8 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'Tất cả danh mục' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700 uppercase text-xs font-bold border-b border-slate-200">
                <th className="p-4">STT</th>
                <th className="p-4">Mã Sản Phẩm</th>
                <th className="p-4">Tên Sản Phẩm</th>
                <th className="p-4">Danh Mục</th>
                <th className="p-4 text-center">Đơn Vị Tính</th>
                <th className="p-4 text-center">Trạng Thái Chuyển</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Không tìm thấy sản phẩm nào khớp với tìm kiếm.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((prod, idx) => (
                  <tr key={prod.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 text-xs font-mono text-slate-400">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="p-4 font-mono font-bold text-indigo-600">{prod.code}</td>
                    <td className="p-4 font-semibold text-slate-800">{prod.name}</td>
                    <td className="p-4 text-slate-600 text-xs font-medium">{prod.category}</td>
                    <td className="p-4 text-center text-slate-600 text-xs bg-slate-50/50 font-medium">{prod.unit}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Sẵn sàng điều chuyển
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">
              Hiển thị {paginatedProducts.length} trên tổng số <strong>{filteredProducts.length}</strong> sản phẩm
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white border border-slate-200 rounded font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                ◀ Trước
              </button>
              <span className="px-3 py-1 font-bold text-slate-800">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white border border-slate-200 rounded font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                Sau ▶
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
