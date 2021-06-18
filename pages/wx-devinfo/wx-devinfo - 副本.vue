<template>
	<view class="devinfo-warp">
		<view class="devinfo-tabs">
			<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
				swiperWidth="750"></u-tabs-swiper>
		</view>
		<view class="devinfo-swiper">
			<swiper class="swiper" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y class="item-page" @scrolltolower="onreachBottom">
						<u-cell-group title="基础信息">
							<u-cell-item icon="file-text" title="设备名称" :value="devInfoData[0].name"></u-cell-item>
							<u-cell-item icon="file-text" title="设备编号" :value="devInfoData[0].ucode"></u-cell-item>
							<u-cell-item icon="map" title="自动更新位置" :value="devInfoData[0].local_flag ? '是' : '否'">
							</u-cell-item>
							<u-cell-item icon="file-text" title="在线状态" :value="devInfoData[0].connstate"></u-cell-item>
							<u-cell-item icon="file-text" title="信号强度" :value="devInfoData[0].csq"></u-cell-item>
							<u-cell-item icon="calendar-fill" title="服务到期时间"
								:value="devInfoData[0].maintenancetime | formatTime"></u-cell-item>
							<u-cell-item icon="calendar" title="安装时间" :value="devInfoData[0].setuptime | formatTime">
							</u-cell-item>
						</u-cell-group>
						<u-cell-group title="地址">
							<u-cell-item icon="map-fill" title="使用单位" :value="devInfoData[0].addrname"></u-cell-item>
							<u-cell-item icon="map" title="详细地址" :value="devInfoData[0].address"></u-cell-item>
						</u-cell-group>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y class="item-page" @scrolltolower="onreachBottom">
						<div>
							<div class="notdata_div" v-show='sksj_nullimg'>
								<!-- <img :src='$store.state.notdata_url' /> -->
								<span class='massfont'>没有数据</span>
							</div>
							<ul class='detPubInfo' v-for='item in D_D_Data' style="margin-bottom:12px"
								v-bind:key="item.id">
								<li class="fistHead">
									<span>{{item.name}}</span>
									<span style='color:#5EEA62' v-show='item.connstate=="在线"'
										class="right">{{item.connstate}}</span>
									<span style='color:#858585' v-show='item.connstate=="离线"'
										class="right">{{item.connstate}}</span>
									<span style='color:#E83352' v-show='item.connstate=="告警"'
										class="right">{{item.connstate}}</span>
									<span style='color:#EAA25C' v-show='item.connstate=="异常"'
										class="right">{{item.connstate}}</span>
								</li>
								<li v-show='not_Show_Values' class="notpower wid60">
									<!-- <img :src="$store.state.notpowe_url" /> -->
									notpower
								</li>
								<!-- @click='goEcharsvir("/hheDetchars",{"dcode":sItem.dcode,"dname":D_H_Data[0].name},sItem)' -->
								<li class='threefloor' v-show='item.dcode == sItem.dcode && !not_Show_Values'
									v-for='(sItem,Index) in S_V_Data'>
									<!--           {{sItem.myKey}} -->
									<div class='sk_dev clearfix' v-for='(ssItem) in sItem.myKey'>
										<span class='sk_devstate'
											:class="{deviceinfo_warning:child.includes('断电')||child.includes('停止')||child.includes('异常')||child.includes('关闭'),deviceinfo_0:child.replace(/[^0-9.]/ig,'')==='0'}"
											v-for="child in ssItem">
											{{child}}
										</span>
									</div>
								</li>
							</ul>
						</div>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y class="item-page showAlarm" @scrolltolower="onreachBottom">
						<timeAxis :options="alarmData"></timeAxis>
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
	import Tool from "../../util/Tool";
	// dayjs().format()
	// dayjs(unix_time).format('YYYY-MM-DD')
	export default {
		components: {
			timeAxis
		},
		filters: {
			formatTime(date) {
				return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
			}
		},
		data() {
			return {
				list: [{
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
				ucode: "",
				devInfoData: [{}],
				alarmData: [],

				//外设相关
				fifterDcode: ['th'],
				sksj_nullimg: false,
				D_D_Data: [],

				not_Show_Values: false,
				S_V_Data: [],
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
					data: {
						ucode: this.ucode
					},
					pageNumber: 1,
					pageSize: 15,
				};
				this.AxiosPOST("/businessApi/device/showAlarm", params).then((res) => {
					this.alarmData = res.result.list;
					console.log("this.alarmData");
					console.log(this.alarmData);
				});
			},
			//外设
			goEcharsDatavir(item) {
				let setArr = this.fifterDcode;
				if (setArr.indexOf(item.dcode) == 0) {
					return true;
				}
			},
			getDeviceDevice() {
				let _this = this;
				this.AxiosPOST("/currencyApi/currency/showDeviceDevice", {
					ucode: this.ucode
				}).then((res) => {
					console.log(res)
					if (res.result.length == 0) {
						_this.sksj_nullimg = true;
					}
					let filterEcher = [];
					_this.D_D_Data = res.result;
					_this.D_D_Data.map(function(item, index) {
						if (_this.goEcharsDatavir(item)) {
							let ar = {};
							ar.ucode = item.ucode;
							ar.dcode = item.dcode;
							ar.model = item.model;
							filterEcher.push(ar);
						}
					});
					localStorage.setItem(
						"filterEcher",
						JSON.stringify(filterEcher)
					);
				});
			},
			InZation_Refresh() {
				let _this = this;
				this.AxiosPOST("/businessApi/device/showValues", {
					ucode: this.ucode
				}).then((res) => {
					this.AxiosPOST("/currencyApi/currency/showAttrByModel", {
						ucode: this.ucode
					}).then((resmo) => {
						if (res.status != 0) {
							_this.not_Show_Values = true;
						} else {
							_this.S_V_Data = res.result;
							let d = _this.S_V_Data;
							let unit = resmo.result;
							for (let i in d) {
								// dcode = i.split('_')[1]; //提取dcode 用于对比
								let dcode = i.substring(
									i.indexOf("_") + 1,
									i.length
								);
								let model = i.split("_")[1];
								d[i].dcode = dcode;
								d[i].myKey = new Array();
								for (let j in d[i]) {
									//删除old字段
									if (/^old/.test(j)) {
										delete d[i][j];
									}

									if (
										j.indexOf("_") == -1 &&
										j != "dcode" &&
										j != "myKey" &&
										!/^old/.test(j)
									) {
										let obj = {};
										unit.map(function(uit, uindex) {
											if (
												uit.code == j &&
												uit.model == model
											) {
												if (
													uit.type == "LONG" ||
													uit.type == "DOUBLE"
												) {
													obj = {
														[j + "_name"]: d[i][
															j + "_name"
														],
														[j]: d[i][j] +
															uit.unit,
														[j +
															"_time"
														]: Tool.dateFormat(
															d[i][
																j + "_time"
															]
														)
													};
												} else if (
													uit.type == "STRING"
												) {
													if (
														uit.note !=
														undefined
													) {
														let note = JSON.parse(
															uit.note
														);
														let notMatch =
															d[i][j];
														// console.log(notMatch);
														// console.log(i);
														// console.log(j);
														// console.log(note);
														// console.log(d);
														// console.log(d[i][j]);
														// console.log(note[d[i][j]]);
														// console.log("=====================");
														// console.log("=====================");
														// console.log("=====================");

														for (let findDef in note) {
															if (
																findDef ==
																"default"
															) {
																notMatch =
																	note[
																		findDef
																	];
															}
														}

														obj = {
															[j +
																"_name"
															]: d[i][
																j + "_name"
															],
															[j]: note[
																	d[i][j]
																] ||
																notMatch,
															[j +
																"_time"
															]: Tool.dateFormat(
																d[i][
																	j +
																	"_time"
																]
															)
														};
													} else {
														obj = {
															[j +
																"_name"
															]: d[i][
																j + "_name"
															],
															[j]: d[i][j],
															[j +
																"_time"
															]: Tool.dateFormat(
																d[i][
																	j +
																	"_time"
																]
															)
														};
													}
												}
											}
										});
										d[i].myKey.unshift(obj);
									}
								}
							}
							_this.S_V_Data = d;
						}
					})
				})
			},
		},

		mounted() {
			this.getDevInfo();
			this.getAlarms();
			this.getDeviceDevice();
			this.InZation_Refresh();
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

	//外设
	
	.detPubInfo {
		width: 100%;
		margin-bottom: 0px;
		box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.05);

		li {
			width: 100%;
			background: #f5f5f5;
			// border-bottom: 1px solid #fff;
			padding: 10px;
			font-size: 16px;
			border-bottom: 1px solid #dddddd;
			border-top: 1px solid white;
			color: #777;

			span.atr {
				color: #333;
			}

			&.bottom_li {
				margin-bottom: 10px;
			}

			&.threefloor {
				border-top: 1px solid #e5e5e5;
			}

			&.fistHead {
				font-size: 16px;
				border-bottom: none;
				// border-radius: 7px 7px 0 0;
				color: #6ea818;

				.right {
					float: right;
				}
			}

			.sk_dev {
				width: 100%;

				&:not(:last-child) {
					border-bottom: 1px solid #ccc;
					padding: 5px 0;
					border-bottom: 1px solid #dddddd;
					border-top: 1px solid white;
				}

				&:last-child {
					padding-top: 5px;
					border-top: 1px solid white;
				}

				&:first-child {
					border-top: none;
				}

				.sk_devstate {
					color: #777;

					&:nth-child(2) {
						margin-left: 20px;
						float: right;
						display: inline-block;
					}

					&:nth-child(3) {
						color: #777;
						display: block;
						width: 100%;
						text-align: right;
						margin-top: 5px;
						margin-left: 0;
						padding-right: 10px;
					}
				}
			}

			span {
				margin-right: 10px;
			}
		}
	}
</style>
