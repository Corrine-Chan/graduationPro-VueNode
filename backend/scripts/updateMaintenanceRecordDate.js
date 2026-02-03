/**
 * ============================================
 * 文件名: updateMaintenanceRecordDate.js
 * 作用: 更新充电桩维修记录的日期为今天
 * ============================================
 *
 * 功能说明:
 * 1. 将数据库中所有充电桩维修记录的日期更新为当前日期
 * 2. 适用于演示环境，快速让现有记录显示为今天的记录
 * 3. 不会修改记录内容，只更新日期字段
 *
 * 使用场景:
 * - 演示项目时，需要让历史记录显示为今天
 * - 数据库中有旧记录，但想快速在页面上显示
 *
 * 使用方法:
 * cd backend
 * node scripts/updateMaintenanceRecordDate.js
 *
 * 注意事项:
 * ⚠️ 此脚本会更新所有充电桩维修记录的日期
 * ⚠️ 执行前会显示当前记录统计，执行后会显示更新结果
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
    console.log("🔍 正在检查当前维修记录...\n");

    // 先查看当前记录统计
    const [current] = await pool.query(
      "SELECT record_date, COUNT(*) as count FROM pile_maintenance_record GROUP BY record_date",
    );

    if (current.length === 0) {
      console.log("❌ 数据库中没有充电桩维修记录");
      console.log("💡 请先运行 添加维修记录表.bat 创建表和示例数据");
      await pool.end();
      return;
    }

    console.log("📊 当前维修记录统计:");
    current.forEach((r) => {
      const date = new Date(r.record_date).toISOString().split("T")[0];
      console.log(`  ${date}: ${r.count} 条记录`);
    });
    console.log("");

    // 更新充电桩维修记录的日期为今天
    console.log("🔄 正在更新维修记录日期为今天...\n");
    const [result] = await pool.query(
      "UPDATE pile_maintenance_record SET record_date = CURDATE()",
    );

    console.log(
      "✅ 更新成功:",
      result.affectedRows,
      "条记录已更新为今天日期\n",
    );

    // 验证更新结果
    const [rows] = await pool.query(
      "SELECT COUNT(*) as count, record_date FROM pile_maintenance_record GROUP BY record_date",
    );
    console.log("📊 更新后维修记录统计:");
    rows.forEach((r) => {
      const date = new Date(r.record_date).toISOString().split("T")[0];
      console.log(`  ${date}: ${r.count} 条记录`);
    });
    console.log("");
    console.log("✨ 完成！现在可以刷新前端页面查看维修记录了");
    console.log("💡 提示: 如果前端页面还是没有记录，请检查后端服务是否已启动");
  } catch (error) {
    console.error("\n❌ 更新失败:", error.message);
    console.error("\n请检查:");
    console.error("  1. 数据库连接信息是否正确");
    console.error("  2. 数据库 charging_station 是否存在");
    console.error("  3. 表 pile_maintenance_record 是否存在");
    console.error("  4. 如果表不存在，请运行 添加维修记录表.bat");
  } finally {
    await pool.end();
  }
})();
