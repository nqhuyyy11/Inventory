# BỘ PROMPT VISUAL PARADIGM AI (TEXT-TO-UML)

Bản tổng hợp các prompt chuẩn 100% theo tên Class, Method và Cấu trúc Code thực tế của hệ thống Inventory Management System.

---

## 📌 3.1. Inventory Manager

### 3.1.1 Class Diagram (Inventory Manager Module)
```text
Create a UML Class Diagram for Inventory Manager module in an Inventory Management System based on Node.js/Express TypeScript backend architecture:

Classes:
1. ManageRequestsView (Boundary)
   - selectedRequest: DispatchRequest
   - warehouseStock: StockMap
   + handleOpenDetail(req: DispatchRequest): void
   + handleProcess(id: number): void
   + handleReject(id: number): void

2. InventoryService (API Client / Service)
   + getRequests(): Promise<RequestList>
   + getInventory(locationId: number): Promise<InventoryList>
   + processRequest(requestId: number, userId: number): Promise<Result>
   + rejectRequest(requestId: number, userId: number, reason: string): Promise<Result>

3. InventoryRequestController (Controller)
   + processRequest(req: Request, res: Response): Promise<void>

4. InventoryEntity (Domain Service / Entity)
   + checkStockAvailability(locationId: number, productIds: number[]): Promise<Record<number, number>>

5. InventoryRequestEntity (Entity)
   + id: number
   + sourceLocationId: number
   + destLocationId: number
   + status: RequestStatus
   + updateStatus(id: number, status: RequestStatus): Promise<InventoryRequest>

6. TransactionEntity (Entity)
   + id: number
   + locationId: number
   + type: TransactionType
   + totalValue: number
   + createTransaction(data: TransactionInput): Promise<Transaction>

Relationships:
- ManageRequestsView uses InventoryService
- InventoryService calls InventoryRequestController via HTTP API
- InventoryRequestController interacts with InventoryEntity, InventoryRequestEntity, and TransactionEntity
```

---

### 3.1.2 Sequence Diagram Import Goods (Duyệt Xuất/Nhập Kho & Cấp Phát)
```text
Create a UML Sequence Diagram for UC "Process & Export Goods (Duyệt xuất kho & Cấp phát hàng hóa)" with lifelines:
- InventoryManager (Actor)
- ManageRequestsView (Boundary)
- InventoryService (Control/Service)
- InventoryRequestController (Controller)
- InventoryEntity (Entity)
- InventoryRequestEntity (Entity)
- TransactionEntity (Entity)

Sequence Flow:
1. InventoryManager clicks "Xuất Kho" on ManageRequestsView
2. ManageRequestsView calls handleProcess(requestId)
3. ManageRequestsView calls InventoryService.processRequest(requestId, userId)
4. InventoryService sends POST HTTP Request to InventoryRequestController at /api/requests/:id/process
5. InventoryRequestController calls InventoryEntity.checkStockAvailability(sourceLocationId, productIds)
6. InventoryEntity queries stock levels in Database and returns stockMap

alt Stock Insufficient
   7. InventoryRequestController returns 400 Bad Request "Thiếu hàng trong kho xuất" with itemized errors
   8. InventoryService throws Out-of-Stock Error to ManageRequestsView
   9. ManageRequestsView displays Error Alert "Lỗi xuất kho: Thiếu hàng trong kho xuất" to InventoryManager
else Stock Sufficient
   10. InventoryRequestController deducts source warehouse stock and increments destination store stock
   11. InventoryRequestController calls TransactionEntity.createTransaction(EXPORT, sourceLocationId, items)
   12. InventoryRequestController calls TransactionEntity.createTransaction(IMPORT, destLocationId, items)
   13. InventoryRequestController calls InventoryRequestEntity.updateStatus(requestId, APPROVED)
   14. InventoryRequestController returns 200 OK "Dispatch request processed and approved successfully" with updatedAt timestamp
   15. InventoryService returns success response to ManageRequestsView
   16. ManageRequestsView updates UI status to "🟢 Đã Hoàn Tất Xuất Kho" and shows success message to InventoryManager
end
```

---

## 📌 4.1. Store Manager

### 4.1.1 Class Diagram (Store Manager Module)
```text
Create a UML Class Diagram for Store Manager module in an Inventory Management System:

Classes:
1. StoreDispatchView (Boundary)
   - sourceId: number
   - destId: number
   - notes: string
   - rows: RequestRow[]
   + handleAddRow(): void
   + handleRemoveRow(index: number): void
   + handleSubmit(e: FormEvent): void

2. InventoryService (API Client / Service)
   + getProducts(): Promise<ProductList>
   + getLocations(): Promise<LocationList>
   + getInventory(locationId: number): Promise<InventoryData>
   + createRequest(data: CreateRequestParams): Promise<Response>

3. InventoryRequestController (Controller)
   + validateRequest(details: any): ValidationResult
   + createRequest(req: Request, res: Response): Promise<void>

4. InventoryEntity (Entity)
   + checkStockAvailability(locationId: number, productIds: number[]): Promise<Record<number, number>>

5. InventoryRequestEntity (Entity)
   + create(details: CreateRequestParams): Promise<InventoryRequest>

Relationships:
- StoreDispatchView uses InventoryService
- InventoryService communicates with InventoryRequestController via HTTP API
- InventoryRequestController invokes InventoryRequestController.validateRequest(details)
- InventoryRequestController calls InventoryEntity.checkStockAvailability() and InventoryRequestEntity.create()
```

---

### 4.2.1 Sequence Diagram Create Inventory Request (Tạo Yêu Cầu Điều Chuyển Hàng Hóa)
```text
Create a UML Sequence Diagram for UC 2.2.1 "Create Inventory Request (Tạo Yêu Cầu Điều Chuyển Hàng Hóa)" with lifelines:
- StoreManager (Actor)
- StoreDispatchView (Boundary)
- InventoryService (Control/Service)
- InventoryRequestController (Controller)
- InventoryEntity (Entity)
- InventoryRequestEntity (Entity)

Sequence Flow:
1. StoreManager inputs transfer details (sourceLocationId, destLocationId, items, notes) and clicks "Gửi Yêu Cầu Điều Chuyển"
2. StoreDispatchView invokes handleSubmit(e)
3. StoreDispatchView calls InventoryService.createRequest(details)
4. InventoryService sends POST HTTP Request to InventoryRequestController at /api/requests/create
5. InventoryRequestController executes validateRequest(details)

alt Request Invalid (Missing fields or quantity <= 0)
   6. InventoryRequestController returns 400 Bad Request with validationErrors
   7. StoreDispatchView displays error message to StoreManager
else Request Valid
   8. InventoryRequestController calls InventoryEntity.checkStockAvailability(sourceLocationId, productIds)
   9. InventoryRequestController queries database and returns stockLevels
   
   alt Real-time Stock Insufficient
      10. InventoryRequestController returns 400 Bad Request "Thiếu hàng trong kho xuất" with outOfStockErrors
      11. StoreDispatchView displays warning "Thiếu hàng trong kho xuất" to StoreManager
   else Real-time Stock Sufficient
      12. InventoryRequestController calls InventoryRequestEntity.create(details)
      13. InventoryRequestEntity inserts new record with status PENDING into Database and returns newRequestObject
      14. InventoryRequestController returns 201 Created "Request Submitted Successfully" with requestId
      15. InventoryService returns success response to StoreDispatchView
      16. StoreDispatchView resets form and displays success notification with requestId to StoreManager
   end
end
```
