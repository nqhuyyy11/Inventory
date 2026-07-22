import { Router } from "express";
import { createDispatchRequest, processDispatchRequest, getRequests } from "./request.controller.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = Router();

// Lấy danh sách requests
router.get("/", authenticateToken, getRequests);

// Store Manager tạo yêu cầu xin cấp hàng
router.post("/dispatch", authenticateToken, createDispatchRequest);

// Inventory Manager xử lý yêu cầu
router.post("/:id/process", authenticateToken, processDispatchRequest);

export default router;
