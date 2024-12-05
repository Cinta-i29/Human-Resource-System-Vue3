import request from "@/utils/request";

// 登录
export const login = async (loginForm) => {
    return await request.post("/user/login", loginForm);
};

// 登出
export const logout = async () => {
    return await request.get("/user/logout");
};

// 添加用户
export const addUser = async (user) => {
    return await request.post("/user/add", user);
};

// 删除用户
export const deleteUser = async (id) => {
    return await request.delete(`/user/delete/${id}`);
};

// 获取所有用户
export const getAllUsers = async () => {
    return await request.get("/user/all");
};

// 修改用户信息
export const updateUser = async (user) => {
    return await request.put("/user/update", user);
};

// 根据id获取用户信息
export const getUserInfoById = async (userId) => { 
    return await request.get(`/user/${userId}`)
}