-- ============================================================
-- INVENTORY MANAGEMENT SYSTEM - ADDITIONAL SEED DATA SCRIPT
-- Database: InventoryManagement
-- ============================================================

USE [InventoryManagement];
GO

PRINT N'Seeding more products...';

-- 1. Insert Additional Products (PRD-011 to PRD-050)
INSERT INTO [Product] (code, name, description, category, unit) VALUES
-- Beverages
(N'PRD-011', N'Coca Cola 320ml', N'Nuoc ngọt Coca Cola lon', N'Beverages', N'Lon'),
(N'PRD-012', N'Pepsi 320ml', N'Nuoc ngọt Pepsi lon', N'Beverages', N'Lon'),
(N'PRD-013', N'Tra xanh khong do 450ml', N'Tra xanh thanh nhiet', N'Beverages', N'Chai'),
(N'PRD-014', N'Sua dau nanh Fami 200ml', N'Sua dau nanh nguyen chat', N'Dairy', N'Hop'),
(N'PRD-015', N'Nuoc tang luc Redbull 250ml', N'Bo huc nhap khau Thai Lan', N'Beverages', N'Lon'),
(N'PRD-016', N'Bia Heineken 330ml', N'Bia Heineken lon bac', N'Beverages', N'Lon'),
(N'PRD-017', N'Tra sua Kirin Latte 345ml', N'Tra sua Kirin Latte Nhat Ban', N'Beverages', N'Chai'),

-- Snacks & Confectionery
(N'PRD-018', N'Banh ChocoPie 396g', N'Banh ChocoPie Orion hop 12 cai', N'Snacks', N'Hop'),
(N'PRD-019', N'Khoai tay chien Lay''s 150g', N'Khoai tay chien vi tu nhien', N'Snacks', N'Goi'),
(N'PRD-020', N'Keo gum Doublemint', N'Keo cao su huong bac ha', N'Snacks', N'Hu'),
(N'PRD-021', N'Banh quy Cosy Cosy 336g', N'Banh quy bo thom ngon', N'Snacks', N'Hop'),
(N'PRD-022', N'Banh que Astor 150g', N'Banh que vi socola', N'Snacks', N'Hop'),
(N'PRD-023', N'Hat dieu rang muoi Omai 200g', N'Hat dieu rang muoi loai 1', N'Snacks', N'Hu'),

-- Canned & Instant Food
(N'PRD-024', N'Ca hop Ba Co Gai 155g', N'Ca nuc sot ca chua', N'Canned Food', N'Lon'),
(N'PRD-025', N'Thit heo hop Vissan 150g', N'Thit heo xay dong hop', N'Canned Food', N'Lon'),
(N'PRD-026', N'Mi Kokomi dai ngon 75g', N'Mi tom chua cay Kokomi', N'Noodles', N'Goi'),
(N'PRD-027', N'Pho bo an lien Cung Dinh', N'Pho bo Cung Dinh huong vi Ha Noi', N'Noodles', N'Bat'),
(N'PRD-028', N'Chao thit bam Gấu Đỏ 50g', N'Chao thit bam an lien', N'Noodles', N'Goi'),

-- Grains & Dry Goods
(N'PRD-029', N'Gao Thom Neptune 5kg', N'Gao thom thuong hang nha Neptune', N'Grains', N'Bich'),
(N'PRD-030', N'Bot mi da dung Meizan 1kg', N'Bot mi da dung cao cap', N'Grains', N'Goi'),
(N'PRD-031', N'Duong cat trang Bien Hoa 1kg', N'Duong tinh luyen tu nhien', N'Condiments', N'Goi'),
(N'PRD-032', N'Muoi iot Hải Tĩnh 500g', N'Muoi iot tinh say', N'Condiments', N'Goi'),
(N'PRD-033', N'Hat nem Knorr thit tham 900g', N'Hat nem tu thit va xuong ong', N'Condiments', N'Goi'),
(N'PRD-034', N'Tuong ot Chinsu 250g', N'Tuong ot cay nhe dam da', N'Condiments', N'Chai'),

-- Dairy & Breakfast
(N'PRD-035', N'Sua chua Vinamilk co duong', N'Loc 4 hop sua chua Vinamilk', N'Dairy', N'Loc'),
(N'PRD-036', N'Bo thuc vat Meizan 200g', N'Bo thuc vat thom ngon be ngo', N'Dairy', N'Hop'),
(N'PRD-037', N'Phomai Con Bo Cuoi 8 mieng', N'Phomai hop giay 8 mieng', N'Dairy', N'Hop'),
(N'PRD-038', N'Sua dac Ong Tho do 380g', N'Sua dac co duong Ong Tho', N'Dairy', N'Lon'),

