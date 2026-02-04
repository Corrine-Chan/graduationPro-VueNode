// 检查地图数据是否存在
import db from "../src/config/database.js";

async function checkMapData() {
  try {
    console.log("=".repeat(60));
    console.log("🔍 检查地图站点数据");
    console.log("=".repeat(60));

    // 检查表是否存在
    console.log("\n1. 检查 map_stations 表是否存在...");
    const [tables] = await db.query(`
      SHOW TABLES LIKE 'map_stations'
    `);

    if (tables.length === 0) {
      console.log("❌ map_stations 表不存在！");
      console.log("请运行以下命令创建表：");
      console.log("mysql -u root -p charging_station < database/schema.sql");
      process.exit(1);
    }
    console.log("✅ map_stations 表存在");

    // 检查数据数量
    console.log("\n2. 检查数据数量...");
    const [countResult] = await db.query(`
      SELECT COUNT(*) as total FROM map_stations
    `);
    const total = countResult[0].total;
    console.log(`✅ 共有 ${total} 条数据`);

    if (total === 0) {
      console.log("❌ 没有数据！请运行以下命令插入数据：");
      console.log("mysql -u root -p charging_station < database/schema.sql");
      process.exit(1);
    }

    // 检查启用的数据
    console.log("\n3. 检查启用的站点...");
    const [activeResult] = await db.query(`
      SELECT COUNT(*) as active FROM map_stations WHERE is_active = 1
    `);
    const active = activeResult[0].active;
    console.log(`✅ 启用的站点: ${active} 个`);

    // 显示前5条数据
    console.log("\n4. 显示前5条数据...");
    const [stations] = await db.query(`
      SELECT 
        station_id,
        station_name,
        address,
        longitude,
        latitude,
        status,
        pile_count,
        is_active
      FROM map_stations
      LIMIT 5
    `);

    stations.forEach((station, index) => {
      console.log(
        `\n  ${index + 1}. ${station.station_name} (${station.station_id})`,
      );
      console.log(`     地址: ${station.address}`);
      console.log(`     坐标: [${station.longitude}, ${station.latitude}]`);
      console.log(
        `     状态: ${station.status}, 充电桩数: ${station.pile_count}, 启用: ${station.is_active ? "是" : "否"}`,
      );
    });

    console.log("\n" + "=".repeat(60));
    console.log("✅ 数据检查完成！");
    console.log("=".repeat(60));

    process.exit(0);
  } catch (error) {
    console.error("\n❌ 检查失败:", error.message);
    console.error("错误详情:", error);
    process.exit(1);
  }
}

checkMapData();
