import request from "@/utils/request";

// 新增员工档案
export const addEmployeeFile = async (file) => {
    return await request.post("/employee/add", file);
};

// 根据档案编号上传头像
export const uploadAvatar = async (recordNumber, headPhoto) => {
    return await request.post(`/employee/upload/avatar/${recordNumber}`, headPhoto);
};

// 条件查询员工
export const getEmployeesByCondition = async (condition) => {
    return await request.post("/employee/condition/search", condition);
};

// 获取所有员工档案
export const getAllEmployees = async () => {
    return await request.post("/employee/list");
};

// 删除员工档案
export const deleteEmployeeById = async (id) => {
    return await request.post(`/employee/delete/${id}`);
};

// 根据档案号查询员工档案
export const getEmployeesById = async (id) => {
    return await request.post(`/employee/get/${id}`);
};

// 更新员工档案
export const updateEmployee = async (employee) => {
    return await request.post("/employee/update/s", employee);
};

// 复核员工档案
export const reviewEmployee = async (employee) => {
    return await request.post("/employee/update/m", employee);
}

// 获取已删除员工档案
export const getDeletedEmployee = async () => { 
    return await request.post("/employee/list/deleted");
}

// 恢复员工档案
export const recoverEmployeeById = async (id) => { 
    return await request.post(`/employee/recover/${id}`);
}