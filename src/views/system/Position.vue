<template>
    <div>
        <!-- 顶部操作区域 -->
        <div class="operation-area">
            <span class="operation-title">职位管理</span>
            <el-button type="primary" @click="handleAdd">添加职位</el-button>
        </div>
        <!-- 职位表格 -->
        <div class="position-table">
            <el-table :data="positions" stripe>
                <el-table-column label="序号" prop="id"></el-table-column>
                <el-table-column label="职位名称" prop="name"></el-table-column>
                <el-table-column label="操作" width="180">
                    <template #default="scope">
                        <el-button size="small" type="primary" @click="handleEdit(scope.row)"
                            >编辑</el-button
                        >
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 添加/编辑职位对话框 -->
        <div class="dialog">
            <el-dialog v-model="dialogVisible" title="职位信息" width="30%">
                <el-form
                    :model="positionForm"
                    :rules="rules"
                    ref="positionFormRef"
                    label-width="80px"
                >
                    <el-form-item label="职位名称">
                        <el-input v-model="positionForm.name"></el-input>
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
import { onMounted, ref } from "vue";
import { getAllPositions, deletePosition, addPosition, updatePosition } from "@/api/position";
import { ElMessage, ElMessageBox } from "element-plus";

const positions = ref([]);
const dialogVisible = ref(false);
const positionForm = ref({
    id: null,
    name: "",
});
const positionFormRef = ref(null);

const rules = {
    name: [{ required: true, message: "请输入职位名称", trigger: "blur" }],
};

// 获取所有职位
const getPositions = async () => {
    const res = await getAllPositions();
    if (res.code === 200) {
        positions.value = res.data;
    } else {
        console.log(res.msg);
    }
};

// 新建职位
const handleAdd = async () => {
    positionForm.value = {
        id: null,
        name: "",
    };
    dialogVisible.value = true;
};

// 编辑职位
const handleEdit = async (row) => {
    positionForm.value = { ...row };
    dialogVisible.value = true;
};

// 删除职位
const handleDelete = async (row) => {
    ElMessageBox.confirm("确定要删除该职位吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(async () => {
        try {
            const res = await deletePosition(row.id);
            if (res.code === 200) {
                ElMessage.success("删除成功");
                getPositions();
            } else {
                ElMessage.error(res.msg);
            }
        } catch (error) {
            ElMessage.error("删除失败");
        }
    });
};

// 取消事件
const handleCancel = () => {
    positionFormRef.value?.resetFields();
    dialogVisible.value = false;
};

// 提交表单
const handleSubmit = async () => {
    positionFormRef.value?.validate(async (valid) => {
        if (valid) {
            // 表单验证通过
            let res;
            try {
                if (positionForm.value.id) {
                    res = await updatePosition(positionForm.value);
                } else {
                    res = await addPosition(positionForm.value);
                }
                if (res.code === 200) {
                    ElMessage.success(res.msg);
                    dialogVisible.value = false;
                    getPositions();
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
    getPositions();
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

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>
