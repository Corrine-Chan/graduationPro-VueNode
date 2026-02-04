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

-- 充电桩详情表
CREATE TABLE IF NOT EXISTS charging_pile (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pile_id VARCHAR(50) NOT NULL COMMENT '充电桩ID',
  station_id VARCHAR(50) NOT NULL COMMENT '所属充电站ID',
  station_name VARCHAR(200) NOT NULL COMMENT '所属充电站名称',
  voltage VARCHAR(20) NOT NULL DEFAULT '314v' COMMENT '电压',
  current VARCHAR(20) NOT NULL DEFAULT '212.2A' COMMENT '电流',
  power VARCHAR(20) NOT NULL DEFAULT '21KW' COMMENT '功率',
  temperature VARCHAR(20) NOT NULL DEFAULT '32°c' COMMENT '温度',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 1-空闲 2-充电中 3-连接中 4-排队中 5-被预约 6-故障/离线',
  charge_percent VARCHAR(10) COMMENT '充电进度百分比',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_pile_id (pile_id),
  INDEX idx_station_id (station_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='充电桩详情表';

-- 充电桩使用记录表
CREATE TABLE IF NOT EXISTS pile_usage_record (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pile_id VARCHAR(50) NOT NULL COMMENT '充电桩ID',
  record_time TIME NOT NULL COMMENT '记录时间',
  energy_consumed DECIMAL(10, 2) NOT NULL COMMENT '充电度数',
  amount DECIMAL(10, 2) NOT NULL COMMENT '消费金额',
  record_date DATE NOT NULL DEFAULT (CURDATE()) COMMENT '记录日期',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_pile_id (pile_id),
  INDEX idx_record_date (record_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='充电桩使用记录表';


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


-- 插入充电桩详情示例数据（北京西单充电站的充电桩）
INSERT INTO charging_pile (pile_id, station_id, station_name, voltage, current, power, temperature, status, charge_percent) VALUES
('CD1001', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '32°c', 1, NULL),
('CD1002', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '29°c', 2, '70%'),
('CD1003', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '32°c', 1, NULL),
('CD1004', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '30°c', 2, '70%'),
('CD1005', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '30°c', 2, '70%'),
('CD1006', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '28°c', 2, '70%'),
('CD1007', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '32°c', 6, NULL),
('CD1008', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '31°c', 2, '70%'),
('CD1009', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '32°c', 1, NULL),
('CD1010', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '32°c', 4, NULL),
('CD1011', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '32°c', 1, NULL),
('CD1012', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '32°c', 4, NULL),
('CD1013', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '32°c', 1, NULL),
('CD1014', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '32°c', 5, NULL),
('CD1015', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '32°c', 1, NULL),
('CD1016', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '32°c', 2, '70%'),
('CD1017', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '32°c', 6, NULL),
('CD1018', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '32°c', 6, NULL),
('CD1019', 'VXZ10001', '北京西单充电站', '314v', '212.2A', '21KW', '32°c', 6, NULL)
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- 插入充电桩使用记录示例数据（CD1001的使用记录）
INSERT INTO pile_usage_record (pile_id, record_time, energy_consumed, amount, record_date) VALUES
('CD1001', '12:08:17', 80.00, 80.00, CURDATE()),
('CD1001', '13:12:09', 50.00, 50.00, CURDATE()),
('CD1001', '13:15:22', 60.00, 60.00, CURDATE()),
('CD1001', '16:22:33', 70.00, 70.00, CURDATE()),
('CD1001', '17:27:17', 90.00, 90.00, CURDATE()),
('CD1001', '18:08:33', 100.00, 100.00, CURDATE())
ON DUPLICATE KEY UPDATE energy_consumed = VALUES(energy_consumed);

-- 充电桩维修记录表
CREATE TABLE IF NOT EXISTS pile_maintenance_record (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pile_id VARCHAR(50) NOT NULL COMMENT '充电桩ID',
  station_id VARCHAR(50) NOT NULL COMMENT '所属充电站ID',
  fault_type VARCHAR(100) NOT NULL COMMENT '故障类型',
  fault_description TEXT COMMENT '故障描述',
  maintenance_type TINYINT NOT NULL DEFAULT 1 COMMENT '维修类型: 1-日常维护 2-故障维修 3-紧急抢修',
  maintenance_status TINYINT NOT NULL DEFAULT 1 COMMENT '维修状态: 1-待维修 2-维修中 3-已完成',
  technician_name VARCHAR(50) COMMENT '维修技师',
  start_time DATETIME COMMENT '开始维修时间',
  end_time DATETIME COMMENT '完成维修时间',
  maintenance_cost DECIMAL(10, 2) DEFAULT 0 COMMENT '维修费用(元)',
  maintenance_note TEXT COMMENT '维修备注',
  record_date DATE NOT NULL DEFAULT (CURDATE()) COMMENT '记录日期',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_pile_id (pile_id),
  INDEX idx_station_id (station_id),
  INDEX idx_record_date (record_date),
  INDEX idx_maintenance_status (maintenance_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='充电桩维修记录表';

-- 插入示例维修记录数据（CD1001的维修记录）
INSERT INTO pile_maintenance_record 
(pile_id, station_id, fault_type, fault_description, maintenance_type, maintenance_status, technician_name, start_time, end_time, maintenance_cost, maintenance_note, record_date) 
VALUES
('CD1001', 'VXZ10001', '电压异常', '充电桩电压波动较大，需要检查电路', 2, 3, '张师傅', '2026-02-01 09:00:00', '2026-02-01 11:30:00', 350.00, '更换了稳压器，测试正常', CURDATE()),
('CD1001', 'VXZ10001', '定期保养', '季度例行保养检查', 1, 3, '李师傅', '2026-01-15 14:00:00', '2026-01-15 15:30:00', 150.00, '清洁设备，检查线路，一切正常', CURDATE()),
('CD1007', 'VXZ10001', '通信故障', '充电桩无法与后台通信', 2, 3, '王师傅', '2026-02-02 10:00:00', '2026-02-02 12:00:00', 280.00, '更换通信模块，恢复正常', CURDATE()),
('CD1017', 'VXZ10001', '显示屏故障', '显示屏黑屏无显示', 2, 2, '赵师傅', '2026-02-03 08:30:00', NULL, 0, '正在维修中，等待配件到货', CURDATE()),
('CD1018', 'VXZ10001', '充电接口损坏', '充电接口松动，无法正常充电', 3, 1, NULL, NULL, NULL, 0, '待安排维修', CURDATE()),
('CD1019', 'VXZ10001', '散热系统故障', '散热风扇不转，温度过高', 2, 1, NULL, NULL, NULL, 0, '已报修，等待维修人员', CURDATE())
ON DUPLICATE KEY UPDATE 
  fault_description = VALUES(fault_description),
  maintenance_status = VALUES(maintenance_status);

-- 创建地图站点表
CREATE TABLE IF NOT EXISTS map_stations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  station_id VARCHAR(50) UNIQUE NOT NULL COMMENT '站点ID',
  station_name VARCHAR(200) NOT NULL COMMENT '站点名称',
  address VARCHAR(255) NOT NULL COMMENT '站点地址',
  longitude DECIMAL(11, 8) NOT NULL COMMENT '经度',
  latitude DECIMAL(10, 8) NOT NULL COMMENT '纬度',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 1-空闲 2-使用中 3-维护中 4-故障 5-待维修',
  pile_count INT NOT NULL DEFAULT 0 COMMENT '充电桩数量',
  is_active TINYINT NOT NULL DEFAULT 1 COMMENT '是否启用: 0-未启用 1-已启用',
  remarks TEXT COMMENT '备注信息',
  operator VARCHAR(50) COMMENT '操作员',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_station_id (station_id),
  INDEX idx_status (status),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='地图站点表';

-- 插入示例地图站点数据
INSERT INTO map_stations (station_id, station_name, address, longitude, latitude, status, pile_count, is_active) VALUES
('VXZ10001', '北京西单充电站', '北京市西城区西单北大街', 116.395645, 39.90923, 1, 135, 1),
('VXZ10002', '上海陆家嘴充电站', '上海市浦东新区陆家嘴环路', 121.491121, 31.236222, 2, 125, 1),
('VXZ10003', '广州花城广场充电站', '广州市天河区花城广场', 113.32452, 23.097418, 2, 123, 1),
('VXZ10004', '深圳大梅沙充电站', '深圳市盐田区大梅沙', 114.156836, 22.283758, 1, 110, 1),
('VXZ10005', '成都天府广场充电站', '成都市锦江区天府广场', 104.065735, 30.659462, 5, 125, 1),
('VXZ10006', '西安钟楼充电站', '西安市碑林区钟楼', 108.948024, 34.263161, 4, 115, 1),
('VXZ10007', '杭州西湖充电站', '杭州市西湖区西湖景区', 120.15507, 30.274084, 1, 104, 1),
('VXZ10008', '南京夫子庙充电站', '南京市秦淮区夫子庙', 118.796877, 32.060255, 2, 129, 1),
('VXZ10009', '天津意大利风情区充电站', '天津市河北区意大利风情区', 117.200983, 39.084158, 2, 123, 1),
('VXZ10010', '青岛栈桥充电站', '青岛市市南区栈桥', 120.308949, 36.065319, 1, 123, 1),
('VXZ10011', '武汉黄鹤楼充电站', '武汉市武昌区黄鹤楼', 114.305393, 30.593099, 2, 102, 1),
('VXZ10012', '福州三坊七巷充电站', '福州市鼓楼区三坊七巷', 119.296494, 26.074507, 4, 107, 1),
('VXZ10013', '合肥包公园充电站', '合肥市包河区包公园', 117.283042, 31.86119, 2, 100, 1),
('VXZ10014', '重庆解放碑充电站', '重庆市渝中区解放碑', 106.551556, 29.563009, 2, 117, 1),
('VXZ10015', '桂林漓江充电站', '桂林市象山区漓江', 110.290195, 25.273566, 2, 106, 1),
('VXZ10016', '苏州园区充电站', '苏州市工业园区', 120.619585, 31.299379, 2, 115, 1),
('VXZ10017', '昆明滇池充电站', '昆明市西山区滇池', 102.833218, 24.879659, 1, 112, 1),
('VXZ10018', '南宁青秀山充电站', '南宁市青秀区青秀山', 108.327546, 22.815478, 2, 117, 1),
('VXZ10019', '长沙橘子洲头充电站', '长沙市岳麓区橘子洲', 112.938814, 28.228209, 2, 112, 1),
('VXZ10020', '哈尔滨中央大街充电站', '哈尔滨市道里区中央大街', 126.534967, 45.802664, 2, 107, 1),
('VXZ10021', '石家庄正定古城充电站', '石家庄市正定县古城', 114.514859, 38.042306, 4, 103, 1),
('VXZ10022', '兰州黄河桥充电站', '兰州市城关区黄河桥', 103.834302, 36.061089, 5, 126, 1),
('VXZ10023', '济南大明湖充电站', '济南市历下区大明湖', 116.994929, 36.682785, 1, 132, 1),
('VXZ10024', '沈阳故宫充电站', '沈阳市沈河区故宫', 123.431474, 41.805699, 4, 108, 1),
('VXZ10025', '福州西湖充电站', '福州市鼓楼区西湖公园', 119.302444, 26.080429, 2, 113, 1),
('VXZ10026', '无锡灵山大佛充电站', '无锡市滨湖区灵山', 120.31191, 31.498809, 1, 123, 1),
('VXZ10027', '郑州二七广场充电站', '郑州市二七区二七广场', 113.558519, 34.857641, 1, 120, 1),
('VXZ10028', '大连星海广场充电站', '大连市沙河口区星海广场', 121.614682, 38.914003, 2, 117, 1),
('VXZ10029', '宁波天一广场充电站', '宁波市海曙区天一广场', 121.551918, 29.874058, 4, 130, 1),
('VXZ10030', '贵阳甲秀楼充电站', '贵阳市南明区甲秀楼', 106.713478, 26.578343, 1, 114, 1),
('VXZ10031', '珠海长隆海洋王国充电站', '珠海市横琴新区长隆', 113.58239, 22.276949, 1, 114, 1),
('VXZ10032', '天津滨海新区充电站', '天津市滨海新区', 117.701648, 39.041746, 1, 129, 1)
ON DUPLICATE KEY UPDATE 
  station_name = VALUES(station_name),
  pile_count = VALUES(pile_count),
  status = VALUES(status);
