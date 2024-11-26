<template>
  <div class="common-layout">
    <el-container class="layout-container">
        <el-header>
            <common-header></common-header>
        </el-header>
        <el-container>
            main
        </el-container>
    </el-container>
  </div>
</template>

<script setup>
import CommonHeader from '@/components/CommonHeader/CommonHeader.vue';
</script>

<style scoped>
.common-layout, .layout-container{
    height: 100%;
}
</style>