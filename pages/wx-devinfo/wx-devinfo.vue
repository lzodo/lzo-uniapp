<template>
    <view class="devinfo-warp">
        <view class="devinfo-tabs">
            <u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
        </view>
        <view class="devinfo-swiper">
            <swiper class='swiper' :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
                <swiper-item class="swiper-item">
                    <scroll-view scroll-y class="item-page" @scrolltolower="onreachBottom"> 
                        <view>基础信息</view> 
                        <view>基础信息</view> 
                        <view>基础信息</view> 
                    </scroll-view>
                </swiper-item>
                <swiper-item class="swiper-item">
                    <scroll-view scroll-y class="item-page" @scrolltolower="onreachBottom"> 实况数据 </scroll-view>
                </swiper-item>
                <swiper-item class="swiper-item">
                    <scroll-view scroll-y class="item-page" @scrolltolower="onreachBottom"> 历史告警 </scroll-view>
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            list: [
                {
                    name: "基础信息",
                },
                {
                    name: "实况数据",
                },
                {
                    name: "历史告警",
                },
            ],
            tabs: ["基础信息", "实况数据", "历史告警"],
            // 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
            current: 0, // tabs组件的current值，表示当前活动的tab选项
            swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
        };
    },
    methods: {
        // tabs通知swiper切换
        tabsChange(index) {
            this.swiperCurrent = index;
        },
        // swiper-item左右移动，通知tabs的滑块跟随移动
        transition(e) {
            let dx = e.detail.dx;
            this.$refs.uTabs.setDx(dx);
        },
        // 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
        // swiper滑动结束，分别设置tabs和swiper的状态
        animationfinish(e) {
            let current = e.detail.current;
            this.$refs.uTabs.setFinishCurrent(current);
            this.swiperCurrent = current;
            this.current = current;
        },
        // scroll-view到底部加载更多
        onreachBottom() {},
    },

    onLoad() {},
    mounted() {
        console.log("cc");
    },
};
</script>

<style lang="scss" scoped>
.devinfo-warp {
    display: flex;
    width: 100%;
    padding: 20rpx;
    background: #f2f2f2;
    flex-direction: column;

    .devinfo-tabs {
        width: 100%;
        height: 90rpx;
    }
    .devinfo-swiper {
        width: 100%;
        flex: 1;
        .swiper{
            height: 100%;
        }
    }
}
.item-page {
    width: 100%;
    height: 100%;
    background: #fff;
}
</style>
