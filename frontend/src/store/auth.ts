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
    token:
      localStorage.getItem("token") || sessionStorage.getItem("token") || "",
    roles: sessionStorage.getItem("roles")
      ? JSON.parse(sessionStorage.getItem("roles")!)
      : [],
    username: sessionStorage.getItem("username") || "",
    department: sessionStorage.getItem("department") || "",
    menu: sessionStorage.getItem("menu")
      ? JSON.parse(sessionStorage.getItem("menu")!)
      : [],
  }),
  actions: {
    async login(data: LoginParams) {
      try {
        const response = await loginApi(data);

        // 兼容新后端返回格式 { message, token, user }
        if (response.token) {
          this.token = response.token;
          this.username = response.user.username;
          this.department = response.user.department;

          // 保存到本地存储
          localStorage.setItem("token", response.token);
          sessionStorage.setItem("token", response.token);
          sessionStorage.setItem("username", response.user.username);
          sessionStorage.setItem("department", response.user.department);

          // 如果有角色和菜单信息也保存
          if (response.user.roles) {
            this.roles = response.user.roles;
            sessionStorage.setItem(
              "roles",
              JSON.stringify(response.user.roles),
            );
          }
          if (response.menulist) {
            this.menu = response.menulist;
            sessionStorage.setItem("menu", JSON.stringify(response.menulist));
          }
        }
        // 兼容旧的返回格式
        else if (response.data) {
          const {
            token,
            user: { username, roles },
            menulist,
          } = response.data;
          this.token = token;
          this.username = username;
          this.roles = roles;
          this.menu = menulist;

          localStorage.setItem("token", token);
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("roles", JSON.stringify(roles));
          sessionStorage.setItem("username", username);
          sessionStorage.setItem("menu", JSON.stringify(menulist));
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

      localStorage.removeItem("token");
      localStorage.removeItem("rememberedUsername");
      localStorage.removeItem("rememberedPassword");
      sessionStorage.clear();

      const tabsStore = useTabsStore();
      tabsStore.clearAllTabs();
    },
  },
});
