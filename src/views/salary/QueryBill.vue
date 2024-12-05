<template>
    <div>
        <div class="operation-area">
            <span class="operation-title">薪酬发放查询</span>
        </div>
        <div class="search-area">
            <el-form :model="searchForm">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="薪酬单号">
                            <el-input v-model="searchForm.id"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="登记时间">
                            <el-date-picker
                                v-model="dateRange"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="YYYY-MM-DD"
                                style="width: 100%"
                            />
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
                <el-table-column label="档案编号" prop="employeeId" />
                <!-- <el-table-column label="员工姓名" prop="name" /> -->
                <el-table-column label="薪酬标准总额" prop="salaryStandardTotalMoney" />
                <el-table-column label="奖励奖金" prop="awardMoney" />
                <el-table-column label="应扣奖金" prop="deductionMoney" />
                <el-table-column label="账单总额" prop="billTotalMoney" />
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="handleDetail(row)"> 查看 </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 添加账单详情对话框 -->
        <el-dialog v-model="dialogVisible" title="薪酬发放详情" width="60%">
            <div class="salary-info">
                <div class="info-item">
                    <span class="label">档案编号：</span>
                    <span>{{ currentBill?.employeeId }}</span>
                </div>
                <div class="info-item">
                    <span class="label">薪酬标准：</span>
                    <span>{{ currentBill?.salaryStandardName }}</span>
                </div>
                <div class="info-item">
                    <span class="label">登记人：</span>
                    <span>{{ creatorMap[currentBill?.registerId] || "加载中..." }}</span>
                </div>
                <div class="info-item">
                    <span class="label">登记时间：</span>
                    <span>{{ formatDateTime(currentBill?.registerTime) }}</span>
                </div>
                <div class="info-item">
                    <span class="label">复核人：</span>
                    <span>{{ creatorMap[currentBill?.reviewId] || "加载中..." }}</span>
                </div>
                <div class="info-item">
                    <span class="label">复核时间：</span>
                    <span>{{ formatDateTime(currentBill?.reviewTime) }}</span>
                </div>
                <div class="info-item">
                    <span class="label">复核意见：</span>
                    <span>{{ currentBill?.reviewOpinion }}</span>
                </div>
            </div>

            <el-table :data="currentBill?.salaryItemMoneyVoList || []" border>
                <el-table-column label="项目名称" prop="name" />
                <el-table-column label="扣款项" width="120">
                    <template #default="{ row }">
                        {{ row.isDeduction ? "是" : "否" }}
                    </template>
                </el-table-column>
                <el-table-column label="金额" width="200">
                    <template #default="{ row }">
                        <span>{{ row.money?.toFixed(2) || "0.00" }}</span>
                    </template>
                </el-table-column>
            </el-table>

            <div class="summary-info" style="margin-top: 20px">
                <div class="info-item">
                    <span class="label">薪酬标准总额：</span>
                    <span>{{ currentBill?.salaryStandardTotalMoney?.toFixed(2) || "0.00" }}</span>
                </div>
                <div class="info-item">
                    <span class="label">奖励奖金：</span>
                    <span>{{ currentBill?.awardMoney?.toFixed(2) || "0.00" }}</span>
                </div>
                <div class="info-item">
                    <span class="label">应扣奖金：</span>
                    <span>{{ currentBill?.deductionMoney?.toFixed(2) || "0.00" }}</span>
                </div>
                <div class="info-item">
                    <span class="label">账单总额：</span>
                    <span>{{ currentBill?.billTotalMoney?.toFixed(2) || "0.00" }}</span>
                </div>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">关闭</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import { getBillsByCondition } from "@/api/bill";
import { formatDateTime } from "@/utils/format";
import { getUserInfoById } from "@/api/user";

const bills = ref([]);

const dateRange = ref([]);
const searchForm = reactive({
    id: "",
    status: "已发放",
    registerStartTime: "",
    registerEndTime: "",
});

const dialogVisible = ref(false);
const currentBill = ref(null);
const creatorMap = ref({});

const handleSearch = async () => {
    searchForm.registerStartTime = dateRange.value?.[0] || "";
    searchForm.registerEndTime = dateRange.value?.[1] || "";
    console.log(searchForm);
    const res = await getBillsByCondition(searchForm);
    console.log(res);
    if (res.code === 200) {
        bills.value = res.data;
    } else {
        ElMessage.error(res.msg || "查询失败");
    }
};

const handleReset = () => {
    searchForm.id = "";
    searchForm.keywords = "";
    searchForm.startTime = "";
    searchForm.endTime = "";
    dateRange.value = [];
    handleSearch(); // 重置后自动查询
};

const getBillsList = async () => {
    const form = {
        status: "已发放",
    };

    const res = await getBillsByCondition(form);
    // console.log(res);
    if (res.code === 200) {
        bills.value = res.data;
    } else {
        console.log(res.msg);
    }
};

const handleDetail = async (row) => {
    currentBill.value = JSON.parse(JSON.stringify(row));
    dialogVisible.value = true;

    try {
        // 获取登记人信息
        if (row.registerId) {
            const registrarRes = await getUserInfoById(row.registerId);
            if (registrarRes.code === 200) {
                creatorMap.value[row.registerId] = registrarRes.data.name;
            }
        }

        // 获取复核人信息
        if (row.reviewId) {
            const reviewerRes = await getUserInfoById(row.reviewId);
            if (reviewerRes.code === 200) {
                creatorMap.value[row.reviewId] = reviewerRes.data.name;
            }
        }
    } catch (error) {
        console.error("获取用户信息失败:", error);
        ElMessage.error("获取用户信息失败");
    }
};

onMounted(() => {
    getBillsList();
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

.table {
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
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

.bill-detail {
    padding: 20px;
}

.dialog-footer {
    padding-top: 20px;
    text-align: right;
}
</style>
