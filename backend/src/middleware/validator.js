import { body } from "express-validator";

export const validateRegister = [
  body("username")
    .isLength({ min: 6, max: 11 })
    .withMessage("用户名必须是6-11位"),
  body("password")
    .matches(/^\d{6}$/)
    .withMessage("密码必须是6位纯数字"),
  body("department").notEmpty().withMessage("部门不能为空"),
];

export const validateLogin = [
  body("username").notEmpty().withMessage("用户名不能为空"),
  body("password").notEmpty().withMessage("密码不能为空"),
];
