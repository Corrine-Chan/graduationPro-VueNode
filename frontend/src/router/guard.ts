// 导航守卫
import { useUserStore } from "@/store/auth";
import router from "./index";
router.beforeEach((to) => {
    const userStore = useUserStore()
    const isLogin = userStore.token // 如果取到了就是有值 取不到就是undefined
    if (!isLogin) {
        // 未登录
        if (to.path !== "/login") {
            return {path:"/login"}
        }
    } else {
        // 已登录
        if (to.path === "/login") {
            // 如果你已经登录了想返回登录页不行，给重定向到首页return
            return {path:"/"}
        }
        // 判断一下 有没有权限去访问 没有权限去访问就设置重定向到首页面
        // 判断我们拥有的角色和要访问这个页面的所需要的角色有没有交集
        if (to.meta?.needAuth && !userStore.roles.some((role:string)=>(to.meta.needAuth as string[]).includes(role))) {
            return {path:"/"}
        }
    }
})