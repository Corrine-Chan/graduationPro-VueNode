import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { testMockConnection } from "./config/mockDatabase.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// 健康检查
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "服务运行正常" });
});

// 错误处理
app.use(errorHandler);

// 启动服务器
const startServer = async () => {
  // 使用内存数据库（不需要 MySQL）
  await testMockConnection();

  app.listen(PORT, () => {
    console.log("=".repeat(50));
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    console.log(`📊 环境: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 API 地址: http://localhost:${PORT}/api`);
    console.log(`💾 数据库模式: 内存数据库（Mock Database）`);
    console.log("=".repeat(50));
    console.log("\n📝 默认账号信息:");
    console.log("   管理员: admin123456 / 123456");
    console.log("   测试用户: test123456 / 123456");
    console.log("\n💡 提示: 当前使用内存数据库，无需安装 MySQL");
    console.log("=".repeat(50));
  });
};

startServer();
