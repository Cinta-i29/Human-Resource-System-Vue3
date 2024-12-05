<template>
    <div>
      <div class="operation-area">
          <span class="operation-title">薪酬标准登复核</span>
      </div>
  
      <div class="table">
          <el-table :data="salaryStandardList" stripe boder>
              <el-table-column label="标准编号" type="index" width="180px"/>
              <el-table-column label="名称" prop="name" />
              <el-table-column label="登记时间" prop="registrarAt">
                  <template #default="{ row }">
                      {{ formatDateTime(row.registrarAt) }}
                  </template>
              </el-table-column>
              <el-table-column label="登记" width="200">
                  <template #default="{ row }">
                      <el-button type="primary" text bg @click="handleReview(row)">
                          复核
                      </el-button>
                  </template>
              </el-table-column>
          </el-table>
      </div>
  
      <el-dialog
        v-model="dialogVisible"
        title="薪酬标准登记"
        width="60%"
      >
        <div class="salary-info">
          <div class="info-item">
            <span class="label">薪酬标准编号：</span>
            <span>{{ salaryStandard.id }}</span>
          </div>
          <div class="info-item">
            <span class="label">制定人：</span>
            <span>{{ creator }}</span>
          </div>
          <div class="info-item">
            <span class="label">创建时间：</span>
            <span>{{ formatDateTime(salaryStandard.creatorAt) }}</span>
          </div>
          <div class="info-item">
            <span class="label">登记人：</span>
            <span>{{ registrar }}</span>
          </div>
          <div class="info-item">
                <span class="label">登记时间：</span>
                <span>{{ formatDateTime(salaryStandard.registrarAt) }}</span>
            </div>
            <div class="info-item">
                <span class="label">复核意见：</span>
                <el-input v-model="salaryStandard.comment" type="textarea" :rows="3" placeholder="请输入复核意见"></el-input>
            </div>
        </div>
        <el-table :data="salaryStandard.salaryItemMoneyVoList" border>
          <el-table-column label="项目名称" prop="name" />
          <el-table-column label="扣款项" width="120">
            <template #default="{ row }">
              {{ row.isDeduction ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column label="金额" width="200">
            <template #default="{ row }">
              <el-input-number 
                v-model="row.money" 
                :min="0" 
                :precision="2" 
                :step="100"
                controls-position="right"
                :disabled="isAutoCalculated(row.name)"
                @change="handleBasicSalaryChange"
              />
            </template>
          </el-table-column>
        </el-table>
  
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitReview">
              确认复核
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { getAllSalaryStandards, reviewStandard } from '@/api/salaryStandard';
  import { getUserInfoById } from '@/api/user';
  import { ElMessage } from 'element-plus';
  
  const salaryStandardList = ref([]);
  const salaryStandard = ref({});
  const dialogVisible = ref(false);
const creator = ref("");
const registrar = ref("");
  
  // 添加时间格式化函数
  const formatDateTime = (dateTimeString) => {
      if (!dateTimeString) return '';
      const date = new Date(dateTimeString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  }
  
  // 获取待登记的薪酬标准
  const getSalaryStandards2 = async () => { 
      const res = await getAllSalaryStandards(2);
      // console.log(res);
      if (res.code === 200) {
          salaryStandardList.value = res.data;
      } else {
          console.log(res.msg);
      }
  }
  
  // 判断是否为自动计算的项目
  const isAutoCalculated = (name) => {
    return ['养老保险', '医疗保险', '失业保险', '住房公积金'].includes(name);
  }
  
  // 获取基本工资的值
  const getBasicSalary = computed(() => {
    const basicSalaryItem = salaryStandard.value.salaryItemMoneyVoList?.find(
      item => item.name === '基本工资'
    );
    return basicSalaryItem?.money || 0;
  });
  
  // 处理基本工资变化
  const handleBasicSalaryChange = () => {
    const basicSalary = getBasicSalary.value;
    
    salaryStandard.value.salaryItemMoneyVoList?.forEach(item => {
      switch (item.name) {
        case '养老保险':
          item.money = Number((basicSalary * 0.08).toFixed(2));
          break;
        case '医疗保险':
          item.money = Number((basicSalary * 0.02 + 3).toFixed(2));
          break;
        case '失业保险':
          item.money = Number((basicSalary * 0.005).toFixed(2));
          break;
        case '住房公积金':
          item.money = Number((basicSalary * 0.08).toFixed(2));
          break;
      }
    });
  }
  
  // 复核薪酬标准
  const handleReview = (row) => { 
      salaryStandard.value = JSON.parse(JSON.stringify(row));
      getCreator(row.creatorId);
      getRegistrar(row.registrarId);
      dialogVisible.value = true;
  }
  
  // 获取制定人信息
  const getCreator = async (id) => { 
      const res = await getUserInfoById(id);
      if (res.code === 200) {
          creator.value = res.data.name;
      } else {
          console.log(res.msg);
      }
  }

// 获取登记人信息
const getRegistrar = async (id) => { 
      const res = await getUserInfoById(id);
      if (res.code === 200) {
          registrar.value = res.data.name;
      } else {
          console.log(res.msg);
      }
  }
  
  // 提交审核
  const submitReview = async () => {
      try {
          handleBasicSalaryChange();
          
          // 构造提交的数据格式
          const standardForm = {
            id: salaryStandard.value.id,
            comment: salaryStandard.value.comment || '',
              registerSalaryItemMoneyVoList: salaryStandard.value.salaryItemMoneyVoList.map(item => ({
                  id: item.id,
                  money: item.money || 0
              }))
          };
  
          const res = await reviewStandard(standardForm);
          console.log(res);
          if (res.code === 200) {
              ElMessage.success('审核成功');
              dialogVisible.value = false;
              getSalaryStandards2(); // 刷新列表
          } else {
              ElMessage.error(res.msg || '审核失败');
          }
      } catch (error) {
          console.error(error);
          ElMessage.error('审核失败');
      }
  }
  
  onMounted(() => { 
      getSalaryStandards2();
  })
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
  .el-button + .el-button {
      margin-left: 8px;
  }
  
  .dialog-footer {
      padding: 20px 0 0;
      text-align: right;
  }
  
  .salary-info {
      margin-bottom: 20px;
  }
  
  .info-item {
      margin-bottom: 10px;
  }
  
  .label {
      font-weight: bold;
      margin-right: 10px;
  }
  
  .el-input-number {
      width: 100%;
  }
  
  /* 添加禁用输入框的样式 */
  .el-input-number.is-disabled {
    background-color: #f5f7fa;
  }
  </style>