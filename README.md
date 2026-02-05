# 绿闪桩能源管理平台

一个基于 Vue 3 + Node.js + MySQL 的充电站管理系统，采用前后端分离架构。

## 📊 项目进度

- **已完成**: 7个模块（用户认证、数据看板、充电站监控、营收统计、充电桩管理、电子地图、订单管理）
- **待开发**: 5个模块
- **完成度**: 58%

详细进度请查看：[项目进度说明.md](项目进度说明.md)

## 📁 项目结构

```
graduationPro-VueNode/
├── frontend/              # 前端项目 (Vue 3 + TypeScript + Vite)
│   ├── src/
│   │   ├── api/          # API 接口
│   │   ├── components/   # 组件
│   │   ├── views/        # 页面
│   │   ├── store/        # 状态管理 (Pinia)
│   │   ├── router/       # 路由
│   │   └── utils/        # 工具函数
│   └── package.json
│
├── backend/              # 后端项目 (Node.js + Express)
│   ├── src/
│   │   ├── controllers/  # 控制器
│   │   ├── routes/       # 路由
│   │   ├── middleware/   # 中间件
│   │   └── config/       # 配置
│   └── package.json
│
├── database/             # 数据库脚本
│   └── schema.sql        # 完整数据库结构
│
├── docs/                 # 项目文档
│   ├── 快速启动指南.md
│   ├── 开发指南.md
│   └── Bug修复-新增充电站状态选项.md
│
├── 项目进度说明.md       # 详细项目进度
├── 默认账号.txt          # 默认登录账号
└── 启动项目.bat          # 快速启动脚本 (Windows)
```

## 🚀 快速开始

### 方式一：使用启动脚本（推荐）

双击运行 `启动项目.bat`（仅限Windows）

### 方式二：手动启动

#### 1. 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd backend
npm install
```

#### 2. 配置数据库

修改 `backend/.env` 文件：

```env
PORT=5501
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的密码
DB_NAME=charging_station
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
```

#### 3. 初始化数据库

```bash
# 创建数据库并导入结构
mysql -u root -p < database/schema.sql
```

**注意**: 充电站监控数据已在本地Navicat中插入，无需重复导入。

#### 4. 启动服务

```bash
# 启动后端服务 (端口 5501)
cd backend
npm run dev

# 启动前端服务 (端口 5173)
cd frontend
npm run dev
```

#### 5. 访问系统

打开浏览器访问：`http://localhost:5173`

**默认账号：**

- 管理员：`admin123` / `123456`
- 测试用户：`user123` / `666666`

## ✅ 已完成功能

### 1. 用户认证模块

- ✅ 用户登录
- ✅ JWT token认证
- ✅ 基于角色的权限控制
- ✅ 密码加密存储

### 2. 数据看板模块

- ✅ 折线图数据展示
- ✅ 饼图数据展示
- ✅ 雷达图数据展示
- ✅ 设备统计
- ✅ 营收排行
- ✅ 最新告警

### 3. 充电站监控模块

- ✅ 充电站列表查询（分页、筛选）
- ✅ 新增/编辑充电站
- ✅ 删除充电站
- ✅ 统计数据展示
- ✅ 按名称/ID查询
- ✅ 按状态筛选

### 4. 营收统计模块

- ✅ 营收统计卡片展示
- ✅ 月度营收趋势图表
- ✅ 营收明细列表（分页、搜索）
- ✅ 按站点名称搜索
- ✅ 增长率标签显示
- ✅ 数据排序功能

### 5. 充电桩管理模块

- ✅ 充电桩列表展示（支持多充电站）
- ✅ 按充电站筛选充电桩
- ✅ 按状态筛选（7种状态）
- ✅ 充电桩状态可视化
- ✅ 充电进度显示
- ✅ 充电桩详细信息展示
- ✅ 使用记录查看
- ✅ 维修记录查看
- ✅ 状态统计功能

### 6. 电子地图模块

- ✅ 地图站点展示（高德地图 + flashIcon 图标）
- ✅ 点击标记显示站点详情
- ✅ 根据状态显示不同颜色
- ✅ 新增站点功能（表单验证、经纬度验证）
- ✅ 充电桩数量输入（0-500）
- ✅ 自动生成站点ID
- ✅ 新增后自动刷新地图
- ✅ 统计数据动态展示
- ✅ 数据库存储和查询

### 7. 订单管理模块

- ✅ 订单列表查询（分页、多条件筛选）
- ✅ 按订单号查询
- ✅ 按订单状态筛选（全部/进行中/已完成/异常）
- ✅ 按设备编号查询
- ✅ 按站点名称查询
- ✅ 按日期范围查询
- ✅ 订单详情查看（完整信息展示）
- ✅ 单个删除订单
- ✅ 批量删除订单
- ✅ 导出订单数据到Excel

## 🚧 待开发功能

- ⏳ 运营管理（计费管理）
- ⏳ 报警管理
- ⏳ 会员卡管理
- ⏳ 招商管理
- ⏳ 系统设置
- ⏳ 个人中心

## 🛠️ 技术栈

### 前端

- Vue 3 - 渐进式JavaScript框架
- TypeScript - JavaScript的超集
- Vite - 下一代前端构建工具
- Element Plus - Vue 3组件库
- Pinia - Vue状态管理
- Vue Router - 路由管理
- ECharts - 数据可视化
- Axios - HTTP客户端

