/**
 * ============================================
 * 文件名: generateDailyRevenue.js
 * 作用: 自动生成指定日期的营收统计数据
 * ============================================
 *
 * 功能说明:
 * 1. 为所有充电站生成指定日期的营收统计数据
 * 2. 自动读取 station_monitor 表中的充电站信息
 * 3. 为每个充电站随机生成合理的营收数据（模拟真实业务）
 * 4. 插入到 station_revenue 表中
 * 5. 自动检查是否已存在数据，避免重复插入
 *
 * 使用场景:
 * - 每天需要生成新的营收数据用于演示
 * - 初始化项目时批量生成历史数据
 * - 测试营收统计功能
 *
 * 使用方法:
 * # 生成今天的数据
 * cd backend
 * node scripts/generateDailyRevenue.js
 *
 * # 生成指定日期的数据
 * node scripts/generateDailyRevenue.js 2026-02-04
 *
 * 生成的数据包括:
 * - 电费营收 (7000-9000元)
 * - 停车费营收 (2500-3000元)
 * - 服务费营收 (6500-7000元)
 * - 会员储值金 (3000-3500元)
 * - 单日总收入 (自动计算)
 * - 月度总收入 (4500-5500万元)
 * - 日增长率 (-5% 到 +5%)
 * - 月增长率 (-5% 到 +5%)
 *
 * 注意事项:
 * ⚠️ 如果指定日期已有数据，脚本会提示但不会覆盖
 * ⚠️ 需要先在 station_monitor 表中有充电站数据
 * ⚠️ 生成的是模拟数据，真实环境应从订单表统计
 *
 * 数据库配置:
 * - 需要修改下方的数据库连接信息（host, user, password）
 * - 确保数据库 charging_station 存在
 * - 确保表 station_monitor 和 station_revenue 存在
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
    console.log("🚀 营收数据生成脚本启动\n");

    // 获取命令行参数中的日期，如果没有则使用今天
    const targetDate =
      process.argv[2] || new Date().toISOString().split("T")[0];
    console.log(`📅 目标日期: ${targetDate}\n`);

    // 检查该日期是否已有数据
    console.log("🔍 检查是否已存在数据...");
    const [existing] = await pool.query(
      "SELECT COUNT(*) as count FROM station_revenue WHERE stat_date = ?",
      [targetDate],
    );

    if (existing[0].count > 0) {
      console.log(
        `\n⚠️  警告: ${targetDate} 已存在 ${existing[0].count} 条数据`,
      );
      console.log("❌ 为避免数据重复，脚本已停止");
      console.log("\n💡 提示:");
      console.log(
        "  - 如果要更新现有数据的日期，请使用: node scripts/updateRevenueDate.js",
      );
      console.log("  - 如果要删除现有数据后重新生成，请手动执行 DELETE 语句");
      await pool.end();
      return;
    }
    console.log("✅ 该日期暂无数据，可以生成\n");

    // 获取所有充电站信息
    console.log("🔍 正在读取充电站信息...");
    const [stations] = await pool.query(
      "SELECT station_id, station_name, city, fast_charge + slow_charge as pile_count FROM station_monitor",
    );

    if (stations.length === 0) {
      console.log("❌ 错误: 没有找到充电站数据");
      console.log("💡 请先在 station_monitor 表中添加充电站数据");
      await pool.end();
      return;
    }

    console.log(`✅ 找到 ${stations.length} 个充电站\n`);
    console.log("⚙️  开始生成营收数据...");

    // 为每个充电站生成营收数据
    const insertPromises = stations.map((station) => {
      // 随机生成营收数据（模拟真实业务场景）
      // 注意：真实环境应该从 charging_orders 表统计实际订单数据
      const electricity = Math.floor(Math.random() * 2000) + 7000; // 电费营收: 7000-9000元
      const parking = Math.floor(Math.random() * 500) + 2500; // 停车费营收: 2500-3000元
      const service = Math.floor(Math.random() * 500) + 6500; // 服务费营收: 6500-7000元
      const member = Math.floor(Math.random() * 500) + 3000; // 会员储值金: 3000-3500元
      const dailyTotal = electricity + parking + service + member; // 单日总收入（自动计算）
      const monthlyTotal = Math.floor(Math.random() * 1000) + 4500; // 月度总收入: 4500-5500万元
      const dailyGrowth = (Math.random() * 10 - 5).toFixed(2); // 日增长率: -5% 到 +5%
      const monthlyGrowth = (Math.random() * 10 - 5).toFixed(2); // 月增长率: -5% 到 +5%

      // 插入数据到 station_revenue 表
      return pool.query(
        `INSERT INTO station_revenue 
        (station_id, station_name, city, pile_count, electricity_fee, parking_fee, 
         service_fee, member_recharge, daily_total, monthly_total, 
         daily_growth_rate, monthly_growth_rate, stat_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          station.station_id,
          station.station_name,
          station.city,
          station.pile_count,
          electricity,
          parking,
          service,
          member,
          dailyTotal,
          monthlyTotal,
          dailyGrowth,
          monthlyGrowth,
          targetDate,
        ],
      );
    });

    // 批量插入所有充电站的营收数据
    await Promise.all(insertPromises);

    console.log(`\n✅ 成功生成 ${stations.length} 条营收数据`);
    console.log(`📅 统计日期: ${targetDate}\n`);

    // 验证插入结果，显示数据统计
    console.log("📊 正在验证数据...");
    const [result] = await pool.query(
      "SELECT COUNT(*) as count, SUM(daily_total) as total_revenue FROM station_revenue WHERE stat_date = ?",
      [targetDate],
    );
    console.log(
      `✅ 数据统计: ${result[0].count} 条记录，总营收: ${Number(result[0].total_revenue).toFixed(2)} 元`,
    );

    console.log("\n✨ 完成！现在可以刷新前端页面查看数据了");
    console.log("💡 提示: 如果前端页面还是没有数据，请检查后端服务是否已启动");
  } catch (error) {
    console.error("\n❌ 生成数据失败:", error.message);
    console.error("\n请检查:");
    console.error("  1. 数据库连接信息是否正确");
    console.error("  2. 数据库 charging_station 是否存在");
    console.error("  3. 表 station_monitor 和 station_revenue 是否存在");
    console.error("  4. station_monitor 表中是否有充电站数据");
  } finally {
    await pool.end();
  }
})();
