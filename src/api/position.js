import request from "@/utils/request";

// 获取所有职位
export const getAllPositions = async () => {
  return await request.post("/position/list");
};

// 新增职位
export const addPosition = async (position) => {
  return await request.post("/position/add", position);
};

// 删除职位
export const deletePosition = async (id) => {
  return await request.delete(`/position/${id}`);
};

// 修改职位信息
export const updatePosition = async (position) => {
  return await request.put("/position/update", position);
};
