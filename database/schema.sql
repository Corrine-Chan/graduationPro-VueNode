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
  latitude DECIMAL(10, 6) COMMENT '纬度',
  longitude DECIMAL(11, 6) COMMENT '经度',
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

-- 插入示例部门数据
INSERT INTO departments (dept_name, dept_code, description) VALUES
('管理部', 'DEPT001', '负责整体管理和协调'),
('运维部', 'DEPT002', '负责充电桩运维'),
('财务部', 'DEPT003', '负责财务管理'),
('技术部', 'DEPT004', '负责技术支持')
ON DUPLICATE KEY UPDATE dept_name=dept_name;

-- 插入默认管理员账号
-- 用户名: admin123456  密码: 123456
INSERT INTO users (username, password, department, role) 
VALUES ('admin123456', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '管理部', 'admin')
ON DUPLICATE KEY UPDATE username=username;

-- 充电站监控表
CREATE TABLE IF NOT EXISTS station_monitor (
  id INT PRIMARY KEY AUTO_INCREMENT,
  station_id VARCHAR(50) UNIQUE NOT NULL COMMENT '站点ID',
  station_name VARCHAR(200) NOT NULL COMMENT '站点名称',
  city VARCHAR(50) NOT NULL COMMENT '所属城市',
  fast_charge INT NOT NULL DEFAULT 0 COMMENT '快充数量',
  slow_charge INT NOT NULL DEFAULT 0 COMMENT '慢充数量',
  status TINYINT NOT NULL DEFAULT 2 COMMENT '状态: 2-使用中 3-空闲中 4-维护中 5-待维修',
  charging_now INT NOT NULL DEFAULT 0 COMMENT '正在充电数量',
  fault_count INT NOT NULL DEFAULT 0 COMMENT '故障数',
  manager_name VARCHAR(50) NOT NULL COMMENT '站点负责人',
  manager_tel VARCHAR(20) NOT NULL COMMENT '负责人电话',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_station_id (station_id),
  INDEX idx_city (city),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='充电站监控表';

-- 充电站营收统计表
CREATE TABLE IF NOT EXISTS station_revenue (
  id INT PRIMARY KEY AUTO_INCREMENT,
  station_id VARCHAR(50) NOT NULL COMMENT '站点ID',
  station_name VARCHAR(200) NOT NULL COMMENT '站点名称',
  city VARCHAR(50) NOT NULL COMMENT '所属城市',
  pile_count INT NOT NULL DEFAULT 0 COMMENT '充电桩总数量',
  electricity_fee DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '电费营收(元)',
  parking_fee DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '停车费营收(元)',
  service_fee DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '服务费营收(元)',
  member_recharge DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '会员储值金(元)',
  daily_total DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '单日总收入(元)',
  monthly_total DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '月度总收入(万元)',
  daily_growth_rate DECIMAL(5, 2) NOT NULL DEFAULT 0 COMMENT '日增长率(%)',
  monthly_growth_rate DECIMAL(5, 2) NOT NULL DEFAULT 0 COMMENT '月增长率(%)',
  stat_date DATE NOT NULL COMMENT '统计日期',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_station_id (station_id),
  INDEX idx_city (city),
  INDEX idx_stat_date (stat_date),
  UNIQUE KEY uk_station_date (station_id, stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='充电站营收统计表';

-- 营收图表数据表（月度统计）
CREATE TABLE IF NOT EXISTS revenue_chart (
  id INT PRIMARY KEY AUTO_INCREMENT,
  month TINYINT NOT NULL COMMENT '月份(1-12)',
  sales_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '销售额(万元)',
  visit_count INT NOT NULL DEFAULT 0 COMMENT '访问量',
  stat_year INT NOT NULL COMMENT '统计年份',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY uk_year_month (stat_year, month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='营收图表数据表';


-- 插入营收统计示例数据（当前日期）
INSERT INTO station_revenue (station_id, station_name, city, pile_count, electricity_fee, parking_fee, service_fee, member_recharge, daily_total, monthly_total, daily_growth_rate, monthly_growth_rate, stat_date) VALUES
('VXZ10001', '北京西单充电站', '北京', 135, 7563.00, 2356.00, 5633.00, 2698.00, 18250.00, 2155.00, -5.30, 2.30, CURDATE()),
('VXZ10002', '上海陆家嘴充电站', '上海', 125, 8000.00, 3000.00, 7000.00, 3500.00, 21500.00, 5000.00, 2.50, 2.40, CURDATE()),
('VXZ10003', '广州花城广场充电站', '广州', 123, 8200.00, 3100.00, 7100.00, 3600.00, 22000.00, 5200.00, 3.00, 3.50, CURDATE()),
('VXZ10004', '深圳大梅沙充电站', '深圳', 110, 7800.00, 2900.00, 6900.00, 3400.00, 21000.00, 4900.00, -1.80, -2.60, CURDATE()),
('VXZ10005', '成都天府广场充电站', '成都', 125, 8300.00, 3200.00, 7200.00, 3700.00, 22400.00, 5300.00, 3.50, -0.10, CURDATE()),
('VXZ10006', '西安钟楼充电站', '西安', 115, 7900.00, 2950.00, 7050.00, 3450.00, 21350.00, 5100.00, -2.20, -0.80, CURDATE()),
('VXZ10007', '杭州西湖充电站', '杭州', 104, 7600.00, 2800.00, 6800.00, 3300.00, 20500.00, 4800.00, 1.50, 0.70, CURDATE()),
('VXZ10008', '南京夫子庙充电站', '南京', 129, 8400.00, 3250.00, 7250.00, 3750.00, 22650.00, 5400.00, 4.00, 6.20, CURDATE()),
('VXZ10009', '天津意大利风情区充电站', '天津', 123, 8150.00, 3100.00, 7100.00, 3500.00, 21850.00, 5150.00, -2.80, -0.40, CURDATE()),
('VXZ10010', '青岛栈桥充电站', '青岛', 123, 8100.00, 3050.00, 7050.00, 3450.00, 21650.00, 5100.00, 2.70, 3.40, CURDATE()),
('VXZ10011', '武汉黄鹤楼充电站', '武汉', 102, 7400.00, 2700.00, 6700.00, 3250.00, 20050.00, 4700.00, 1.20, 0.60, CURDATE()),
('VXZ10012', '福州三坊七巷充电站', '福州', 107, 7650.00, 2850.00, 6850.00, 3350.00, 20700.00, 4850.00, 1.70, 1.30, CURDATE()),
('VXZ10013', '合肥包公园充电站', '合肥', 100, 7200.00, 2600.00, 6600.00, 3200.00, 19600.00, 4600.00, -0.90, 0.50, CURDATE()),
('VXZ10014', '重庆解放碑充电站', '重庆', 117, 7950.00, 3000.00, 7100.00, 3500.00, 21550.00, 5150.00, 2.60, 3.10, CURDATE()),
('VXZ10015', '桂林漓江充电站', '桂林', 106, 7700.00, 2800.00, 6900.00, 3400.00, 20800.00, 4950.00, 2.00, -1.50, CURDATE()),
('VXZ10016', '苏州园区充电站', '苏州', 115, 7900.00, 2950.00, 7050.00, 3450.00, 21350.00, 5100.00, 2.30, 0.90, CURDATE()),
('VXZ10017', '昆明滇池充电站', '昆明', 112, 7800.00, 2900.00, 7000.00, 3400.00, 21100.00, 5050.00, -2.10, 0.80, CURDATE()),
('VXZ10018', '南宁青秀山充电站', '南宁', 117, 7900.00, 2950.00, 7050.00, 3450.00, 21350.00, 5100.00, -2.40, -2.70, CURDATE()),
('VXZ10019', '长沙橘子洲头充电站', '长沙', 112, 7750.00, 2850.00, 6950.00, 3350.00, 20900.00, 4950.00, -1.90, -1.10, CURDATE()),
('VXZ10020', '哈尔滨中央大街充电站', '哈尔滨', 107, 7650.00, 2800.00, 6800.00, 3300.00, 20550.00, 4850.00, 1.60, -0.90, CURDATE()),
('VXZ10021', '石家庄正定古城充电站', '石家庄', 103, 7500.00, 2750.00, 6750.00, 3250.00, 20250.00, 4750.00, 1.30, 2.80, CURDATE()),
('VXZ10022', '兰州黄河桥充电站', '兰州', 126, 8200.00, 3150.00, 7150.00, 3550.00, 22050.00, 5200.00, 3.10, 4.40, CURDATE()),
('VXZ10023', '济南大明湖充电站', '济南', 132, 8400.00, 3250.00, 7250.00, 3650.00, 22550.00, 5350.00, -3.70, -5.50, CURDATE()),
('VXZ10024', '沈阳故宫充电站', '沈阳', 108, 7700.00, 2850.00, 6850.00, 3350.00, 20750.00, 4900.00, 1.80, -2.30, CURDATE()),
('VXZ10025', '福州西湖充电站', '福州', 113, 7850.00, 2950.00, 6950.00, 3400.00, 21150.00, 5050.00, 2.00, 2.20, CURDATE()),
('VXZ10026', '无锡灵山大佛充电站', '无锡', 123, 8100.00, 3050.00, 7050.00, 3500.00, 21700.00, 5150.00, -2.80, -3.20, CURDATE()),
('VXZ10027', '郑州二七广场充电站', '郑州', 120, 8000.00, 3000.00, 7000.00, 3450.00, 21450.00, 5100.00, 2.40, 0.80, CURDATE()),
('VXZ10028', '大连星海广场充电站', '大连', 117, 7950.00, 3000.00, 7100.00, 3500.00, 21550.00, 5150.00, 2.60, 3.90, CURDATE()),
('VXZ10029', '宁波天一广场充电站', '宁波', 130, 8250.00, 3150.00, 7150.00, 3550.00, 22100.00, 5250.00, -3.40, -2.30, CURDATE()),
('VXZ10030', '贵阳甲秀楼充电站', '贵阳', 114, 7850.00, 2950.00, 6950.00, 3400.00, 21150.00, 5050.00, 2.20, -1.40, CURDATE()),
('VXZ10031', '珠海长隆海洋王国充电站', '珠海', 114, 7850.00, 2950.00, 6950.00, 3400.00, 21150.00, 5050.00, 2.20, 1.80, CURDATE()),
('VXZ10032', '天津滨海新区充电站', '天津', 129, 8350.00, 3200.00, 7200.00, 3600.00, 22350.00, 5300.00, -3.60, -2.60, CURDATE())
ON DUPLICATE KEY UPDATE 
  electricity_fee = VALUES(electricity_fee),
  parking_fee = VALUES(parking_fee),
  service_fee = VALUES(service_fee),
  member_recharge = VALUES(member_recharge),
  daily_total = VALUES(daily_total),
  monthly_total = VALUES(monthly_total),
  daily_growth_rate = VALUES(daily_growth_rate),
  monthly_growth_rate = VALUES(monthly_growth_rate);

-- 插入营收图表数据（2026年月度数据）
INSERT INTO revenue_chart (month, sales_amount, visit_count, stat_year) VALUES
(1, 60.00, 600, 2026),
(2, 40.00, 400, 2026),
(3, 120.00, 600, 2026),
(4, 140.00, 700, 2026),
(5, 160.00, 800, 2026),
(6, 80.00, 400, 2026),
(7, 140.00, 700, 2026),
(8, 120.00, 900, 2026),
(9, 110.00, 600, 2026),
(10, 90.00, 500, 2026),
(11, 60.00, 800, 2026),
(12, 80.00, 600, 2026)
ON DUPLICATE KEY UPDATE 
  sales_amount = VALUES(sales_amount),
  visit_count = VALUES(visit_count);
