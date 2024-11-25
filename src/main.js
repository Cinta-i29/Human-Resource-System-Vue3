import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import "@/assets/common.css"
// 导入 Element Plus 样式
import 'element-plus/dist/index.css'

const app = createApp(App);
app.use(router).mount('#app');