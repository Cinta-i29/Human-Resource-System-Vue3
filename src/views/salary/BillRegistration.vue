<template>
    <div>
        <div class="operation-area">
            <span class="operation-title">薪酬发放登记</span>
        </div>

        <div class="search-area">
            <el-form :model="searchForm">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="一级机构">
                            <el-select
                                v-model="searchForm.firstCode"
                                placeholder="请选择"
                                clearable
                                @change="handleFirstChange"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="org in level1Options"
                                    :key="org.code"
                                    :label="org.name"
                                    :value="org.code"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="二级机构">
                            <el-select
                                v-model="searchForm.secondCode"
                                placeholder="请选择"
                                clearable
                                @change="handleSecondChange"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="org in level2Options"
                                    :key="org.code"
                                    :label="org.name"
                                    :value="org.code"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="三级机构">
                            <el-select
                                v-model="searchForm.thirdCode"
                                placeholder="请选择"
                                clearable
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="org in level3Options"
                                    :key="org.code"
                                    :label="org.name"
                                    :value="org.code"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" style="text-align: center">
                        <el-form-item>
                            <el-button type="primary" @click="handleSearch">查询</el-button>
                            <el-button @click="handleReset">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <div class="table">
            <el-table :data="bills" stripe border>
                <el-table-column label="档案编号" prop="recordNumber" />
                <el-table-column label="员工姓名" prop="name" />
                <el-table-column label="职位" prop="positionName" />
                <el-table-column label="职称" prop="title" />
                <el-table-column label="薪酬标准" prop="salaryStandardName" />
                <el-table-column label="薪酬总额" prop="salaryStandardAmount" />
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="handleRegister(row)">
                            登记
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 添加薪酬标准详情对话框 -->
        <el-dialog
            v-model="dialogVisible"
            title="薪酬标准详情"
            width="600px"
        >
            <!-- 添加员工基本信息 -->
            <el-descriptions :column="2" border>
                <el-descriptions-item label="员工姓名">{{ currentEmployee?.name }}</el-descriptions-item>
                <el-descriptions-item label="档案编号">{{ currentEmployee?.recordNumber }}</el-descriptions-item>
            </el-descriptions>

            <!-- 原有的薪酬标准信息 -->
            <el-descriptions :column="2" border style="margin-top: 20px">
                <el-descriptions-item label="标准名称">{{ currentStandard.name }}</el-descriptions-item>
                <el-descriptions-item label="状态">{{ currentStandard.status }}</el-descriptions-item>
                <el-descriptions-item label="复核人">{{ reviewerName }}</el-descriptions-item>
                <el-descriptions-item label="复核时间">{{ formatDateTime(currentStandard.reviewAt) }}</el-descriptions-item>
            </el-descriptions>

            <el-table :data="currentStandard.salaryItemMoneyVoList" style="margin-top: 20px">
                <el-table-column label="项目名称" prop="name" />
                <el-table-column label="金额" prop="money">
                    <template #default="{ row }">
                        <span :style="{ color: row.isDeduction ? '#f56c6c' : '#67c23a' }">
                            {{ row.isDeduction ? '-' : '+' }}{{ row.money.toFixed(2) }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="类型" prop="isDeduction">
                    <template #default="{ row }">
                        {{ row.isDeduction ? '扣除项' : '发放项' }}
                    </template>
                </el-table-column>
            </el-table>

            <!-- 添加奖金输入框 -->
            <el-form :model="bonusForm" label-width="120px" style="margin-top: 20px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="奖励奖金">
                            <el-input-number 
                                v-model="bonusForm.reward" 
                                :min="0"
                                :precision="2"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="应扣奖金">
                            <el-input-number 
                                v-model="bonusForm.deduction" 
                                :min="0"
                                :precision="2"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <!-- 添加总额显示 -->
            <div class="salary-total" style="margin-top: 20px; text-align: right">
                <el-descriptions :column="1">
                    <el-descriptions-item label="标准总额度">
                        {{ standardTotal.toFixed(2) }}
                    </el-descriptions-item>
                    <el-descriptions-item label="实发总额">
                        <span style="color: #67c23a; font-weight: bold; font-size: 16px">
                            {{ finalTotal.toFixed(2) }}
                        </span>
                    </el-descriptions-item>
                </el-descriptions>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">关闭</el-button>
                    <el-button type="primary" @click="handleSubmitRegister">登记</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { getRegisterBillList, registerBill } from "@/api/bill";
import { getAllOrganizations } from "@/api/organization";
import { getStandardByEmployeeId } from "@/api/salaryStandard";
import { formatDateTime } from "@/utils/format";
import { getUserInfoById } from "@/api/user";

const searchForm = reactive({
    firstCode: "",
    secondCode: "",
    thirdCode: "",
});
const bills = ref([]);

// 机构选项
const organizations = ref([]);
const level1Options = ref([]);

// 计算二级机构选项
const level2Options = computed(() => {
    if (!searchForm.firstCode) return [];
    const level1Org = organizations.value.find((org) => org.code === searchForm.firstCode);
    return level1Org?.childrenOrg2 || [];
});

// 计算三级机构选项
const level3Options = computed(() => {
    if (!searchForm.secondCode) return [];
    const level1Org = organizations.value.find((org) => org.code === searchForm.firstCode);
    const level2Org = level1Org?.childrenOrg2?.find((org) => org.code === searchForm.secondCode);
    return level2Org?.childrenOrg3 || [];
});

// 处理一级机构变化
const handleFirstChange = () => {
    searchForm.secondCode = "";
    searchForm.thirdCode = "";
};

// 处理二级机构变化
const handleSecondChange = () => {
    searchForm.thirdCode = "";
};

// 获取所有机构
const getOrganizations = async () => {
    const res = await getAllOrganizations();
    if (res.code === 200) {
        organizations.value = res.data;
        level1Options.value = res.data;
    } else {
        ElMessage.error(res.msg);
    }
};

// 获取可登记薪酬帐单列表
const getRegisterBills = async () => {
    const res = await getRegisterBillList(searchForm);
    // console.log(res);
    if (res.code === 200) {
        bills.value = res.data;
    } else {
        console.log(res.msg);
    }
};

// 查询
const handleSearch = async () => {
    const res = await getRegisterBillList(searchForm);
    // console.log(res);
    if (res.code === 200) {
        bills.value = res.data;
    } else {
        console.log(res.msg);
    }
};

// 重置
const handleReset = () => {
    searchForm.firstCode = "";
    searchForm.secondCode = "";
    searchForm.thirdCode = "";
    getEmployees();
};

const dialogVisible = ref(false);
const currentStandard = ref({
    name: '',
    status: '',
    reviewComment: '',
    registrarAt: '',
    salaryItemMoneyVoList: []
});
const reviewerName = ref('');

// 添加奖金表单数据
const bonusForm = reactive({
    reward: 0,
    deduction: 0
});

// 计算标准总额（不含奖金）
const standardTotal = computed(() => {
    if (!currentStandard.value.salaryItemMoneyVoList) return 0;
    return currentStandard.value.salaryItemMoneyVoList.reduce((total, item) => {
        return item.isDeduction 
            ? total - item.money 
            : total + item.money;
    }, 0);
});

// 计算最终总额（含奖金）
const finalTotal = computed(() => {
    return standardTotal.value + bonusForm.reward - bonusForm.deduction;
});

// 添加当前选中的员工信息
const currentEmployee = ref(null);

// 修改 handleRegister 方法，保存当前选中的员工信息
const handleRegister = async (row) => {
    try {
        currentEmployee.value = row; // 保存当前选中的员工
        const res = await getStandardByEmployeeId(row.recordNumber);
        // console.log(res);
        if (res.code === 200 && res.data.length > 0) {
            currentStandard.value = res.data[0];
            // 重置奖金表单
            bonusForm.reward = 0;
            bonusForm.deduction = 0;
            // 获取复核人信息
            const userRes = await getUserInfoById(currentStandard.value.reviewId);
            if (userRes.code === 200) {
                reviewerName.value = userRes.data.name;
            }
            dialogVisible.value = true;
        } else {
            ElMessage.warning('未找到该员工的薪酬标准信息');
        }
    } catch (error) {
        console.error(error);
        ElMessage.error('获取薪酬标准信息失败');
    }
};

// 添加提交登记方法
const handleSubmitRegister = async () => {
    try {
        const params = {
            employeeId: currentEmployee.value.recordNumber,
            salaryStandardId: currentStandard.value.id,
            awardMoney: bonusForm.reward,
            deductionMoney: bonusForm.deduction
        };

        const res = await registerBill(params);
        console.log(res);
        if (res.code === 200) {
            ElMessage.success('登记成功');
            dialogVisible.value = false;
            // 刷新列表
            getRegisterBills();
        } else {
            ElMessage.error(res.msg || '登记失败');
        }
    } catch (error) {
        console.error(error);
        ElMessage.error('登记失败');
    }
};

onMounted(() => {
    getOrganizations();
    getRegisterBills();
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

.search-area {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 4px;
}

.el-button + .el-button {
    margin-left: 8px;
}

.dialog-footer {
    padding: 20px 0 0;
    text-align: right;
}

.el-descriptions {
    margin: 20px 0;
}

.salary-total {
    border-top: 1px solid #EBEEF5;
    padding-top: 20px;
}

.salary-total .el-descriptions {
    margin: 0;
}
</style>
