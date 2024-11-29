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
        path: "compensation",
        name: "compensation",
        component: () => import("@/views/system/Compensation.vue"),
      },
      {
        path: "position",
        name: "position",
        component: () => import("@/views/system/Position.vue"),
      },
    ],
  },
  {
    path: "/personelManagement",
    name: "personelManagement",
    component: () => import("@/views/PersonelManagement.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
