<template>
    <div>
        <div class="operation-area">
            <span class="operation-title">人力资源档案查询</span>
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

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="职位">
                            <el-select
                                v-model="searchForm.positionId"
                                placeholder="请选择"
                                clearable
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="position in positions"
                                    :key="position.id"
                                    :label="position.name"
                                    :value="position.id"
                                />
                            </el-select>
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
                <el-table-column prop="status" label="档案状态" />
                <el-table-column label="操作" width="200">
                    <template #default="{ row }">
                        <el-button type="primary" text bg @click="handleDetail(row)">
                            查看
                        </el-button>
                        <el-button
                            v-if="userRole === 'HR-Specialist'"
                            type="warning"
                            text
                            bg
                            @click="handleEdit(row)"
                            :disabled="row.status !== '正常'"
                        >
                            变更
                        </el-button>
                        <el-button
                            v-if="userRole === 'HR-Manager'"
                            type="danger"
                            text
                            bg
                            @click="handleDelete(row)"
                        >
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 添加编辑对话框 -->
        <el-dialog
            v-model="editDialogVisible"
            :title="dialogMode === 'view' ? '查看员工档案' : '修改员工档案'"
            width="80%"
            :before-close="handleDialogClose"
        >
            <el-form
                :model="editForm"
                :rules="dialogMode === 'edit' ? rules : {}"
                ref="editFormRef"
                label-width="100px"
            >
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="档案编号">
                            <el-input v-model="editForm.recordNumber" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所属机构">
                            <el-input :value="getOrgFullName" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="职位">
                            <el-input :value="getPositionName" disabled />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="editForm.name" :disabled="isViewMode" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="性别" prop="gender">
                            <el-select
                                v-model="editForm.gender"
                                placeholder="请选择性别"
                                :disabled="isViewMode"
                            >
                                <el-option
                                    v-for="gender in genders"
                                    :key="gender.value"
                                    :label="gender.label"
                                    :value="gender.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="职称" prop="title">
                            <el-select
                                v-model="editForm.title"
                                placeholder="请选择职称"
                                :disabled="isViewMode"
                            >
                                <el-option
                                    v-for="title in jobTitles"
                                    :key="title.value"
                                    :label="title.label"
                                    :value="title.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="出生日期" prop="birthDate">
                            <el-date-picker
                                v-model="editForm.birthDate"
                                type="date"
                                placeholder="请选择出生日期"
                                format="YYYY/MM/DD"
                                value-format="YYYY-MM-DD"
                                :disabled="isViewMode"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="年龄" prop="age">
                            <el-input
                                v-model.number="editForm.age"
                                type="text"
                                :disabled="isViewMode"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="民族" prop="ethnicity">
                            <el-select
                                v-model="editForm.ethnicity"
                                placeholder="请选择民族"
                                :disabled="isViewMode"
                            >
                                <el-option
                                    v-for="nationalitie in nationalities"
                                    :key="nationalitie.value"
                                    :label="nationalitie.label"
                                    :value="nationalitie.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="政治面貌" prop="politicalStatus">
                            <el-select
                                v-model="editForm.politicalStatus"
                                placeholder="请选择政治面貌"
                                :disabled="isViewMode"
                            >
                                <el-option
                                    v-for="status in politicalStatusList"
                                    :key="status.value"
                                    :label="status.label"
                                    :value="status.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="身份证号" prop="idCardNumber">
                            <el-input v-model="editForm.idCardNumber" :disabled="isViewMode" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="社保号码" prop="socialSecurityNumber">
                            <el-input
                                v-model="editForm.socialSecurityNumber"
                                :disabled="isViewMode"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="学历" prop="education">
                            <el-select
                                v-model="editForm.education"
                                placeholder="请选择学历"
                                :disabled="isViewMode"
                            >
                                <el-option
                                    v-for="education in educations"
                                    :key="education.value"
                                    :label="education.label"
                                    :value="education.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="专业" prop="educationMajor">
                            <el-input v-model="editForm.educationMajor" :disabled="isViewMode" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="宗教信仰" prop="religion">
                            <el-input v-model="editForm.religion" :disabled="isViewMode" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="出生地" prop="birthplace">
                            <el-input v-model="editForm.birthplace" :disabled="isViewMode" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="固定电话" prop="phone">
                            <el-input v-model="editForm.phone" :disabled="isViewMode" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="手机电话" prop="mobile">
                            <el-input v-model="editForm.mobile" :disabled="isViewMode" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="editForm.email" :disabled="isViewMode" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="QQ" prop="qq">
                            <el-input v-model="editForm.qq" :disabled="isViewMode" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="邮政编码" prop="postalCode">
                            <el-input v-model="editForm.postalCode" :disabled="isViewMode" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="详细住址" prop="address">
                            <el-input v-model="editForm.address" :disabled="isViewMode" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开户行" prop="bank">
                            <el-input v-model="editForm.bank" :disabled="isViewMode" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="银行账号" prop="account">
                            <el-input v-model="editForm.account" :disabled="isViewMode" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="特长" prop="specialty">
                            <el-input v-model="editForm.specialty" :disabled="isViewMode" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="爱好" prop="hobbies">
                            <el-input v-model="editForm.hobbies" :disabled="isViewMode" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="个人履历" prop="resume">
                            <el-input
                                v-model="editForm.resume"
                                type="textarea"
                                :rows="4"
                                :disabled="isViewMode"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="家庭关系" prop="familyInfo">
                            <el-input
                                v-model="editForm.familyInfo"
                                type="textarea"
                                :rows="4"
                                :disabled="isViewMode"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remarks">
                            <el-input
                                v-model="editForm.remarks"
                                type="textarea"
                                :rows="4"
                                :disabled="isViewMode"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer v-if="dialogMode === 'edit'">
                <span class="dialog-footer">
                    <el-button @click="handleDialogClose">取消</el-button>
                    <el-button type="primary" @click="handleEditSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import {
    getAllEmployees,
    getEmployeesByCondition,
    getEmployeesById,
    updateEmployee,
    deleteEmployeeById
} from "@/api/employee";
import { getAllOrganizations, getInfoByOrgId3 } from "@/api/organization";
import { getAllPositions } from "@/api/position";
import { ElMessageBox, ElMessage } from "element-plus";
import {
    genders,
    jobTitles,
    nationalities,
    educations,
    politicalStatusList,
} from "@/utils/options";

