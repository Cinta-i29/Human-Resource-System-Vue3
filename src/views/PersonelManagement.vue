<template>
    <div class="common-layout">
      <el-container class="layout-container">
          <el-header class="header-container">
              <common-header></common-header>
          </el-header>
          <el-container>
            <el-aside>
              <common-aside :list="menuList"></common-aside>
            </el-aside>
            <el-main>
                main
            </el-main>
          </el-container>
      </el-container>
    </div>
</template>
  
<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import CommonHeader from '@/components/CommonHeader/CommonHeader.vue';
import CommonAside from '@/components/CommonAside/CommonAside.vue';

const router = useRouter();
const userStore = useUserStore();

const menus = [
  {
      id: 1,
      path: "",
      name: "人力资源档案登记",
      children:[],
      roles: ["HR-Specialist"]
  },
  {
      id: 2,
      path: "",
      name: "人力资源档案复核",
      children: [],
      roles: ["HR-Manager"]
  },
  {
      id: 3,
      path: "",
      name: "人力资源档案查询",
      children: [],
      roles: ["HR-Specialist", "HR-Manager"]
  },
  {
      id: 4,
      path: "",
      name: "人力资源档案变更",
      children: [],
      roles: ["HR-Specialist"]
  },
  {
      id: 5,
      path: "",
      name: "人力资源档案删除",
      children: [],
      roles: ["HR-Manager"]
  }
]

// 根据用户角色过滤菜单
const menuList = computed(() => {
  return menus.filter(menu => menu.roles.includes(userStore.role));
});

// 组件挂载时，如果当前路径是 /system，则自动跳转到第一个菜单项
// onMounted(() => {
//   if (router.currentRoute.value.path === '/personel') {
//     router.push(list[0].path);
//   }
// });
</script>
  
<style scoped>
.common-layout, .layout-container{
    height: 100vh;
}
.header-container {
  padding: 0;  /* 移除el-header的内边距 */
  background: linear-gradient(to right, #1485FE, #7F80FF);
}


.main-container{
background-color: #F2F2F2;
}

:deep(.el-header) {
  padding: 0;  /* 确保深层的el-header也没有内边距 */
}
</style>