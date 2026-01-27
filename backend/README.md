# 绿闪桩能源管理平台 - 后端服务

## 技术栈

- Node.js + Express
- MySQL
- JWT 认证
- bcryptjs 密码加密

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置数据库

1. 安装 MySQL（推荐 MySQL 8.0+）
2. 创建数据库并导入表结构：

```bash
mysql -u root -p < database/schema.sql
```

### 3. 配置环境变量

复制 `.env` 文件并修改数据库配置：

- DB_HOST: 数据库主机
- DB_USER: 数据库用户名
- DB_PASSWORD: 数据库密码
- DB_NAME: 数据库名称
- JWT_SECRET: JWT密钥（生产环境请修改）

### 4. 启动服务

```bash
# 开发模式（热重载）
npm run dev

# 生产模式
npm start
```

服务将运行在 http://localhost:3000

## API 接口

### 认证接口

- POST `/api/auth/register` - 用户注册
- POST `/api/auth/login` - 用户登录
- GET `/api/auth/verify` - 验证token

### 请求示例

#### 注册

```json
POST /api/auth/register
{
  "username": "user123456",
  "password": "123456",
  "department": "技术部"
}
```

#### 登录

```json
POST /api/auth/login
{
  "username": "user123456",
  "password": "123456"
}
```

## 项目结构

```
server/
├── src/
│   ├── config/          # 配置文件
│   │   └── database.js  # 数据库配置
│   ├── controllers/     # 控制器
│   │   └── authController.js
│   ├── middleware/      # 中间件
│   │   ├── auth.js      # JWT认证
│   │   ├── validator.js # 数据验证
│   │   └── errorHandler.js
│   ├── routes/          # 路由
│   │   └── auth.js
│   └── app.js           # 应用入口
├── database/            # 数据库脚本
│   └── schema.sql       # 表结构
├── .env                 # 环境变量
├── package.json
└── README.md
```

## 下一步开发计划

1. 完善充电桩管理接口
2. 添加订单管理接口
3. 实现数据统计接口
4. 添加文件上传功能
5. 实现实时数据推送（WebSocket）
