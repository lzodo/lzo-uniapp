import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate"


Vue.use(Vuex);

const store = new Vuex.Store({
    // plugins: [createPersistedState()],
    plugins: [
		createPersistedState({
			storage: {
				getItem: key => uni.getStorageSync(key),
				setItem: (key, value) => uni.setStorageSync(key, value),
				removeItem: key => uni.removeStorageSync(key)
			}
		})
	],
    state: {
        /**
         * 是否需要强制登录
         */
        forcedLogin: true,
        hasLogin: true,
        userName: "",

        hasphone: "",
        token: "",
        platform:{},
        devModelList:[],//获取图片
        fileApi: 'http://api.huihezn.com/fileApi',
    },
    mutations: {
        setModelList(state,data){
            state.devModelList = data;
            console.log(data)
            console.log('state.devModelList')
        },
        login(state, userInfo) {
            state.hasLogin = true;

            let loginInfoJson = JSON.parse(uni.getStorageSync("loginInfoJson"));
            state.hasphone = loginInfoJson.phone||'无';
            state.token = loginInfoJson.token;
            state.userName = loginInfoJson.displayname || "新用户";

            state.platform = {
                systemname:loginInfoJson.systemInfo.systemname
            };


            console.log(state.token)
        },
        logout(state) {
            state.userName = "";
            //state.hasLogin = false;
            
            uni.removeStorageSync("loginInfoJson");
            state.hasphone = "";
            state.token = "";
            state.platform = {};
            uni.reLaunch({
                url: "../login/login",
            });
        },
    },
});

export default store;
