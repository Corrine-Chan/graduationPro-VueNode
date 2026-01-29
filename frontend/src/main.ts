import { createApp } from "vue";
import "./style.less";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { createPinia } from "pinia";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import permission from "./directives/permission";

const app = createApp(App);

// 注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 注册指令
app.directive("permission", permission);

// 注册插件
app.use(createPinia());
app.use(ElementPlus, { locale: zhCn });
app.use(router);

// 导入路由守卫
import "@/router/guard";

app.mount("#app");
