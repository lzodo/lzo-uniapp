import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        /**
         * 是否需要强制登录
         */
        forcedLogin: true,
        hasLogin: true,
        userName: "",

        hasphone: "",
        token: "",
        devModelList:[],//获取图片
        fileApi: 'http://api.huihezn.com/fileApi',
    },
    mutations: {
        setModelList(state,data){
            state.devModelList = data;
            console.log(data)
            console.log('state.devModelList')
        },
        login(state, userName) {
            state.userName = userName || "新用户";
            state.hasLogin = true;

            uni.setStorageSync(
                "loginInfoJson",
                JSON.stringify({
                    hasphone: true,
                    token:
                        "eyJST0xFIjoicm9vdCx4eWpXZUNoYXQsZGxzX2Rpc3BsYXlCb2FyZCx3ZWl4aW5DcCxkaXNwbGF5Qm9hcmQsYWRtaW4sbGllaHVXZUNoYXQsb25saW5lQ2hlY2ssZGV2ZWxvcGVyX29ubmVyLGhod3hTY2hlZHVsZSx0aHVuZGVyLGh1aWhlV2VDaGF0LHNlbmRDbWQsbGllaHUsdG9uZ2JhaVdlQ2hhdCx1c2VyIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiI3ZDdiZDkzYy00NmZkLTQ5MTctODZkNS1hOWEwYzNiMmM1OTgiLCJzdWIiOiJyb290IiwiaWF0IjoxNjA4MTA3NTEzLCJleHAiOjE2MDgxMjE5MTN9.DWMHBKD5DG1zXb8SakSAlhqkcHLNbY60yWPPsjT_nN0",
                })
            );

            let loginInfoJson = JSON.parse(uni.getStorageSync("loginInfoJson"));
            state.hasphone = loginInfoJson.hasphone;
            state.token = loginInfoJson.token;
            console.log(state.token)
        },
        logout(state) {
            state.userName = "";
            //state.hasLogin = false;
            
            uni.removeStorageSync("loginInfoJson");
            state.hasphone = "";
            state.token = "";
            // uni.reLaunch({
            //     url: "../pages/login/login",
            // });
        },
    },
});

export default store;
