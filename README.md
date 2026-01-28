# 绿闪桩能源管理平台

一个基于 Vue3 + Node.js + MySQL 的充电站管理系统。

## 📁 项目结构

```
graduationPro-VueNode/
├── frontend/              # 前端项目 (Vue3 + TypeScript + Vite)
│   ├── src/
│   │   ├── api/          # API 接口
│   │   ├── components/   # 组件
│   │   ├── views/        # 页面
│   │   ├── store/        # 状态管理
│   │   └── router/       # 路由
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
│   ├── schema.sql        # 数据库结构
│   ├── extended-schema.sql  # 扩展表结构
│   ├── generate-test-data.sql  # 测试数据
│   └── init-all.bat      # 一键初始化
│
└── docs/                 # 项目文档
    ├── 快速启动指南.md
    ├── 开发指南.md
    └── 项目更新说明.md
```

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd backend
npm install
```

### 2. 配置数据库

修改 `backend/.env` 文件：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的密码
DB_NAME=charging_station
```

### 3. 初始化数据库

```bash
cd database
# 双击运行 init-all.bat
# 或手动执行：
mysql -u root -p < schema.sql
mysql -u root -p < extended-schema.sql
mysql -u root -p < generate-test-data.sql
```

### 4. 启动项目

```bash
# 启动后端 (端口 5501)
cd backend
npm run dev

# 启动前端 (端口 5173)
cd frontend
npm run dev
```

### 5. 访问系统

打开浏览器访问：`http://localhost:5173`

**默认账号：**

- 管理员：`admin123456` / `123456`
- 测试用户：`test123456` / `123456`

## 📊 功能模块

- ✅ 用户登录/注册
- ✅ 数据看板
- ⏳ 充电站管理
- ⏳ 充电桩管理
- ⏳ 订单管理
- ⏳ 营收统计
- ⏳ 会员管理
- ⏳ 系统管理

## 🛠️ 技术栈

### 前端

- Vue 3
- TypeScript
- Vite
- Element Plus
- Pinia
- Vue Router
- ECharts

### 后端

- Node.js
- Express
- MySQL
- JWT
- bcryptjs

## 📝 开发说明

### 前端开发

```bash
cd frontend
npm run dev      # 开发模式
npm run build    # 生产构建
```

### 后端开发

```bash
cd backend
npm run dev      # 开发模式（nodemon）
npm start        # 生产模式
```

### 数据库管理

- 使用 Navicat 或 MySQL Workbench
- 数据库名：`charging_station`
- 字符集：`utf8mb4`

## 🔧 环境要求

- Node.js >= 16.0.0
- MySQL >= 5.7
- npm >= 8.0.0

## 📖 文档

详细文档请查看 `docs/` 目录：

- [快速启动指南](docs/快速启动指南.md)
- [开发指南](docs/开发指南.md)
- [项目更新说明](docs/项目更新说明.md)

## 🐛 常见问题

### 1. 数据库连接失败

检查 `backend/.env` 中的数据库配置是否正确。

### 2. 端口被占用

修改 `backend/.env` 中的 `PORT` 配置。

### 3. 前端无法访问后端

检查 `frontend/.env` 中的 `VITE_API_URL` 配置。

## 📄 License

MIT

## 👥 作者

绿闪桩团队
