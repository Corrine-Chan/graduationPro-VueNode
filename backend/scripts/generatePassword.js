import bcrypt from "bcryptjs";

// 生成密码哈希
const password = "123456";
const hashedPassword = bcrypt.hashSync(password, 10);

console.log("原始密码:", password);
console.log("加密后的密码:", hashedPassword);
console.log("\n请将此哈希值复制到 database/schema.sql 文件中");
