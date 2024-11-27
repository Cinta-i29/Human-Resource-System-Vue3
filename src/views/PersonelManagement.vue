<template>
    <div class="common-layout">
      <el-container class="layout-container">
          <el-header>
              <common-header></common-header>
          </el-header>
          <el-container>
            <el-aside>
              <common-aside :list="list"></common-aside>
            </el-aside>
            <el-main>
                main
            </el-main>
          </el-container>
      </el-container>
    </div>
  </template>
  
  <script setup>
  import CommonHeader from '@/components/CommonHeader/CommonHeader.vue';
  import CommonAside from '@/components/CommonAside/CommonAside.vue';
  const list = [
    {
        id: 1,
        path: "",
        name: "人力资源档案登记",
        children:[]
    },
    {
        id: 2,
        path: "",
        name: "人力资源档案复核",
        children: []
    },
    {
        id: 3,
        path: "",
        name: "人力资源档案查询",
        children: []
    },
    {
        id: 4,
        path: "",
        name: "人力资源档案变更",
        children: []
    },
    {
        id: 5,
        path: "",
        name: "人力资源档案删除",
        children: []
    }
  ]
  </script>
  
  <style scoped>
  .common-layout, .layout-container{
      height: 100vh;
  }
  </style>