<template>
    <div>
        <div class="operation-area">
            <span class="operation-title">人力资源档案登记</span>
        </div>
        <div class="form">
            <el-form :model="fileForm" :rules="rules" ref="fileFormRef" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="一级机构" prop="organizationCode1">
                            <el-select
                                v-model="fileForm.organizationCode1"
                                placeholder="请选择一级机构"
                                @change="handleLevel1Change"
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
                    <el-col :span="8">
                        <el-form-item label="二级机构" prop="organizationCode2">
                            <el-select
                                v-model="fileForm.organizationCode2"
                                placeholder="请选择二级机构"
                                :disabled="!fileForm.organizationCode1"
                                @change="handleLevel2Change"
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
                    <el-col :span="8">
                        <el-form-item label="三级机构" prop="organizationCode3">
                            <el-select
                                v-model="fileForm.organizationCode3"
                                placeholder="请选择三级机构"
                                :disabled="!fileForm.organizationCode2"
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
                        <el-form-item label="职位名称" prop="positionId">
                            <el-select v-model="fileForm.positionId" placeholder="请选择职位">
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
                        <el-form-item label="职称" prop="title">
                            <el-select v-model="fileForm.title" placeholder="请选择职称">
                                <el-option
                                    v-for="jobTitle in jobTitles"
                                    :key="jobTitle.id"
                                    :label="jobTitle.label"
                                    :value="jobTitle.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="薪酬标准" prop="salaryStandardId">
                            <el-select
                                v-model="fileForm.salaryStandardId"
                                placeholder="请选择薪酬标准"
                            >
                                <el-option
                                    v-for="salaryStandard in salaryStandards3"
                                    :key="salaryStandard.id"
                                    :label="salaryStandard.name"
                                    :value="salaryStandard.id"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="fileForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="性别" prop="gender">
                            <el-select v-model="fileForm.gender" placeholder="请选择性别">
                                <el-option
                                    v-for="gender in genders"
                                    :key="gender.id"
                                    :label="gender.label"
                                    :value="gender.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出生日期" prop="birthDate">
                            <el-date-picker
                                v-model="fileForm.birthDate"
                                type="date"
                                aria-label="请选择出生日期"
                                placeholder="请选择出生日期"
                                format="YYYY/MM/DD"
                                value-format="YYYY-MM-DD"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="年龄" prop="age">
                            <el-input v-model.number="fileForm.age" type="text"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="民族" prop="ethnicity">
                            <el-select v-model="fileForm.ethnicity" placeholder="请选择民族">
                                <el-option
                                    v-for="nationalitie in nationalities"
                                    :key="nationalitie.id"
                                    :label="nationalitie.label"
                                    :value="nationalitie.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="宗教信仰" prop="religion">
                            <el-input v-model="fileForm.religion"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="政治面貌" prop="politicalStatus">
                            <el-select
                                v-model="fileForm.politicalStatus"
                                placeholder="请选择政治面貌"
                            >
                                <el-option
                                    v-for="politicalStatus in politicalStatusList"
                                    :key="politicalStatus.id"
                                    :label="politicalStatus.label"
                                    :value="politicalStatus.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="身份证号" prop="idCardNumber">
                            <el-input v-model="fileForm.idCardNumber"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="社保号码" prop="socialSecurityNumber">
                            <el-input v-model="fileForm.socialSecurityNumber"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="学历" prop="education">
                            <el-select v-model="fileForm.education" placeholder="请选择学历">
                                <el-option
                                    v-for="education in educations"
                                    :key="education.id"
                                    :label="education.label"
                                    :value="education.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="专业" prop="educationMajor">
                            <el-input v-model="fileForm.educationMajor"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="国籍" prop="nationality">
                            <el-input v-model="fileForm.nationality"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="出生地" prop="birthplace">
                            <el-input v-model="fileForm.birthplace"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="固定电话" prop="phone">
                            <el-input v-model="fileForm.phone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="手机电话" prop="mobile">
                            <el-input v-model="fileForm.mobile"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="fileForm.email"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="QQ" prop="qq">
                            <el-input v-model="fileForm.qq"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="邮政编码" prop="postalCode">
                            <el-input v-model="fileForm.postalCode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="详细住址" prop="address">
                            <el-input v-model="fileForm.address"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开户行" prop="bank">
                            <el-input v-model="fileForm.bank"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="银行账号" prop="account">
                            <el-input v-model="fileForm.account"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="特长" prop="specialty">
                            <el-input v-model="fileForm.specialty"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="爱好" prop="hobbies">
                            <el-input v-model="fileForm.hobbies"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="个人履历" prop="resume">
                            <el-input
                                v-model="fileForm.resume"
                                type="textarea"
                                :rows="4"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="家庭关系" prop="familyInfo">
                            <el-input
                                v-model="fileForm.familyInfo"
                                type="textarea"
                                :rows="4"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remarks">
                            <el-input
                                v-model="fileForm.remarks"
                                type="textarea"
                                :rows="4"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="员工图片" prop="avatar">
                            <el-upload
                                class="avatar-uploader"
                                :auto-upload="false"
                                :show-file-list="false"
                                :on-change="handleAvatarChange"
                                :before-upload="beforeAvatarUpload"
                                accept="image/jpeg,image/png"
                            >
                                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-button type="primary" @click="handleSubmit"> 登记 </el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from "vue";
