import pool from "../config/database.js";

// 获取充电站列表（带分页和筛选）
export const getStationList = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      status = 1,
      name = "",
      id = "",
    } = req.body;

    // 构建查询条件
    let whereConditions = [];
    let queryParams = [];

    // 按ID查询
    if (id) {
      whereConditions.push("station_id = ?");
      queryParams.push(id);
    }

    // 按名称查询（模糊匹配）
    if (name) {
      whereConditions.push("station_name LIKE ?");
      queryParams.push(`%${name}%`);
    }

    // 按状态查询（1表示全部，不过滤）
    if (status && status != 1) {
      whereConditions.push("status = ?");
      queryParams.push(status);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // 查询总数
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM station_monitor ${whereClause}`,
      queryParams,
    );
    const total = countResult[0].total;

    // 查询分页数据
    const offset = (page - 1) * pageSize;
    queryParams.push(parseInt(pageSize), offset);

    const [rows] = await pool.query(
      `SELECT 
        station_id as id,
        station_name as name,
        city,
        fast_charge as fast,
        slow_charge as slow,
        status,
        charging_now as now,
        fault_count as fault,
        manager_name as person,
        manager_tel as tel
      FROM station_monitor 
      ${whereClause}
      ORDER BY id ASC
      LIMIT ? OFFSET ?`,
      queryParams,
    );

    res.json({
      code: 200,
      success: true,
      data: {
        list: rows,
        total: total,
      },
    });
  } catch (error) {
    console.error("获取充电站列表失败:", error);
    res.status(500).json({
      code: 500,
      success: false,
      message: "服务器错误",
    });
  }
};

// 新增或编辑充电站
export const editStation = async (req, res) => {
  try {
    const { id, name, city, fast, slow, status, now, fault, person, tel } =
      req.body;

    // 检查是否存在该站点（通过station_id）
    const [existing] = await pool.query(
      "SELECT id FROM station_monitor WHERE station_id = ?",
      [id],
    );

    if (existing.length > 0) {
      // 更新现有站点
      await pool.query(
        `UPDATE station_monitor 
        SET station_name = ?, 
            city = ?, 
            fast_charge = ?, 
            slow_charge = ?, 
            status = ?, 
            charging_now = ?, 
            fault_count = ?, 
            manager_name = ?, 
            manager_tel = ?
        WHERE station_id = ?`,
        [name, city, fast, slow, status, now, fault, person, tel, id],
      );
    } else {
      // 新增站点
      await pool.query(
        `INSERT INTO station_monitor 
        (station_id, station_name, city, fast_charge, slow_charge, status, charging_now, fault_count, manager_name, manager_tel) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, city, fast, slow, status, now, fault, person, tel],
      );
    }

    res.json({
      code: 200,
      success: true,
      data: "操作成功",
    });
  } catch (error) {
    console.error("编辑充电站失败:", error);
    res.status(500).json({
      code: 500,
      success: false,
      message: "服务器错误",
    });
  }
};

// 删除充电站
export const deleteStation = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "缺少站点ID",
      });
    }

    await pool.query("DELETE FROM station_monitor WHERE station_id = ?", [id]);

    res.json({
      code: 200,
      success: true,
      data: "操作成功",
    });
  } catch (error) {
    console.error("删除充电站失败:", error);
    res.status(500).json({
      code: 500,
      success: false,
      message: "服务器错误",
    });
  }
};

// 获取充电站统计数据（顶部统计卡片）
export const getStationStats = async (req, res) => {
  try {
    // 累计充电量（模拟数据，实际应该从订单表统计）
    const totalElectricity = 268900;

    // 累计充电次数（模拟数据）
    const totalChargingTimes = 1389;

    // 服务区域数（统计不同城市数量）
    const [cityCount] = await pool.query(
      "SELECT COUNT(DISTINCT city) as count FROM station_monitor",
    );

    // 累计效益（模拟数据）
    const totalRevenue = 5622178;

    res.json({
      code: 200,
      success: true,
      data: {
        totalElectricity,
        totalChargingTimes,
        serviceAreas: cityCount[0].count,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("获取充电站统计失败:", error);
    res.status(500).json({
      code: 500,
      success: false,
      message: "服务器错误",
    });
  }
};
