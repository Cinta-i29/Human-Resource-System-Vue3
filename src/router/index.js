import { createRouter, createWebHashHistory } from "vue-router";

// 制定路由规则
const routes = [
    {
        path: "/",
        name: "login",
        component: () => import("@/views/Login.vue"),
    },
    {
        path: "/system",
        component: () => import("@/views/SystemManagement.vue"),
        children: [
            {
                path: "authorization",
                name: "authorization",
                component: () => import("@/views/system/Authorization.vue"),
            },
            {
                path: "organization",
                name: "organization",
                component: () => import("@/views/system/Organization.vue"),
            },
            {
                path: "salaryItem",
                name: "salaryItem",
                component: () => import("@/views/system/SalaryItem.vue"),
            },
            {
                path: "position",
                name: "position",
                component: () => import("@/views/system/Position.vue"),
            },
            {
                path: "salaryStandard",
                name: "salaryStandard",
                component: () => import("@/views/system/SalaryStandard.vue"),
            },
        ],
    },
    {
        path: "/personel",
        name: "personel",
        component: () => import("@/views/PersonelManagement.vue"),
        children: [
            {
                path: "fileRegistration",
                name: "fileRegistration",
                component: () => import("@/views/personel/FileRegistration.vue"),
            },
            {
                path: "queryFile",
                name: "queryFile",
                component: () => import("@/views/personel/QueryFile.vue"),
            },
            {
                path: "review",
                name: "review",
                component: () => import("@/views/personel/Review.vue"), 
            },
            {
                path: "recover",
                name: "recover",
                component: () => import("@/views/personel/Recover.vue"), 
            }
        ],
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
