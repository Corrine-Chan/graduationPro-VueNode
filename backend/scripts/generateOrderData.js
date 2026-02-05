import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量
dotenv.config({ path: join(__dirname, "../.env") });

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "charging_station",
  port: parseInt(process.env.DB_PORT) || 3306,
};

// 充电站数据
const stations = [
  {
    id: "VXZ10001",
    name: "北京西单充电站",
    city: "北京",
    manager: "张伟",
    tel: "17876554801",
  },
  {
    id: "VXZ10002",
    name: "上海陆家嘴充电站",
    city: "上海",
    manager: "李娜",
    tel: "17876554802",
  },
  {
    id: "VXZ10003",
    name: "广州花城广场充电站",
    city: "广州",
    manager: "王强",
    tel: "17876554803",
  },
  {
    id: "VXZ10004",
    name: "深圳大梅沙充电站",
    city: "深圳",
    manager: "赵敏",
    tel: "17876554804",
  },
  {
    id: "VXZ10005",
    name: "成都天府广场充电站",
    city: "成都",
    manager: "李晓华",
    tel: "17876554805",
  },
  {
    id: "VXZ10006",
    name: "西安钟楼充电站",
    city: "西安",
    manager: "刘伟",
    tel: "17876554806",
  },
  {
    id: "VXZ10007",
    name: "杭州西湖充电站",
    city: "杭州",
    manager: "陈芳",
    tel: "17876554807",
  },
  {
    id: "VXZ10008",
    name: "南京夫子庙充电站",
    city: "南京",
    manager: "黄伟",
    tel: "17876554808",
  },
  {
    id: "VXZ10009",
    name: "天津意大利风情区充电站",
    city: "天津",
    manager: "吴敏",
    tel: "17876554809",
  },
  {
    id: "VXZ10010",
    name: "青岛栈桥充电站",
    city: "青岛",
    manager: "杨杰",
    tel: "17876554810",
  },
];

// 维保人员
const maintenanceStaff = [
  { name: "李四", tel: "13563456543" },
  { name: "王五", tel: "13812345678" },
  { name: "赵六", tel: "13698765432" },
  { name: "孙七", tel: "13745678901" },
  { name: "周八", tel: "13856789012" },
];

// 支付方式
const paymentMethods = ["微信", "支付宝", "储值卡"];

// 订单状态
const orderStatus = [2, 3, 4]; // 2-进行中 3-已完成 4-异常

// 设备类型
const equipmentTypes = ["充电桩(快充)", "充电桩(慢充)", "充电杆"];

// 生成随机数
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成随机小数
function randomFloat(min, max, decimals = 2) {
  return (Math.random() * (max - min) + min).toFixed(decimals);
}

// 生成随机日期
function randomDate(start, end) {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
  return date.toISOString().split("T")[0];
}

// 生成随机时间
function randomTime() {
  const hour = String(randomInt(0, 23)).padStart(2, "0");
  const minute = String(randomInt(0, 59)).padStart(2, "0");
  const second = String(randomInt(0, 59)).padStart(2, "0");
  return `${hour}:${minute}:${second}`;
}

// 生成订单号
function generateOrderNo() {
  const timestamp = Date.now();
  const random = randomInt(100000, 999999);
  return `${timestamp}${random}`;
}

// 生成设备编号
function generateEquipmentNo() {
  return `CD${randomInt(1000, 9999)}`;
}

// 生成订单数据
async function generateOrders() {
  let connection;

  try {
    console.log("正在连接数据库...");
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ 数据库连接成功");

    // 不再清空现有订单数据，而是追加新数据
    console.log("\n正在生成新订单数据（追加模式）...");
    const orders = [];
    const orderCount = 10; // 生成10条订单

    const startDate = new Date("2025-01-01");
    const endDate = new Date();

    for (let i = 0; i < orderCount; i++) {
      const station = stations[randomInt(0, stations.length - 1)];
      const maintenance =
        maintenanceStaff[randomInt(0, maintenanceStaff.length - 1)];
      const status = orderStatus[randomInt(0, orderStatus.length - 1)];
      const paymentMethod =
        paymentMethods[randomInt(0, paymentMethods.length - 1)];
      const equipmentType =
        equipmentTypes[randomInt(0, equipmentTypes.length - 1)];

      const orderDate = randomDate(startDate, endDate);
      const startTime = randomTime();
      const endTime = status === 3 ? randomTime() : null; // 只有已完成的订单有结束时间

      const chargingDuration =
        status === 3 ? parseFloat(randomFloat(0.5, 8, 2)) : null;
      const energyConsumed =
        status === 3 ? parseFloat(randomFloat(10, 150, 2)) : null;

      const electricityFee = energyConsumed
        ? parseFloat((energyConsumed * 1.2).toFixed(2))
        : 0;
      const serviceFee = parseFloat(randomFloat(5, 15, 2));
      const parkingFee = chargingDuration
        ? parseFloat((chargingDuration * 2).toFixed(2))
        : 0;
      const totalAmount = parseFloat(
        (electricityFee + serviceFee + parkingFee).toFixed(2),
      );

      const chargeInfo = `电费+服务费+停车费，高峰时段费用为${randomFloat(1.5, 2.5, 1)}元一度，停车费2元/小时，服务费${serviceFee}元/次`;

      orders.push([
        generateOrderNo(),
        generateEquipmentNo(),
        station.id,
        station.name,
        station.city,
        orderDate,
        startTime,
        endTime,
        chargingDuration,
        energyConsumed,
        equipmentType,
        totalAmount,
        electricityFee,
        serviceFee,
        parkingFee,
        paymentMethod,
        status,
        station.manager,
        station.tel,
        maintenance.name,
        maintenance.tel,
        chargeInfo,
        status === 4 ? "订单异常，需要人工处理" : "暂无",
      ]);
    }

    // 批量插入订单数据
    const insertSql = `
      INSERT INTO charging_orders (
        order_no, equipment_no, station_id, station_name, city,
        order_date, start_time, end_time, charging_duration, energy_consumed,
        equipment_type, total_amount, electricity_fee, service_fee, parking_fee,
        payment_method, status, manager_name, manager_tel, maintenance_name,
        maintenance_tel, charge_info, remarks
      ) VALUES ?
    `;

    await connection.query(insertSql, [orders]);
    console.log(`✅ 成功生成 ${orderCount} 条新订单数据`);

    // 显示统计信息
    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) as ongoing,
        SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 4 THEN 1 ELSE 0 END) as abnormal
      FROM charging_orders
    `);

    console.log("\n📊 订单统计（总数）:");
    console.log(`   总订单数: ${stats[0].total}`);
    console.log(`   进行中: ${stats[0].ongoing}`);
    console.log(`   已完成: ${stats[0].completed}`);
    console.log(`   异常: ${stats[0].abnormal}`);

    console.log("\n✅ 新订单数据生成完成！");
  } catch (error) {
    console.error("❌ 生成订单数据失败:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 执行生成
generateOrders();
