<template>
    <common-layout :menu-list="menuList"></common-layout>
</template>

<script setup>
import { onMounted, computed } from "vue";
import router from "@/router";
import CommonLayout from "@/layouts/CommonLayout.vue";

const role = localStorage.getItem("role");
const menus = [
    {
        id: "salary-standardRegistration",
        path: "/salary/standardRegistration",
        name: "薪酬标准登记",
        children: [],
        roles: ["Salary-Specialist", "Salary-Manager"],
    },
    {
        id: "salary-reviewStandard",
        path: "/salary/reviewStandard",
        name: "薪酬标准复核",
        children: [],
        roles: ["Salary-Manager"],
    },
    {
        id: "salary-queryStandard",
        path: "/salary/queryStandard",
        name: "薪酬标准查询",
        children: [],
        roles: ["Salary-Manager", "Salary-Specialist"],
    },
    {
        id: "salary-billRegistration",
        path: "/salary/billRegistration",
        name: "薪酬发放登记",
        children: [],
        roles: ["Salary-Specialist"],
    },
    {
        id: "salary-reviewBill",
        path: "/salary/reviewBill",
        name: "薪酬发放复核",
        children: [],
        roles: ["Salary-Manager"],
    },
    {
        id: "salary-queryBill",
        path: "/salary/queryBill",
        name: "薪酬发放查询",
        children: [],
        roles: ["Salary-Manager", "Salary-Specialist"],
    },
];

const menuList = computed(() => {
    return menus.filter((menu) => menu.roles.includes(role));
});

// 组件挂载时，如果当前路径是 /salary，则自动跳转到第一个菜单项
onMounted(() => {
    if (router.currentRoute.value.path === "/salary") {
        const firstAvailableMenu = menuList.value[0];
        if (firstAvailableMenu && firstAvailableMenu.path) {
            router.push(firstAvailableMenu.path);
        }
    }
});
</script>
<style scoped></style>
