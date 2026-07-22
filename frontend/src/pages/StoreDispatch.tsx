import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';
import { inventoryService } from '../services/api';

interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  unit: string;
}

interface Location {
  id: number;
  name: string;
  type: string;
}

interface RequestRow {
  productId: number;
  quantity: number;
}

export default function StoreDispatch() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [sourceId, setSourceId] = useState<number>(1); // Default to Main Warehouse
  const [destId, setDestId] = useState<number>(2); // Default to Store A
  const [notes, setNotes] = useState('');
  const [rows, setRows] = useState<RequestRow[]>([{ productId: 1, quantity: 10 }]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await inventoryService.getProducts();
        const locRes = await inventoryService.getLocations();
        setProducts(prodRes.data);
        setLocations(locRes.data);
      } catch (err) {
        console.error('Error fetching data for dispatch:', err);
      }
    };
    fetchData();
  }, []);

  const handleAddRow = () => {
    setRows([...rows, { productId: products[0]?.id || 1, quantity: 10 }]);
  };

  const handleRemoveRow = (index: number) => {
    if (rows.length === 1) return;
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleRowChange = (index: number, field: keyof RequestRow, value: number) => {
    const newRows = [...rows];
    newRows[index] = {
      ...newRows[index]!,
      [field]: value,
    };
    setRows(newRows);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    if (sourceId === destId) {
      setMessage({ type: 'error', text: 'Kho xuất và Cửa hàng nhận không được trùng nhau.' });
      setSubmitting(false);
      return;
    }

    try {
      await inventoryService.createDispatchRequest({
        sourceLocationId: sourceId,
        destLocationId: destId,
        createdById: Number(user?.id) || 2,
        notes,
        items: rows,
      });

      setMessage({ type: 'success', text: 'Tạo yêu cầu điều chuyển hàng hóa thành công!' });
      // Reset form
      setNotes('');
      setRows([{ productId: products[0]?.id || 1, quantity: 10 }]);
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu điều chuyển.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-indigo-600 text-white">
          <h2 className="text-xl font-bold">Tạo Yêu Cầu Điều Chuyển Hàng Hóa</h2>
          <p className="text-sm text-indigo-100 mt-1">
            Gửi yêu cầu cấp phát, điều động hàng hóa từ tổng kho về chi nhánh cửa hàng.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {message && (
            <div
              className={`p-4 rounded-lg text-sm border ${
                message.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-red-50 border-red-300 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Source and Dest Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Kho Xuất Hàng (Tổng kho)
              </label>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {locations
                  .filter((l) => l.type === 'WAREHOUSE')
                  .map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Cửa Hàng Nhận (Chi nhánh)
              </label>
              <select
                value={destId}
                onChange={(e) => setDestId(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {locations
                  .filter((l) => l.type === 'STORE')
                  .map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Product Items Table */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Danh sách sản phẩm yêu cầu
              </h3>
              <button
                type="button"
                onClick={handleAddRow}
                className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100 font-semibold"
              >
                + Thêm sản phẩm
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold">
                  <tr>
                    <th className="p-3">Sản phẩm</th>
                    <th className="p-3 w-40">Số lượng cần điều</th>
                    <th className="p-3 w-20 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rows.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <select
                          value={row.productId}
                          onChange={(e) => handleRowChange(index, 'productId', Number(e.target.value))}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              [{p.code}] {p.name} ({p.unit})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="1"
                          value={row.quantity}
                          onChange={(e) => handleRowChange(index, 'quantity', Number(e.target.value))}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(index)}
                          disabled={rows.length === 1}
                          className="text-red-500 hover:text-red-700 disabled:opacity-30"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ghi chú</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Nhập lý do điều chuyển hoặc ghi chú bổ sung..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow disabled:opacity-50"
            >
              {submitting ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
