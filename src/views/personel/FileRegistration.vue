<template>
    <div>
        <el-form :model="fileForm">
            <el-form-item label="所属机构">
                <OrganizationSelect v-model="selectedOrg" @change="handleOrgChange" />
            </el-form-item>
            <el-form-item></el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { educations, nationalities } from "@/utils/options";
import OrganizationSelect from "@/components/OrganizationSelect/OrganizationSelect.vue";

const fileForm = ref({
    name: "",
    gender: "",
    birthDate: "",
    age: 0,
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
    registrarId: 0,
    organizationCode1: 0,
    organizationCode2: 0,
    organizationCode3: 0,
    positionId: 0,
    title: "",
    salaryStandardId: 0,
});

// 机构选择相关
const selectedOrg = ref(null);

// 监听机构选择变化，更新表单中的机构代码
const handleOrgChange = (val) => {
    fileForm.value.organizationCode1 = val.level1?.code || 0;
    fileForm.value.organizationCode2 = val.level2?.code || 0;
    fileForm.value.organizationCode3 = val.level3?.code || 0;
};
</script>

<style scoped>
:deep(.select-container) {
    width: 100%;
}
</style>
