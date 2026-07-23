import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set auth token header
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Check if Mock Mode is enabled
export const isMockMode = (): boolean => {
  const mode = localStorage.getItem('use_mock_mode');
  return mode === 'true' || !mode; // Default to true if not set (ensures working app immediately)
};

export const setMockMode = (useMock: boolean) => {
  localStorage.setItem('use_mock_mode', String(useMock));
};

// Mock data structures
interface MockProduct {
  id: number;
  code: string;
  name: string;
  category: string;
  unit: string;
}

interface MockLocation {
  id: number;
  name: string;
  type: 'WAREHOUSE' | 'STORE';
}

interface MockInventory {
  locationId: number;
  productId: number;
  quantity: number;
}

interface MockRequest {
  id: number;
  sourceLocationId: number;
  destLocationId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdById: number;
  notes: string;
  createdAt: string;
  sourceLocation?: MockLocation;
  destLocation?: MockLocation;
  items: Array<{
    id: number;
    requestId: number;
    productId: number;
    quantity: number;
    product: MockProduct;
  }>;
}

// Initial mock data setup
const initMockData = () => {
  if (!localStorage.getItem('mock_products')) {
    const products: MockProduct[] = [
      { id: 1, code: 'PRD-001', name: 'Sữa tươi Vinamilk 1L', category: 'Dairy', unit: 'Hộp' },
      { id: 2, code: 'PRD-002', name: 'Mì Hảo Hảo tôm chua cay', category: 'Noodles', unit: 'Gói' },
      { id: 3, code: 'PRD-003', name: 'Nước suối Aquafina 500ml', category: 'Beverages', unit: 'Chai' },
      { id: 4, code: 'PRD-004', name: 'Dầu ăn Neptune 1L', category: 'Cooking Oil', unit: 'Chai' },
      { id: 5, code: 'PRD-005', name: 'Cà phê Nescafe 3in1', category: 'Beverages', unit: 'Bịch' },
      { id: 6, code: 'PRD-006', name: 'Sữa TH True Milk 180ml', category: 'Dairy', unit: 'Hộp' },
      { id: 7, code: 'PRD-007', name: 'Nước mắm Chinsu 500ml', category: 'Condiments', unit: 'Chai' },
      { id: 8, code: 'PRD-008', name: 'Bánh mì sandwich', category: 'Bakery', unit: 'Bịch' },
      { id: 9, code: 'PRD-009', name: 'Trứng gà ta (hộp 10)', category: 'Fresh Food', unit: 'Hộp' },
      { id: 10, code: 'PRD-010', name: 'Xúc xích Vissan 500g', category: 'Processed', unit: 'Gói' },
      { id: 11, code: 'PRD-011', name: 'Coca Cola 320ml', category: 'Beverages', unit: 'Lon' },
      { id: 12, code: 'PRD-012', name: 'Pepsi 320ml', category: 'Beverages', unit: 'Lon' },
      { id: 13, code: 'PRD-013', name: 'Trà xanh không độ 450ml', category: 'Beverages', unit: 'Chai' },
      { id: 14, code: 'PRD-014', name: 'Sữa đậu nành Fami 200ml', category: 'Dairy', unit: 'Hộp' },
      { id: 15, code: 'PRD-015', name: 'Nước tăng lực Redbull 250ml', category: 'Beverages', unit: 'Lon' },
      { id: 16, code: 'PRD-016', name: 'Bia Heineken 330ml', category: 'Beverages', unit: 'Lon' },
      { id: 17, code: 'PRD-017', name: 'Trà sữa Kirin Latte 345ml', category: 'Beverages', unit: 'Chai' },
      { id: 18, code: 'PRD-018', name: 'Bánh ChocoPie 396g', category: 'Snacks', unit: 'Hộp' },
      { id: 19, code: 'PRD-019', name: 'Khoai tây chiên Lay\'s 150g', category: 'Snacks', unit: 'Gói' },
      { id: 20, code: 'PRD-020', name: 'Kẹo gum Doublemint', category: 'Snacks', unit: 'Hũ' },
      { id: 21, code: 'PRD-021', name: 'Bánh quy Cosy Cosy 336g', category: 'Snacks', unit: 'Hộp' },
      { id: 22, code: 'PRD-022', name: 'Bánh que Astor 150g', category: 'Snacks', unit: 'Hộp' },
      { id: 23, code: 'PRD-023', name: 'Hạt điều rang muối Omai 200g', category: 'Snacks', unit: 'Hũ' },
      { id: 24, code: 'PRD-024', name: 'Cá hộp Ba Cô Gái 155g', category: 'Canned Food', unit: 'Lon' },
      { id: 25, code: 'PRD-025', name: 'Thịt heo hộp Vissan 150g', category: 'Canned Food', unit: 'Lon' },
      { id: 26, code: 'PRD-026', name: 'Mì Kokomi dai ngon 75g', category: 'Noodles', unit: 'Gói' },
      { id: 27, code: 'PRD-027', name: 'Phở bò ăn liền Cung Đình', category: 'Noodles', unit: 'Bát' },
      { id: 28, code: 'PRD-028', name: 'Cháo thịt bằm Gấu Đỏ 50g', category: 'Noodles', unit: 'Gói' },
      { id: 29, code: 'PRD-029', name: 'Gạo Thơm Neptune 5kg', category: 'Grains', unit: 'Bịch' },
      { id: 30, code: 'PRD-030', name: 'Bột mì đa dụng Meizan 1kg', category: 'Grains', unit: 'Gói' },
      { id: 31, code: 'PRD-031', name: 'Đường cát trắng Biên Hòa 1kg', category: 'Condiments', unit: 'Gói' },
      { id: 32, code: 'PRD-032', name: 'Muối iot Hải Tĩnh 500g', category: 'Condiments', unit: 'Gói' },
      { id: 33, code: 'PRD-033', name: 'Hạt nêm Knorr thịt thăn 900g', category: 'Condiments', unit: 'Gói' },
      { id: 34, code: 'PRD-034', name: 'Tương ớt Chinsu 250g', category: 'Condiments', unit: 'Chai' },
      { id: 35, code: 'PRD-035', name: 'Sữa chua Vinamilk có đường', category: 'Dairy', unit: 'Lốc' },
      { id: 36, code: 'PRD-036', name: 'Bơ thực vật Meizan 200g', category: 'Dairy', unit: 'Hộp' },
      { id: 37, code: 'PRD-037', name: 'Phô mai Con Bò Cười 8 miếng', category: 'Dairy', unit: 'Hộp' },
      { id: 38, code: 'PRD-038', name: 'Sữa đặc Ông Thọ đỏ 380g', category: 'Dairy', unit: 'Lon' },
      { id: 39, code: 'PRD-039', name: 'Nước lau sàn Sunlight 1kg', category: 'Household', unit: 'Chai' },
      { id: 40, code: 'PRD-040', name: 'Nước rửa chén Sunlight Chanh 750ml', category: 'Household', unit: 'Chai' },
      { id: 41, code: 'PRD-041', name: 'Bột giặt OMO đỏ 3kg', category: 'Household', unit: 'Bịch' },
      { id: 42, code: 'PRD-042', name: 'Nước xả vải Comfort 1.8L', category: 'Household', unit: 'Bịch' },
      { id: 43, code: 'PRD-043', name: 'Giấy vệ sinh Pulppy 10 cuộn', category: 'Household', unit: 'Bịch' },
      { id: 44, code: 'PRD-044', name: 'Dầu gội Clear bạc hà 650g', category: 'Personal Care', unit: 'Chai' },
      { id: 45, code: 'PRD-045', name: 'Sữa tắm Lifebuoy bảo vệ 850g', category: 'Personal Care', unit: 'Chai' },
      { id: 46, code: 'PRD-046', name: 'Kem đánh răng P/S 240g', category: 'Personal Care', unit: 'Hộp' },
      { id: 47, code: 'PRD-047', name: 'Bàn chải đánh răng Colgate', category: 'Personal Care', unit: 'Cây' },
      { id: 48, code: 'PRD-048', name: 'Nước súc miệng Listerine 500ml', category: 'Personal Care', unit: 'Chai' },
      { id: 49, code: 'PRD-049', name: 'Xà bông tắm Safeguard trắng 130g', category: 'Personal Care', unit: 'Cục' },
      { id: 50, code: 'PRD-050', name: 'Bông tẩy trang Ipek 80 miếng', category: 'Personal Care', unit: 'Bịch' },
    ];
    localStorage.setItem('mock_products', JSON.stringify(products));
  }

  if (!localStorage.getItem('mock_locations')) {
    const locations: MockLocation[] = [
      { id: 1, name: 'Main Warehouse', type: 'WAREHOUSE' },
      { id: 2, name: 'Branch Store A', type: 'STORE' },
      { id: 3, name: 'Branch Store B', type: 'STORE' },
    ];
    localStorage.setItem('mock_locations', JSON.stringify(locations));
  }

  if (!localStorage.getItem('mock_inventory')) {
    const inventory: MockInventory[] = [
      // Warehouse (ID 1)
      { locationId: 1, productId: 1, quantity: 200 },
      { locationId: 1, productId: 2, quantity: 1500 },
      { locationId: 1, productId: 3, quantity: 3000 },
      { locationId: 1, productId: 4, quantity: 500 },
      { locationId: 1, productId: 5, quantity: 800 },
      { locationId: 1, productId: 6, quantity: 100 },
      { locationId: 1, productId: 7, quantity: 600 },
      { locationId: 1, productId: 8, quantity: 50 },
      { locationId: 1, productId: 9, quantity: 300 },
      { locationId: 1, productId: 10, quantity: 400 },
      { locationId: 1, productId: 11, quantity: 1200 },
      { locationId: 1, productId: 12, quantity: 1000 },
      { locationId: 1, productId: 13, quantity: 800 },
      { locationId: 1, productId: 14, quantity: 2500 },
      { locationId: 1, productId: 15, quantity: 1500 },
      { locationId: 1, productId: 16, quantity: 3000 },
      { locationId: 1, productId: 17, quantity: 400 },
      { locationId: 1, productId: 18, quantity: 500 },
      { locationId: 1, productId: 19, quantity: 1500 },
      { locationId: 1, productId: 20, quantity: 300 },
      { locationId: 1, productId: 21, quantity: 600 },
      { locationId: 1, productId: 22, quantity: 400 },
      { locationId: 1, productId: 23, quantity: 200 },
      { locationId: 1, productId: 24, quantity: 1000 },
      { locationId: 1, productId: 25, quantity: 800 },
      { locationId: 1, productId: 26, quantity: 5000 },
      { locationId: 1, productId: 27, quantity: 1200 },
      { locationId: 1, productId: 28, quantity: 2000 },
      { locationId: 1, productId: 29, quantity: 600 },
      { locationId: 1, productId: 30, quantity: 700 },
      { locationId: 1, productId: 31, quantity: 1500 },
      { locationId: 1, productId: 32, quantity: 1000 },
      { locationId: 1, productId: 33, quantity: 800 },
      { locationId: 1, productId: 34, quantity: 1800 },
      { locationId: 1, productId: 35, quantity: 900 },
      { locationId: 1, productId: 36, quantity: 300 },
      { locationId: 1, productId: 37, quantity: 450 },
      { locationId: 1, productId: 38, quantity: 1200 },
      { locationId: 1, productId: 39, quantity: 700 },
      { locationId: 1, productId: 40, quantity: 1500 },
      { locationId: 1, productId: 41, quantity: 600 },
      { locationId: 1, productId: 42, quantity: 500 },
      { locationId: 1, productId: 43, quantity: 1200 },
      { locationId: 1, productId: 44, quantity: 600 },
      { locationId: 1, productId: 45, quantity: 800 },
      { locationId: 1, productId: 46, quantity: 1500 },
      { locationId: 1, productId: 47, quantity: 1000 },
      { locationId: 1, productId: 48, quantity: 400 },
      { locationId: 1, productId: 49, quantity: 1200 },
      { locationId: 1, productId: 50, quantity: 500 },
      // Store A (ID 2)
      { locationId: 2, productId: 1, quantity: 30 },
      { locationId: 2, productId: 2, quantity: 80 },
      { locationId: 2, productId: 3, quantity: 200 },
      { locationId: 2, productId: 5, quantity: 50 },
      { locationId: 2, productId: 11, quantity: 150 },
      { locationId: 2, productId: 13, quantity: 80 },
      { locationId: 2, productId: 19, quantity: 120 },
      { locationId: 2, productId: 26, quantity: 400 },
      { locationId: 2, productId: 34, quantity: 90 },
      { locationId: 2, productId: 40, quantity: 60 },
      // Store B (ID 3)
      { locationId: 3, productId: 1, quantity: 0 },
      { locationId: 3, productId: 2, quantity: 0 },
      { locationId: 3, productId: 12, quantity: 120 },
      { locationId: 3, productId: 15, quantity: 70 },
      { locationId: 3, productId: 26, quantity: 300 },
      { locationId: 3, productId: 35, quantity: 50 },
      { locationId: 3, productId: 43, quantity: 40 },
    ];
    localStorage.setItem('mock_inventory', JSON.stringify(inventory));
  }

  if (!localStorage.getItem('mock_requests')) {
    const initialRequests: MockRequest[] = [
      {
        id: 1,
        sourceLocationId: 1,
        destLocationId: 3,
        status: 'PENDING',
        createdById: 2, // store manager
        notes: 'Cần gấp sữa tươi và mì tôm cho Store B',
        createdAt: new Date().toISOString(),
        items: [
          {
            id: 1,
            requestId: 1,
            productId: 1,
            quantity: 100,
            product: { id: 1, code: 'PRD-001', name: 'Sữa tươi Vinamilk 1L', category: 'Dairy', unit: 'Hộp' },
          },
          {
            id: 2,
            requestId: 1,
            productId: 2,
            quantity: 50,
            product: { id: 2, code: 'PRD-002', name: 'Mì Hảo Hảo tôm chua cay', category: 'Noodles', unit: 'Gói' },
          },
        ],
      },
    ];
    localStorage.setItem('mock_requests', JSON.stringify(initialRequests));
  }
};