import {
    educations,
    nationalities,
    jobTitles,
    genders,
    politicalStatusList,
} from "@/utils/options";
import { getAllOrganizations } from "@/api/organization";
import { getAllPositions } from "@/api/position";
import { getAllSalaryStandards } from "@/api/salaryStandard";
import { addEmployeeFile, uploadAvatar } from "@/api/employee";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const fileForm = reactive({
    name: "",
    gender: "",
    birthDate: "",
    age: null,
    ethnicity: "",
    religion: "",
    politicalStatus: "",
    idCardNumber: "",
    socialSecurityNumber: "",
    education: "",
    educationMajor: "",
    nationality: "",
    birthplace: "",
    phone: "",
    mobile: "",
    email: "",
    qq: "",
    address: "",
    postalCode: "",
    bank: "",
    account: "",
    specialty: "",
    hobbies: "",
    resume: "",
    familyInfo: "",
    remarks: "",
    registrarId: null,
    organizationCode1: null,
    organizationCode2: null,
    organizationCode3: null,
    positionId: null,
    title: "",
    salaryStandardId: null,
});

// 职位数组
const positions = ref([]);
// 正常的薪酬标准
const salaryStandards3 = ref([]);

// 机构选项数据
const level1Options = ref([]);
const allOrganizations = ref([]);

// 计算二级机构选项
const level2Options = computed(() => {
    if (!fileForm.organizationCode1) return [];
    const level1Org = allOrganizations.value.find((org) => org.code === fileForm.organizationCode1);
    return level1Org?.childrenOrg2 || [];
});

// 计算三级机构选项
const level3Options = computed(() => {
    if (!fileForm.organizationCode2) return [];
    const level1Org = allOrganizations.value.find((org) => org.code === fileForm.organizationCode1);
    const level2Org = level1Org?.childrenOrg2?.find(
        (org) => org.code === fileForm.organizationCode2,
    );
    return level2Org?.childrenOrg3 || [];
});

// 处理一级机构变化
const handleLevel1Change = () => {
    fileForm.organizationCode2 = null;
    fileForm.organizationCode3 = null;
};

// 处理二级机构变化
const handleLevel2Change = () => {
    fileForm.organizationCode3 = null;
};

// 添加表单ref
const fileFormRef = ref(null);

