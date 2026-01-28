import express from "express";
import {
  getChartData,
  getChartData2,
  getChartData3,
  getDeviceStats,
  getRevenueRanking,
  getLatestAlarms,
} from "../controllers/dashboardController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 图表数据接口
router.get("/chartData", getChartData);
router.get("/chartData2", getChartData2);
router.get("/chartData3", getChartData3);

// 设备统计
router.get("/device-stats", getDeviceStats);

// 营收排行
router.get("/revenue-ranking", getRevenueRanking);

// 最新告警
router.get("/latest-alarms", getLatestAlarms);

export default router;
