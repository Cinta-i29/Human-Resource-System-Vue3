import request from "@/utils/request";

// 获取所有机构
export const getAllOrganizations = async () => { 
    return await request.post("/org/list");
}

