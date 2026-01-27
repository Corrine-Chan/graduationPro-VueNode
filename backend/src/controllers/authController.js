import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import mockQuery from "../config/mockDatabase.js";

// 使用内存数据库（不需要 MySQL）
const useMockDB = true;

// 注册
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, department } = req.body;

    // 检查用户是否已存在
    const existingUsers = await mockQuery.findUserByUsername(username);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "用户名已存在" });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入新用户
    const result = await mockQuery.createUser(
      username,
      hashedPassword,
      department,
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
    const users = await mockQuery.findUserByUsername(username);

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
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    // 更新最后登录时间
    await mockQuery.updateLastLogin(user.id);

    res.json({
      message: "登录成功",
      token,
      user: {
        id: user.id,
        username: user.username,
        department: user.department,
      },
    });
  } catch (error) {
    console.error("登录错误:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};

// 验证token
export const verifyToken = async (req, res) => {
  res.json({
    message: "Token有效",
    user: req.user,
  });
};