### 后端

- Node.js - JavaScript运行时
- Express - Web应用框架
- MySQL - 关系型数据库
- JWT - 身份认证
- bcrypt - 密码加密
- nodemon - 开发热重载

## 📝 API接口

### 认证接口

- `POST /api/auth/login` - 用户登录

### 数据看板接口

- `GET /api/dashboard/chartData` - 折线图数据
- `GET /api/dashboard/chartData2` - 饼图数据
- `GET /api/dashboard/chartData3` - 雷达图数据
- `GET /api/dashboard/deviceStats` - 设备统计
- `GET /api/dashboard/revenueRanking` - 营收排行
- `GET /api/dashboard/latestAlarms` - 最新告警

### 充电站监控接口

- `POST /api/station/list` - 获取充电站列表
- `POST /api/station/edit` - 新增/编辑充电站
- `POST /api/station/delete` - 删除充电站
- `GET /api/station/stats` - 获取统计数据

### 营收统计接口

- `POST /api/station/revenue/list` - 获取营收统计列表
- `GET /api/station/revenue/chart` - 获取营收图表数据

### 充电桩管理接口

- `POST /api/station/pile/list` - 获取充电桩列表（按充电站分组）

### 电子地图接口

- `POST /api/map/mapList` - 获取地图站点列表
- `POST /api/map/create` - 创建新站点
- `GET /api/map/stats` - 获取地图统计数据

### 订单管理接口

- `POST /api/order/list` - 获取订单列表
- `POST /api/order/detail` - 获取订单详情
- `POST /api/order/singleDelete` - 单个删除订单
- `POST /api/order/batchDelete` - 批量删除订单
- `GET /api/order/cityList` - 获取城市列表

## 🗄️ 数据库表

### 已创建的表

1. `users` - 用户表
2. `departments` - 部门表
3. `charging_stations` - 充电桩表
4. `charging_orders` - 充电订单表（100条数据）
5. `station_monitor` - 充电站监控表（32条数据）
6. `station_revenue` - 充电站营收统计表（32条数据）
7. `revenue_chart` - 营收图表数据表（12个月数据）
8. `charging_pile` - 充电桩详情表（47条数据）
9. `pile_usage_record` - 充电桩使用记录表（12条数据）
10. `pile_maintenance_record` - 充电桩维修记录表（6条数据）
11. `map_stations` - 地图站点表（34条数据)

## 🔧 开发命令

### 前端开发

```bash
cd frontend
npm run dev      # 开发模式
npm run build    # 生产构建
npm run preview  # 预览构建结果
```

### 后端开发

```bash
cd backend
npm run dev      # 开发模式（nodemon自动重启）
npm start        # 生产模式
```

## 🔧 环境要求

- Node.js >= 16.0.0
- MySQL >= 8.0
- npm >= 8.0.0

## 📖 文档

- [项目进度说明](项目进度说明.md) - 详细的项目进度和功能说明
- [快速启动指南](docs/快速启动指南.md) - 快速启动步骤
- [开发指南](docs/开发指南.md) - 开发规范和指南
- [Bug修复记录](docs/Bug修复记录.md) - Bug修复记录汇总
- [充电桩管理模块](docs/充电桩管理模块.md) - 充电桩管理模块文档

## 🐛 常见问题

### 1. 数据库连接失败

**解决方案**:

- 检查MySQL服务是否运行
- 确认 `backend/.env` 中的数据库配置正确
- 确认数据库 `charging_station` 已创建

### 2. 端口被占用

**解决方案**:

```bash
# 查看端口占用
netstat -ano | findstr :5501  # 后端端口
netstat -ano | findstr :5173  # 前端端口

# 杀掉占用进程
taskkill /F /PID <进程ID>
```

### 3. 登录失败

**解决方案**:

- 确认使用正确的账号: `admin123` / `123456`
- 检查后端服务是否正常运行
- 查看浏览器控制台是否有错误信息

### 4. 前端无法访问后端

**解决方案**:

- 检查 `frontend/.env.development` 中的 `VITE_API_URL` 配置
- 确认后端服务运行在 `http://localhost:5501`
- 检查CORS配置

## 📈 项目统计

- **代码行数**: ~25,000行
- **API接口**: 24个已实现，16+待开发
- **数据库表**: 11个已创建
- **前端页面**: 12个主要页面
- **测试数据**: 32条充电站数据 + 32条营收数据 + 47条充电桩数据 + 34条地图站点数据 + 100条订单数据

## 🎯 下一步计划

### 短期目标（1-2周）

1. 完善运营管理模块（计费管理）
2. 实现报警管理功能
3. 完成会员卡管理模块

### 中期目标（1个月）

1. 完成所有模块的后端API开发
2. 完成前后端联调
3. 完善数据库设计

### 长期目标（2-3个月）

1. 添加数据导出功能
2. 优化前端UI/UX
3. 添加单元测试
4. 性能优化
5. 部署上线

## 📄 License

MIT

## 👥 作者

绿闪桩团队--Corrine-Chan

---

**最后更新**: 2026-02-05  
**项目状态**: 🚧 开发中  
**完成度**: 58%
