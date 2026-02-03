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

// 营收API实现
// 获取营收统计列表（带分页和筛选）
export const getRevenueList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, name = "" } = req.body;

    // 先获取最新的统计日期
    const [latestDate] = await pool.query(
      "SELECT MAX(stat_date) as latest_date FROM station_revenue",
    );

    if (!latestDate[0].latest_date) {
      // 如果没有任何数据，返回空列表
      return res.json({
        code: 200,
        success: true,
        data: {
          list: [],
          total: 0,
        },
      });
    }

    // 构建查询条件
    let whereConditions = [];
    let queryParams = [];

    // 按名称查询（模糊匹配）
    if (name) {
      whereConditions.push("station_name LIKE ?");
      queryParams.push(`%${name}%`);
    }

    // 查询最新日期的数据（而不是强制查询当天）
    whereConditions.push("stat_date = ?");
    queryParams.push(latestDate[0].latest_date);

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // 查询总数
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM station_revenue ${whereClause}`,
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
        pile_count as count,
        electricity_fee as electricity,
        parking_fee as parkingFee,
        service_fee as serviceFee,
        member_recharge as member,
        daily_total as day,
        monthly_total as month,
        daily_growth_rate as percent,
        monthly_growth_rate as mpercent
      FROM station_revenue 
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
    console.error("获取营收统计列表失败:", error);
    res.status(500).json({
      code: 500,
      success: false,
      message: "服务器错误",
    });
  }
};

// 获取营收图表数据
export const getRevenueChart = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // 查询当前年份的月度数据
    const [rows] = await pool.query(
      `SELECT 
        month,
        sales_amount,
        visit_count
      FROM revenue_chart 
      WHERE stat_year = ?
      ORDER BY month ASC`,
      [currentYear],
    );

    // 构建图表数据格式
    const salesData = [];
    const visitData = [];

    rows.forEach((row) => {
      salesData.push(row.sales_amount);
      visitData.push(row.visit_count);
    });

    res.json({
      code: 200,
      success: true,
      data: {
        list: [
          {
            name: "销售",
            data: salesData,
          },
          {
            name: "访问量",
            data: visitData,
          },
        ],
      },
    });
  } catch (error) {
    console.error("获取营收图表数据失败:", error);
    res.status(500).json({
      code: 500,
      success: false,
      message: "服务器错误",
    });
  }
};

// 获取充电桩列表（按充电站分组）
export const getPileList = async (req, res) => {
  try {
    // 查询所有充电站及其充电桩
    const [stations] = await pool.query(
      `SELECT DISTINCT station_id as id, station_name as name 
       FROM charging_pile 
       ORDER BY station_id ASC`,
    );

    // 为每个充电站查询其充电桩列表
    const result = [];
    for (const station of stations) {
      const [piles] = await pool.query(
        `SELECT 
          pile_id as id,
          voltage,
          current,
          power,
          temperature as tem,
          status,
          charge_percent as percent
        FROM charging_pile 
        WHERE station_id = ?
        ORDER BY pile_id ASC`,
        [station.id],
      );

      // 为每个充电桩查询使用记录
      for (const pile of piles) {
        const [records] = await pool.query(
          `SELECT 
            DATE_FORMAT(record_time, '%H:%i:%s') as time,
            CONCAT('充电', energy_consumed, '度，消费', amount, '元') as msg
          FROM pile_usage_record 
          WHERE pile_id = ? AND record_date = CURDATE()
          ORDER BY record_time DESC
          LIMIT 10`,
          [pile.id],
        );
        pile.record = records;
      }

      result.push({
        id: station.id,
        name: station.name,
        list: piles,
      });
    }

    res.json({
      code: 200,
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("获取充电桩列表失败:", error);
    res.status(500).json({
      code: 500,
      success: false,
      message: "服务器错误",
    });
  }
};
