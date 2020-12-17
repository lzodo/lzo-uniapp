<template>
    <view class="content">
        <!-- <view v-if="hasLogin" class="hello">
            <view class="title"> 您好 {{ userName }}，您已成功登录。 </view>
            <view class="ul">
                <view>这是 uni-app 带登录模板的示例App首页。</view>
                <view>在 “我的” 中点击 “退出” 可以 “注销当前账户”</view>
            </view>
        </view>
        <view v-if="!hasLogin" class="hello">
            <view class="title"> 您好 游客。 </view>
            <view class="ul">
                <view>这是 uni-app 带登录模板的示例App首页。</view>
                <view>在 “我的” 中点击 “登录” 可以 “登录您的账户”</view>
            </view>
        </view> -->
        <u-cell-group title="用户信息">
            <u-cell-item icon="account" title="用户名" :value="userName"></u-cell-item>
            <u-cell-item icon="phone" title="手机号" :value="phone"></u-cell-item>
        </u-cell-group>
        <u-cell-group title="平台信息">
            <u-cell-item icon="home" title="系统名称" :value="platform.systemname"></u-cell-item>
        </u-cell-group>

        <u-cell-group title="用户配置">
            <u-cell-item icon="setting" title="告警配置"></u-cell-item>
            <u-cell-item icon="edit-pen" title="用户信息"></u-cell-item>
            <u-cell-item icon="kefu-ermai" title="联系我们"></u-cell-item>
            <u-cell-item icon="warning" title="故障报修"></u-cell-item>
        </u-cell-group>
        <view class="btn-row">
            <button v-if="!hasLogin" type="primary" class="primary" @tap="bindLogin">登录</button>
            <button v-if="hasLogin" type="warning" @tap="bindLogout">退出登录</button>
        </view>
    </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
    computed: {
        ...mapState(["hasLogin", "forcedLogin", "userName", "phone", "platform"]),
    },
    methods: {
        ...mapMutations(["logout"]),
        bindLogin() {
            uni.navigateTo({
                url: "../login/login",
            });
        },
        onLoad() {
            // if (!this.hasLogin) {
            //     uni.showModal({
            //         title: "未登录",
            //         content: "您未登录，需要登录后才能继续",
            //         /**
            //          * 如果需要强制登录，不显示取消按钮
            //          */
            //         showCancel: !this.forcedLogin,
            //         success: (res) => {
            //             if (res.confirm) {
            //                 /**
            //                  * 如果需要强制登录，使用reLaunch方式
            //                  */
            //                 if (this.forcedLogin) {
            //                     uni.reLaunch({
            //                         url: "../login/login",
            //                     });
            //                 } else {
            //                     uni.navigateTo({
            //                         url: "../login/login",
            //                     });
            //                 }
            //             }
            //         },
            //     });
            // }
        },
        bindLogout() {
            this.logout();
            /**
             * 如果需要强制登录跳转回登录页面
             */
            if (this.forcedLogin) {
                uni.reLaunch({
                    url: "../login/login",
                });
            }
        },
    },
};
</script>

<style></style>
