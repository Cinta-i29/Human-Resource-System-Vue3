<template>
    <div class="header">
        <div class="l-content">
            <div class="title">人力资源管理系统</div>
        </div>
        <div class="r-content">
            <span>欢迎，</span>
            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                    {{ username }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { ArrowDown } from "@element-plus/icons-vue";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { logout } from "@/api/user";

const userStore = useUserStore();
const username = localStorage.getItem("username");
const router = useRouter();

const handleCommand = async (command) => {
    if (command === "logout") {
        const res = await logout();
        if (res.code === 200) {
            userStore.clearUserInfo();
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("role");
            localStorage.removeItem("username");
            router.push("/");
            ElMessage.success("退出成功");
        }
    }
};
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
}

.title {
    font-weight: bold;
    font-size: 17px;
    color: #fff;
}

.r-content {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 16px;
}

.el-dropdown-link {
    display: flex;
    align-items: center;
    cursor: pointer;
    outline: none;
    color: #fff;
    font-size: 16px;
}

:deep(.el-dropdown-link:focus) {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
}
</style>
