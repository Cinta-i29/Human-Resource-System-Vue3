import axios from "axios"

const BASEURL = "http://localhost:12345";
const TIMEOUT = 5000;

const request = axios.create({
    baseURL: BASEURL,
    timeout: TIMEOUT
})

// 请求拦截器
request.interceptors.request.use(
    (request) => { 
        const token = localStorage.getItem("token");
        if (token != null && token != "") {
            request.headers["Authorization"] = token;
        }
        return request;
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => { 
        return response.data;
    },
    error => { 
        ElMessage.error('请求失败：' + error.message)
        return Promise.reject(error)
    }
)

export default request;