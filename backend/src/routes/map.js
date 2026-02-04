// 地图管理路由配置
import express from "express";
import {
  getMapStations,
  createStation,
  getMapStats,
} from "../controllers/mapController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 获取地图站点列表
router.post("/mapList", getMapStations);

// 创建新站点
router.post("/create", createStation);

// 获取地图统计数据
router.get("/stats", getMapStats);

export default router;
