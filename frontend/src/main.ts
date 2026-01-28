import { createApp } from "vue";
import "./style.less"; // 注意改为less
import App from "./App.vue";
import router from "./router";
import "@/router/guard";
// 引入ElementPlus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { createPinia } from "pinia";
// import "./mock";  // 暂时禁用 Mock 数据
import zhCn from "element-plus/es/locale/lang/zh-cn"; // 国际化全局配置 日历改为中文
import permission from "./directives/permission";

// 后续要调用很多第三方插件，所以用app方便调用
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
const pinia = createPinia();

app.directive("permission", permission);

// 后续要调用很多第三方插件
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
}); // 一定要确保在挂载之前
app.use(pinia);
app.mount("#app");
