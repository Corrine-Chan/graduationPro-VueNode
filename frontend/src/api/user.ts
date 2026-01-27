import { post } from "@/utils/http";

// 采用ts的枚举,把项目中的所有接口都用变量定义一下
const Api = {
  Login: "/api/auth/login",
  Register: "/api/auth/register",
  Verify: "/api/auth/verify",
};

// 登录参数类型
interface LoginParams {
  username: string;
  password: string;
}

// 注册参数类型
interface RegisterParams {
  username: string;
  password: string;
  department: string;
}

// 登录接口
function loginApi(data: LoginParams): Promise<any> {
  return post(Api.Login, data);
}

// 注册接口
function registerApi(data: RegisterParams): Promise<any> {
  return post(Api.Register, data);
}

// 验证token接口
function verifyTokenApi(): Promise<any> {
  return post(Api.Verify);
}

export { loginApi, registerApi, verifyTokenApi };