// 添加表单验证规则
const rules = {
    organizationCode1: [{ required: true, message: "请选择一级机构", trigger: "change" }],
    organizationCode2: [{ required: true, message: "请选择二级机构", trigger: "change" }],
    organizationCode3: [{ required: true, message: "请选择三级机构", trigger: "change" }],
    positionId: [{ required: true, message: "请选择职位", trigger: "change" }],
    title: [{ required: true, message: "请选择职称", trigger: "change" }],
    salaryStandardId: [{ required: true, message: "请选择薪酬标准", trigger: "change" }],
    name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    gender: [{ required: true, message: "请选择性别", trigger: "change" }],
    birthDate: [{ required: true, message: "请选择出生日期", trigger: "change" }],
    age: [
        { required: true, message: "请输入年龄", trigger: "blur" },
        {
            validator: (rule, value, callback) => {
                if (isNaN(value)) {
                    callback(new Error("年龄必须是数字"));
                } else {
                    callback();
                }
            },
            trigger: "blur",
        },
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
    avatar: [
        {
            validator: (rule, value, callback) => {
                if (!avatarFile.value) {
                    callback(new Error("请上传头像"));
                } else {
                    callback();
                }
            },
            trigger: "change",
        },
    ],
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

// 获取正常的薪酬标准
const getSalaryStandards3 = async () => {
    const res = await getAllSalaryStandards(3);
    console.log(res);
    if (res.code === 200) {
        salaryStandards3.value = res.data;
    } else {
        console.log(res.msg);
    }
};

// 获取所有机构数据
const getOrganizations = async () => {
    const res = await getAllOrganizations();
    console.log(res);
    if (res.code === 200) {
        allOrganizations.value = res.data;
        level1Options.value = res.data;
    } else {
        console.log(res.msg);
    }
};

// 修改响应式变量
const imageUrl = ref("");
const avatarFile = ref(null);

// 图片上传前的验证
const beforeAvatarUpload = (file) => {
    const isJPG = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJPG) {
        ElMessage.error("头像只能是 JPG/PNG 格式!");
        return false;
    }
    if (!isLt2M) {
        ElMessage.error("头像大小不能超过 2MB!");
        return false;
    }
    return true;
};

// 处理头像变化
const handleAvatarChange = (file) => {
    if (beforeAvatarUpload(file.raw)) {
        avatarFile.value = file.raw;
        imageUrl.value = URL.createObjectURL(file.raw);
    }
};

// 上传头像
const handleUploadAvatar = async (recordNumber) => {
    if (!avatarFile.value) {
        ElMessage.error("请先选择头像");
        return false;
    }

    try {
        // 创建 FormData
        const formData = new FormData();
        // formData.append("")
        formData.append("headPhoto", avatarFile.value);

        // 发送请求
        const res = await uploadAvatar(recordNumber, formData);
        if (res.code === 200) {
            // ElMessage.success("员工图片上传成功");
            return true;
        } else {
            ElMessage.error(res.msg || "员工图片上传失败");
            return false;
        }
    } catch (error) {
        ElMessage.error("员工图片上传失败");
        return false;
    }
};

// 修改提交处理函数
const handleSubmit = () => {
    if (!fileFormRef.value) return;

    if (!avatarFile.value) {
        ElMessage.error("请先上传员工图片");
        return;
    }

    fileFormRef.value.validate(async (valid) => {
        if (valid) {
            // 检查三级机构是否都已选择
            if (
                !fileForm.organizationCode1 ||
                !fileForm.organizationCode2 ||
                !fileForm.organizationCode3
            ) {
                ElMessage.error("请选择完整的三级机构");
                return;
            }

            try {
                fileForm.registrarId = localStorage.getItem("userId");
                const res = await addEmployeeFile(fileForm);
                if (res.code === 200) {
                    // 提交成功后上传头像
                    const uploadSuccess = await handleUploadAvatar(res.data);
                    if (uploadSuccess) {
                        ElMessage.success("档案添加成功");
                        handleReset();
                    }
                } else {
                    ElMessage.error(res.msg);
                }
            } catch (error) {
                ElMessage.error("操作失败");
            }
        } else {
            // 表单验证失败
            ElMessage.error("请填写正确的表单信息");
            return false;
        }
    });
};

// 修改重置处理函数
const handleReset = () => {
    if (fileFormRef.value) {
        fileFormRef.value.resetFields();
        imageUrl.value = "";
        avatarFile.value = null;
    }
};

onMounted(() => {
    getPositions();
    getSalaryStandards3();
    getOrganizations();
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

.form {
    margin-top: 20px;
    padding-bottom: 20px;
}

:deep(.select-container) {
    width: 100%;
}

:deep(.el-form-item) {
    margin-bottom: 18px;
}

:deep(.el-input),
:deep(.el-select) {
    width: 100%;
}

:deep(.el-date-picker) {
    width: 100%;
}

.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
