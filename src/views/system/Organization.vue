<template>
    <div>
        <!-- 顶部操作区 -->
        <div class="operation-area">
            <span class="operation-title">机构管理</span>
            <div class="right-content">
                <el-button type="primary" @click="handleAdd1">添加一级机构</el-button>
                <el-button type="primary" @click="handleAdd2">添加二级机构</el-button>
                <el-button type="primary" @click="handleAdd3">添加三级机构</el-button>
            </div>
        </div>

        <!-- 机构展示栏 -->
        <el-table :data="tableData" stripe style="width: 100%; margin-top: 20px" border>
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="level1Name" label="一级机构" />
            <el-table-column prop="level2Name" label="二级机构" />
            <el-table-column prop="level3Name" label="三级机构" />
        </el-table>

        <!-- 添加机构对话框 -->
        <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
            <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
                <!-- 机构名称（所有级别都需要） -->
                <el-form-item label="机构名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入机构名称"></el-input>
                </el-form-item>

                <!-- 选择一级机构（仅二级和三级机构需要） -->
                <el-form-item v-if="currentLevel > 1" label="所属一级机构" prop="firstCode">
                    <el-select v-model="formData.firstCode" placeholder="请选择一级机构">
                        <el-option
                            v-for="org in level1Options"
                            :key="org.code"
                            :label="org.name"
                            :value="org.code"
                        />
                    </el-select>
                </el-form-item>

                <!-- 选择二级机构（仅三级机构需要） -->
                <el-form-item v-if="currentLevel === 3" label="所属二级机构" prop="secondCode">
                    <el-select
                        v-model="formData.secondCode"
                        placeholder="请选择二级机构"
                        :disabled="!formData.firstCode"
                    >
                        <el-option
                            v-for="org in level2Options"
                            :key="org.code"
                            :label="org.name"
                            :value="org.code"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getAllOrganizations, addOrganization } from "@/api/organization";
import { ElMessage } from "element-plus";

const tableData = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const level1Options = ref([]);
const currentLevel = ref(1);
const formData = ref({
    name: "",
    level: 0,
    firstCode: null,
    secondCode: null,
});

const formRef = ref(null);

// 二级机构选项（根据选择的一级机构筛选）
const level2Options = computed(() => {
    if (!formData.value.firstCode) return [];
    const level1Org = level1Options.value.find((org) => org.code === formData.value.firstCode);
    return level1Org?.childrenOrg2 || [];
});

// 表单验证规则
const rules = computed(() => ({
    name: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
    firstCode:
        currentLevel.value > 1
            ? [{ required: true, message: "请选择一级机构", trigger: "change" }]
            : [],
    secondCode:
        currentLevel.value === 3
            ? [{ required: true, message: "请选择二级机构", trigger: "change" }]
            : [],
}));

// 获取并处理表格数据
const getOrganizations = async () => {
    const res = await getAllOrganizations();
    console.log(res);
    if (res.code === 200) {
        const flattenedData = [];

        // 遍历一级机构
        res.data.forEach((level1) => {
            // 遍历二级机构
            (level1.childrenOrg2 || []).forEach((level2) => {
                // 遍历三级机构
                (level2.childrenOrg3 || []).forEach((level3) => {
                    flattenedData.push({
                        level1Name: level1.name,
                        level2Name: level2.name,
                        level3Name: level3.name,
                        level1: level1,
                        level2: level2,
                        level3: level3,
                    });
                });
            });
        });

        tableData.value = flattenedData;

        // 更新一级机构选项
        level1Options.value = res.data;
    }
};

// 修改顶部按钮的点击事件
const handleAdd1 = () => {
    dialogTitle.value = "添加一级机构";
    currentLevel.value = 1;
    formData.value = {
        name: "",
        level: 1,
        firstCode: null,
        secondCode: null,
    };
    dialogVisible.value = true;
};

const handleAdd2 = () => {
    dialogTitle.value = "添加二级机构";
    currentLevel.value = 2;
    formData.value = {
        name: "",
        level: 2,
        firstCode: null,
        secondCode: null,
    };
    dialogVisible.value = true;
};

const handleAdd3 = () => {
    dialogTitle.value = "添加三级机构";
    currentLevel.value = 3;
    formData.value = {
        name: "",
        level: 3,
        firstCode: null,
        secondCode: null,
    };
    dialogVisible.value = true;
};

// 表单提交处理
const handleSubmit = async () => {
    formRef.value?.validate(async (valid) => {
        if (valid) {
            try {
                const res = await addOrganization(formData.value);
                console.log(res);
                if (res.code === 200) {
                    ElMessage.success(res.msg);
                    dialogVisible.value = false;
                    getOrganizations();
                } else {
                    ElMessage.error(res.msg);
                }
            } catch (error) {
                if (error.message) {
                    ElMessage.error(error.message);
                }
            }
        } else {
            ElMessage.error("请填写完整信息");
            return false;
        }
    });
};

// 对话框关闭前的处理
const handleClose = () => {
    if (formRef.value) {
        formRef.value.resetFields();
    }
    formData.value = {
        name: "",
        level: 0,
        firstCode: null,
        secondCode: null,
    };
    dialogVisible.value = false;
};

onMounted(() => {
    getOrganizations();
});
</script>

<style scoped>
.operation-area {
    margin-bottom: 10px;
    display: flex;
    padding: 10px;
    justify-content: space-between;
    align-items: center;
}
.opertaion-title {
    font-weight: bold;
}

.el-table {
    margin-top: 20px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}
</style>
