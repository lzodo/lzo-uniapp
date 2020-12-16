import Vue from "vue";
import axios from "axios";

//基地址
let base = "http://api.huihezn.com";
let headers = {};

var authToken = JSON.parse(uni.getStorageSync("loginInfoJson")).token;
if (authToken) {
    headers["x-auth-token"] = authToken;
}

//通用方法
Vue.prototype.AxiosPOST = (url, params) => {
    console.log(headers)
    let that = this;
    return new Promise((resolve, reject) => {
        return axios.post(`${base}${url}`, params, { headers: headers }).then((res) => {
            if (res.data.status == 0) {
                resolve(res.data);
            } else {
                console.log("全局status!=0");
            }
        },(err) => {
            console.log("全局失败方法");
        });
    });
};

// export const GET = (url, params) => {
//     return axios.get(`${base}${url}`, { params: params }).then((res) => res.data);
// };
