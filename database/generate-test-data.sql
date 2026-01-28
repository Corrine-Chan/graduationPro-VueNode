-- 生成测试数据
USE charging_station;

-- 1. 插入充电站数据（基于Mock数据的前10个）- 调整类型分布更均衡
INSERT INTO charging_stations (station_code, station_name, location, latitude, longitude, power_capacity, status, type) VALUES
('VXZ10001', '北京西单充电站', '北京市西城区西单北大街', 39.9042, 116.4074, 120.00, 'online', 'DC'),
('VXZ10002', '上海陆家嘴充电站', '上海市浦东新区陆家嘴环路', 31.2304, 121.4737, 90.00, 'online', 'mixed'),
('VXZ10003', '广州花城广场充电站', '广州市天河区花城广场', 23.1291, 113.2644, 85.00, 'online', 'AC'),
('VXZ10004', '深圳大梅沙充电站', '深圳市盐田区大梅沙', 22.5431, 114.0579, 110.00, 'online', 'DC'),
('VXZ10005', '成都天府广场充电站', '成都市锦江区天府广场', 30.6586, 104.0647, 125.00, 'online', 'mixed'),
('VXZ10006', '西安钟楼充电站', '西安市碑林区钟楼', 34.2583, 108.9398, 115.00, 'online', 'AC'),
('VXZ10007', '杭州西湖充电站', '杭州市西湖区西湖景区', 30.2489, 120.1363, 104.00, 'online', 'DC'),
('VXZ10008', '南京夫子庙充电站', '南京市秦淮区夫子庙', 32.0473, 118.7892, 129.00, 'online', 'mixed'),
('VXZ10009', '天津意大利风情区充电站', '天津市河北区意式风情街', 39.1235, 117.2047, 123.00, 'online', 'AC'),
('VXZ10010', '青岛栈桥充电站', '青岛市市南区栈桥', 36.0671, 120.3826, 123.00, 'online', 'mixed')
ON DUPLICATE KEY UPDATE station_name=station_name;

-- 2. 为每个充电站插入充电桩（每站10个桩）
INSERT INTO charging_piles (pile_code, station_id, voltage, current, power, temperature, status, charge_percent) 
SELECT 
  CONCAT('CD', LPAD(s.id, 4, '0'), LPAD(n.n, 3, '0')) as pile_code,
  s.id as station_id,
  '314v' as voltage,
  '212.2A' as current,
  '21KW' as power,
  CONCAT(FLOOR(25 + RAND() * 10), '°c') as temperature,
  CASE FLOOR(RAND() * 6) + 1
    WHEN 1 THEN 'idle'
    WHEN 2 THEN 'charging'
    WHEN 3 THEN 'connecting'
    WHEN 4 THEN 'queuing'
    WHEN 5 THEN 'reserved'
    ELSE 'fault'
  END as status,
  CASE 
    WHEN FLOOR(RAND() * 6) + 1 = 2 THEN CONCAT(FLOOR(50 + RAND() * 50), '%')
    ELSE NULL
  END as charge_percent
FROM charging_stations s
CROSS JOIN (
  SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
  UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
) n
WHERE s.id <= 10;

-- 3. 插入营收记录（每个站点一条记录）
INSERT INTO revenue_records (station_id, record_date, electricity_fee, parking_fee, service_fee, monthly_income, member_recharge, growth_percent, member_growth_percent)
SELECT 
  id as station_id,
  CURDATE() as record_date,
  FLOOR(7000 + RAND() * 2000) as electricity_fee,
  FLOOR(2500 + RAND() * 800) as parking_fee,
  FLOOR(6000 + RAND() * 1500) as service_fee,
  FLOOR(4500 + RAND() * 1000) as monthly_income,
  FLOOR(3000 + RAND() * 1000) as member_recharge,
  ROUND(-5 + RAND() * 10, 1) as growth_percent,
  ROUND(-3 + RAND() * 8, 1) as member_growth_percent
FROM charging_stations
WHERE id <= 10;

-- 4. 插入订单数据（50条）
INSERT INTO charging_orders (order_no, user_id, station_id, start_time, end_time, energy_consumed, amount, status)
SELECT 
  CONCAT('ORD', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(n, 6, '0')) as order_no,
  1 as user_id,
  FLOOR(1 + RAND() * 10) as station_id,
  DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY) as start_time,
  DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 29) DAY) as end_time,
  ROUND(20 + RAND() * 80, 2) as energy_consumed,
  ROUND(30 + RAND() * 120, 2) as amount,
  CASE FLOOR(RAND() * 3)
    WHEN 0 THEN 'charging'
    WHEN 1 THEN 'completed'
    ELSE 'cancelled'
  END as status
