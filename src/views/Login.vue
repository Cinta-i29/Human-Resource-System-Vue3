<template>
    <div class="layout-container">
        <div class="loginForm">
            <el-icon color="#CAE6FC" :size="30"><UserFilled /></el-icon>
            <div class="loginTitle">人力资源管理系统</div>
            <el-form label-width="auto" :model="loginFormData" style="max-width: 600px">
                <el-form-item>
                    <el-input v-model="loginFormData.username" placeholder="用户名" />
                </el-form-item>
                <el-form-item>
                    <el-input v-model="loginFormData.password" placeholder="密码" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm" style="width: 100%">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script setup>
import { ElMessage } from "element-plus";
import { ref } from "vue";
import { login } from "@/api/user";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";

const router = useRouter();
const userStore = useUserStore();
const loginFormData = ref({
    username: "",
    password: "",
});

const submitForm = async () => {
    if (!loginFormData.value.username || !loginFormData.value.password) {
        return ElMessage.error("用户名或密码不能为空");
    }
    try {
        const res = await login(loginFormData.value);
        if (res.code === 200) {
            userStore.setUserInfo(res.data);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("username", res.data.name);
            ElMessage.success("登录成功");
            if (res.data.role === "Administrator") {
                router.push("/system");
            } else if (res.data.role === "HR-Specialist" || res.data.role === "HR-Manager") {
                router.push("/personel");
            }
        } else {
            ElMessage.error(res.msg || "登录失败");
        }
    } catch (error) {
        console.error("登录失败:", error);
        ElMessage.error("登录失败，请稍后重试");
    }
};
</script>
<style scoped>
.layout-container {
    width: 100vw;
    height: 100vh;
    background-color: #cae6fc;
    display: flex;
    justify-content: center;
    align-items: center;
}

.loginForm {
    background-color: #fff;
    padding: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.loginTitle {
    color: #373837;
    margin: 20px 0;
}

:deep(.el-button) {
    width: 100%;
}
</style>
