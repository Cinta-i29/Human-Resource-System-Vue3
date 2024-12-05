<template>
    <div>
        <!-- 顶部操作区 -->
        <div class="operation-area">
            <span class="operation-title">薪酬项目管理</span>
            <div class="right-content">
                <el-button type="primary" @click="handleAdd">添加薪酬项目</el-button>
            </div>
        </div>

        <!-- 机构展示栏 -->
        <el-table :data="salaryItems" style="width: 100%; margin-top: 20px" border>
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="name" label="项目名称" />
            <el-table-column prop="isDeduction" label="是否为扣款项">
                <template #default="{ row }">
                    {{ row.isDeduction ? "是" : "否" }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <el-button size="small" type="danger" @click="handleDelete(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加对话框 -->
        <div class="dialog">
            <el-dialog v-model="dialogVisible" title="添加薪酬项目" width="500">
                <el-form
                    :model="salaryItemForm"
                    ref="salaryItemFormRef"
                    label-width="150px"
                    :rules="rules"
                >
                    <el-form-item label="项目名称" prop="name">
                        <el-input v-model="salaryItemForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="是否为扣款项" prop="isDeduction">
                        <el-radio-group v-model="salaryItemForm.isDeduction">
                            <el-radio :value="true">是</el-radio>
                            <el-radio :value="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="handleCancel">取消</el-button>
                        <el-button type="primary" @click="handleSubmit">确定</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>
<script setup>
import { getAllSalaryItems, deleteSalaryItem, addSalaryItem } from "@/api/salaryItem";
import { ref, onMounted } from "vue";

const salaryItems = ref([]);
const dialogVisible = ref(false);
const salaryItemFormRef = ref(null);
const salaryItemForm = ref({
    name: "",
    isDeduction: null,
});

const rules = {
    name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
    isDeduction: [{ required: true, message: "请选择是否为扣款项", trigger: "change" }],
};

// 获取所有薪酬项目
const getSalaryItems = async () => {
    const res = await getAllSalaryItems();
    console.log(res);
    if (res.code === 200) {
        salaryItems.value = res.data;
    } else {
        // console.log(res.msg);
        ElMessage.error(res.msg);
    }
};

// 添加薪酬项目
const handleAdd = () => {
    dialogVisible.value = true;
    salaryItemForm.value = {
        name: "",
        isDeduction: null,
    };
};

// 删除薪酬项目
const handleDelete = async (salaryItem) => {
    // console.log(salaryItem.id);
    ElMessageBox.confirm("确定要删除该薪酬项目吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(async () => {
        try {
            const res = await deleteSalaryItem(salaryItem.id);
            if (res.code === 200) {
                ElMessage.success("删除成功");
                getSalaryItems();
            } else {
                ElMessage.error(res.msg);
            }
        } catch (error) {
            ElMessage.error("删除失败");
        }
    });
};

// 处理取消
const handleCancel = () => {
    salaryItemFormRef.value?.resetFields();
    dialogVisible.value = false;
};

// 处理提交
const handleSubmit = () => {
    salaryItemFormRef.value?.validate(async (valid) => {
        if (valid) {
            // 表单验证通过
            // console.log(salaryItemForm.value);
            try {
                const res = await addSalaryItem(salaryItemForm.value);
                if (res.code === 200) {
                    ElMessage.success(res.msg);
                    dialogVisible.value = false;
                    getSalaryItems();
                } else {
                    ElMessage.error(res.msg);
                }
            } catch (error) {
                ElMessage.error("操作失败");
            }
        } else {
            ElMessage.error("请填写完整信息");
            return false;
        }
    });
};

onMounted(() => {
    getSalaryItems();
});
</script>
<style scoped>
.operation-area {
    margin-bottom: 10px;
    display: flex;
    padding: 10px;
    justify-content: space-between;
    align-items: center;
}
.opertaion-title {
    font-weight: bold;
}

.el-table {
    margin-top: 20px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}
</style>
