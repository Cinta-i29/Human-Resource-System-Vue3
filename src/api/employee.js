import request from "@/utils/request";

// 新增员工档案
export const addEmployeeFile = async (file) => {
    return await request.post("/employee/add", file);
};

// 根据档案编号上传头像
export const uploadAvatar = async (recordNumber, headPhoto) => {
    return await request.post(`/employee/upload/avatar/${recordNumber}`, headPhoto);
};
