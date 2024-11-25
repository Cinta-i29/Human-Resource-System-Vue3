import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/common.css";
// 导入 Element Plus 样式
import "element-plus/dist/index.css";
// 导入 Element-plus icon样式
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(router).mount("#app");
