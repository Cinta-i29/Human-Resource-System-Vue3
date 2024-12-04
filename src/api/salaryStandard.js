import request from "@/utils/request";

// 新增薪酬标准（管理员）
export const addSalaryStandard = async (salaryStandard) => { 
    return await request.post("/salaryStandard/add", salaryStandard)
}