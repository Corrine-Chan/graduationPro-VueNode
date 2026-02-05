import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 测试数据库连接
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ 数据库连接成功");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ 数据库连接失败:", error.message);
    return false;
  }
};

// 执行查询
export const query = async (sql, params = []) => {
  try {
    // 统一使用query方法，它能更好地处理各种参数类型
    const [rows] = await pool.query(sql, params);
    return rows;
  } catch (error) {
    console.error("数据库查询错误:", error.message);
    console.error("SQL:", sql);
    console.error("参数:", params);
    throw error;
  }
};

export default pool;
