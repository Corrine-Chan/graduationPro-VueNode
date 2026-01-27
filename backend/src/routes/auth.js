import express from "express";
import { register, login, verifyToken } from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../middleware/validator.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// 注册
router.post("/register", validateRegister, register);

// 登录
router.post("/login", validateLogin, login);

// 验证token
router.get("/verify", authenticateToken, verifyToken);

export default router;
