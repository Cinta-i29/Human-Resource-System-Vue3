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
import CommonHeader from "@/components/CommonHeader/CommonHeader.vue";
import CommonAside from "@/components/CommonAside/CommonAside.vue";

defineProps({
    menuList: {
        type: Array,
        required: true,
    },
});
</script>

<style scoped>
.common-layout,
.layout-container {
    height: 100vh;
}

.header-container {
    padding: 0;
    background: linear-gradient(to right, #1485fe, #7f80ff);
}

.main-container {
    background-color: #f2f2f2;
    height: calc(100vh - 60px);
    overflow-y: auto;
    padding: 20px;
}

:deep(.el-header) {
    padding: 0;
}
</style>
