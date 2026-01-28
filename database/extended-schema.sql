-- 扩展数据库表结构
USE charging_station;

-- 充电桩表（扩展）
CREATE TABLE IF NOT EXISTS charging_piles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pile_code VARCHAR(50) UNIQUE NOT NULL COMMENT '充电桩编号',
  station_id INT NOT NULL COMMENT '所属充电站ID',
  voltage VARCHAR(20) COMMENT '电压',
  current VARCHAR(20) COMMENT '电流',
  power VARCHAR(20) COMMENT '功率',
  temperature VARCHAR(20) COMMENT '温度',
  status ENUM('idle', 'charging', 'connecting', 'queuing', 'reserved', 'fault') DEFAULT 'idle' COMMENT '状态：1空闲 2充电中 3连接中 4排队中 5被预约 6故障',
  charge_percent VARCHAR(10) COMMENT '充电百分比',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (station_id) REFERENCES charging_stations(id) ON DELETE CASCADE,
  INDEX idx_pile_code (pile_code),
  INDEX idx_station_id (station_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='充电桩表';

-- 营收记录表
CREATE TABLE IF NOT EXISTS revenue_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  station_id INT NOT NULL COMMENT '充电站ID',
  record_date DATE NOT NULL COMMENT '记录日期',
  electricity_fee DECIMAL(10, 2) DEFAULT 0 COMMENT '电费',
  parking_fee DECIMAL(10, 2) DEFAULT 0 COMMENT '停车费',
  service_fee DECIMAL(10, 2) DEFAULT 0 COMMENT '服务费',
  monthly_income DECIMAL(10, 2) DEFAULT 0 COMMENT '月度总收入',
  member_recharge DECIMAL(10, 2) DEFAULT 0 COMMENT '会员储值金',
  growth_percent DECIMAL(5, 2) DEFAULT 0 COMMENT '增长比例',
  member_growth_percent DECIMAL(5, 2) DEFAULT 0 COMMENT '会员增长比例',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (station_id) REFERENCES charging_stations(id) ON DELETE CASCADE,
  INDEX idx_station_date (station_id, record_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='营收记录表';

-- 告警表
CREATE TABLE IF NOT EXISTS alarms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  alarm_type VARCHAR(50) NOT NULL COMMENT '告警类型',
  station_name VARCHAR(100) COMMENT '充电站名称',
  pile_code VARCHAR(50) COMMENT '充电桩编号',
  description TEXT COMMENT '告警描述',
  level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium' COMMENT '告警级别',
  status ENUM('pending', 'processing', 'resolved') DEFAULT 'pending' COMMENT '处理状态',
  alarm_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '告警时间',
  resolved_time DATETIME COMMENT '解决时间',
  INDEX idx_status (status),
  INDEX idx_alarm_time (alarm_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='告警表';

-- 会员表
CREATE TABLE IF NOT EXISTS members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  member_no VARCHAR(50) UNIQUE NOT NULL COMMENT '会员卡号',
  member_name VARCHAR(100) NOT NULL COMMENT '会员姓名',
  phone VARCHAR(20) NOT NULL COMMENT '手机号',
  balance DECIMAL(10, 2) DEFAULT 0 COMMENT '余额',
  total_recharge DECIMAL(10, 2) DEFAULT 0 COMMENT '累计充值',
  total_consumption DECIMAL(10, 2) DEFAULT 0 COMMENT '累计消费',
  status ENUM('active', 'inactive', 'frozen') DEFAULT 'active' COMMENT '状态',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  last_use_time DATETIME COMMENT '最后使用时间',
  INDEX idx_member_no (member_no),
  INDEX idx_phone (phone),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员表';

-- 文档分类表
CREATE TABLE IF NOT EXISTS document_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(100) NOT NULL COMMENT '分类名称',
  description TEXT COMMENT '分类描述',
  sort_order INT DEFAULT 0 COMMENT '排序',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文档分类表';

-- 文档表
CREATE TABLE IF NOT EXISTS documents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT NOT NULL COMMENT '分类ID',
  title VARCHAR(200) NOT NULL COMMENT '标题',
  content TEXT COMMENT '内容',
  author VARCHAR(100) COMMENT '作者',
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft' COMMENT '状态',
  views INT DEFAULT 0 COMMENT '浏览次数',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES document_categories(id) ON DELETE CASCADE,
  INDEX idx_category (category_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文档表';

-- 消息表
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  message_type VARCHAR(50) NOT NULL COMMENT '消息类型',
  title VARCHAR(200) NOT NULL COMMENT '标题',
  content TEXT COMMENT '内容',
  level ENUM('info', 'warning', 'error') DEFAULT 'info' COMMENT '级别',
  is_read BOOLEAN DEFAULT FALSE COMMENT '是否已读',
  is_processed BOOLEAN DEFAULT FALSE COMMENT '是否已处理',
  user_id INT COMMENT '接收用户ID',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME COMMENT '阅读时间',
  processed_at DATETIME COMMENT '处理时间',
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_message_type (message_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息表';

-- 权限表
CREATE TABLE IF NOT EXISTS permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  permission_code VARCHAR(100) UNIQUE NOT NULL COMMENT '权限代码',
  permission_name VARCHAR(100) NOT NULL COMMENT '权限名称',
  permission_type ENUM('page', 'button') DEFAULT 'page' COMMENT '权限类型',
  parent_id INT DEFAULT 0 COMMENT '父权限ID',
  description TEXT COMMENT '描述',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_permission_code (permission_code),
  INDEX idx_permission_type (permission_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

-- 用户权限关联表
CREATE TABLE IF NOT EXISTS user_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL COMMENT '用户ID',
  permission_id INT NOT NULL COMMENT '权限ID',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_permission (user_id, permission_id),
  INDEX idx_user_id (user_id),
  INDEX idx_permission_id (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户权限关联表';
