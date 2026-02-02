import pool from "../config/database.js";

// 图表1：折线图数据（充电量、充电时长、充电功率）
export const getChartData = async (req, res) => {
  try {
    // 模拟时间段的数据
    const chartData = {
      list: [
        {
          name: "充电量(kWh)",
          data: [42, 35, 70, 28, 55, 50, 60, 65, 48],
        },
        {
          name: "充电时长(min)",
          data: [70, 35, 50, 45, 48, 25, 40, 35, 20],
        },
        {
          name: "充电功率(kW)",
          data: [36, 60, 84, 37, 70, 120, 90, 111, 144],
        },
      ],
    };

    res.json({
      code: 200,
      message: "操作成功",
      data: chartData,
    });
  } catch (error) {
    console.error("获取图表数据失败:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};

// 图表2：饼图数据（充电桩类型分布）
export const getChartData2 = async (req, res) => {
  try {
    // 从数据库统计充电桩类型分布
    const [rows] = await pool.query(`
      SELECT 
        type,
        COUNT(*) as count
      FROM charging_stations
      GROUP BY type
    `);

    // 转换为饼图数据格式
    const colorMap = {
      AC: "#91cc75",
      DC: "#73c0de",
      mixed: "#ee6666",
    };

    const nameMap = {
      AC: "交流充电桩",
      DC: "直流充电桩",
      mixed: "混合充电桩",
    };

    // 如果某个类型数量太少（小于总数的10%），调整为至少10%以便显示
    const total = rows.reduce((sum, row) => sum + row.count, 0);
    const minPercentage = 0.15; // 最小占比15%

    let chartData = rows.map((row) => ({
      value: row.count,
      name: nameMap[row.type] || row.type,
      itemStyle: { color: colorMap[row.type] || "#5470c6" },
      originalValue: row.count, // 保存原始值用于tooltip
    }));

    // 调整数据使其更均衡显示
    chartData.forEach((item) => {
      const percentage = item.value / total;
      if (percentage < minPercentage) {
        // 如果占比太小，调整显示值（但保留原始值）
        item.value = Math.ceil(total * minPercentage);
      }
    });

    res.json({
      code: 200,
      message: "操作成功",
      data: { list: chartData },
    });
  } catch (error) {
    console.error("获取饼图数据失败:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};

// 图表3：雷达图数据（设备综合评估）
export const getChartData3 = async (req, res) => {
  try {
    // 计算各项指标
    const [stationStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_stations,
        SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) as online_stations
      FROM charging_stations
    `);

    const [pileStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_piles,
        SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) as charging_piles,
        SUM(CASE WHEN status = 6 THEN 1 ELSE 0 END) as fault_piles
      FROM charging_pile
    `);

    // 计算各项指标百分比
    const stationUsageRate =
      (stationStats[0].online_stations / stationStats[0].total_stations) * 100;
    const pileUsageRate =
      (pileStats[0].charging_piles / pileStats[0].total_piles) * 100;
    const faultRate =
      (pileStats[0].fault_piles / pileStats[0].total_piles) * 100;

    const chartData = {
      list: [
        Math.round(pileUsageRate), // 充电桩使用率
        Math.round(stationUsageRate), // 充电站运行率
        Math.round(100 - faultRate), // 设备故障率（反向）
        85, // 充电效率（模拟数据）
        92, // 设备维护率（模拟数据）
        88, // 系统稳定性（模拟数据）
      ],
    };

    res.json({
      code: 200,
      message: "操作成功",
      data: chartData,
    });
  } catch (error) {
    console.error("获取雷达图数据失败:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};

// 获取设备统计数据
export const getDeviceStats = async (req, res) => {
  try {
    // 充电桩统计
    const [pileStats] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status IN (1, 2) THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 6 THEN 1 ELSE 0 END) as fault
      FROM charging_pile
    `);

    // 充电站统计
    const [stationStats] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'fault' THEN 1 ELSE 0 END) as fault
      FROM charging_stations
    `);

    res.json({
      code: 200,
      success: true,
      data: {
        pile: {
          total: pileStats[0].total,
          active: pileStats[0].active,
          fault: pileStats[0].fault,
        },
        station: {
          total: stationStats[0].total,
          active: stationStats[0].active,
          fault: stationStats[0].fault,
        },
      },
    });
  } catch (error) {
    console.error("获取设备统计失败:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};

// 获取营收排行
export const getRevenueRanking = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.location as city,
        SUM(r.monthly_income) as total_income,
        AVG(r.growth_percent) as avg_growth
      FROM revenue_records r
      JOIN charging_stations s ON r.station_id = s.id
      GROUP BY s.location
      ORDER BY total_income DESC
      LIMIT 7
    `);

    const ranking = rows.map((row, index) => ({
      rank: index + 1,
      city: row.city.split("市")[0], // 提取城市名
      sales: Math.round(row.total_income),
      percent: row.avg_growth.toFixed(1),
    }));

    res.json({
      code: 200,
      success: true,
      data: { list: ranking },
    });
  } catch (error) {
    console.error("获取营收排行失败:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};

// 获取最新告警
export const getLatestAlarms = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        alarm_type,
        station_name,
        pile_code,
        description,
        level,
        alarm_time
      FROM alarms
      ORDER BY alarm_time DESC
      LIMIT 5
    `);

    res.json({
      code: 200,
      success: true,
      data: { list: rows },
    });
  } catch (error) {
    console.error("获取告警列表失败:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};
