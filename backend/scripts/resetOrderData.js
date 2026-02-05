import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量
dotenv.config({ path: join(__dirname, "../.env") });

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "charging_station",
  port: parseInt(process.env.DB_PORT) || 3306,
};

// 重置订单数据（清空所有订单）
async function resetOrders() {
  let connection;

  try {
    console.log("正在连接数据库...");
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ 数据库连接成功");

    // 查询当前订单数量
    const [countResult] = await connection.execute(
      "SELECT COUNT(*) as total FROM charging_orders",
    );
    const currentCount = countResult[0].total;

    console.log(`\n当前订单数量: ${currentCount}`);

    if (currentCount === 0) {
      console.log("⚠️  数据库中没有订单数据");
      return;
    }

    // 确认删除
    console.log("\n⚠️  警告：此操作将删除所有订单数据！");
    console.log("如果要继续，请运行: node resetOrderData.js --confirm");

    // 检查是否有 --confirm 参数
    if (!process.argv.includes("--confirm")) {
      console.log("\n❌ 操作已取消");
      return;
    }

    // 清空订单数据
    console.log("\n正在清空订单数据...");
    await connection.execute("DELETE FROM charging_orders");
    console.log("✅ 所有订单数据已清空");

    // 重置自增ID
    await connection.execute("ALTER TABLE charging_orders AUTO_INCREMENT = 1");
    console.log("✅ 自增ID已重置");

    console.log("\n✅ 订单数据重置完成！");
    console.log("提示：运行 generateOrderData.js 可以生成新的测试数据");
  } catch (error) {
    console.error("❌ 重置失败:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 执行重置
resetOrders();
