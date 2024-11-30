<template>
    <div>
        <!-- 顶部操作区 -->
        <div class="operation-area">
            <span class="operation-title">用户管理</span>
            <el-button type="primary" @click="handleAdd">添加用户</el-button>
        </div>

        <!-- 用户列表 -->
        <div class="user-table">
            <el-table :data="userList" stripe style="width: 100%">
                <el-table-column prop="username" label="用户" />
                <el-table-column prop="name" label="姓名" />
                <el-table-column prop="password" label="密码" :formatter="formatPassword" />
                <el-table-column prop="role" label="用户角色" />
                <el-table-column label="操作" width="200">
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

        <!-- 添加/编辑用户对话框 -->
        <div class="dialog">
            <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500">
                <el-form :model="userForm" :rules="rules" ref="userFormRef" label-width="80px">
                    <el-form-item label="账户" prop="username">
                        <el-input
                            v-model="userForm.username"
                            :disabled="dialogTitle === '编辑用户'"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="userForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="userForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="用户角色" prop="role">
                        <el-select v-model="userForm.role" placeholder="请选择用户角色">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
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
import { useUserStore } from "@/store/user";
import { ElMessage, ElMessageBox } from "element-plus";
import { getAllUsers, addUser, updateUser, deleteUser } from "@/api/user";

const userStore = useUserStore();
const userFormRef = ref(null);

const options = userStore.roleOption;
const userList = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const userForm = ref({
    userId: null,
    username: "",
    password: "",
    name: "",
    role: "",
});

// 表单验证规则
const rules = {
    username: [{ required: true, message: "请输入账户名", trigger: "blur" }],
    name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    role: [{ required: true, message: "请选择用户角色", trigger: "change" }],
};

// 获取所有用户
const getUsers = async () => {
    const res = await getAllUsers();
    console.log(res);
    if (res.code === 200) {
        userList.value = res.data;
    } else {
        console.log(res.msg);
    }
};

// 格式化姓名
const formatPassword = (row) => {
    return "******";
};

// 添加用户
const handleAdd = () => {
    dialogTitle.value = "添加用户";
    userForm.value = {
        userId: null,
        username: "",
        password: "",
        name: "",
        role: "",
    };
    dialogVisible.value = true;
};

// 编辑用户
const handleEdit = (row) => {
    dialogTitle.value = "编辑用户";
    userForm.value = { ...row };
    dialogVisible.value = true;
};

// 删除用户
const handleDelete = (row) => {
    // console.log(row.userId);
    ElMessageBox.confirm("确定要删除该用户吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(async () => {
        try {
            const res = await deleteUser(row.userId);
            if (res.code === 200) {
                ElMessage.success("删除成功");
                getUsers();
            } else {
                ElMessage.success(res.msg);
            }
        } catch (error) {
            ElMessage.error("删除失败");
        }
    });
};

// 处理取消
const handleCancel = () => {
    userFormRef.value?.resetFields();
    dialogVisible.value = false;
};

// 处理提交
const handleSubmit = () => {
    userFormRef.value?.validate(async (valid) => {
        if (valid) {
            // 表单验证通过
            let res;
            try {
                if (userForm.value.userId) {
                    res = await updateUser(userForm.value);
                } else {
                    res = await addUser(userForm.value);
                }
                if (res.code === 200) {
                    ElMessage.success(res.msg);
                    dialogVisible.value = false;
                    getUsers();
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
    getUsers();
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
