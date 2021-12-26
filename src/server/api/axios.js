import axios from "axios";
let new_axios=axios.create();
new_axios.interceptors.request.use(
    config => {
        const token=sessionStorage.getItem('token');
        if(token){
            config.headers.Authorization='Bearer '+token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
)

export default new_axios;