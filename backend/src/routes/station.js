// 充电站管理路由配置
import express from "express";
import {
  getStationList,
  editStation,
  deleteStation,
  getStationStats,
  getRevenueList,
  getRevenueChart,
  getPileList,
} from "../controllers/stationController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 获取充电站列表
router.post("/list", getStationList);

// 新增/编辑充电站
router.post("/edit", editStation);

// 删除充电站
router.post("/delete", deleteStation);

// 获取充电站统计数据
router.get("/stats", getStationStats);

// 获取营收统计列表
router.post("/revenue/list", getRevenueList);

// 获取营收图表数据
router.get("/revenue/chart", getRevenueChart);

// 获取充电桩列表
router.post("/pile/list", getPileList);

export default router;
