<template>
    <div>
        <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" router unique-opened>
            <!-- 遍历主列表 -->
            <template v-for="item in list" :key="item.id">
                <!-- 当有子项时渲染子菜单 -->
                <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.id">
                    <template #title>
                        <span>{{ item.name }}</span>
                    </template>
                    <el-menu-item
                        v-for="child in item.children"
                        :key="child.id"
                        :index="child.path"
                    >
                        {{ child.name }}
                    </el-menu-item>
                </el-sub-menu>
                <!-- 没有子项时直接渲染菜单项 -->
                <el-menu-item v-else :index="item.path">
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
    list: {
        type: Array,
        default: () => [],
    },
});

// 计算默认激活的菜单项
const defaultActive = computed(() => {
    return props.list[0]?.path || ""; // 返回第一个菜单项的路径
});
</script>

<style scoped></style>