-- Household & Cleaning
(N'PRD-039', N'Nuoc lau san Sunlight 1kg', N'Nuoc lau san huong hoa ha', N'Household', N'Chai'),
(N'PRD-040', N'Nuoc rua chen Sunlight Chanh 750ml', N'Nuoc rua chen tay sach dau mo', N'Household', N'Chai'),
(N'PRD-041', N'Bot giat OMO do 3kg', N'Bot giat OMO xoay bay vet ban', N'Household', N'Bich'),
(N'PRD-042', N'Nuoc xa vai Comfort 1.8L', N'Nuoc xa vai ban mai diu dang', N'Household', N'Bich'),
(N'PRD-043', N'Giay ve sinh Pulppy 10 cuon', N'Giay ve sinh Pulppy 2 lop', N'Household', N'Bich'),

-- Personal Care
(N'PRD-044', N'Dau goi Clear bac ha 650g', N'Dau goi sach gau mat lanh', N'Personal Care', N'Chai'),
(N'PRD-045', N'Sua tam Lifebuoy bao ve 850g', N'Sua tam diet khuan Lifebuoy', N'Personal Care', N'Chai'),
(N'PRD-046', N'Kem danh rang P/S 240g', N'Kem danh rang P/S ngua sau rang', N'Personal Care', N'Hop'),
(N'PRD-047', N'Ban chai danh rang Colgate', N'Ban chai danh rang long to mem mai', N'Personal Care', N'Cay'),
(N'PRD-048', N'Nuoc suc mieng Listerine 500ml', N'Nuoc suc mieng huong bac ha', N'Personal Care', N'Chai'),
(N'PRD-049', N'Xa bong tam Safeguard trang 130g', N'Xa phong tam diet khuan', N'Personal Care', N'Cuc'),
(N'PRD-050', N'Bong tay trang Ipek 80 mieng', N'Bong tay trang cotton tu nhien', N'Personal Care', N'Bich');
GO

PRINT N'Seeding supplier-product prices...';

-- 2. Associate Products with Suppliers
-- Supplier 1 (Vinamilk): Dairy products
-- Supplier 2 (Nestle Vietnam): Beverages & snacks
-- Supplier 3 (TH True Milk): Dairy products
-- Supplier 4 (Masan Consumer): Noodles & condiments & canned food
-- Let's define some supplier product prices.
INSERT INTO [SupplierProduct] (supplierId, productId, price, isAvailable)
SELECT 1, id, 22000, 1 FROM [Product] WHERE code IN ('PRD-014', 'PRD-035', 'PRD-038');

INSERT INTO [SupplierProduct] (supplierId, productId, price, isAvailable)
SELECT 3, id, 24000, 1 FROM [Product] WHERE code IN ('PRD-014', 'PRD-035');

INSERT INTO [SupplierProduct] (supplierId, productId, price, isAvailable)
SELECT 4, id, 2800, 1 FROM [Product] WHERE code IN ('PRD-026', 'PRD-034');

INSERT INTO [SupplierProduct] (supplierId, productId, price, isAvailable)
SELECT 2, id, 8000, 1 FROM [Product] WHERE code IN ('PRD-011', 'PRD-012', 'PRD-013', 'PRD-015', 'PRD-019');
GO

PRINT N'Seeding inventory quantities in warehouses and stores...';

-- 3. Seed Inventory for Main Warehouse (locationId = 1)
-- Let's put a generous amount of products in the Main Warehouse.
INSERT INTO [Inventory] (locationId, productId, quantity, costPrice, sellingPrice, expirationDate, dynamicThreshold) VALUES
-- Beverages
(1, (SELECT id FROM [Product] WHERE code = 'PRD-011'), 1200, 7200, 10000, '2026-06-30', 100),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-012'), 1000, 7200, 10000, '2026-06-30', 100),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-013'), 800,  6000, 9000,  '2026-02-28', 50),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-014'), 2500, 5200, 8000,  '2025-05-15', 200),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-015'), 1500, 9500, 14000, '2027-01-01', 100),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-016'), 3000, 16000, 22000, '2026-09-30', 300),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-017'), 400,  14000, 20000, '2025-10-31', 40),

-- Snacks
(1, (SELECT id FROM [Product] WHERE code = 'PRD-018'), 500,  45000, 60000, '2026-03-20', 50),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-019'), 1500, 11000, 16000, '2025-12-15', 100),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-020'), 300,  18000, 25000, '2026-08-30', 30),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-021'), 600,  32000, 45000, '2026-07-25', 50),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-022'), 400,  24000, 35000, '2026-01-10', 40),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-023'), 200,  62000, 85000, '2026-04-15', 20),

