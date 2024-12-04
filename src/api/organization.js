import request from "@/utils/request";

// 获取所有机构
export const getAllOrganizations = async () => {
    return await request.post("/org/list");
};

// 新增机构
export const addOrganization = async (organization) => {
    return await request.post("/org/add", organization);
};

// 根据三级机构id查询机构信息
export const getInfoByOrgId3 = async (id) => {
    return await request.post(`/org/${id}`);
};
