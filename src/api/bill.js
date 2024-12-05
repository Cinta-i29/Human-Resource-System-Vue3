import request from "@/utils/request"

// 获取可登记薪酬账单的档案列表
export const getRegisterBillList = async (searchForm) => { 
    return await request.post("/bill/employee/list", searchForm);
}

// 登记表单
export const registerBill = async (billForm) => { 
    return await request.post("/bill/register", billForm);
}