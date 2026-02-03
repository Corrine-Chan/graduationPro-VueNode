/**
 * ============================================
 * 文件名: checkRevenueData.js
 * 作用: 查看营收统计数据的概况
 * ============================================
 *
 * 功能说明:
 * 1. 查询数据库中所有营收统计数据
 * 2. 按日期分组统计每天的数据量
 * 3. 显示最新的数据日期
 * 4. 帮助快速了解数据库中的数据情况
 *
 * 使用场景:
 * - 检查数据库中是否有营收数据
 * - 查看最新的数据日期是哪天
 * - 确认数据生成脚本是否执行成功
 * - 排查"页面无数据"问题
 *
 * 使用方法:
 * cd backend
 * node scripts/checkRevenueData.js
 *
 * 输出示例:
 * 📊 营收数据统计：
 * ================
 *   2026-02-04: 33 条数据
 *   2026-02-03: 33 条数据
 *   2026-02-02: 42 条数据
 * ================
 * 总计: 3 个日期
 *
 * 注意事项:
 * ⚠️ 只显示统计信息，不会修改任何数据
 * ⚠️ 如果显示"总计: 0 个日期"，说明数据库中没有营收数据
 * ⚠️ 需要先运行 generateDailyRevenue.js 生成数据
 *
 * 数据库配置:
 * - 需要修改下方的数据库连接信息（host, user, password）
 * - 确保数据库 charging_station 存在
 * - 确保表 station_revenue 存在
 * ============================================
 */

import mysql from "mysql2/promise";

(async () => {
  // 创建数据库连接池
  const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "021126", // ⚠️ 请根据实际情况修改密码
    database: "charging_station",
  });

  try {
    console.log("🔍 正在查询营收数据...\n");

    // 查询所有日期的数据统计
    const [rows] = await pool.query(
      "SELECT stat_date, COUNT(*) as count FROM station_revenue GROUP BY stat_date ORDER BY stat_date DESC",
    );

    if (rows.length === 0) {
      console.log("❌ 数据库中没有营收数据");
      console.log("\n💡 提示:");
      console.log("  - 请运行: node scripts/generateDailyRevenue.js");
      console.log("  - 或者检查数据库表 station_revenue 是否存在");
      await pool.end();
      return;
    }

    console.log("📊 营收数据统计：");
    console.log("================");
    rows.forEach((r) => {
      const date = new Date(r.stat_date).toISOString().split("T")[0];
      console.log(`  ${date}: ${r.count} 条数据`);
    });
    console.log("================");
    console.log(`总计: ${rows.length} 个日期\n`);

    // 显示最新数据日期
    const latestDate = new Date(rows[0].stat_date).toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];

    console.log(`📅 最新数据日期: ${latestDate}`);
    console.log(`📅 今天日期: ${today}`);

    if (latestDate === today) {
      console.log("✅ 数据是最新的（今天）");
    } else {
      console.log("⚠️  数据不是今天的");
      console.log("\n💡 提示:");
      console.log(`  - 生成今天的数据: node scripts/generateDailyRevenue.js`);
      console.log(`  - 或更新日期为今天: node scripts/updateRevenueDate.js`);
    }
  } catch (error) {
    console.error("❌ 查询失败:", error.message);
    console.error("\n请检查:");
    console.error("  1. 数据库连接信息是否正确");
    console.error("  2. 数据库 charging_station 是否存在");
    console.error("  3. 表 station_revenue 是否存在");
  } finally {
    await pool.end();
  }
})();
