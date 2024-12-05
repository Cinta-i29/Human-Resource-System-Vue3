import request from "@/utils/request";

// 新增薪酬标准（管理员）
export const addSalaryStandard = async (salaryStandard) => {
    return await request.post("/salaryStandard/add", salaryStandard);
};

// 获取薪酬标准
export const getAllSalaryStandards = async (type) => {
    return await request.post(`/salaryStandard/list/${type}`);
};

// 登记薪酬标准
export const registerSalaryStandard = async (standardForm) => { 
    return await request.post("/salaryStandard/register", standardForm);
}

// 条件查询薪酬标准
export const queryStandardByCondition = async (condition) => { 
    return await request.post("/salaryStandard/search", condition)
}

// 复核薪酬标准
export const reviewStandard = async (standardForm) => { 
    return await request.post("/salaryStandard/review", standardForm);
}