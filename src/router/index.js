import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";
import { createRouter, createWebHashHistory } from "vue-router";

// 制定路由规则
const routes = [
    {
        path: "/",
        name: "login",
        component: () => import("@/pages/Login.vue"),
    }, {
        path: "/systemManager",
        name: "systemManager",
        component: () => import("@/pages/SystemManager.vue"),
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;