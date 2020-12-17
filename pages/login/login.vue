<template>
    <view class="login-warp">
        <view class="">
            <u-form :model="form" ref="uForm" class="uForm">
                <u-form-item label="账号" prop="name" :focus="true" :trim="true"><u-input v-model="form.account" /></u-form-item>
                <u-form-item label="密码" prop="intro" type="password" :password-icon='true' :trim="true"><u-input type="password" v-model="form.password" /></u-form-item>
            </u-form>
            <u-button type="primary" @click="bindLogin">提交</u-button>
        </view>
    </view>
</template>

<script>
import service from "../../service.js";
import { mapState, mapMutations } from "vuex";
import mInput from "../../components/m-input.vue";

export default {
    components: {
        mInput,
    },
    data() {
        return {
            providerList: [],
            hasProvider: false,
            account: "",
            password: "",
            positionTop: 0,

            form: {
                account: "",
                password: "",
            },
            rules: {
                account: [
                    {
                        required: true,
                        message: "请输入账号",
                        // 可以单个或者同时写两个触发验证方式
                        trigger: ["change", "blur"],
                    },
                ],
                password: [
                    {
                        min: 5,
                        message: "简介不能少于5个字",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    onReady() {
        this.$refs.uForm.setRules(this.rules);
    },
    computed: mapState(["forcedLogin"]),
    methods: {
		...mapMutations(["login","setModelList"]),
		getDeviceModel() {
            this.AxiosPOST("/currencyApi/currency/showDeviceModel", {}).then((res) => {
                this.setModelList(res.result);
            });
        },
        submit() {
              console.log('8888888888888888888')
            let loginParams = {
                username: this.form.account,
                password: this.form.password,
            };
            this.AxiosGET("/securityApi/auth/login", loginParams).then((res) => {
                this.toMain(res)
                console.log('9999999999999999999999')
            });
        },
        initPosition() {
            /**
             * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
             * 反向使用 top 进行定位，可以避免此问题。
             */
            this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
        },
        bindLogin() {
            /**
             * 客户端对账号信息进行一些必要的校验。
             * 实际开发中，根据业务需要进行处理，这里仅做示例。
             */
            if (this.form.account.length < 4) {
                uni.showToast({
                    icon: "none",
                    title: "账号最短为 4 个字符",
                });
                return;
            }
            if (this.form.password.length < 6) {
                uni.showToast({
                    icon: "none",
                    title: "密码最短为 6 个字符",
                });
                return;
            }
            /**
             * 下面简单模拟下服务端的处理
             * 检测用户账号密码是否在已注册的用户列表中
             * 实际开发中，使用 uni.request 将账号信息发送至服务端，客户端在回调函数中获取结果信息。
             */
            const data = {
                account: this.form.account,
                password: this.form.password,
            };
            this.submit();

        },

        toMain(userName) {
			uni.setStorageSync("loginInfoJson",JSON.stringify(userName.result));

            
            /**
             * 强制登录时使用reLaunch方式跳转过来
             * 返回首页也使用reLaunch方式
             */
			this.getDeviceModel();
			this.login(userName);
            if (this.forcedLogin) {
                uni.reLaunch({
                    url: "../wx-devlist/wx-devlist",
                });
            } else {
                uni.navigateBack();
            }
        },
    },
    onReady() {
        this.initPosition();
    },
};
</script>

<style lang="scss" scoped>
.action-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.action-row navigator {
    color: #007aff;
    padding: 0 20upx;
}

.oauth-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}

.oauth-image {
    width: 100upx;
    height: 100upx;
    border: 1upx solid #dddddd;
    border-radius: 100upx;
    margin: 0 40upx;
    background-color: #ffffff;
}

.oauth-image image {
    width: 60upx;
    height: 60upx;
    margin: 20upx;
}
.login-warp {
    background: #fff;
    width: 100%;
    padding: 50upx;
    .uForm {
        margin-bottom: 20upx;
    }
}
/* .uForm{
	background: #fff;
} */
</style>
