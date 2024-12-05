<template>
    <div>
        <div class="operation-area">
            <span class="operation-title">薪酬发放复核</span>
        </div>
        <div class="table">
            <el-table :data="bills" stripe border>
                <el-table-column label="档案编号" prop="employeeId" />
                <!-- <el-table-column label="员工姓名" prop="name" /> -->
                <el-table-column label="薪酬标准总额" prop="salaryStandardTotalMoney" />
                <el-table-column label="奖励奖金" prop="awardMoney" />
                <el-table-column label="应扣奖金" prop="deductionMoney" />
                <el-table-column label="账单总额" prop="billTotalMoney" />
                <el-table-column label="复核建议" width="200">
                    <template #default="{ row }">
                        <el-input
                            v-model="row.reviewOpinion"
                            placeholder="请输入复核建议"
                            type="textarea"
                            :rows="2"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="handleReview(row)"> 提交 </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { getBillsByCondition, reviewBill } from "@/api/bill";

const bills = ref([]);

const getBillsList = async () => {
    const form = {
        status: "待复核",
    };

    const res = await getBillsByCondition(form);
    // console.log(res);
    if (res.code === 200) {
        bills.value = res.data;
    } else {
        console.log(res.msg);
    }
};

const handleReview = async (row) => {
    console.log(row);
    const billForm = {
        id: row.id,
        awardMoney: row.awardMoney,
        deductionMoney: row.deductionMoney,
        reviewOpinion: row.reviewOpinion,
    };

    try {
        const res = await reviewBill(billForm);
        if (res.code === 200) {
            ElMessage.success("复核成功");
            getBillsList(); // 刷新列表
        } else {
            ElMessage.error(res.msg || "复核失败");
        }
    } catch (error) {
        console.error(error);
        ElMessage.error("复核失败");
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
</style>
