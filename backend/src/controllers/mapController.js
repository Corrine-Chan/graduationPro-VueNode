import db from "../config/database.js";

// 获取地图站点列表
export const getMapStations = async (req, res) => {
  try {
    const query = `
      SELECT 
        station_id,
        station_name,
        address,
        longitude,
        latitude,
        status,
        pile_count,
        is_active,
        remarks,
        operator,
        created_at,
        updated_at
      FROM map_stations
      WHERE is_active = 1
      ORDER BY created_at DESC
    `;

    const [stations] = await db.query(query);

    // 转换数据格式以匹配前端需求
    const formattedStations = stations.map((station) => ({
      position: [parseFloat(station.longitude), parseFloat(station.latitude)],
      title: station.station_name,
      status: station.status,
      count: station.pile_count,
      address: station.address,
      id: station.station_id,
      remarks: station.remarks,
      operator: station.operator,
      createTime: station.created_at,
    }));

    res.json({
      code: 200,
      success: true,
      data: formattedStations,
    });
  } catch (error) {
    console.error("获取地图站点列表失败:", error);
    res.status(500).json({
      code: 500,
      success: false,
      message: "获取地图站点列表失败",
      error: error.message,
    });
  }
};

// 创建新站点
export const createStation = async (req, res) => {
  try {
    const {
      name,
      region,
      longitude,
      latitude,
      pileCount,
      isActive,
      remarks,
      createTime,
      operator,
    } = req.body;

    // 验证必填字段
    if (!name || !region || longitude === undefined || latitude === undefined) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "缺少必填字段",
      });
    }

    // 验证经纬度范围
    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "经度范围应在-180到180之间",
      });
    }

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "纬度范围应在-90到90之间",
      });
    }

    // 验证充电桩数量
    const pileCountValue = pileCount !== undefined ? parseInt(pileCount) : 0;
    if (pileCountValue < 0 || pileCountValue > 500) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "充电桩数量应在0到500之间",
      });
    }

    // 生成站点ID
    const [maxIdResult] = await db.query(
      "SELECT station_id FROM map_stations ORDER BY id DESC LIMIT 1",
    );

    let newStationId;
    if (maxIdResult.length > 0) {
      const lastId = maxIdResult[0].station_id;
      const numPart = parseInt(lastId.replace("VXZ", ""));
      newStationId = `VXZ${(numPart + 1).toString().padStart(5, "0")}`;
    } else {
      newStationId = "VXZ10001";
    }

    // 插入新站点
    const insertQuery = `
      INSERT INTO map_stations (
        station_id,
        station_name,
        address,
        longitude,
        latitude,
        status,
        pile_count,
        is_active,
        remarks,
        operator
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const status = isActive ? 2 : 1; // 2表示使用中，1表示空闲
    const activeStatus = isActive ? 1 : 0;

    await db.query(insertQuery, [
      newStationId,
      name,
      region,
      longitude,
      latitude,
      status,
      pileCountValue, // 使用用户输入的充电桩数量
      activeStatus,
      remarks || null,
      operator || "系统管理员",
    ]);

    // 返回新创建的站点信息
    const newStation = {
      position: [longitude, latitude],
      title: name,
      status: status,
      count: pileCountValue, // 返回实际的充电桩数量
      address: region,
      id: newStationId,
      remarks: remarks,
      operator: operator,
      createTime: createTime,
    };

    res.json({
      code: 200,
      success: true,
      message: "站点创建成功",
      data: newStation,
    });
  } catch (error) {
    console.error("创建站点失败:", error);
    res.status(500).json({
      code: 500,
      success: false,
      message: "创建站点失败",
      error: error.message,
    });
  }
};

// 获取地图统计数据
export const getMapStats = async (req, res) => {
  try {
    // 获取总站点数
    const [totalResult] = await db.query(
      "SELECT COUNT(*) as total FROM map_stations WHERE is_active = 1",
    );
    const totalStations = totalResult[0].total;

    // 获取各省份站点数量（这里简化处理，实际应该根据地址解析省份）
    const [provinceResult] = await db.query(`
      SELECT 
        SUBSTRING_INDEX(address, '市', 1) as province,
        COUNT(*) as count
      FROM map_stations
      WHERE is_active = 1
      GROUP BY province
      ORDER BY count DESC
      LIMIT 1
    `);

    // 获取省份数量（简化处理）
    const [provinceCountResult] = await db.query(`
      SELECT COUNT(DISTINCT SUBSTRING_INDEX(address, '市', 1)) as count
      FROM map_stations
      WHERE is_active = 1
    `);

    // 获取营收最高和最低的站点（关联营收表）
    const [revenueHighest] = await db.query(`
      SELECT ms.station_name
      FROM map_stations ms
      LEFT JOIN station_revenue sr ON ms.station_id = sr.station_id
      WHERE ms.is_active = 1 AND sr.stat_date = CURDATE()
      ORDER BY sr.daily_total DESC
      LIMIT 1
    `);

    const [revenueLowest] = await db.query(`
      SELECT ms.station_name
      FROM map_stations ms
      LEFT JOIN station_revenue sr ON ms.station_id = sr.station_id
      WHERE ms.is_active = 1 AND sr.stat_date = CURDATE()
      ORDER BY sr.daily_total ASC
      LIMIT 1
    `);

    // 获取故障率最高的站点（关联充电站监控表）
    const [faultHighest] = await db.query(`
      SELECT ms.station_name
      FROM map_stations ms
      LEFT JOIN station_monitor sm ON ms.station_id = sm.station_id
      WHERE ms.is_active = 1
      ORDER BY sm.fault_count DESC
      LIMIT 1
    `);

    res.json({
      code: 200,
      success: true,
      data: {
        totalStations: totalStations,
        maxProvinceStations:
          provinceResult.length > 0
            ? `${provinceResult[0].province}(${provinceResult[0].count}个)`
            : "暂无数据",
        provinceCount: provinceCountResult[0].count,
        noStationProvinces: 34 - provinceCountResult[0].count, // 假设中国有34个省级行政区
        revenueHighest:
          revenueHighest.length > 0
            ? revenueHighest[0].station_name
            : "暂无数据",
        revenueLowest:
          revenueLowest.length > 0 ? revenueLowest[0].station_name : "暂无数据",
        faultHighest:
          faultHighest.length > 0 ? faultHighest[0].station_name : "暂无数据",
      },
    });
  } catch (error) {
    console.error("获取地图统计数据失败:", error);
    res.status(500).json({
      code: 500,
      success: false,
      message: "获取地图统计数据失败",
      error: error.message,
    });
  }
};
