import axios from "axios"


const API_BASE_URL = "http://localhost:3000/api";

const api = axios.create({
    baseURL:API_BASE_URL,
    timeout:30000,
    headers:{
        'Content-Type':'application/json',

    },
    withCredentials:true,
});

api.interceptors.request.use(
    (config)=>{
        const token= sessionStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error.response ?.status === 401){
            sessionStorage.removeItem("token");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);
export default api
export{API_BASE_URL};