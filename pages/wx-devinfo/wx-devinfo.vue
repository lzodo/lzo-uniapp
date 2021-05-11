<template>
    <view class="devinfo-warp">
        <view class="devinfo-tabs">
            <u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
        </view>
        <view class="devinfo-swiper">
            <swiper class="swiper" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
                <swiper-item class="swiper-item">
                    <scroll-view scroll-y class="item-page" @scrolltolower="onreachBottom">
                        <u-cell-group title="基础信息">
                            <u-cell-item icon="file-text" title="设备名称" :value="devInfoData[0].name"></u-cell-item>
                            <u-cell-item icon="file-text" title="设备编号" :value="devInfoData[0].ucode"></u-cell-item>
                            <u-cell-item icon="map" title="自动更新位置" :value="devInfoData[0].local_flag ? '是' : '否'"></u-cell-item>
                            <u-cell-item icon="file-text" title="在线状态" :value="devInfoData[0].connstate"></u-cell-item>
                            <u-cell-item icon="file-text" title="信号强度" :value="devInfoData[0].csq"></u-cell-item>
                            <u-cell-item icon="calendar-fill" title="服务到期时间" :value="devInfoData[0].maintenancetime | formatTime"></u-cell-item>
                            <u-cell-item icon="calendar" title="安装时间" :value="devInfoData[0].setuptime | formatTime"></u-cell-item>
                        </u-cell-group>
                        <u-cell-group title="地址">
                            <u-cell-item icon="map-fill" title="使用单位" :value="devInfoData[0].addrname"></u-cell-item>
                            <u-cell-item icon="map" title="详细地址" :value="devInfoData[0].address"></u-cell-item>
                        </u-cell-group>
                    </scroll-view>
                </swiper-item>
                <swiper-item class="swiper-item">
                    <scroll-view scroll-y class="item-page" @scrolltolower="onreachBottom"> 实况数据 </scroll-view>
                </swiper-item>
                <swiper-item class="swiper-item">
                    <scroll-view scroll-y class="item-page showAlarm" @scrolltolower="onreachBottom">
                        <timeAxis :options ="alarmData"></timeAxis>
                    </scroll-view>
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>

<script>
import timeAxis from "@/components/time-axis.vue";
//var dayjs = require('dayjs')
import dayjs from 'dayjs' // ES 2015
// dayjs().format()
// dayjs(unix_time).format('YYYY-MM-DD')
export default {
    components: {
        timeAxis
    },
	filters:{
		formatTime(date){
			return dayjs(date).format('YYYY-MM-DD HH:mm:ss') 
		}
	},
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
            tabs: ["基础信息", "实况数据","历史告警"],
            // 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
            current: 0, // tabs组件的current值，表示当前活动的tab选项
            swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
            ucode: "",
            devInfoData: [{}],
            alarmData: [],
        };
    },
    onLoad(option) {
        this.ucode = option.ucode;
    },
    // filter:{
    //     dateFormat(){}
    // },
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

        //获取基础信息
        getDevInfo() {
            let params = {
                ucode: this.ucode,
            };
            this.AxiosPOST("/currencyApi/currency/showDeviceHost", params).then((res) => {
                this.devInfoData = res.result;
                console.log(this.devInfoData);
            });
        },
        getAlarms() {
            let params = {
                data: { ucode: this.ucode },
                pageNumber: 1,
                pageSize: 15,
            };
            this.AxiosPOST("/businessApi/device/showAlarm", params).then((res) => {
                this.alarmData = res.result.list;
                console.log("this.alarmData");
                console.log(this.alarmData);
            });
        },
    },

    mounted() {
        this.getDevInfo();
        this.getAlarms();
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
        .swiper {
            height: 100%;
        }
    }
}
.item-page {
    width: 100%;
    height: 100%;
    // background: #fff;
    position: relative;
    &.showAlarm {
        // padding-left: 50px;
    }
}

/**历史时间轴 */
.u-node {
    width: 44rpx;
    height: 44rpx;
    border-radius: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #d0d0d0;
}

.u-order-title {
    color: #333333;
    font-weight: bold;
    font-size: 32rpx;
}

.u-order-desc {
    color: rgb(150, 150, 150);
    font-size: 28rpx;
    margin-bottom: 6rpx;
}

.u-order-time {
    color: rgb(200, 200, 200);
    font-size: 26rpx;
}
</style>
