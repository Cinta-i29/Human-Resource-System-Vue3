import { createRouter, createWebHashHistory } from "vue-router";

// 制定路由规则
const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/systemManagement",
    name: "systemManagement",
    component: () => import("@/views/SystemManagement.vue"),
  },
  {
    path: "/personelManagement",
    name: "personelManagement",
    component: () => import("@/views/PersonelManagement.vue"),
  },
  {
    path: "/system",
    component: () => import("@/views/SystemManagement.vue"),
    children: [
      {
        path: "authorization",
        component: () => import("@/views/system/Authorization.vue"),
      },
      {
        path: "organization",
        component: () => import("@/views/system/Organization.vue"),
      },
      {
        path: "compensation",
        component: () => import("@/views/system/Compensation.vue"),
      },
      {
        path: "position",
        component: () => import("@/views/system/Position.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
