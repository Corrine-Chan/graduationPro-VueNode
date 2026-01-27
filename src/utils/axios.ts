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
    return config; // 必须要return
  },
  (error: AxiosError) => {
    // 这里是没有跑通请求后端失败才会返回error
    ElNotification({
      title: "Error",
      message: error.message,
      type: "error",
    });
    // 通过Promise.reject把这个错误抛出去才能捕获
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.code != 200) {
      // 不是200状态码就弹出弹窗
      ElNotification({
        title: "Error",
        message: response.data.message,
        type: "error",
      });
    } else {
      console.log("拦截器", response);
      return response.data; // 必须要return
    }
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

export default service;
