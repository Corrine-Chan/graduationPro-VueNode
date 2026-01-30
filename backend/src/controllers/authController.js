import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import pool from "../config/database.js";

// 注册
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, department } = req.body;

    // 检查用户是否已存在
    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "用户名已存在" });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入新用户
    const [result] = await pool.query(
      "INSERT INTO users (username, password, department, role) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, department, "user"],
    );

    res.status(201).json({
      message: "注册成功",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("注册错误:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};

// 登录
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // 查询用户
    const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ message: "用户名或密码错误" });
    }

    const user = users[0];

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "用户名或密码错误" });
    }

    // 生成token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    // 更新最后登录时间
    await pool.query("UPDATE users SET last_login = NOW() WHERE id = ?", [
      user.id,
    ]);

    // 根据角色和部门生成菜单列表
    const menulist = generateMenuByRole(user.role, user.department);

    res.json({
      message: "登录成功",
      token,
      user: {
        id: user.id,
        username: user.username,
        department: user.department,
        role: user.role,
        roles: [user.role],
      },
      menulist,
    });
  } catch (error) {
    console.error("登录错误:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};

// 根据角色和部门生成菜单
const generateMenuByRole = (role, department) => {
  // 基础菜单（所有用户都可以访问）
  const baseMenu = [
    {
      name: "数据看板",
      url: "/dashboard",
      icon: "DataAnalysis",
    },
    {
      name: "充电站管理",
      icon: "Odometer",
      children: [
        {
          name: "实时监控",
          url: "/chargingstation/monitor",
          icon: "Monitor",
        },
        {
          name: "营收统计",
          url: "/chargingstation/revenue",
          icon: "TrendCharts",
        },
        {
          name: "充电桩管理",
          url: "/chargingstation/fault",
          icon: "Warning",
        },
      ],
    },
    {
      name: "电子地图",
      url: "/map",
      icon: "Location",
    },
  ];

  // 部门专属菜单
  const departmentMenus = {
    运营部: [
      {
        name: "运营管理",
        icon: "Management",
        children: [
          {
            name: "订单管理",
            url: "/operations/orders",
            icon: "List",
          },
          {
            name: "订单详情",
            url: "/operations/detail",
            icon: "Document",
          },
          {
            name: "总览统计",
            url: "/operations/total",
            icon: "DataLine",
          },
        ],
      },
    ],
    技术部: [
      {
        name: "告警管理",
        url: "/alarm",
        icon: "Bell",
      },
    ],
    市场部: [
      {
        name: "会员管理",
        url: "/membership",
        icon: "User",
      },
    ],
    财务部: [
      {
        name: "运营管理",
        icon: "Management",
        children: [
          {
            name: "订单管理",
            url: "/operations/orders",
            icon: "List",
          },
          {
            name: "订单详情",
            url: "/operations/detail",
            icon: "Document",
          },
          {
            name: "总览统计",
            url: "/operations/total",
            icon: "DataLine",
          },
        ],
      },
    ],
    维修部: [
      {
        name: "告警管理",
        url: "/alarm",
        icon: "Bell",
      },
      {
        name: "充电站管理",
        icon: "Odometer",
        children: [
          {
            name: "充电桩管理",
            url: "/chargingstation/fault",
            icon: "Warning",
          },
        ],
      },
    ],
    客服部: [
      {
        name: "会员管理",
        url: "/membership",
        icon: "User",
      },
    ],
    总经办: [
      {
        name: "运营管理",
        icon: "Management",
        children: [
          {
            name: "订单管理",
            url: "/operations/orders",
            icon: "List",
          },
          {
            name: "订单详情",
            url: "/operations/detail",
            icon: "Document",
          },
          {
            name: "总览统计",
            url: "/operations/total",
            icon: "DataLine",
          },
        ],
      },
      {
        name: "告警管理",
        url: "/alarm",
        icon: "Bell",
      },
      {
        name: "会员管理",
        url: "/membership",
        icon: "User",
      },
    ],
  };

  // 通用菜单（所有部门都有）
  const commonMenu = [
    {
      name: "个人中心",
      url: "/personal",
      icon: "UserFilled",
    },
  ];

  // 管理员额外菜单
  const adminMenu = [
    {
      name: "文档管理",
      url: "/document",
      icon: "Folder",
    },
    {
      name: "系统管理",
      url: "/system",
      icon: "Setting",
    },
  ];

  // 组合菜单
  let finalMenu = [...baseMenu];

  // 如果是管理员，显示所有菜单
  if (role === "admin") {
    // 管理员可以看到所有部门的菜单项
    const allBusinessMenus = [
      {
        name: "运营管理",
        icon: "Management",
        children: [
          {
            name: "订单管理",
            url: "/operations/orders",
            icon: "List",
          },
          {
            name: "订单详情",
            url: "/operations/detail",
            icon: "Document",
          },
          {
            name: "总览统计",
            url: "/operations/total",
            icon: "DataLine",
          },
        ],
      },
      {
        name: "告警管理",
        url: "/alarm",
        icon: "Bell",
      },
      {
        name: "会员管理",
        url: "/membership",
        icon: "User",
      },
    ];

    finalMenu = [
      ...finalMenu,
      ...allBusinessMenus,
      ...commonMenu,
      ...adminMenu,
    ];
  } else {
    // 普通用户根据部门显示对应菜单
    if (departmentMenus[department]) {
      finalMenu = [...finalMenu, ...departmentMenus[department]];
    }
    finalMenu = [...finalMenu, ...commonMenu];
  }

  return finalMenu;
};

// 验证token
export const verifyToken = async (req, res) => {
  res.json({
    message: "Token有效",
    user: req.user,
  });
};
