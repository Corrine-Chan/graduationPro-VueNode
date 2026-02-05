import express from "express";
import {
  getOrderList,
  getOrderDetail,
  batchDeleteOrders,
  singleDeleteOrder,
  getCityList,
} from "../controllers/orderController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// 所有订单路由都需要认证
router.use(authenticateToken);

// 获取订单列表
router.post("/list", getOrderList);

// 获取订单详情
router.post("/detail", getOrderDetail);

// 批量删除订单
router.post("/batchDelete", batchDeleteOrders);

// 单个删除订单
router.post("/singleDelete", singleDeleteOrder);

// 获取城市列表
router.get("/cityList", getCityList);

export default router;
