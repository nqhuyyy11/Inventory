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
    category?: string;
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

interface StockMap {
  [productId: number]: number;
}

export default function ManageRequests() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [requests, setRequests] = useState<DispatchRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [errorDialog, setErrorDialog] = useState<{ title: string; messages: string[] } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Detail Modal State
  const [selectedRequest, setSelectedRequest] = useState<DispatchRequest | null>(null);
  const [warehouseStock, setWarehouseStock] = useState<StockMap>({});
  const [loadingStock, setLoadingStock] = useState(false);

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

  // Open Detail Modal & Fetch Real-time Stock for the source warehouse
  const handleOpenDetail = async (req: DispatchRequest) => {
    setSelectedRequest(req);
    setLoadingStock(true);
    try {
      const sourceLocId = req.sourceLocationId || 1;
      const invData = await inventoryService.getInventory(sourceLocId);
      const stockMap: StockMap = {};
      invData.forEach((item: any) => {
        stockMap[item.productId] = (stockMap[item.productId] || 0) + item.quantity;
      });
      setWarehouseStock(stockMap);
    } catch (err) {
      console.error('Error fetching warehouse stock:', err);
    } finally {
      setLoadingStock(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedRequest(null);
  };

  const handleProcess = async (id: number) => {
    setProcessingId(id);
    setErrorDialog(null);
    setSuccessMsg(null);

    try {
      await inventoryService.processRequest(id, Number(user?.id) || 3);
      setSuccessMsg(`Duyệt và xuất kho yêu cầu #${id} thành công! Tồn kho đã được cập nhật.`);
      if (selectedRequest?.id === id) {
        setSelectedRequest(null);
      }
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
          messages: [' Cảnh báo thiếu hàng'],
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
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-sm font-semibold flex justify-between items-center">
          <span>✅ {successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-xs text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}

      {errorDialog && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-800 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm">❌ {errorDialog.title}</h3>
            <button onClick={() => setErrorDialog(null)} className="text-xs text-red-600 hover:text-red-900">✕</button>
          </div>
          <ul className="list-disc pl-5 text-xs space-y-1">
            {errorDialog.messages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Request List Table */}
      <div className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Quản Lý Yêu Cầu Điều Chuyển Hàng</h2>
            <p className="text-xs text-slate-500">
              Danh sách các yêu cầu điều chuyển từ chi nhánh đang chờ kiểm duyệt và xuất kho.
            </p>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              fetchRequests();
            }}
            className="px-3 py-1.5 text-xs bg-slate-100 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-200 font-semibold flex items-center gap-1"
          >
            🔄 Tải Lại Dữ Liệu
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="p-12 text-center text-slate-400">Không có yêu cầu điều chuyển nào được tìm thấy.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700 font-bold text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="p-4">Mã Đơn</th>
                  <th className="p-4">Kho Xuất Hàng</th>
                  <th className="p-4">Cửa Hàng Nhận</th>
                  <th className="p-4">Số Loại SP</th>
                  <th className="p-4">Thời Gian Tạo</th>
                  <th className="p-4 text-center">Trạng Thái</th>
                  <th className="p-4 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4 font-mono font-bold text-indigo-600">
                      #REQ-{String(req.id).padStart(4, '0')}
                    </td>
                    <td className="p-4 text-slate-800 font-medium">
                      {req.sourceLocation?.name || 'Main Warehouse'}
                    </td>
                    <td className="p-4 text-slate-800 font-medium">
                      {req.destLocation?.name}
                    </td>
                    <td className="p-4 font-semibold text-slate-700">
                      {req.items?.length || 0} sản phẩm
                    </td>
                    <td className="p-4 text-xs text-slate-500">
                      {new Date(req.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${req.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {req.status === 'PENDING' ? 'Chờ Duyệt' : req.status === 'APPROVED' ? 'Đã Xuất Kho' : 'Đã Từ Chối'}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() => handleOpenDetail(req)}
                        className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100 font-bold transition"
                      >
                        🔍 Bảng Chi Tiết
                      </button>
                      {req.status === 'PENDING' && (
                        <button
                          onClick={() => handleProcess(req.id)}
                          disabled={processingId !== null}
                          className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow transition disabled:opacity-50"
                        >
                          {processingId === req.id ? 'Đang xuất...' : 'Xuất Kho'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 📌 BẢNG CHI TIẾT MODAL (FULL WIDE DETAIL TABLE MODAL)                      */}
      {/* ========================================================================= */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] h-[90vh] overflow-hidden flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-indigo-600 text-white px-8 py-6 flex justify-between items-center shadow-md">
              <div>
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-black tracking-tight">
                    BẢNG CHI TIẾT ĐƠN YÊU CẦU #REQ-{String(selectedRequest.id).padStart(4, '0')}
                  </h3>
                  <span
                    className={`px-4 py-1 text-xs font-black rounded-full uppercase tracking-wider ${selectedRequest.status === 'PENDING'
                      ? 'bg-amber-400 text-amber-950'
                      : selectedRequest.status === 'APPROVED'
                        ? 'bg-emerald-400 text-emerald-950'
                        : 'bg-red-400 text-red-950'
                      }`}
                  >
                    {selectedRequest.status === 'PENDING' ? 'Chờ Duyệt' : selectedRequest.status === 'APPROVED' ? 'Đã Xuất Kho' : 'Từ Chối'}
                  </span>
                </div>
                <p className="text-xs text-indigo-100 mt-1 font-medium">
                  Thời gian tạo: {new Date(selectedRequest.createdAt).toLocaleString('vi-VN')} | Người yêu cầu: {selectedRequest.createdBy?.fullName || 'Store Manager'}
                </p>
              </div>
              <button
                onClick={handleCloseDetail}
                className="text-indigo-200 hover:text-white text-3xl font-bold p-1 leading-none transition"
                title="Đóng cửa sổ"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-slate-50/50">
              {/* Location Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm">
                <div>
                  <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Kho Xuất Hàng (Source)</span>
                  <span className="font-bold text-slate-800 text-base">{selectedRequest.sourceLocation?.name || 'Main Warehouse'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Cửa Hàng Nhận (Destination)</span>
                  <span className="font-bold text-indigo-600 text-base">{selectedRequest.destLocation?.name}</span>
                </div>
              </div>

              {/* Notes if available */}
              {selectedRequest.notes && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-lg text-xs italic">
                  📝 <strong>Ghi chú đơn hàng:</strong> "{selectedRequest.notes}"
                </div>
              )}

              {/* Product Detail Table Header */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                    📋 BẢNG CHI TIẾT SẢN PHẨM CẦN XUẤT KHO
                  </h4>
                  {loadingStock && (
                    <span className="text-xs text-indigo-600 font-semibold animate-pulse">
                      ⏳ Đang đối soát tồn kho thực tế...
                    </span>
                  )}
                </div>

                {/* Detailed Table */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-100 text-slate-700 text-xs font-bold uppercase border-b border-slate-200">
                      <tr>
                        <th className="p-3 text-center w-12">STT</th>
                        <th className="p-3">Mã SP</th>
                        <th className="p-3">Tên Sản Phẩm</th>
                        <th className="p-3">Danh Mục</th>
                        <th className="p-3 text-center">ĐVT</th>
                        <th className="p-3 text-right">SL Yêu Cầu</th>
                        <th className="p-3 text-right">Tồn Kho Kho Xuất</th>
                        <th className="p-3 text-center">Trạng Thái Tồn</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedRequest.items?.map((item, index) => {
                        const currentStock = warehouseStock[item.productId] ?? 0;
                        const isStockSufficient = currentStock >= item.quantity;

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/70">
                            <td className="p-3 text-center font-mono text-xs text-slate-400">{index + 1}</td>
                            <td className="p-3 font-mono font-bold text-slate-700">{item.product.code}</td>
                            <td className="p-3 font-semibold text-slate-800">{item.product.name}</td>
                            <td className="p-3 text-xs text-slate-500">{item.product.category || 'N/A'}</td>
                            <td className="p-3 text-center text-xs bg-slate-50 font-medium text-slate-600">{item.product.unit}</td>
                            <td className="p-3 text-right font-mono font-black text-indigo-600 text-base">
                              {item.quantity}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-slate-700">
                              {loadingStock ? '...' : currentStock}
                            </td>
                            <td className="p-3 text-center">
                              {!loadingStock && (
                                <span
                                  className={`inline-block px-2 py-0.5 text-[11px] font-bold rounded ${isStockSufficient
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                  {isStockSufficient ? '✓ Đủ Tồn Kho' : '⚠️ Thiếu Hàng'}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">
                Tổng cộng: <strong>{selectedRequest.items?.length || 0}</strong> loại mặt hàng
              </span>
              <div className="flex gap-3">
                <button
                  onClick={handleCloseDetail}
                  className="px-5 py-2 text-xs bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-bold shadow-sm"
                >
                  Đóng
                </button>
                {selectedRequest.status === 'PENDING' && (
                  <button
                    onClick={() => handleProcess(selectedRequest.id)}
                    disabled={processingId !== null}
                    className="px-5 py-2 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow disabled:opacity-50 flex items-center gap-1"
                  >
                    {processingId === selectedRequest.id ? 'Đang xuất...' : '✓ Duyệt & Xuất Kho Ngay'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
