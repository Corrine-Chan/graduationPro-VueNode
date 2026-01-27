import { defineStore } from "pinia";
import { loginApi } from "@/api/user";
import { useTabsStore } from "./tabs";
interface LoginParams {
  username: string;
  password: string;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    token: sessionStorage.getItem("token") || "", // 它的初始值会去本地存储中去取，当你有值时会给这个token覆盖
    roles: sessionStorage.getItem("roles")
      ? JSON.parse(sessionStorage.getItem("roles")!)
      : [], // 非空断言
    username: sessionStorage.getItem("username") || "",
    menu: sessionStorage.getItem("menu")
      ? JSON.parse(sessionStorage.getItem("menu")!)
      : [], // 在登录接口后端会根据角色返回这样的你所拥有的菜单
  }),
  actions: {
    async login(data: LoginParams) {
      // const res = await loginApi(data)
      try {
        const {
          data: {
            token,
            user: { username, roles },
            menulist,
          },
        } = await loginApi(data); // 解构赋值，ES6中的嵌套知识
        // console.log("store",res);
        // 数据存起来
        this.token = token;
        this.username = username;
        this.roles = roles;
        this.menu = menulist;
        // 本地存储 不用刷新了就没了  使用 sessionStorage页面关了就没有
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("roles", JSON.stringify(roles));
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("menu", JSON.stringify(menulist));
      } catch (error) {
        console.log("error", error);
      }
    },
    // 登出(不存在异步操作不用async)
    logout() {
      // 清空用户信息
      this.token = "";
      this.roles = [];
      this.username = "";
      this.menu = [];
      sessionStorage.clear(); // 本地存储也清空

      // 清空页签状态
      const tabsStore = useTabsStore();
      tabsStore.clearAllTabs();
    },
  },
});
