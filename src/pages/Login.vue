<template>
  <div class="layout-container">
    <div class="loginForm">
      <el-icon color="#CAE6FC" :size="30"><UserFilled /></el-icon>
      <div class="loginTitle">人力资源管理系统</div>
      <el-form
        label-width="auto"
        :model="loginFormData"
        style="max-width: 600px"
      >
        <el-form-item>
          <el-input v-model="loginFormData.username" placeholder="用户名"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="loginFormData.password" placeholder="密码"/>
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
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import request from '@/utils/request';

const loginFormData = ref({
  username: "",
  password:"",
})

const submitForm = async () => {
  if (loginFormData.username == "" || loginFormData.password == "") {
    return ElMessage.error("用户名或密码不能为空");
  }
  try {
    const res = await request.post("/user/login", loginFormData.value);
    if (res.code == 200) {
      localStorage.setItem("token", res.data.token);
    } else {
      ElMessage.error(res.msg)
    }
  } catch (error) { 
    console.error("登陆失败" + error);
    ElMessage.error("登陆失败");
  }
}
</script>
<style scoped>
.layout-container{
  width: 100vw;
  height: 100vh;
  background-color: #CAE6FC;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loginForm{
  background-color: #fff;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loginTitle{
  color: #373837;
  margin: 20px 0;
}

:deep(.el-button) {
  width: 100%;
}
</style>