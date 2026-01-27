-- 测试数据初始化脚本
USE charging_station;

-- 插入测试用户（如果不存在）
-- 用户名: test123456  密码: 123456
INSERT IGNORE INTO users (username, password, department, role) 
VALUES ('test123456', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '技术部', 'user');

-- 插入示例充电桩数据
INSERT IGNORE INTO charging_stations (station_code, station_name, location, latitude, longitude, power_capacity, status, type) VALUES
('CS001', '绿闪桩-总部1号', '北京市朝阳区科技园区A座', 39.9042, 116.4074, 120.00, 'online', 'DC'),
('CS002', '绿闪桩-总部2号', '北京市朝阳区科技园区B座', 39.9052, 116.4084, 60.00, 'online', 'AC'),
('CS003', '绿闪桩-分部1号', '上海市浦东新区张江高科', 31.2304, 121.4737, 120.00, 'offline', 'DC'),
('CS004', '绿闪桩-分部2号', '深圳市南山区科技园', 22.5431, 114.0579, 180.00, 'online', 'mixed');

SELECT '✅ 测试数据初始化完成' AS message;
SELECT '默认管理员账号: admin123456 / 123456' AS admin_account;
SELECT '测试用户账号: test123456 / 123456' AS test_account;
