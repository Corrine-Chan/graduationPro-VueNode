import { body } from "express-validator";

export const validateRegister = [
  body("username")
    .isLength({ min: 6, max: 20 })
    .withMessage("用户名必须是6-20位"),
  body("password")
    .isLength({ min: 6, max: 20 })
    .withMessage("密码长度为6-20位")
    .matches(/^(?:\d{6,20}|[a-zA-Z]+\d+|\d+[a-zA-Z]+|[a-zA-Z\d]{6,20})$/)
    .withMessage("密码必须是6位以上纯数字或字母数字组合"),
  body("department").notEmpty().withMessage("部门不能为空"),
];

export const validateLogin = [
  body("username")
    .isLength({ min: 6, max: 20 })
    .withMessage("用户名必须是6-20位"),
  body("password")
    .isLength({ min: 6, max: 20 })
    .withMessage("密码长度为6-20位"),
];
