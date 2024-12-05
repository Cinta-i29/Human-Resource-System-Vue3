<template>
    <div>
        <div class="operation-area">
            <span class="operation-title">薪酬标准查询</span>
        </div>
        <div class="search-area">
            <el-form :model="searchForm">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="薪酬标准编号">
                            <el-input v-model="searchForm.id"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="关键字">
                            <el-input v-model="searchForm.keywords"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="建档时间">
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
            <el-table :data="standardList" stripe border>
                <el-table-column label="薪酬标准编号" prop="id" width="120" />
                <el-table-column label="名称" prop="name" />
                <el-table-column label="制定人" width="120">
                    <template #default="{ row }">
                        {{ creatorMap[row.creatorId] || "加载中..." }}
                    </template>
                </el-table-column>
                <el-table-column label="制定时间" width="180">
                    <template #default="{ row }">
                        {{ formatDateTime(row.creatorAt) }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="120">
                    <template #default="{ row }">
                        <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="handleView(row)"> 查看 </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog v-model="dialogVisible" title="薪酬标准详情" width="60%">
            <div class="salary-info">
                <div class="info-item">
                    <span class="label">薪酬标准编号：</span>
                    <span>{{ currentStandard.id }}</span>
                </div>
                <div class="info-item">
                    <span class="label">制定人：</span>
                    <span>{{ creatorMap[currentStandard.creatorId] || "加载中..." }}</span>
                </div>
                <div class="info-item">
                    <span class="label">创建时间：</span>
                    <span>{{ formatDateTime(currentStandard.creatorAt) }}</span>
                </div>
                <div class="info-item" v-if="currentStandard.registrarId">
                    <span class="label">登记人：</span>
                    <span>{{ creatorMap[currentStandard.registrarId] || "加载中..." }}</span>
                </div>
                <div class="info-item" v-if="currentStandard.registrarAt">
                    <span class="label">登记时间：</span>
                    <span>{{ formatDateTime(currentStandard.registrarAt) }}</span>
                </div>
                <div class="info-item" v-if="currentStandard.reviewId">
                    <span class="label">复核人：</span>
                    <span>{{ creatorMap[currentStandard.reviewId] || "加载中..." }}</span>
                </div>
                <div class="info-item" v-if="currentStandard.reviewAt">
                    <span class="label">复核时间：</span>
                    <span>{{ formatDateTime(currentStandard.reviewAt) }}</span>
                </div>
                <div class="info-item" v-if="currentStandard.reviewComment">
                    <span class="label">复核意见：</span>
                    <span>{{ currentStandard.reviewComment }}</span>
                </div>
            </div>

            <el-table :data="currentStandard.salaryItemMoneyVoList" border>
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
        </el-dialog>
    </div>
</template>
<script setup>
import { reactive, ref, onMounted } from "vue";
import { queryStandardByCondition } from "@/api/salaryStandard";
import { getUserInfoById } from "@/api/user";
import { formatDateTime } from "@/utils/format";
import { ElMessage } from "element-plus";

const dateRange = ref([]);
const standardList = ref([]); // 表格数据
const creatorMap = ref({}); // 存储制定人信息的映射

const searchForm = reactive({
    id: "",
    keywords: "",
    startTime: "",
    endTime: "",
});

const dialogVisible = ref(false);
const currentStandard = ref({});

// 获取状态对应的类型
const getStatusType = (status) => {
    switch (status) {
        case "待登记":
            return "info";
        case "待复核":
            return "warning";
        case "正常":
            return "success";
        default:
            return "";
    }
};

// 获取制定人信息
const getCreatorInfo = async (creatorId) => {
    try {
        const res = await getUserInfoById(creatorId);
        if (res.code === 200) {
            creatorMap.value[creatorId] = res.data.name;
        }
    } catch (error) {
        console.error("获取制定人信息失败:", error);
    }
};

const handleSearch = async () => {
    searchForm.startTime = dateRange.value?.[0] || "";
    searchForm.endTime = dateRange.value?.[1] || "";
    const res = await queryStandardByCondition(searchForm);
    console.log(res);
    if (res.code === 200) {
        standardList.value = res.data;
        // 获取所有制定人的信息
        const creatorIds = [...new Set(res.data.map((item) => item.creatorId))];
        creatorIds.forEach((id) => getCreatorInfo(id));
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

// 查看详情
const handleView = async (row) => {
    currentStandard.value = JSON.parse(JSON.stringify(row));
    dialogVisible.value = true;

    // 获取所有需要的用户信息
    try {
        // 获取制定人信息
        if (row.creatorId) {
            const creatorRes = await getUserInfoById(row.creatorId);
            if (creatorRes.code === 200) {
                creatorMap.value[row.creatorId] = creatorRes.data.name;
            }
        }

        // 获取登记人信息
        if (row.registrarId) {
            const registrarRes = await getUserInfoById(row.registrarId);
            if (registrarRes.code === 200) {
                creatorMap.value[row.registrarId] = registrarRes.data.name;
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

// 初始化时执行一次查询
onMounted(() => {
    handleSearch();
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
</style>