FROM (
  SELECT @row := @row + 1 as n
  FROM (SELECT 0 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
       (SELECT 0 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) t2,
       (SELECT @row := 0) r
  LIMIT 50
) numbers;

-- 5. 插入告警数据
INSERT INTO alarms (alarm_type, station_name, pile_code, description, level, status, alarm_time) VALUES
('设备故障', '北京西单充电站', 'CD00010007', '充电桩通信异常', 'high', 'pending', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('温度异常', '上海陆家嘴充电站', 'CD00020003', '充电桩温度过高', 'medium', 'processing', DATE_SUB(NOW(), INTERVAL 5 HOUR)),
('电压异常', '广州花城广场充电站', 'CD00030005', '输出电压不稳定', 'high', 'pending', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('通信故障', '深圳大梅沙充电站', 'CD00040002', '网络连接中断', 'critical', 'pending', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
('设备离线', '成都天府广场充电站', 'CD00050008', '充电桩离线', 'medium', 'resolved', DATE_SUB(NOW(), INTERVAL 2 DAY));

-- 6. 插入会员数据
INSERT INTO members (member_no, member_name, phone, balance, total_recharge, total_consumption, status, created_at, last_use_time) VALUES
('M20240001', '张三', '13800138001', 500.00, 2000.00, 1500.00, 'active', DATE_SUB(NOW(), INTERVAL 180 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
('M20240002', '李四', '13800138002', 1200.00, 5000.00, 3800.00, 'active', DATE_SUB(NOW(), INTERVAL 150 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
('M20240003', '王五', '13800138003', 80.00, 1000.00, 920.00, 'active', DATE_SUB(NOW(), INTERVAL 120 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
('M20240004', '赵六', '13800138004', 0.00, 800.00, 800.00, 'inactive', DATE_SUB(NOW(), INTERVAL 90 DAY), DATE_SUB(NOW(), INTERVAL 30 DAY)),
('M20240005', '孙七', '13800138005', 2500.00, 10000.00, 7500.00, 'active', DATE_SUB(NOW(), INTERVAL 200 DAY), NOW());

-- 7. 插入文档分类
INSERT INTO document_categories (category_name, description, sort_order) VALUES
('招商政策', '充电站招商相关政策文档', 1),
('运营指南', '充电站运营管理指南', 2),
('技术文档', '充电桩技术规范文档', 3),
('培训资料', '员工培训相关资料', 4);

-- 8. 插入文档
INSERT INTO documents (category_id, title, content, author, status, views, created_at) VALUES
(1, '2024年充电站招商优惠政策', '本年度针对新建充电站提供多项优惠政策...', '管理员', 'published', 156, DATE_SUB(NOW(), INTERVAL 30 DAY)),
(2, '充电站日常运营管理规范', '充电站日常运营需要注意的事项...', '运营部', 'published', 89, DATE_SUB(NOW(), INTERVAL 20 DAY)),
(3, '快充桩技术规范V2.0', '快充桩的技术参数和安装规范...', '技术部', 'published', 234, DATE_SUB(NOW(), INTERVAL 45 DAY)),
(4, '新员工入职培训手册', '新员工需要了解的基本知识...', 'HR部', 'published', 67, DATE_SUB(NOW(), INTERVAL 10 DAY));

-- 9. 插入消息数据
INSERT INTO messages (message_type, title, content, level, is_read, is_processed, user_id, created_at) VALUES
('系统通知', '系统维护通知', '系统将于今晚22:00-24:00进行维护', 'info', FALSE, FALSE, 1, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('设备告警', '充电桩故障告警', '北京西单充电站CD00010007号桩出现故障', 'error', FALSE, FALSE, 1, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
('订单提醒', '新订单提醒', '您有一笔新的充电订单', 'info', TRUE, TRUE, 1, DATE_SUB(NOW(), INTERVAL 5 HOUR)),
('会员消息', '会员充值成功', '会员M20240001充值500元', 'info', TRUE, TRUE, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('运营报告', '月度运营报告已生成', '2024年1月运营报告已生成，请查看', 'info', FALSE, FALSE, 1, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- 10. 插入权限数据
INSERT INTO permissions (permission_code, permission_name, permission_type, parent_id, description) VALUES
('dashboard', '数据看板', 'page', 0, '查看数据看板'),
('station', '充电站管理', 'page', 0, '充电站管理页面'),
('station:add', '新增充电站', 'button', 2, '新增充电站按钮'),
('station:edit', '编辑充电站', 'button', 2, '编辑充电站按钮'),
('station:delete', '删除充电站', 'button', 2, '删除充电站按钮'),
('order', '订单管理', 'page', 0, '订单管理页面'),
('order:delete', '删除订单', 'button', 6, '删除订单按钮'),
('system', '系统管理', 'page', 0, '系统管理页面'),
('system:user', '用户管理', 'button', 8, '用户管理权限'),
('system:permission', '权限管理', 'button', 8, '权限管理权限');

-- 11. 给管理员分配所有权限
INSERT INTO user_permissions (user_id, permission_id)
SELECT 1, id FROM permissions;

SELECT '✅ 测试数据生成完成！' as message;
SELECT CONCAT('充电站数量: ', COUNT(*)) as info FROM charging_stations;
SELECT CONCAT('充电桩数量: ', COUNT(*)) as info FROM charging_piles;
SELECT CONCAT('订单数量: ', COUNT(*)) as info FROM charging_orders;
SELECT CONCAT('会员数量: ', COUNT(*)) as info FROM members;
SELECT CONCAT('告警数量: ', COUNT(*)) as info FROM alarms;
