<template>
    <common-layout :menu-list="menuList"></common-layout>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useUserStore } from "@/store/user";
import router from "@/router";
import CommonLayout from "@/layouts/CommonLayout.vue";

const userStore = useUserStore();

const menus = [
    {
        id: "personel-fileRegistration",
        path: "/personel/fileRegistration",
        name: "人力资源档案登记",
        children: [],
        roles: ["HR-Specialist"],
    },
    {
        id: 2,
        path: "",
        name: "人力资源档案复核",
        children: [],
        roles: ["HR-Manager"],
    },
    {
        id: 3,
        path: "",
        name: "人力资源档案查询",
        children: [],
        roles: ["HR-Specialist", "HR-Manager"],
    },
    {
        id: 4,
        path: "",
        name: "人力资源档案变更",
        children: [],
        roles: ["HR-Specialist"],
    },
    {
        id: 5,
        path: "",
        name: "人力资源档案删除",
        children: [],
        roles: ["HR-Manager"],
    },
];

const menuList = computed(() => {
    return menus.filter((menu) => menu.roles.includes(userStore.role));
});

// 组件挂载时，如果当前路径是 /personel，则自动跳转到第一个菜单项
onMounted(() => {
    if (router.currentRoute.value.path === "/personel") {
        const firstAvailableMenu = menuList.value[0];
        if (firstAvailableMenu && firstAvailableMenu.path) {
            router.push(firstAvailableMenu.path);
        }
    }
});
</script>
<style scoped></style>
