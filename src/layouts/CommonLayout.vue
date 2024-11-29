<template>
  <div class="common-layout">
    <el-container class="layout-container">
      <el-header class="header-container">
        <common-header></common-header>
      </el-header>
      <el-container>
        <el-aside width="150px" class="aside-container">
          <common-aside :list="menuList"></common-aside>
        </el-aside>
        <el-main class="main-container">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import CommonHeader from '@/components/CommonHeader/CommonHeader.vue';
import CommonAside from '@/components/CommonAside/CommonAside.vue';

defineProps({
  menuList: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.common-layout, .layout-container{
    height: 100vh;
}

.header-container {
  padding: 0;
  background: linear-gradient(to right, #1485FE, #7F80FF);
}

.main-container{
  background-color: #F2F2F2;
}

:deep(.el-header) {
    padding: 0;
}
</style> 