<template>
    <view class="wrap" style="width: 100%">
        <view class="header-search">
            <u-search
                placeholder="请输入关键字"
                v-model="keyword"
                @input="
                    clear();
                    number = 1;
                    getList();
                "
                bg-color="#fff"
                input-align="center"
                height="70"
            ></u-search>
        </view>
        <u-waterfall v-model="devlist" ref="uWaterfall">
            <template v-slot:left="{ leftList }">
                <view class="demo-warter" v-for="(item, index) in leftList" :key="index"  @click="godevinfo(item)">
                    <u-lazy-load threshold="-450" border-radius="10" :image="item.icon" :index="index"></u-lazy-load>
                    <view class="demo-title">
                        {{ item.name }}
                    </view>
                    <view class="demo-price">
                        {{ item.ucode }}
                        <view class="demo-status">
                            <span style="color: #5eea62" v-show="item.connstate == '在线'" class="value">{{ item.connstate }}</span>
                            <span style="color: #858585" v-show="item.connstate == '离线'" class="value">{{ item.connstate }}</span>
                            <span style="color: #e83352" v-show="item.connstate == '告警'" class="value">{{ item.connstate }}</span>
                            <span style="color: #eaa25c" v-show="item.connstate == '异常'" class="value">{{ item.connstate }}</span>
                        </view>
                    </view>
                    <view class="demo-shop">
                        {{ item.model }}
                    </view>
                </view>
            </template>
            <template v-slot:right="{ rightList }">
                <view class="demo-warter" v-for="(item, index) in rightList" :key="index" @click="godevinfo(item)">
                    <u-lazy-load threshold="-450" border-radius="10" :image="item.icon" :index="index"></u-lazy-load>
                    <view class="demo-title">
                        {{ item.name }}
                    </view>
                    <view class="demo-price">
                        {{ item.ucode }}
                        <view class="demo-status">
                            <span style="color: #5eea62" v-show="item.connstate == '在线'" class="value">{{ item.connstate }}</span>
                            <span style="color: #858585" v-show="item.connstate == '离线'" class="value">{{ item.connstate }}</span>
                            <span style="color: #e83352" v-show="item.connstate == '告警'" class="value">{{ item.connstate }}</span>
                            <span style="color: #eaa25c" v-show="item.connstate == '异常'" class="value">{{ item.connstate }}</span>
                        </view>
                    </view>
                    <view class="demo-shop">
                        {{ item.model }}
                    </view>
                    <!-- <u-icon name="close-circle-fill" color="#fa3534" size="34" class="u-close" @click="remove(item.id)"></u-icon> -->
                </view>
            </template>
        </u-waterfall>
        <u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
    </view>
</template>

<script>
export default {
    data() {
        return {
            devlist: [],
            number: 1,
            size: 10,
            total: 0,
            keyword: "",

            loadStatus: "loadmore",
        };
    },
    onShow: function () {},
    onLoad() {
        // this.addRandomData();
    },
    onReachBottom() {
        this.loadStatus = "loading";
        // 模拟数据加载
        setTimeout(() => {
            this.addRandomData();
            this.loadStatus = "loadmore";
        }, 1000);
    },
    methods: {
        godevinfo(item) {
            console.log(item)
            console.log(uni.navigateTo)
            uni.navigateTo({
                url: "/pages/wx-devinfo/wx-devinfo",
            });
        },
        getList(state) {
            let params = {
                name: this.keyword,
                pageNumber: this.number,
                pageSize: this.size,
            };
            this.AxiosPOST("/currencyApi/page/currency/showDeviceBy", params).then((res) => {
                if (res.status == 0) {
                    this.total = res.result.totalRow;
                    if (state == "concat") {
                        this.devlist = this.devlist.concat(this.getIco(res.result.list, this.$store.state.devModelList));
                    } else {
                        this.devlist = [].concat(this.getIco(res.result.list, this.$store.state.devModelList));
                        // console.log(this.devlist)
                        // this.$set(this,'devlist',)
                    }
                } else {
                    this.devlist = [];
                }
            });
        },
        getIco(res, icondata) {
            res.map((resItem, ri) => {
                icondata.map((iconItem, si) => {
                    if (iconItem.model == resItem.model) {
                        res[ri].icon = this.$store.state.fileApi + iconItem.icon;
                    }
                });
            });
            return res;
        },
        addRandomData() {
            if (this.number < Math.ceil(this.total / this.size)) {
                this.number++;
                this.getList("concat");
            }
        },
        remove(id) {
            this.$refs.uWaterfall.remove(id);
        },
        clear() {
            this.$refs.uWaterfall.clear();
        },
    },
    mounted() {
        this.getList();
    },
};
</script>
<style>
/* page不能写带scope的style标签中，否则无效 */
page {
    background-color: rgb(240, 240, 240);
}
</style>
<style lang="scss" scoped>
.demo-warter {
    border-radius: 8px;
    margin: 5px;
    background-color: #ffffff;
    padding: 8px;
    position: relative;
}

.u-close {
    position: absolute;
    top: 32rpx;
    right: 32rpx;
}

.demo-image {
    width: 100%;
    border-radius: 4px;
}

.demo-title {
    font-size: 30rpx;
    margin-top: 5px;
    color: $u-main-color;
}

.demo-tag {
    display: flex;
    margin-top: 5px;
}

.demo-tag-owner {
    background-color: $u-type-error;
    color: #ffffff;
    display: flex;
    align-items: center;
    padding: 4rpx 14rpx;
    border-radius: 50rpx;
    font-size: 20rpx;
    line-height: 1;
}

.demo-tag-text {
    border: 1px solid $u-type-primary;
    color: $u-type-primary;
    margin-left: 10px;
    border-radius: 50rpx;
    line-height: 1;
    padding: 4rpx 14rpx;
    display: flex;
    align-items: center;
    border-radius: 50rpx;
    font-size: 20rpx;
}

.demo-price {
    font-size: 30rpx;
    color: $u-type-error;
    margin-top: 5px;
}

.demo-shop {
    font-size: 22rpx;
    color: $u-tips-color;
    margin-top: 5px;
}
.demo-status {
    float: right;
}
.header-search {
    padding: 20rpx 15rpx 10rpx;
}
</style>
