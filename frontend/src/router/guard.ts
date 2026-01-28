// 导航守卫
import { useUserStore } from "@/store/auth";
import router from "./index";

router.beforeEach((to) => {
  const userStore = useUserStore();
  const isLogin = userStore.token;

  if (!isLogin) {
    // 未登录
    if (to.path !== "/login") {
      return { path: "/login" };
    }
  } else {
    // 已登录
    if (to.path === "/login") {
      return { path: "/" };
    }
    // 权限检查
    if (
      to.meta?.needAuth &&
      !userStore.roles.some((role: string) =>
        (to.meta.needAuth as string[]).includes(role),
      )
    ) {
      return { path: "/" };
    }
  }
});
