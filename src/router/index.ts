import { createRouter, createWebHistory } from "vue-router"; // 这里只负责创建路由实例
import routes from "./basicRouteMap";  // 导入路由表配置

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 把路由配置项导出
export default router