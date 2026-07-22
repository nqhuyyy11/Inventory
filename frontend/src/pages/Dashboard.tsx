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
  status: string;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

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
    return <div className="text-center py-10 text-slate-500">Đang tải dữ liệu...</div>;
  }

  const pendingRequestsCount = requests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border border-slate-100 flex flex-col gap-2">
          <div className="text-sm font-semibold text-slate-500 uppercase">Tổng số sản phẩm</div>
          <div className="text-3xl font-bold text-slate-800">{products.length}</div>
          <div className="text-xs text-indigo-500">Danh mục đăng ký</div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-slate-100 flex flex-col gap-2">
          <div className="text-sm font-semibold text-slate-500 uppercase">Hàng hết hạn / Cảnh báo</div>
          <div className="text-3xl font-bold text-amber-600">1</div>
          <div className="text-xs text-amber-600">Cần xử lý sớm</div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-slate-100 flex flex-col gap-2">
          <div className="text-sm font-semibold text-slate-500 uppercase">Yêu cầu chờ duyệt</div>
          <div className="text-3xl font-bold text-indigo-600">{pendingRequestsCount}</div>
          <div className="text-xs text-indigo-500">Đang chờ Thủ Kho xử lý</div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-slate-100 flex flex-col gap-2">
          <div className="text-sm font-semibold text-slate-500 uppercase">Trạng thái hệ thống</div>
          <div className="text-3xl font-bold text-emerald-600">Hoạt động</div>
          <div className="text-xs text-emerald-600">Không có sự cố</div>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Danh mục sản phẩm trong hệ thống</h2>
          <p className="text-xs text-slate-500">Thông tin danh sách các sản phẩm đang được quản lý điều chuyển</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-600 uppercase text-xs font-semibold border-b border-slate-200">
                <th className="p-4">Mã Sản Phẩm</th>
                <th className="p-4">Tên Sản Phẩm</th>
                <th className="p-4">Danh Mục</th>
                <th className="p-4">Đơn Vị Tính</th>
                <th className="p-4">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono font-semibold text-indigo-600">{prod.code}</td>
                  <td className="p-4 font-medium text-slate-800">{prod.name}</td>
                  <td className="p-4 text-slate-600">{prod.category}</td>
                  <td className="p-4 text-slate-600">{prod.unit}</td>
                  <td className="p-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700">
                      Sẵn sàng
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
