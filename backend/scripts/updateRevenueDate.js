/**
 * ============================================
 * 文件名: updateRevenueDate.js
 * 作用: 更新营收统计数据的日期为今天
 * ============================================
 *
 * 功能说明:
 * 1. 将数据库中所有营收统计数据的日期更新为当前日期
 * 2. 适用于演示环境，快速让现有数据显示为今天的数据
 * 3. 不会修改营收金额，只更新日期字段
 *
 * 使用场景:
 * - 演示项目时，需要让历史数据显示为今天
 * - 数据库中有旧数据，但想快速在页面上显示
 * - 不需要重新生成数据，只需要更新日期
 *
 * 使用方法:
 * cd backend
 * node scripts/updateRevenueDate.js
 *
 * 注意事项:
 * ⚠️ 此脚本会更新所有营收数据的日期
 * ⚠️ 如果需要保留历史数据，请使用 generateDailyRevenue.js 生成新数据
 * ⚠️ 执行前会显示当前数据统计，执行后会显示更新结果
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
    console.log("🔍 正在检查当前数据...\n");

    // 先查看当前数据统计
    const [current] = await pool.query(
      "SELECT stat_date, COUNT(*) as count FROM station_revenue GROUP BY stat_date",
    );

    if (current.length === 0) {
      console.log("❌ 数据库中没有营收数据");
      console.log("💡 请先运行: node scripts/generateDailyRevenue.js");
      await pool.end();
      return;
    }

    console.log("📊 当前数据统计:");
    current.forEach((r) => {
      const date = new Date(r.stat_date).toISOString().split("T")[0];
      console.log(`  ${date}: ${r.count} 条数据`);
    });
    console.log("");

    // 更新营收统计表的日期为今天
    console.log("🔄 正在更新数据日期为今天...\n");
    const [result] = await pool.query(
      "UPDATE station_revenue SET stat_date = CURDATE()",
    );

    console.log(
      "✅ 更新成功:",
      result.affectedRows,
      "条数据已更新为今天日期\n",
    );

    // 验证更新结果
    const [rows] = await pool.query(
      "SELECT COUNT(*) as count, stat_date FROM station_revenue GROUP BY stat_date",
    );
    console.log("📊 更新后数据统计:");
    rows.forEach((r) => {
      const date = new Date(r.stat_date).toISOString().split("T")[0];
      console.log(`  ${date}: ${r.count} 条数据`);
    });
    console.log("");
    console.log("✨ 完成！现在可以刷新前端页面查看数据了");
    console.log("💡 提示: 如果前端页面还是没有数据，请检查后端服务是否已启动");
  } catch (error) {
    console.error("\n❌ 更新失败:", error.message);
    console.error("\n请检查:");
    console.error("  1. 数据库连接信息是否正确");
    console.error("  2. 数据库 charging_station 是否存在");
    console.error("  3. 表 station_revenue 是否存在");
  } finally {
    await pool.end();
  }
})();
