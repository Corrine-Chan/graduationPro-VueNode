import bcrypt from "bcryptjs";

// 内存数据库 - 用于开发测试，不需要 MySQL
const mockDatabase = {
  users: [
    {
      id: 1,
      username: "admin123456",
      password: bcrypt.hashSync("123456", 10), // 密码: 123456
      department: "管理部",
      role: "admin",
      status: "active",
      created_at: new Date(),
      last_login: null,
    },
    {
      id: 2,
      username: "test123456",
      password: bcrypt.hashSync("123456", 10), // 密码: 123456
      department: "技术部",
      role: "user",
      status: "active",
      created_at: new Date(),
      last_login: null,
    },
  ],
  nextUserId: 3,
};

// 模拟数据库查询方法
export const mockQuery = {
  // 查询用户
  async findUserByUsername(username) {
    const user = mockDatabase.users.find((u) => u.username === username);
    return user ? [user] : [];
  },

  // 创建用户
  async createUser(username, hashedPassword, department) {
    const newUser = {
      id: mockDatabase.nextUserId++,
      username,
      password: hashedPassword,
      department,
      role: "user",
      status: "active",
      created_at: new Date(),
      last_login: null,
    };
    mockDatabase.users.push(newUser);
    return { insertId: newUser.id };
  },

  // 更新最后登录时间
  async updateLastLogin(userId) {
    const user = mockDatabase.users.find((u) => u.id === userId);
    if (user) {
      user.last_login = new Date();
    }
    return true;
  },

  // 获取所有用户（用于调试）
  getAllUsers() {
    return mockDatabase.users.map((u) => ({
      id: u.id,
      username: u.username,
      department: u.department,
      role: u.role,
    }));
  },
};

// 测试连接（总是返回成功）
export const testMockConnection = async () => {
  console.log("✅ 使用内存数据库（Mock Database）");
  console.log("📝 预置用户：");
  mockDatabase.users.forEach((user) => {
    console.log(`   - ${user.username} (${user.department})`);
  });
  return true;
};

export default mockQuery;
