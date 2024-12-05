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
            },
        ],
    },
    {
        path: "/salary",
        name: "salary",
        component: () => import("@/views/SalaryManagement.vue"),
        children: [
            {
                path: "standardRegistration",
                name: "standardRegistration",
                component: () => import("@/views/salary/StandardRegistration.vue"),
            },
            {
                path: "queryStandard",
                name: "queryStandard",
                component: () => import("@/views/salary/QueryStandard.vue"),
            },
            {
                path: "reviewStandard",
                name: "reviewStandard",
                component: () => import("@/views/salary/ReviewStandard.vue"),
            },
            {
                path: "billRegistration",
                name: "billRegistration",
                component: () => import("@/views/salary/BillRegistration.vue"),
            },
            {
                path: "reviewBill",
                name: "reviewBill",
                component: () => import("@/views/salary/ReviewBill.vue"),
            },
            {
                path: "queryBill",
                name: "queryBill",
                component: () => import("@/views/salary/QueryBill.vue"),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    
    // 如果是访问登录页面，直接放行
    if (to.path === '/') {
        next();
        return;
    }
    
    // 检查是否有token
    if (!token || token.trim() === '') {
        // 如果没有token，重定向到登录页
        next('/');
        return;
    }
    
    // 有token，允许访问
    next();
});


export default router;
