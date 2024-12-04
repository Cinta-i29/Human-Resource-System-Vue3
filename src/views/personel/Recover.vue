<template>
  <div>
    <div class="operation-area">
        <span class="operation-title">人力资源档案恢复</span>
    </div>

    <div class="table">
        <el-table :data="employees" stripe boder>
            <el-table-column label="档案编号" prop="recordNumber" />
            <el-table-column label="姓名" prop="name" />
            <el-table-column prop="firstOrgName" label="一级机构" />
            <el-table-column prop="secondOrgName" label="二级机构" />
            <el-table-column prop="thirdOrgName" label="三级机构" />
            <el-table-column prop="positionId" label="职位名称">
                <template #default="{ row }">
                    {{
                        positions.find((position) => position.id === row.positionId)?.name ||
                        "-"
                    }}
                </template>
            </el-table-column>
            <el-table-column label="复核" width="200">
                <template #default="{ row }">
                    <el-button type="primary" text bg @click="handleRecover(row)">
                        恢复
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import {
    getDeletedEmployee,
    recoverEmployeeById,
} from "@/api/employee";
import { getInfoByOrgId3 } from "@/api/organization";
import { getAllPositions } from "@/api/position";
import { ElMessage } from "element-plus";

const positions = ref([]);
const employees = ref([]);


// 恢复处理函数
const handleRecover = async (row) => { 
    ElMessageBox.confirm("确定要恢复该档案吗？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(async () => {
            try {
                // console.log(row);
                const res = await recoverEmployeeById(row.recordNumber);
                if (res.code === 200) {
                    ElMessage.success("恢复成功");
                    getEmployees(); // 重新加载数据
                } else {
                    ElMessage.error(res.msg);
                }
            } catch (error) {
                ElMessage.error("恢复失败");
            }
        })
        .catch(() => {
            ElMessage.info("已取消恢复");
        });
}

// 获取所有职位
const getPositions = async () => {
    const res = await getAllPositions();
    console.log(res);
    if (res.code === 200) {
        positions.value = res.data;
    } else {
        console.log(res.msg);
    }
};

// 获取所有档案信息
const getEmployees = async () => {
    const res = await getDeletedEmployee();
    if (res.code === 200) {
        const employeesWithOrg = ref([]);
        for (const employee of res.data) {
            const response = await getInfoByOrgId3(employee.organizationId);
            if (response.code === 200) {
                employeesWithOrg.value.push({
                    ...employee,
                    firstOrgName: response.data.firstOrgName,
                    secondOrgName: response.data.secondOrgName,
                    thirdOrgName: response.data.thirdOrgName,
                });
            } else {
                employeesWithOrg.value.push({
                    ...employee,
                    firstOrgName: "-",
                    secondOrgName: "-",
                    thirdOrgName: "-",
                });
            }
        }
        employees.value = employeesWithOrg.value;
    } else {
        ElMessage.error(res.msg);
    }
};

onMounted(() => {
    getEmployees();
    getPositions();
});
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
</style>