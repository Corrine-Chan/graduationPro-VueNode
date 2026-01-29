import { defineStore } from "pinia";
import { loginApi, registerApi } from "@/api/user";
import { useTabsStore } from "./tabs";

interface LoginParams {
  username: string;
  password: string;
}

interface RegisterParams {
  username: string;
  password: string;
  department: string;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    token: sessionStorage.getItem("token") || "",
    roles: (() => {
      const roles = sessionStorage.getItem("roles");
      return roles ? JSON.parse(roles) : [];
    })(),
    username: sessionStorage.getItem("username") || "",
    department: sessionStorage.getItem("department") || "",
    menu: (() => {
      const menu = sessionStorage.getItem("menu");
      return menu ? JSON.parse(menu) : [];
    })(),
  }),

  actions: {
    async login(data: LoginParams) {
      try {
        const response = await loginApi(data);

        if (response.token) {
          this.token = response.token;
          this.username = response.user.username;
          this.department = response.user.department;

          // 保存到 sessionStorage
          sessionStorage.setItem("token", response.token);
          sessionStorage.setItem("username", response.user.username);
          sessionStorage.setItem("department", response.user.department);

          // 保存角色信息
          const roles = response.user.roles || [response.user.role];
          this.roles = roles;
          sessionStorage.setItem("roles", JSON.stringify(roles));

          // 保存菜单信息
          if (response.menulist) {
            this.menu = response.menulist;
            sessionStorage.setItem("menu", JSON.stringify(response.menulist));
          }
        }
      } catch (error) {
        console.error("登录失败:", error);
        throw error;
      }
    },

    async register(data: RegisterParams) {
      try {
        const response = await registerApi(data);
        return response;
      } catch (error) {
        console.error("注册失败:", error);
        throw error;
      }
    },

    logout() {
      this.token = "";
      this.roles = [];
      this.username = "";
      this.department = "";
      this.menu = [];

      sessionStorage.clear();
      // 清除可能残留的密码记录，但保留用户名记录
      localStorage.removeItem("rememberedPassword");

      const tabsStore = useTabsStore();
      tabsStore.clearAllTabs();
    },
  },
});
