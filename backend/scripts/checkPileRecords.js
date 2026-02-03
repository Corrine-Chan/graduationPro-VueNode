/**
 * ============================================
 * 文件名: checkPileRecords.js
 * 作用: 查看充电桩使用记录的概况
 * ============================================
 *
 * 功能说明:
 * 1. 查询数据库中所有充电桩使用记录
 * 2. 按日期分组统计每天的记录数量
 * 3. 显示最新的记录日期
 *
 * 使用方法:
 * cd backend
 * node scripts/checkPileRecords.js
 * ============================================
 */

import mysql from "mysql2/promise";

(async () => {
  const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "021126",
    database: "charging_station",
  });

  try {
    console.log("🔍 正在查询充电桩使用记录...\n");

    // 查询所有日期的记录统计
    const [rows] = await pool.query(
      "SELECT record_date, COUNT(*) as count FROM pile_usage_record GROUP BY record_date ORDER BY record_date DESC",
    );

    if (rows.length === 0) {
      console.log("❌ 数据库中没有充电桩使用记录");
      console.log("\n💡 提示: 请检查表 pile_usage_record 是否存在");
      await pool.end();
      return;
    }

    console.log("📊 充电桩使用记录统计：");
    console.log("================");
    rows.forEach((r) => {
      const date = new Date(r.record_date).toISOString().split("T")[0];
      console.log(`  ${date}: ${r.count} 条记录`);
    });
    console.log("================");
    console.log(`总计: ${rows.length} 个日期\n`);

    // 显示最新记录日期
    const latestDate = new Date(rows[0].record_date)
      .toISOString()
      .split("T")[0];
    const today = new Date().toISOString().split("T")[0];

    console.log(`📅 最新记录日期: ${latestDate}`);
    console.log(`📅 今天日期: ${today}`);

    if (latestDate === today) {
      console.log("✅ 记录是最新的（今天）");
    } else {
      console.log("⚠️  记录不是今天的");
      console.log("\n💡 提示: 可以更新记录日期为今天");
    }
  } catch (error) {
    console.error("❌ 查询失败:", error.message);
  } finally {
    await pool.end();
  }
})();
