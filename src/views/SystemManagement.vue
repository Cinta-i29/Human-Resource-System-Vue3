<template>
  <div class="common-layout">
    <el-container class="layout-container">
        <el-header class="header-container">
            <common-header></common-header>
        </el-header>
        <el-container>
          <el-aside width="150px">
            <common-aside :list="list"></common-aside>
          </el-aside>
          <el-main>
              <router-view></router-view>
          </el-main>
        </el-container>
    </el-container>
  </div>
</template>

<script setup>
import CommonHeader from '@/components/CommonHeader/CommonHeader.vue';
import CommonAside from '@/components/CommonAside/CommonAside.vue';
const list = [
  {
    id: "system-auth",
    path: "/system/authorization",
    name: "权限管理",
    children: []
  },
  {
    id: "system-org",
    path: "/system/organization",
    name: "机构管理",
    children: []
  },
  {
    id: "system-comp",
    path: "/system/compensation",
    name: "薪酬项目管理",
    children: []
  },
]
</script>

<style scoped>
.common-layout, .layout-container{
    height: 100vh;
}

.header-container {
    padding: 0;  /* 移除el-header的内边距 */
}

:deep(.el-header) {
    padding: 0;  /* 确保深层的el-header也没有内边距 */
}
</style>