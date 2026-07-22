-- ============================================================
-- INVENTORY MANAGEMENT SYSTEM - DATABASE SCRIPT
-- Server: ANHLINH | User: sa | Password: 123
-- ============================================================

USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = N'InventoryManagement')
BEGIN
    ALTER DATABASE [InventoryManagement] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [InventoryManagement];
END
GO

CREATE DATABASE [InventoryManagement];
GO

USE [InventoryManagement];
GO

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE [Role] (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(50) NOT NULL UNIQUE,
    permissions NVARCHAR(MAX) NULL,
    createdAt   DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE [User] (
    id        INT IDENTITY(1,1) PRIMARY KEY,
    username  NVARCHAR(100) NOT NULL UNIQUE,
    password  NVARCHAR(255) NOT NULL,
    email     NVARCHAR(200) NULL UNIQUE,
    fullName  NVARCHAR(200) NOT NULL,
    phone     NVARCHAR(20) NULL,
    roleId    INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_User_Role FOREIGN KEY (roleId) REFERENCES [Role](id)
);
GO

CREATE TABLE [Location] (
    id        INT IDENTITY(1,1) PRIMARY KEY,
    name      NVARCHAR(200) NOT NULL,
    type      NVARCHAR(20) NOT NULL,
    address   NVARCHAR(500) NULL,
    capacity  INT NULL,
    managerId INT NULL,
    createdAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Location_Manager FOREIGN KEY (managerId) REFERENCES [User](id),
    CONSTRAINT CK_Location_Type CHECK (type IN (N'WAREHOUSE', N'STORE'))
);
GO

CREATE TABLE [UserLocation] (
    id         INT IDENTITY(1,1) PRIMARY KEY,
    userId     INT NOT NULL,
    locationId INT NOT NULL,
    startDate  DATETIME NOT NULL DEFAULT GETDATE(),
    endDate    DATETIME NULL,
    CONSTRAINT FK_UserLocation_User FOREIGN KEY (userId) REFERENCES [User](id),
    CONSTRAINT FK_UserLocation_Location FOREIGN KEY (locationId) REFERENCES [Location](id),
    CONSTRAINT UQ_UserLocation UNIQUE (userId, locationId)
);
GO

CREATE TABLE [Supplier] (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(200) NOT NULL,
    contactInfo NVARCHAR(MAX) NULL,
    createdAt   DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE [Product] (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    code        NVARCHAR(50) NOT NULL UNIQUE,
    name        NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX) NULL,
    category    NVARCHAR(100) NULL,
    unit        NVARCHAR(50) NOT NULL,
    createdAt   DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE [SupplierProduct] (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    supplierId  INT NOT NULL,
    productId   INT NOT NULL,
    price       FLOAT NOT NULL,
    isAvailable BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_SP_Supplier FOREIGN KEY (supplierId) REFERENCES [Supplier](id),
    CONSTRAINT FK_SP_Product FOREIGN KEY (productId) REFERENCES [Product](id),
    CONSTRAINT UQ_SupplierProduct UNIQUE (supplierId, productId)
);
GO

CREATE TABLE [Inventory] (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    locationId       INT NOT NULL,
    productId        INT NOT NULL,
    quantity         INT NOT NULL DEFAULT 0,
    costPrice        FLOAT NOT NULL DEFAULT 0,
    sellingPrice     FLOAT NOT NULL DEFAULT 0,
    expirationDate   DATETIME NULL,
    dynamicThreshold INT NULL,
    CONSTRAINT FK_Inv_Location FOREIGN KEY (locationId) REFERENCES [Location](id),
    CONSTRAINT FK_Inv_Product FOREIGN KEY (productId) REFERENCES [Product](id)
);
GO

CREATE UNIQUE INDEX UQ_Inventory ON [Inventory](locationId, productId, expirationDate)
WHERE expirationDate IS NOT NULL;
GO

CREATE TABLE [Transaction] (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    locationId  INT NOT NULL,
    type        NVARCHAR(20) NOT NULL,
    createdById INT NOT NULL,
    totalValue  FLOAT NOT NULL DEFAULT 0,
    notes       NVARCHAR(MAX) NULL,
    createdAt   DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Txn_Location FOREIGN KEY (locationId) REFERENCES [Location](id),
    CONSTRAINT FK_Txn_User FOREIGN KEY (createdById) REFERENCES [User](id),
    CONSTRAINT CK_Txn_Type CHECK (type IN (N'IMPORT', N'EXPORT', N'SALE', N'RETURN', N'DAMAGE'))
);
GO

CREATE TABLE [TransactionItem] (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    transactionId INT NOT NULL,
    productId     INT NOT NULL,
    quantity      INT NOT NULL,
    price         FLOAT NOT NULL,
    CONSTRAINT FK_TxnItem_Txn FOREIGN KEY (transactionId) REFERENCES [Transaction](id),
    CONSTRAINT FK_TxnItem_Product FOREIGN KEY (productId) REFERENCES [Product](id)
);
GO

CREATE TABLE [InventoryRequest] (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    sourceLocationId INT NULL,
    destLocationId   INT NOT NULL,
    status           NVARCHAR(20) NOT NULL DEFAULT N'PENDING',
    createdById      INT NOT NULL,
    notes            NVARCHAR(MAX) NULL,
    createdAt        DATETIME NOT NULL DEFAULT GETDATE(),
    updatedAt        DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_IR_Source FOREIGN KEY (sourceLocationId) REFERENCES [Location](id),
    CONSTRAINT FK_IR_Dest FOREIGN KEY (destLocationId) REFERENCES [Location](id),
    CONSTRAINT FK_IR_User FOREIGN KEY (createdById) REFERENCES [User](id),
    CONSTRAINT CK_IR_Status CHECK (status IN (N'PENDING', N'APPROVED', N'REJECTED'))
);
GO

CREATE TABLE [RequestItem] (
    id        INT IDENTITY(1,1) PRIMARY KEY,
    requestId INT NOT NULL,
    productId INT NOT NULL,
    quantity  INT NOT NULL,
    CONSTRAINT FK_RI_Request FOREIGN KEY (requestId) REFERENCES [InventoryRequest](id),
    CONSTRAINT FK_RI_Product FOREIGN KEY (productId) REFERENCES [Product](id)
);
GO

CREATE TABLE [PurchaseOrder] (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    supplierId  INT NOT NULL,
    warehouseId INT NOT NULL,
    status      NVARCHAR(30) NOT NULL DEFAULT N'DRAFT',
    createdById INT NOT NULL,
    totalValue  FLOAT NOT NULL DEFAULT 0,
    createdAt   DATETIME NOT NULL DEFAULT GETDATE(),
    updatedAt   DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_PO_Supplier FOREIGN KEY (supplierId) REFERENCES [Supplier](id),
    CONSTRAINT FK_PO_Warehouse FOREIGN KEY (warehouseId) REFERENCES [Location](id),
    CONSTRAINT FK_PO_User FOREIGN KEY (createdById) REFERENCES [User](id),
    CONSTRAINT CK_PO_Status CHECK (status IN (N'DRAFT', N'PENDING_APPROVAL', N'APPROVED', N'CONFIRMED', N'REJECTED', N'DELIVERED'))
);
GO

CREATE TABLE [PurchaseOrderItem] (
    id        INT IDENTITY(1,1) PRIMARY KEY,
    poId      INT NOT NULL,
    productId INT NOT NULL,
    quantity  INT NOT NULL,
    price     FLOAT NOT NULL,
    CONSTRAINT FK_POI_PO FOREIGN KEY (poId) REFERENCES [PurchaseOrder](id),
    CONSTRAINT FK_POI_Product FOREIGN KEY (productId) REFERENCES [Product](id)
);
GO

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IX_User_RoleId ON [User](roleId);
CREATE INDEX IX_Location_Type ON [Location](type);
CREATE INDEX IX_Inv_LocationId ON [Inventory](locationId);
CREATE INDEX IX_Inv_ProductId ON [Inventory](productId);
CREATE INDEX IX_Inv_Expiry ON [Inventory](expirationDate);
CREATE INDEX IX_Txn_Type ON [Transaction](type);
CREATE INDEX IX_Txn_LocationId ON [Transaction](locationId);
CREATE INDEX IX_PO_Status ON [PurchaseOrder](status);
GO

-- ============================================================
-- SEED DATA
-- ============================================================

-- Roles
INSERT INTO [Role] (name, permissions) VALUES
(N'ADMIN',             N'ALL'),
(N'STORE_MANAGER',     N'STORE_MANAGE,APPROVE_ORDER,VIEW_REPORT'),
(N'INVENTORY_MANAGER', N'INVENTORY_MANAGE,IMPORT,EXPORT,REMOVE,SEARCH,PLACE_ORDER'),
(N'SALESPERSON',       N'POS,SEARCH,CREATE_RECEIPT'),
(N'SUPPLIER',          N'VIEW_ORDER,CONFIRM_ORDER');
GO

-- Users (password = bcrypt hash of '123456')
INSERT INTO [User] (username, password, email, fullName, phone, roleId) VALUES
(N'admin',        N'$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', N'admin@inventory.com',   N'System Admin',       N'0901000001', 1),
(N'storemanager', N'$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', N'sm@inventory.com',      N'Nguyen Van Huy',     N'0901000002', 2),
(N'ducanh',       N'$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', N'ducanh@inventory.com',  N'Phung Duc Anh',      N'0901000003', 3),
(N'salesperson1', N'$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', N'sp1@inventory.com',     N'Nguyen Binh Khanh',  N'0901000004', 4),
(N'supplier1',    N'$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', N'supplier1@mail.com',    N'Phung Phuc Dat',     N'0901000005', 5);
GO

-- Locations
INSERT INTO [Location] (name, type, address, capacity, managerId) VALUES
(N'Main Warehouse',   N'WAREHOUSE', N'123 Nguyen Trai, Ha Noi',     5000, 3),
(N'Branch Store A',   N'STORE',     N'456 Le Loi, HCM',             1000, 2),
(N'Branch Store B',   N'STORE',     N'789 Tran Hung Dao, Da Nang',   800, 2);
GO

-- Staff Assignments
INSERT INTO [UserLocation] (userId, locationId) VALUES
(3, 1),
(4, 2),
(2, 2);
GO

-- Suppliers
INSERT INTO [Supplier] (name, contactInfo) VALUES
(N'Vinamilk',        N'Email: order@vinamilk.vn | Phone: 028-54-155-555'),
(N'Nestle Vietnam',  N'Email: order@nestle.vn | Phone: 028-38-102-030'),
(N'TH True Milk',    N'Email: sales@thtruemilk.vn | Phone: 0236-123-456'),
(N'Masan Consumer',  N'Email: b2b@masan.vn | Phone: 028-62-564-999');
GO

-- Products
INSERT INTO [Product] (code, name, description, category, unit) VALUES
(N'PRD-001', N'Sua tuoi Vinamilk 1L',      N'Sua tuoi tiet trung khong duong',  N'Dairy',       N'Hop'),
(N'PRD-002', N'Mi Hao Hao tom chua cay',   N'Mi an lien 75g',                   N'Noodles',     N'Goi'),
(N'PRD-003', N'Nuoc suoi Aquafina 500ml',   N'Nuoc tinh khiet dong chai',        N'Beverages',   N'Chai'),
(N'PRD-004', N'Dau an Neptune 1L',          N'Dau thuc vat tinh luyen',          N'Cooking Oil', N'Chai'),
(N'PRD-005', N'Ca phe Nescafe 3in1',        N'Ca phe hoa tan 20 goi/bich',      N'Beverages',   N'Bich'),
(N'PRD-006', N'Sua TH True Milk 180ml',     N'Sua tuoi tiet trung it duong',    N'Dairy',       N'Hop'),
(N'PRD-007', N'Nuoc mam Chinsu 500ml',      N'Nuoc mam ca com Phu Quoc',        N'Condiments',  N'Chai'),
(N'PRD-008', N'Banh mi sandwich',           N'Banh mi goi thai lat',            N'Bakery',      N'Bich'),
(N'PRD-009', N'Trung ga ta (hop 10)',       N'Trung ga sach',                   N'Fresh Food',  N'Hop'),
(N'PRD-010', N'Xuc xich Vissan 500g',       N'Xuc xich tiet trung',            N'Processed',   N'Goi');
GO

-- Supplier-Product Pricing
INSERT INTO [SupplierProduct] (supplierId, productId, price, isAvailable) VALUES
(1, 1, 28000, 1),
(1, 6, 8000,  1),
(2, 5, 95000, 1),
(2, 3, 4500,  1),
(3, 6, 7500,  1),
(4, 2, 3500,  1),
(4, 7, 22000, 1);
GO

-- Inventory - Main Warehouse
INSERT INTO [Inventory] (locationId, productId, quantity, costPrice, sellingPrice, expirationDate, dynamicThreshold) VALUES
(1, 1,  200, 28000, 35000,  '2025-03-15', 50),
(1, 2, 1500, 3500,  5000,   '2026-12-31', 200),
(1, 3, 3000, 4500,  7000,   NULL,         500),
(1, 4,  500, 42000, 55000,  '2026-08-20', 100),
(1, 5,  800, 95000, 120000, '2026-11-30', 150),
(1, 6,  100, 7500,  12000,  '2025-02-28', 30),
(1, 7,  600, 22000, 32000,  '2027-06-30', 100),
(1, 8,   50, 15000, 22000,  '2025-01-20', 20),
(1, 9,  300, 35000, 45000,  '2025-08-10', 50),
(1, 10, 400, 55000, 72000,  '2026-05-15', 80);
GO

-- Inventory - Branch Store A
INSERT INTO [Inventory] (locationId, productId, quantity, costPrice, sellingPrice, expirationDate, dynamicThreshold) VALUES
(2, 1, 30,  28000, 35000,  '2025-03-15', 10),
(2, 2, 80,  3500,  5000,   '2026-12-31', 20),
(2, 3, 200, 4500,  7000,   NULL,         50),
(2, 5, 50,  95000, 120000, '2026-11-30', 15);
GO

-- Transactions
INSERT INTO [Transaction] (locationId, type, createdById, totalValue, notes) VALUES
(1, N'IMPORT', 3, 5600000,  N'Nhap lo sua Vinamilk 200 hop tu NCC'),
(1, N'IMPORT', 3, 5250000,  N'Nhap lo mi Hao Hao 1500 goi'),
(1, N'EXPORT', 3, 1050000,  N'Xuat 30 hop sua + 80 goi mi sang Store A'),
(2, N'SALE',   4, 350000,   N'Ban le tai quay Store A');
GO

INSERT INTO [TransactionItem] (transactionId, productId, quantity, price) VALUES
(1, 1, 200, 28000),
(2, 2, 1500, 3500),
(3, 1, 30, 28000),
(3, 2, 80, 3500),
(4, 1, 5, 35000),
(4, 3, 10, 7000);
GO

-- Purchase Order
INSERT INTO [PurchaseOrder] (supplierId, warehouseId, status, createdById, totalValue) VALUES
(1, 1, N'PENDING_APPROVAL', 3, 14000000);
GO

INSERT INTO [PurchaseOrderItem] (poId, productId, quantity, price) VALUES
(1, 1, 500, 28000);
GO

-- Inventory Request
INSERT INTO [InventoryRequest] (sourceLocationId, destLocationId, status, createdById, notes) VALUES
(1, 3, N'PENDING', 3, N'Chuyen hang tu Main Warehouse sang Branch Store B');
GO

INSERT INTO [RequestItem] (requestId, productId, quantity) VALUES
(1, 3, 100),
(1, 5, 30);
GO

-- ============================================================
-- VERIFY
-- ============================================================

PRINT N'===== DATABASE CREATED SUCCESSFULLY =====';
PRINT N'';

SELECT N'Roles' AS [Table], COUNT(*) AS [Rows] FROM [Role]
UNION ALL SELECT N'Users', COUNT(*) FROM [User]
UNION ALL SELECT N'Locations', COUNT(*) FROM [Location]
UNION ALL SELECT N'UserLocations', COUNT(*) FROM [UserLocation]
UNION ALL SELECT N'Suppliers', COUNT(*) FROM [Supplier]
UNION ALL SELECT N'Products', COUNT(*) FROM [Product]
UNION ALL SELECT N'SupplierProducts', COUNT(*) FROM [SupplierProduct]
UNION ALL SELECT N'Inventory', COUNT(*) FROM [Inventory]
UNION ALL SELECT N'Transactions', COUNT(*) FROM [Transaction]
UNION ALL SELECT N'TransactionItems', COUNT(*) FROM [TransactionItem]
UNION ALL SELECT N'InventoryRequests', COUNT(*) FROM [InventoryRequest]
UNION ALL SELECT N'RequestItems', COUNT(*) FROM [RequestItem]
UNION ALL SELECT N'PurchaseOrders', COUNT(*) FROM [PurchaseOrder]
UNION ALL SELECT N'PurchaseOrderItems', COUNT(*) FROM [PurchaseOrderItem];
GO
