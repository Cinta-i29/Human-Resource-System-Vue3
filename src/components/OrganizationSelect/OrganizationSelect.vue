<template>
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
                :value="item.code"
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
                :value="item.code"
            />
        </el-select>

        <!-- 三级机构选择 -->
        <el-select
            v-model="selectedLevel3"
            placeholder="请选择三级机构"
            :disabled="!selectedLevel2"
            @change="handleLevel3Change"
        >
            <el-option
                v-for="item in level3Options"
                :key="item.code"
                :label="item.name"
                :value="item.code"
            />
        </el-select>
    </div>
</template>

<script setup>
import { onMounted, ref, defineEmits } from "vue";
import { getAllOrganizations } from "@/api/organization";

const emit = defineEmits(["update:modelValue", "change"]);

// 各级选中的值
const selectedLevel1 = ref(null);
const selectedLevel2 = ref(null);
const selectedLevel3 = ref(null);

// 各级可选项
const level1Options = ref([]);
const level2Options = ref([]);
const level3Options = ref([]);

// 添加 props 定义
const props = defineProps({
    defaultCodes: {
        type: Object,
        default: () => ({
            code1: 0,
            code2: 0,
            code3: 0,
        }),
    },
});

// 获取所有机构数据
const getOrganizations = async () => {
    const res = await getAllOrganizations();
    console.log(res);

    if (res.code === 200) {
        // 初始化一级机构选项
        level1Options.value = res.data;
    }
};

// 一级选择变化处理
const handleLevel1Change = (val) => {
    selectedLevel2.value = null;
    selectedLevel3.value = null;
    console.log(val);
    if (val) {
        level2Options.value =
            level1Options.value.find((option) => option.code == val).childrenOrg2 || [];
    } else {
        level2Options.value = [];
    }
    level3Options.value = [];
    emitValue();
};

// 二级选择变化处理
const handleLevel2Change = (val) => {
    selectedLevel3.value = null;
    if (val) {
        level3Options.value =
            level2Options.value.find((option) => option.code == val).childrenOrg3 || [];
    } else {
        level3Options.value = [];
    }
    emitValue();
};

// 三级选择变化处理
const handleLevel3Change = () => {
    emitValue();
};

// 发送选中的值
const emitValue = () => {
    const value = {
        level1: selectedLevel1.value,
        level2: selectedLevel2.value,
        level3: selectedLevel3.value,
    };
    emit("update:modelValue", value);
    emit("change", value);
};

// 在 onMounted 中处理默认值
onMounted(async () => {
    await getOrganizations();
    if (props.defaultCodes.code1) {
        // 设置默认选中值的逻辑
        const level1 = level1Options.value.find((item) => item.code === props.defaultCodes.code1);
        if (level1) {
            selectedLevel1.value = level1;
            handleLevel1Change(level1);

            if (props.defaultCodes.code2) {
                const level2 = level2Options.value.find(
                    (item) => item.code === props.defaultCodes.code2,
                );
                if (level2) {
                    selectedLevel2.value = level2;
                    handleLevel2Change(level2);

                    if (props.defaultCodes.code3) {
                        const level3 = level3Options.value.find(
                            (item) => item.code === props.defaultCodes.code3,
                        );
                        if (level3) {
                            selectedLevel3.value = level3;
                            handleLevel3Change(level3);
                        }
                    }
                }
            }
        }
    }
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
