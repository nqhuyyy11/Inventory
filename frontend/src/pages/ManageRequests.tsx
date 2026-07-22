import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';
import { inventoryService } from '../services/api';

interface RequestItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    code: string;
    name: string;
    unit: string;
  };
}

interface DispatchRequest {
  id: number;
  sourceLocationId: number;
  destLocationId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes: string;
  createdAt: string;
  sourceLocation?: { name: string };
  destLocation?: { name: string };
  createdBy?: { fullName: string };
  items: RequestItem[];
}

export default function ManageRequests() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [requests, setRequests] = useState<DispatchRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [errorDialog, setErrorDialog] = useState<{ title: string; messages: string[] } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await inventoryService.getRequests();
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleProcess = async (id: number) => {
    setProcessingId(id);
    setErrorDialog(null);
    setSuccessMsg(null);

    try {
      await inventoryService.processRequest(id, Number(user?.id) || 3);
      setSuccessMsg(`Duyệt yêu cầu điều chuyển #${id} thành công! Tồn kho đã được cập nhật.`);
      fetchRequests();
    } catch (err: any) {
      console.error('Error processing request:', err);
      const errorData = err.response?.data;
      if (errorData?.message === 'Out-of-Stock Error' && Array.isArray(errorData.errors)) {
        setErrorDialog({
          title: 'Lỗi xuất kho: Thiếu hàng trong kho xuất',
          messages: errorData.errors,
        });
      } else {
        setErrorDialog({
          title: 'Lỗi xử lý yêu cầu',
          messages: [errorData?.message || 'Có lỗi xảy ra trong quá trình kết nối và xử lý.'],
        });
      }
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-500">Đang tải danh sách yêu cầu...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Alert Banners */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-sm font-semibold">
          ✅ {successMsg}
        </div>
      )}

      {errorDialog && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-800 rounded-lg space-y-2">
          <h3 className="font-bold text-sm">❌ {errorDialog.title}</h3>
          <ul className="list-disc pl-5 text-xs space-y-1">
            {errorDialog.messages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Quản lý Yêu Cầu Điều Chuyển Hàng</h2>
            <p className="text-xs text-slate-500">
              Danh sách các yêu cầu điều chuyển từ chi nhánh đang chờ duyệt xuất kho.
            </p>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              fetchRequests();
            }}
            className="px-3 py-1.5 text-xs bg-slate-100 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-200 font-medium"
          >
            Tải Lại 🔄
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="p-12 text-center text-slate-400">Không có yêu cầu điều chuyển nào được tìm thấy.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {requests.map((req) => (
              <div key={req.id} className="p-6 hover:bg-slate-50/50 flex flex-col md:flex-row justify-between gap-6">
                {/* Details info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-800 text-base">Mã Yêu Cầu: #{req.id}</span>
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded ${
                        req.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {req.status === 'PENDING' ? 'Chờ Duyệt' : req.status === 'APPROVED' ? 'Đã Xuất Kho' : 'Đã Từ Chối'}
                    </span>
                    <span className="text-xs text-slate-400">
                      Tạo lúc: {new Date(req.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-600">
                    <div>
                      <span className="font-semibold text-slate-700">Kho xuất:</span> {req.sourceLocation?.name || 'Tổng kho'}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Cửa hàng nhận:</span> {req.destLocation?.name}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Người yêu cầu:</span> {req.createdBy?.fullName || 'Manager'}
                    </div>
                  </div>

                  {req.notes && (
                    <div className="text-xs bg-slate-100 p-2 rounded text-slate-500 italic">
                      Ghi chú: "{req.notes}"
                    </div>
                  )}

                  {/* Items List */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chi tiết sản phẩm:</div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {req.items.map((item) => (
                        <div key={item.id} className="flex justify-between border-b border-slate-100 pb-1 last:border-0 last:pb-0">
                          <span className="font-medium text-slate-700">
                            {item.product.name} ({item.product.unit})
                          </span>
                          <span className="font-mono font-bold text-indigo-600">
                            Số lượng: {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-start justify-end md:w-48">
                  {req.status === 'PENDING' ? (
                    <button
                      onClick={() => handleProcess(req.id)}
                      disabled={processingId !== null}
                      className="w-full py-2.5 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow text-sm transition disabled:opacity-50"
                    >
                      {processingId === req.id ? 'Đang xuất kho...' : 'Xử lý Xuất Kho'}
                    </button>
                  ) : (
                    <div className="text-xs text-slate-400 font-semibold italic border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-center w-full">
                      ✓ Đã Hoàn Tất
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
