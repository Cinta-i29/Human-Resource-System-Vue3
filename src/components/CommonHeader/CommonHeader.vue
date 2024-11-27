<template>
  <div class="header">
    <div class="l-content">
      <div class="title">人力资源管理系统</div>
    </div>
    <div class="r-content">
      <el-dropdown :hide-on-click="false">
        <span class="el-dropdown-link">
          用户名<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import { ArrowDown } from '@element-plus/icons-vue';
</script>
<style scoped>
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  color: #fff;
  background-color: #465FD2;
}

.title{
  font-weight: bold;
  font-size: 17px;
}

.el-dropdown-link {
  font-size: 16px;
  display: flex;
  align-items: center;
  color: #fff;
}
</style>