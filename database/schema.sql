-- 创建数据库
CREATE DATABASE IF NOT EXISTS charging_station CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE charging_station;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT '密码（加密）',
  department VARCHAR(100) NOT NULL COMMENT '所属部门',
  role ENUM('admin', 'user') DEFAULT 'user' COMMENT '角色',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  last_login DATETIME COMMENT '最后登录时间',
  INDEX idx_username (username),
  INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 充电桩表
CREATE TABLE IF NOT EXISTS charging_stations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  station_code VARCHAR(50) UNIQUE NOT NULL COMMENT '充电桩编号',
  station_name VARCHAR(100) NOT NULL COMMENT '充电桩名称',
  location VARCHAR(255) NOT NULL COMMENT '位置',
  latitude DECIMAL(10, 7) COMMENT '纬度',
  longitude DECIMAL(10, 7) COMMENT '经度',
  power_capacity DECIMAL(10, 2) NOT NULL COMMENT '功率容量(kW)',
  status ENUM('online', 'offline', 'maintenance', 'fault') DEFAULT 'offline' COMMENT '状态',
  type ENUM('AC', 'DC', 'mixed') NOT NULL COMMENT '充电桩类型',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_station_code (station_code),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='充电桩表';

-- 充电订单表
CREATE TABLE IF NOT EXISTS charging_orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_no VARCHAR(50) UNIQUE NOT NULL COMMENT '订单号',
  user_id INT NOT NULL COMMENT '用户ID',
  station_id INT NOT NULL COMMENT '充电桩ID',
  start_time DATETIME NOT NULL COMMENT '开始时间',
  end_time DATETIME COMMENT '结束时间',
  energy_consumed DECIMAL(10, 2) COMMENT '消耗电量(kWh)',
  amount DECIMAL(10, 2) COMMENT '金额',
  status ENUM('charging', 'completed', 'cancelled') DEFAULT 'charging' COMMENT '订单状态',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (station_id) REFERENCES charging_stations(id) ON DELETE CASCADE,
  INDEX idx_order_no (order_no),
  INDEX idx_user_id (user_id),
  INDEX idx_station_id (station_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='充电订单表';

-- 部门表
CREATE TABLE IF NOT EXISTS departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  dept_name VARCHAR(100) UNIQUE NOT NULL COMMENT '部门名称',
  dept_code VARCHAR(50) UNIQUE NOT NULL COMMENT '部门编码',
  description TEXT COMMENT '部门描述',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_dept_code (dept_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- 插入默认管理员账号
-- 用户名: admin123456  密码: 123456
INSERT INTO users (username, password, department, role) 
VALUES ('admin123456', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '管理部', 'admin')
ON DUPLICATE KEY UPDATE username=username;

-- 插入示例部门数据
INSERT INTO departments (dept_name, dept_code, description) VALUES
('管理部', 'DEPT001', '负责整体管理和协调'),
('运维部', 'DEPT002', '负责充电桩运维'),
('财务部', 'DEPT003', '负责财务管理'),
('技术部', 'DEPT004', '负责技术支持');
