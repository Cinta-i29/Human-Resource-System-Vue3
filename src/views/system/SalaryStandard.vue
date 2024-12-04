<template>
    <div>
        <!-- 顶部操作区 -->
        <div class="operation-area">
            <span class="operation-title">新增薪酬标准</span>
        </div>

        <div class="form">
            <el-form
                :model="salaryStandardForm"
                :rules="rules"
                ref="salaryStandardFormRef"
                label-width="auto"
                style="max-width: 600px"
            >
                <el-form-item label="标准名称" prop="name">
                    <el-input v-model="salaryStandardForm.name" />
                </el-form-item>
                <el-form-item label="薪酬项目" prop="salaryItemIdList">
                    <el-table
                        ref="salaryTableRef"
                        :data="salaryItems"
                        style="width: 100%; margin-top: 20px"
                        border
                        @selection-change="handleSelectionChange"
                        :selectable="checkSelectable"
                    >
                        <el-table-column type="selection" width="55" />
                        <el-table-column prop="name" label="项目名称" />
                        <el-table-column prop="isDeduction" label="是否为扣款项">
                            <template #default="{ row }">
                                {{ row.isDeduction ? "是" : "否" }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item style="margin-top: 20px;">
                    <el-button type="primary" @click="submitForm">提交</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, nextTick } from "vue";
import { getAllSalaryItems } from "@/api/salaryItem";
import { addSalaryStandard } from "@/api/salaryStandard";

const salaryItems = ref([]);
const salaryTableRef = ref(null);
const salaryStandardFormRef = ref(null);
const salaryStandardForm = reactive({
    name: "",
    salaryItemIdList: [],
});

// 表单验证规则
const rules = {
    name: [{ required: true, message: "请输入标准名称", trigger: "blur" }],
    salaryItemIdList: [
        {
            type: "array",
            required: true,
            message: "请至少选择一项薪酬项目",
            trigger: "change",
            validator: (rule, value, callback) => {
                if (value.length === 0) {
                    callback(new Error("请至少选择一项薪酬项目"));
                } else {
                    callback();
                }
            },
        },
    ],
};

// 添加判断是否可选的方法
const checkSelectable = (row, index) => {
    return index !== 0;  // 第一行（索引为0）不可选
};

// 修改处理表格选择变化的方法
const handleSelectionChange = (selection) => {
    // 确保第一项始终被选中
    const firstItem = salaryItems.value[0];
    if (firstItem && !selection.includes(firstItem)) {
        selection.unshift(firstItem);
        salaryTableRef.value?.toggleRowSelection(firstItem, true);
    }
    // 更新选中的ID列表
    salaryStandardForm.salaryItemIdList = selection.map((item) => item.id);
    salaryStandardFormRef.value?.validateField("salaryItemIdList");
};

// 修改获取薪酬项目的方法
const getSalaryItems = async () => {
    const res = await getAllSalaryItems();
    if (res.code === 200) {
        salaryItems.value = res.data;
        // 在数据加载完成后，自动选中第一行
        if (salaryItems.value.length > 0) {
            nextTick(() => {
                salaryTableRef.value?.toggleRowSelection(salaryItems.value[0], true);
            });
        }
    } else {
        ElMessage.error(res.msg);
    }
};

// 提交表单
const submitForm = () => {
    salaryStandardFormRef.value?.validate(async (valid) => {
        if (valid) {
            try {
                const res = await addSalaryStandard(salaryStandardForm);
                if (res.code === 200) {
                    ElMessage.success(res.msg);
                    // 重置表单
                    resetForm();
                } else {
                    ElMessage.error(res.msg);
                }
            } catch (error) {
                ElMessage.error('添加薪酬标准失败');
            }
        } else {
            ElMessage.error('请完善表单信息');
            return false;
        }
    });
};

// 重置表单
const resetForm = () => {
    salaryStandardFormRef.value?.resetFields();
    // 清除表格选中状态后，重新选中第一行
    salaryTableRef.value?.clearSelection();
    if (salaryItems.value.length > 0) {
        salaryTableRef.value?.toggleRowSelection(salaryItems.value[0], true);
    }
};

onMounted(() => {
    getSalaryItems();
});
</script>
<style scoped>
.operation-area {
    margin-bottom: 10px;
    display: flex;
    padding: 10px 0;
    justify-content: space-between;
    align-items: center;
}
.opertaion-title {
    font-weight: bold;
}
.form {
    margin-top: 20px;
}
</style>