const userRole = ref(localStorage.getItem("role") || "");

const employees = ref([]);
const positions = ref([]);
const dateRange = ref([]);
const searchForm = reactive({
    firstCode: "",
    secondCode: "",
    thirdCode: "",
    positionId: "",
    startTime: "",
    endTime: "",
});
// 编辑对话框相关
const editDialogVisible = ref(false);
const editFormRef = ref(null);
const editForm = ref({});
// 'view' 表示查看模式, 'edit' 表示编辑模式
const dialogMode = ref("view");
// 判断是否为查看模式
const isViewMode = computed(() => dialogMode.value === "view");

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
    const level2Org = level1Org?.childrenOrg2?.find(
        (org) => org.code === searchForm.secondCode,
    );
    return level2Org?.childrenOrg3 || [];
});

// 表单验证规则
const rules = {
    name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    gender: [{ required: true, message: "请选择性别", trigger: "change" }],
    title: [{ required: true, message: "请选择职称", trigger: "change" }],
    birthDate: [{ required: true, message: "请选择出生日期", trigger: "change" }],
    age: [
        { required: true, message: "请输入年龄", trigger: "blur" },
        { type: "number", message: "年龄必须为数字", trigger: "blur" },
    ],
    ethnicity: [{ required: true, message: "请选择民族", trigger: "change" }],
    religion: [{ required: true, message: "请输入宗教信仰", trigger: "blur" }],
    politicalStatus: [{ required: true, message: "请选择政治面貌", trigger: "change" }],
    idCardNumber: [{ required: true, message: "请输入身份证号", trigger: "blur" }],
    socialSecurityNumber: [{ required: true, message: "请输入社保号码", trigger: "blur" }],
    education: [{ required: true, message: "请选择学历", trigger: "change" }],
    educationMajor: [{ required: true, message: "请输入学历专业", trigger: "blur" }],
    nationality: [{ required: true, message: "请输入国籍", trigger: "blur" }],
    birthplace: [{ required: true, message: "请输入出生地", trigger: "blur" }],
    phone: [{ required: true, message: "请输入固定电话", trigger: "blur" }],
    mobile: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
    email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
    qq: [{ required: true, message: "请输入QQ号", trigger: "blur" }],
    postalCode: [{ required: true, message: "请输入邮政编码", trigger: "blur" }],
    address: [{ required: true, message: "请输入详细住址", trigger: "blur" }],
    bank: [{ required: true, message: "请输入开户银行", trigger: "blur" }],
    account: [{ required: true, message: "请输入银行账号", trigger: "blur" }],
    specialty: [{ required: true, message: "请输入特长", trigger: "blur" }],
    hobbies: [{ required: true, message: "请输入爱好", trigger: "blur" }],
    resume: [{ required: true, message: "请输入个人履历", trigger: "blur" }],
    familyInfo: [{ required: true, message: "请输入家庭关系", trigger: "blur" }],
    remarks: [{ required: true, message: "请输入备注", trigger: "blur" }],
};

