import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import stationRoutes from "./routes/station.js";
import mapRoutes from "./routes/map.js";
import orderRoutes from "./routes/order.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { testConnection } from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5501;

// 中间件
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/station", stationRoutes);
app.use("/api/map", mapRoutes);
app.use("/api/order", orderRoutes);

// 健康检查
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "服务运行正常" });
});

// 错误处理
app.use(errorHandler);

// 启动服务器
const startServer = async () => {
  // 测试数据库连接
  const isConnected = await testConnection();

  if (!isConnected) {
    console.error("❌ 无法连接到数据库，请检查配置");
    process.exit(1);
  }

  app.listen(PORT, () => {
    // console.log("=".repeat(50));
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    // console.log(`📊 环境: ${process.env.NODE_ENV || "development"}`);
    // console.log(`🔗 API 地址: http://localhost:${PORT}/api`);
    // console.log(`💾 数据库: MySQL - ${process.env.DB_NAME}`);
    // console.log("=".repeat(50));
    // console.log("\n📝 默认账号信息:");
    // console.log("   管理员: admin123456 / 123456");
    // console.log("=".repeat(50));
  });
};

startServer();
