import React, { useState } from 'react';
import axios from 'axios';

interface RequestItem {
  productId: string;
  quantity: number;
}

const CreateRequest: React.FC = () => {
  const [destLocationId, setDestLocationId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<RequestItem[]>([{ productId: '', quantity: 1 }]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const handleItemChange = (index: number, field: keyof RequestItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Gọi API tạo request (giả sử có token trong localStorage)
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/requests/dispatch',
        { destLocationId, notes, items },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      setItems([{ productId: '', quantity: 1 }]); // reset
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tạo yêu cầu');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tạo Yêu Cầu Điều Chuyển Hàng (Product Export)</h2>
      
      {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mã Cửa Hàng (Store ID)</label>
          <input 
            type="text" 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
            value={destLocationId}
            onChange={(e) => setDestLocationId(e.target.value)}
            placeholder="Nhập Object ID của cửa hàng..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
          <textarea 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Lý do xin hàng..."
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Danh sách Sản Phẩm</h3>
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 mb-3 items-end">
              <div className="flex-1">
                <label className="block text-xs text-gray-500">Mã Sản Phẩm (Product ID)</label>
                <input 
                  type="text" 
                  required 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                />
              </div>
              <div className="w-32">
                <label className="block text-xs text-gray-500">Số Lượng</label>
                <input 
                  type="number" 
                  required 
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                />
              </div>
            </div>
          ))}
          <button 
            type="button" 
            onClick={handleAddItem}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + Thêm sản phẩm
          </button>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Gửi Yêu Cầu Đi (Request Dispatch)
        </button>
      </form>
    </div>
  );
};

export default CreateRequest;