initMockData();

// Helper to get items from localStorage
const getFromStorage = <T>(key: string): T => {
  return JSON.parse(localStorage.getItem(key) || '[]');
};

const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// API Services
export const authService = {
  login: async (username: string, password: string) => {
    if (isMockMode()) {
      // Mock auth logic
      let role = 'SALESPERSON';
      let fullName = 'Nhân viên';
      let id = 4;

      if (username === 'admin') {
        role = 'ADMIN';
        fullName = 'System Admin';
        id = 1;
      } else if (username === 'storemanager') {
        role = 'STORE_MANAGER';
        fullName = 'Nguyễn Văn Huy';
        id = 2;
      } else if (username === 'ducanh') {
        role = 'INVENTORY_MANAGER';
        fullName = 'Phùng Đức Anh';
        id = 3;
      }

      return {
        data: {
          token: 'mock-jwt-token',
          user: { id, username, role, fullName },
        },
      };
    }

    return apiClient.post('/auth/login', { username, password });
  },
};

export const inventoryService = {
  getProducts: async () => {
    if (isMockMode()) {
      return { data: getFromStorage<MockProduct[]>('mock_products') };
    }
    return apiClient.get('/products');
  },

  getLocations: async () => {
    if (isMockMode()) {
      return { data: getFromStorage<MockLocation[]>('mock_locations') };
    }
    return apiClient.get('/locations');
  },

  getInventory: async (locationId: number) => {
    const inv = getFromStorage<MockInventory[]>('mock_inventory');
    return inv.filter((i) => i.locationId === locationId);
  },

  getRequests: async () => {
    if (isMockMode()) {
      const reqs = getFromStorage<MockRequest[]>('mock_requests');
      const locs = getFromStorage<MockLocation[]>('mock_locations');

      // Populate locations
      const populated = reqs.map((r) => ({
        ...r,
        sourceLocation: locs.find((l) => l.id === r.sourceLocationId),
        destLocation: locs.find((l) => l.id === r.destLocationId),
      }));

      return { data: populated };
    }
    return apiClient.get('/requests');
  },

  createRequest: async (data: {
    sourceLocationId: number;
    destLocationId: number;
    createdById: number;
    notes?: string;
    items: Array<{ productId: number; quantity: number }>;
  }) => {
    if (isMockMode()) {
      const reqs = getFromStorage<MockRequest[]>('mock_requests');
      const products = getFromStorage<MockProduct[]>('mock_products');
      const inventory = getFromStorage<MockInventory[]>('mock_inventory');

      const sourceLocId = data.sourceLocationId || 1;

      // Validate stock
      const outOfStockErrors: string[] = [];
      for (const item of data.items) {
        const warehouseInv = inventory.find(
          (i) => i.locationId === sourceLocId && i.productId === item.productId
        );
        const availableQty = warehouseInv ? warehouseInv.quantity : 0;
        const prod = products.find((p) => p.id === item.productId);
        const prodName = prod?.name || `Sản phẩm #${item.productId}`;

        if (availableQty < item.quantity) {
          outOfStockErrors.push(
            `"${prodName}" không đủ hàng (Yêu cầu: ${item.quantity}, Hiện có: ${availableQty})`
          );
        }
      }

      if (outOfStockErrors.length > 0) {
        return Promise.reject({
          response: {
            status: 400,
            data: {
              message: 'Thiếu hàng trong kho xuất',
              validationErrors: outOfStockErrors,
            },
          },
        });
      }

      const newId = reqs.length > 0 ? Math.max(...reqs.map((r) => r.id)) + 1 : 1;

      const newRequest: MockRequest = {
        id: newId,
        sourceLocationId: data.sourceLocationId,
        destLocationId: data.destLocationId,
        status: 'PENDING',
        createdById: data.createdById,
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
        items: data.items.map((item, idx) => {
          const prod = products.find((p) => p.id === item.productId)!;
          return {
            id: idx + 1,
            requestId: newId,
            productId: item.productId,
            quantity: item.quantity,
            product: prod,
          };
        }),
      };

      reqs.push(newRequest);
      saveToStorage('mock_requests', reqs);
      return { data: { message: 'Request Submitted Successfully', requestId: newId, request: newRequest } };
    }

    return apiClient.post('/requests/create', data);
  },

  createDispatchRequest: async (data: {
    sourceLocationId: number;
    destLocationId: number;
    createdById: number;
    notes?: string;
    items: Array<{ productId: number; quantity: number }>;
  }) => {
    return inventoryService.createRequest(data);
  },

  processRequest: async (requestId: number, userId: number) => {
    if (isMockMode()) {
      const reqs = getFromStorage<MockRequest[]>('mock_requests');
      const inventory = getFromStorage<MockInventory[]>('mock_inventory');

      const reqIndex = reqs.findIndex((r) => r.id === requestId);
      if (reqIndex === -1) {
        throw new Error('Request not found');
      }

      const request = reqs[reqIndex]!;
      if (request.status !== 'PENDING') {
        throw new Error('Request has already been processed');
      }

      // Check stock
      const outOfStockErrors: string[] = [];
      for (const item of request.items) {
        const warehouseInv = inventory.find(
          (i) => i.locationId === request.sourceLocationId && i.productId === item.productId
        );
        const availableQty = warehouseInv ? warehouseInv.quantity : 0;

        if (availableQty < item.quantity) {
          outOfStockErrors.push(
            `Sản phẩm "${item.product.name}" không đủ tồn kho. Yêu cầu: ${item.quantity}, Hiện có: ${availableQty}`
          );
        }
      }

      if (outOfStockErrors.length > 0) {
        // Return 400 simulation
        return Promise.reject({
          response: {
            status: 400,
            data: {
              message: 'Out-of-Stock Error',
              errors: outOfStockErrors,
            },
          },
        });
      }

      // Deduct source and add destination
      for (const item of request.items) {
        // Deduct source
        const sourceInvIndex = inventory.findIndex(
          (i) => i.locationId === request.sourceLocationId && i.productId === item.productId
        );
        if (sourceInvIndex !== -1) {
          inventory[sourceInvIndex]!.quantity -= item.quantity;
        }

        // Add destination
        const destInvIndex = inventory.findIndex(
          (i) => i.locationId === request.destLocationId && i.productId === item.productId
        );
        if (destInvIndex !== -1) {
          inventory[destInvIndex]!.quantity += item.quantity;
        } else {
          inventory.push({
            locationId: request.destLocationId,
            productId: item.productId,
            quantity: item.quantity,
          });
        }
      }

      // Save inventory
      saveToStorage('mock_inventory', inventory);

      // Update status & set exported timestamp
      request.status = 'APPROVED';
      request.updatedAt = new Date().toISOString();
      reqs[reqIndex] = request;
      saveToStorage('mock_requests', reqs);

      return { data: { message: 'Dispatch request processed (Mock Mode)', request } };
    }

    return apiClient.post(`/requests/${requestId}/process`, { userId });
  },
};
