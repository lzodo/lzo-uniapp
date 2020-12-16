import Vue from "vue";
import App from "./App";

import store from "./store";
import "./api/uni.request";
import "./api/axios.request";

import uView from "uview-ui";
Vue.use(uView);

import "./mock";


Vue.config.productionTip = false;

Vue.prototype.$store = store;

App.mpType = "app";

const app = new Vue({
    store,
    ...App,
});
app.$mount();
