import axios from "axios";
// AxiosInstance实例类型,InternalAxiosRequestConfig表示config类型,
// AxiosError是error的类型,AxiosResponse是response的类型
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";
import { ElNotification } from "element-plus"; //引入Notification 通知组件

// 写axios的实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 后面我们会把它替换成环境变量
  timeout: 5000, // 请求超时时间
});
// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token 并添加到请求头
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    ElNotification({
      title: "Error",
      message: error.message,
      type: "error",
    });
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 后端返回的数据结构可能是 { message, token, user } 或 { code, data, message }
    // 统一处理
    if (response.data.code !== undefined && response.data.code !== 200) {
      ElNotification({
        title: "Error",
        message: response.data.message,
        type: "error",
      });
      return Promise.reject(response.data);
    }
    return response.data;
  },
  (error: AxiosError) => {
    // 处理 401 未授权错误
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      ElNotification({
        title: "认证失败",
        message: "登录已过期，请重新登录",
        type: "warning",
      });
      // 可以在这里跳转到登录页
      window.location.href = "/login";
    } else {
      ElNotification({
        title: "Error",
        message: error.message,
        type: "error",
      });
    }
    return Promise.reject(error);
  },
);

export default service;