-- Canned & Noodles
(1, (SELECT id FROM [Product] WHERE code = 'PRD-024'), 1000, 13000, 18000, '2027-12-31', 100),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-025'), 800,  22000, 30000, '2027-10-30', 80),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-026'), 5000, 2800,  4000,  '2026-11-30', 500),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-027'), 1200, 8500,  12000, '2026-05-20', 100),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-028'), 2000, 2300,  3500,  '2026-02-15', 150),

-- Grains & Condiments
(1, (SELECT id FROM [Product] WHERE code = 'PRD-029'), 600,  92000, 125000, NULL,         80),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-030'), 700,  16000, 23000,  '2026-10-30', 50),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-031'), 1500, 17500, 24000,  NULL,         100),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-032'), 1000, 4200,  7000,   NULL,         50),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-033'), 800,  55000, 75000,  '2026-08-30', 80),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-034'), 1800, 11000, 16000,  '2027-02-28', 120),

-- Dairy & Breakfast
(1, (SELECT id FROM [Product] WHERE code = 'PRD-035'), 900,  18000, 26000,  '2025-02-15', 80),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-036'), 300,  14000, 20000,  '2025-11-20', 30),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-037'), 450,  28000, 38000,  '2025-08-15', 40),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-038'), 1200, 19000, 27000,  '2026-09-30', 100),

-- Household
(1, (SELECT id FROM [Product] WHERE code = 'PRD-039'), 700,  22000, 31000,  NULL,         50),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-040'), 1500, 17000, 24000,  NULL,         100),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-041'), 600,  88000, 115000, NULL,         50),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-042'), 500,  72000, 96000,  NULL,         40),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-043'), 1200, 55000, 72000,  NULL,         80),

-- Personal Care
(1, (SELECT id FROM [Product] WHERE code = 'PRD-044'), 600,  95000, 130000, '2027-05-15', 50),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-045'), 800,  84000, 112000, '2027-04-30', 60),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-046'), 1500, 23000, 32000,  '2026-12-15', 100),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-047'), 1000, 11000, 17000,  NULL,         100),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-048'), 400,  68000, 92000,  '2027-03-31', 30),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-049'), 1200, 9000,  14000,  '2026-10-31', 80),
(1, (SELECT id FROM [Product] WHERE code = 'PRD-050'), 500,  19000, 28000,  NULL,         45);
GO

-- 4. Seed Inventory for Branch Store A (locationId = 2)
-- Store A gets some initial stocks
INSERT INTO [Inventory] (locationId, productId, quantity, costPrice, sellingPrice, expirationDate, dynamicThreshold) VALUES
(2, (SELECT id FROM [Product] WHERE code = 'PRD-011'), 150, 7200, 10000, '2026-06-30', 20),
(2, (SELECT id FROM [Product] WHERE code = 'PRD-013'), 80,  6000, 9000,  '2026-02-28', 10),
(2, (SELECT id FROM [Product] WHERE code = 'PRD-019'), 120, 11000, 16000, '2025-12-15', 20),
(2, (SELECT id FROM [Product] WHERE code = 'PRD-026'), 400, 2800,  4000,  '2026-11-30', 50),
(2, (SELECT id FROM [Product] WHERE code = 'PRD-034'), 90,  11000, 16000, '2027-02-28', 15),
(2, (SELECT id FROM [Product] WHERE code = 'PRD-040'), 60,  17000, 24000, NULL,         10);
GO

-- 5. Seed Inventory for Branch Store B (locationId = 3)
-- Store B gets some initial stocks
INSERT INTO [Inventory] (locationId, productId, quantity, costPrice, sellingPrice, expirationDate, dynamicThreshold) VALUES
(3, (SELECT id FROM [Product] WHERE code = 'PRD-012'), 120, 7200, 10000, '2026-06-30', 20),
(3, (SELECT id FROM [Product] WHERE code = 'PRD-015'), 70,  9500, 14000, '2027-01-01', 10),
(3, (SELECT id FROM [Product] WHERE code = 'PRD-026'), 300, 2800,  4000,  '2026-11-30', 50),
(3, (SELECT id FROM [Product] WHERE code = 'PRD-035'), 50,  18000, 26000, '2025-02-15', 10),
(3, (SELECT id FROM [Product] WHERE code = 'PRD-043'), 40,  55000, 72000, NULL,         8);
GO

PRINT N'===== SEEDING COMPLETED SUCCESSFULLY =====';
PRINT N'';

SELECT N'Products' AS [Table], COUNT(*) AS [Rows] FROM [Product]
UNION ALL SELECT N'Inventory', COUNT(*) FROM [Inventory]
UNION ALL SELECT N'SupplierProducts', COUNT(*) FROM [SupplierProduct];
GO
