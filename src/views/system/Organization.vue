<template>
    <div>
        <div class="select-container">
            <!-- 一级机构选择 -->
            <el-select
                v-model="selectedLevel1"
                placeholder="请选择一级机构"
                @change="handleLevel1Change"
            >
                <el-option
                    v-for="item in level1Options"
                    :key="item.code"
                    :label="item.name"
                    :value="item"
                />
            </el-select>

            <!-- 二级机构选择 -->
            <el-select
                v-model="selectedLevel2"
                placeholder="请选择二级机构"
                :disabled="!selectedLevel1"
                @change="handleLevel2Change"
            >
                <el-option
                    v-for="item in level2Options"
                    :key="item.code"
                    :label="item.name"
                    :value="item"
                />
            </el-select>

            <!-- 三级机构选择 -->
            <el-select
                v-model="selectedLevel3"
                placeholder="请选择三级机构"
                :disabled="!selectedLevel2"
            >
                <el-option
                    v-for="item in level3Options"
                    :key="item.code"
                    :label="item.name"
                    :value="item"
                />
            </el-select>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAllOrganizations } from "@/api/organization";

const organizationList = ref([]);
// 各级选中的值
const selectedLevel1 = ref(null);
const selectedLevel2 = ref(null);
const selectedLevel3 = ref(null);

// 各级可选项
const level1Options = ref([]);
const level2Options = ref([]);
const level3Options = ref([]);

// 获取所有机构数据
const getOrganizations = async () => {
    const res = await getAllOrganizations();
    if (res.code === 200) {
        organizationList.value = res.data;
        // 初始化一级机构选项
        level1Options.value = res.data;
    }
};

// 一级选择变化处理
const handleLevel1Change = (val) => {
    selectedLevel2.value = null;
    selectedLevel3.value = null;
    if (val) {
        level2Options.value = val.childrenOrg2 || [];
    } else {
        level2Options.value = [];
    }
    level3Options.value = [];
};

// 二级选择变化处理
const handleLevel2Change = (val) => {
    selectedLevel3.value = null;
    if (val) {
        level3Options.value = val.childrenOrg3 || [];
    } else {
        level3Options.value = [];
    }
};

onMounted(() => {
    getOrganizations();
});
</script>

<style scoped>
.select-container {
    display: flex;
    gap: 20px;
}
.el-select {
    width: 200px;
}
</style>