// 处理一级机构变化
const handleFirstChange = () => {
    searchForm.secondCode = null;
    searchForm.thirdCode = null;
};

// 处理二级机构变化
const handleSecondChange = () => {
    searchForm.thirdCode = null;
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
    const res = await getAllEmployees();
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

// 查询
const handleSearch = async () => {
    searchForm.startTime = dateRange.value?.[0] || "";
    searchForm.endTime = dateRange.value?.[1] || "";
    const res = await getEmployeesByCondition(searchForm);
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

// 重置
const handleReset = () => {
    searchForm.firstCode = "";
    searchForm.secondCode = "";
    searchForm.thirdCode = "";
    searchForm.positionId = "";
    searchForm.startTime = "";
    searchForm.endTime = "";
    getEmployees();
};

// 修改查看明细的处理函数
const handleDetail = async (row) => {
    dialogMode.value = "view";
    editForm.value = employees.value.find((employee) => employee.recordNumber === row.recordNumber);
    editDialogVisible.value = true;
};

// 修改编辑按钮的处理函数
const handleEdit = async (row) => {
    dialogMode.value = "edit";
    editForm.value = employees.value.find((employee) => employee.recordNumber === row.recordNumber);
    editDialogVisible.value = true;
};

// 获取完整的机构名称
const getOrgFullName = computed(() => {
    return `${editForm.value.firstOrgName || ""} / ${editForm.value.secondOrgName || ""} / ${editForm.value.thirdOrgName || ""}`;
});

// 获取职位名称
const getPositionName = computed(() => {
    const position = positions.value.find((p) => p.id === editForm.value.positionId);
    return position?.name || "";
});

// 关闭对话框
const handleDialogClose = () => {
    editDialogVisible.value = false;
    editFormRef.value?.resetFields();
};

// 提交编辑表单
const handleEditSubmit = () => {
    if (!editFormRef.value) return;

    editFormRef.value.validate(async (valid) => {
        if (valid) {
            try {
                console.log(editForm.value);
                const res = await updateEmployee(editForm.value);
                if (res.code === 200) {
                    ElMessage.success("修改成功");
                    editDialogVisible.value = false;
                    getEmployees(); // 重新加载数据
                } else {
                    ElMessage.error(res.msg || "修改失败");
                }
            } catch (error) {
                ElMessage.error("修改失败");
            }
        } else {
            // 表单验证失败
            ElMessage.error("请填写正确的表单信息");
            return false;
        }
    });
};

// 删除
const handleDelete = (row) => {
    ElMessageBox.confirm("确定要删除该档案吗？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(async () => {
            try {
                // console.log(row);
                const res = await deleteEmployeeById(row.recordNumber);
                if (res.code === 200) {
                    ElMessage.success("删除成功");
                    getEmployees(); // 重新加载数据
                } else {
                    ElMessage.error(res.msg);
                }
            } catch (error) {
                ElMessage.error("删除失败");
            }
        })
        .catch(() => {
            ElMessage.info("已取消删除");
        });
};

onMounted(() => {
    getEmployees();
    getOrganizations();
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
</style>
