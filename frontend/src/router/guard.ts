// 导航守卫
import router from "./index";

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem("token");

  // 如果是登录页面
  if (to.path === "/login") {
    if (token) {
      next({ path: "/dashboard", replace: true });
    } else {
      next();
    }
    return;
  }

  // 如果是其他页面且未登录
  if (!token) {
    next({ path: "/login", replace: true });
    return;
  }

  // 已登录，正常访问
  next();
});
