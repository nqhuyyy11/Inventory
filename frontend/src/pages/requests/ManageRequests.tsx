import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface RequestItem {
  id: string;
  productId: string;
  quantity: number;
  product?: { name: string; code: string };
}

interface InventoryRequest {
  id: string;
  destLocationId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  notes: string;
  items: RequestItem[];
  createdBy?: { fullName: string; username: string };
  destLocation?: { name: string };
}

const ManageRequests: React.FC = () => {
  const [requests, setRequests] = useState<InventoryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [warehouseId, setWarehouseId] = useState(''); // Nhập tay ID kho đang quản lý

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      // Lấy danh sách chờ duyệt (PENDING)
      const response = await axios.get('http://localhost:5000/api/requests?status=PENDING', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (id: string, action: 'APPROVE' | 'REJECT') => {
    if (!warehouseId) {
      setError("Vui lòng nhập Mã Kho xuất (Warehouse ID) trước khi duyệt!");
      return;
    }

    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/requests/${id}/process`,
        { sourceLocationId: warehouseId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage(response.data.message);
      // Xóa request đã duyệt khỏi danh sách
      setRequests(requests.filter(r => r.id !== id));
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data?.details) {
        // Lỗi thiếu hàng
        const details = err.response.data.details;
        const msg = details.map((d: any) => `Sản phẩm ${d.productId} thiếu ${d.requested - d.available} (Có: ${d.available}, Yêu cầu: ${d.requested})`).join(" | ");
        setError(`Out-of-Stock Error: Hàng trong kho không đủ để xuất! Chi tiết: ${msg}`);
      } else {
        setError(err.response?.data?.message || 'Lỗi khi xử lý yêu cầu');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Duyệt Yêu Cầu Điều Chuyển (Inventory Manager)</h2>
      
      {message && <div className="bg-green-100 text-green-700 p-4 rounded mb-4 font-medium">{message}</div>}
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4 font-bold border border-red-300">{error}</div>}

      <div className="mb-6 p-4 bg-gray-50 border rounded flex items-center gap-4">
        <label className="font-semibold text-gray-700">Mã Kho Xuất của bạn (Warehouse ID):</label>
        <input 
          type="text" 
          value={warehouseId} 
          onChange={(e) => setWarehouseId(e.target.value)} 
          placeholder="Nhập ID kho bạn đang quản lý..."
          className="p-2 border rounded w-64 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500 italic">Không có yêu cầu nào đang chờ duyệt.</p>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-lg text-blue-800">Yêu cầu đến Cửa hàng: {req.destLocation?.name || req.destLocationId}</p>
                  <p className="text-sm text-gray-600">Người tạo: {req.createdBy?.fullName || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Ngày tạo: {new Date(req.createdAt).toLocaleString()}</p>
                  {req.notes && <p className="text-sm text-gray-600 italic mt-1">Ghi chú: {req.notes}</p>}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleProcess(req.id, 'APPROVE')}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
                  >
                    Check Stock & Approve
                  </button>
                  <button 
                    onClick={() => handleProcess(req.id, 'REJECT')}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
              
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mã Sản Phẩm</th>
                    <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Số Lượng Yêu Cầu</th>
                  </tr>
                </thead>
                <tbody>
                  {req.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-4 border-b text-sm text-gray-700">{item.productId}</td>
                      <td className="py-2 px-4 border-b text-sm font-medium text-gray-700">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageRequests;
