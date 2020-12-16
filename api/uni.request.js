import Vue from "vue";

// 参数： url:请求地址
// param：请求参数
// method
// res：回调函数
let baseurl = "http://api.huihezn.com";
Vue.prototype.uniRequest = function (url, method, param, res) {
    // 进行请求
    uni.request({
        url: baseurl + url,
        method: method,
        data: param,
        header: {
            'X-AUTH-TOKEN': this.$store.state.token || "无token",
        },
        success: (res) => {
            console.log(res);
        },
    });

    // uni.request({
    //     url: baseurl + url,
    //     data: param,
    //     header: {
    //         token: this.$store.state.token || "无token",
    //     },
    //     // 获取设置请求方式
    //     method: method,
    //     success: (data) => {
    //         console.log(data);
    //         // if (data.data.code === 200) {
    //         //     // 设置返回的数据
    //         //     res(data.data)
    //         // } else {
    //         //     // 干一些事情
    //         // }
    //     },
    // });
};
