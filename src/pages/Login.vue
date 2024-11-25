<template>
  <div class="layout-container">
    <div class="loginForm">
      <el-form
        label-width="auto"
        :model="formData"
        style="max-width: 600px"
        ref="formDataRef"
      >
        <el-form-item>
          <el-input v-model="formData.username" placeholder="用户名"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formData.password" placeholder="密码"/>
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
import { reactive, ref } from 'vue';

const formDataRef = ref();
const formData = reactive({
  username: "",
  password:"",
})

const submitForm = async () => {
  if (!formDataRef.value) {
    console.log('表单实例不存在');
    return;
  }
  
  console.log('表单实例：', formDataRef.value);
  console.log('表单数据：', formData);
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
}

:deep(.el-button) {
  width: 100%;
}
</style>