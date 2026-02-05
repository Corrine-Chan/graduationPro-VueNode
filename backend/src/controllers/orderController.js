import { query } from "../config/database.js";

// 获取订单列表
export const getOrderList = async (req, res, next) => {
  try {
    const {
      orderNo = "",
      status = 1,
      no = "",
      name = "",
      startDate = "",
      endDate = "",
      page = 1,
      pageSize = 10,
    } = req.body;

    // 构建查询条件
    let conditions = [];
    let params = [];

    if (orderNo) {
      conditions.push("order_no = ?");
      params.push(orderNo);
    }

    if (status !== 1) {
      conditions.push("status = ?");
      params.push(status);
    }

    if (no) {
      conditions.push("equipment_no LIKE ?");
      params.push(`%${no}%`);
    }

    if (name) {
      conditions.push("station_name LIKE ?");
      params.push(`%${name}%`);
    }

    if (startDate && endDate) {
      conditions.push("order_date BETWEEN ? AND ?");
      params.push(startDate, endDate);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM charging_orders ${whereClause}`;
    const countResult = await query(countSql, params);
    const total = countResult[0].total;

    // 查询列表数据
    const offset = (page - 1) * pageSize;
    const listSql = `
      SELECT 
        order_no as orderNo,
        equipment_no as equipmentNo,
        order_date as date,
        start_time as startTime,
        end_time as endTime,
        total_amount as money,
        payment_method as pay,
        status
      FROM charging_orders 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    // 确保pageSize和offset是整数
    const list = await query(listSql, [
      ...params,
      parseInt(pageSize),
      parseInt(offset),
    ]);

    res.json({
      code: 200,
      success: true,
      data: {
        list,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 获取订单详情
export const getOrderDetail = async (req, res, next) => {
  try {
    const { orderNo } = req.body;

    if (!orderNo) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "订单号不能为空",
      });
    }

    const sql = `
      SELECT 
        order_no as orderNo,
        equipment_no as equipmentNo,
        station_id as stationId,
        station_name as stationName,
        city,
        order_date as orderDate,
        start_time as startTime,
        end_time as endTime,
        charging_duration as chargingDuration,
        energy_consumed as energyConsumed,
        equipment_type as equipmentType,
        total_amount as totalAmount,
        electricity_fee as electricityFee,
        service_fee as serviceFee,
        parking_fee as parkingFee,
        payment_method as paymentMethod,
        status,
        manager_name as managerName,
        manager_tel as managerTel,
        maintenance_name as maintenanceName,
        maintenance_tel as maintenanceTel,
        charge_info as chargeInfo,
        remarks
      FROM charging_orders 
      WHERE order_no = ?
    `;

    const result = await query(sql, [orderNo]);

    if (result.length === 0) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: "订单不存在",
      });
    }

    res.json({
      code: 200,
      success: true,
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
};

// 批量删除订单
export const batchDeleteOrders = async (req, res, next) => {
  try {
    const { order } = req.body;

    if (!order || !Array.isArray(order) || order.length === 0) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "请选择要删除的订单",
      });
    }

    const placeholders = order.map(() => "?").join(",");
    const sql = `DELETE FROM charging_orders WHERE order_no IN (${placeholders})`;

    await query(sql, order);

    res.json({
      code: 200,
      success: true,
      data: `成功删除 ${order.length} 个订单`,
    });
  } catch (error) {
    next(error);
  }
};

// 单个删除订单
export const singleDeleteOrder = async (req, res, next) => {
  try {
    const { orderNo } = req.body;

    if (!orderNo) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "订单号不能为空",
      });
    }

    const sql = `DELETE FROM charging_orders WHERE order_no = ?`;
    const result = await query(sql, [orderNo]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: "订单不存在",
      });
    }

    res.json({
      code: 200,
      success: true,
      data: "订单删除成功",
    });
  } catch (error) {
    next(error);
  }
};

// 获取城市列表
export const getCityList = async (req, res, next) => {
  try {
    const sql = `
      SELECT DISTINCT city 
      FROM charging_orders 
      ORDER BY city
    `;

    const result = await query(sql, []);
    const cityList = result.map((item) => item.city);

    res.json({
      code: 200,
      success: true,
      data: cityList,
    });
  } catch (error) {
    next(error);
  }
};
