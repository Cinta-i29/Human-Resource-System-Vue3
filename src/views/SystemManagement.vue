<template>
  <div class="common-layout">
    <el-container class="layout-container">
        <el-header class="header-container">
            <common-header></common-header>
        </el-header>
        <el-container>
          <el-aside width="150px" class="aside-container">
            <common-aside :list="list"></common-aside>
          </el-aside>
          <el-main class="main-container">
              <router-view></router-view>
          </el-main>
        </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CommonHeader from '@/components/CommonHeader/CommonHeader.vue';
import CommonAside from '@/components/CommonAside/CommonAside.vue';

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
.common-layout, .layout-container{
    height: 100vh;
}

.header-container {
  padding: 0;  /* 移除el-header的内边距 */
  background: linear-gradient(to right, #1485FE, #7F80FF);
}


.main-container{
  background-color: #F2F2F2;
}

:deep(.el-header) {
    padding: 0;  /* 确保深层的el-header也没有内边距 */
}
</style>