<template>
  <common-layout :menu-list="list"></common-layout>
</template>

<script setup>
import CommonLayout from '@/layouts/CommonLayout.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const list = [
  {
    id: "system-auth",
    path: "/system/authorization",
    name: "用户管理",
    children: []
  },
  {
    id: "system-org",
    path: "/system/organization",
    name: "机构管理",
    children: []
  },
  {
    id: "system-position",
    path: "/system/position",
    name: "职位管理",
    children: []
  },
  {
    id: "system-comp",
    path: "/system/compensation",
    name: "薪酬项目管理",
    children: []
  }
]

// 组件挂载时，如果当前路径是 /system，则自动跳转到第一个菜单项
onMounted(() => {
  if (router.currentRoute.value.path === '/system') {
    router.push(list[0].path);
  }
});
</script>
<style scoped>

</style>
