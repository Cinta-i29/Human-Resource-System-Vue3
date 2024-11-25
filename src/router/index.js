import { createRouter, createWebHashHistory } from "vue-router";

// 制定路由规则
const routes = [
    {
        path: "/",
        name: "login",
        component: () => import("@/pages/Login.vue"),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;