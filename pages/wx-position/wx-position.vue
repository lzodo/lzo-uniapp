<template>
    <view class="m-map">
        <view class="page-body">
            <view class="page-section page-section-gap">
                <map style="width: 100%; height:100%" :latitude="latitude" :longitude="longitude" :markers="covers" :scale="scale"> </map>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            id: 0, // 使用 marker点击事件 需要填写id
            title: "map",
            latitude: 26.075302,
            longitude: 119.306239,
			scale:9,
            covers: [
                {
                    latitude: 39.909,
                    longitude: 116.39742,
                    iconPath: "../../../static/location.png",
                },
                {
                    latitude: 39.9,
                    longitude: 116.39,
                    iconPath: "../../../static/location.png",
                },
            ],
        };
    },
    methods: {},
};
</script>

<style lang="scss" scoped>
.m-map {
    width: 100%;
	.page-body{
		height: 100%;
		.page-section{
			height: 100%;
		}
	}
}
</style>
