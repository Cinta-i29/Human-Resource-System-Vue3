import request from "@/utils/request";

// 获取所有薪酬项目
export const getAllSalaryItems = async () => { 
    return await request.post("/salaryItem/list");
}

// 新增薪酬项目
export const addSalaryItem = async (salaryItem) => { 
    return await request.post("/salaryItem/add", salaryItem);
}

// 删除薪酬项目
export const deleteSalaryItem = async (id) => { 
    return await request.post(`/salaryItem/delete/${id}`);
}