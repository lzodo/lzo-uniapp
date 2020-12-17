import Vue from "vue";
import axios from "axios";
import adapter from "axios/lib/adapters/xhr";

// const axios = axios.create({ adapter })

//基地址
let base = "http://api.huihezn.com";
let headers = {};

//真机获取
axios.defaults.adapter = function (config) {
    return new Promise((resolve, reject) => {
        console.log(config);
        var settle = require("axios/lib/core/settle");
        var buildURL = require("axios/lib/helpers/buildURL");
        uni.request({
            method: config.method.toUpperCase(),
            url: buildURL(config.url, config.params, config.paramsSerializer),
            header: config.headers,
            data: config.data,
            dataType: config.dataType,
            responseType: config.responseType,
            sslVerify: config.sslVerify,
            complete: function complete(response) {
                response = {
                    data: response.data,
                    status: response.statusCode,
                    errMsg: response.errMsg,
                    header: response.header,
                    config: config,
                };

                settle(resolve, reject, response);
            },
        });
    });
};

//通用方法
Vue.prototype.AxiosPOST = (url, params) => {
    let loginInfoJson = uni.getStorageSync("loginInfoJson");
    if (loginInfoJson) {
        var authToken = JSON.parse(loginInfoJson).token;
        headers["x-auth-token"] = authToken;
    }
    return new Promise((resolve, reject) => {
        return axios.post(`${base}${url}`, params, { headers: headers }).then(
            (res) => {
                if (res.data.status == 0) {
                    resolve(res.data);
                } else {
                    console.log("全局status!=0");
                }
            },
            (err) => {
                console.log("全局失败方法");
                console.log(err);
            }
        );
    });
};

Vue.prototype.AxiosGET = (url, params) => {
    let loginInfoJson = uni.getStorageSync("loginInfoJson");
    if (loginInfoJson) {
        var authToken = JSON.parse(loginInfoJson).token;
        headers["x-auth-token"] = authToken;
    }
    return new Promise((resolve, reject) => {
        return axios({
            url: `${base}${url}`,
            params: params,
            method: "GET",
            headers: headers,
        }).then(
            (res) => {
                if (res.data.status == 0) {
                    resolve(res.data);
                } else {
                    uni.showToast({
                        icon: "none",
                        title: res.data.message,
                    });
                    console.log("全局status!=0");
                }
            },
            (err) => {
                console.log("全局失败方法");
                console.log(err);
            }
        );
    });
};

// export const GET = (url, params) => {
//     return axios.get(`${base}${url}`, { params: params }).then((res) => res.data);
// };
