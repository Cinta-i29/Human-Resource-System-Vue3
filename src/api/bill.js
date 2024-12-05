import request from "@/utils/request";

// 获取可登记薪酬账单的档案列表
export const getRegisterBillList = async (searchForm) => {
    return await request.post("/bill/employee/list", searchForm);
};

// 登记账单
export const registerBill = async (billForm) => {
    return await request.post("/bill/register", billForm);
};

// 条件查询账单
export const getBillsByCondition = async (condition) => {
    return await request.post("/bill/list", condition);
};

// 审核账单
export const reviewBill = async (billForm) => {
    return await request.post("/bill/review", billForm);
};
