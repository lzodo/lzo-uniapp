<template>
	<view class="box">
		<div>
			<div class="notdata_div" v-show='sksj_nullimg'>
				<!-- <img :src='$store.state.notdata_url' /> -->
				<span class='massfont'>没有数据</span>
			</div>
			<ul class='detPubInfo' v-for='item in D_D_Data' style="margin-bottom:12px" v-bind:key="item.id">
				<li class="fistHead">
					<span>{{item.name}}</span>
					<span style='color:#5EEA62' v-show='item.connstate=="在线"' class="right">{{item.connstate}}</span>
					<span style='color:#858585' v-show='item.connstate=="离线"' class="right">{{item.connstate}}</span>
					<span style='color:#E83352' v-show='item.connstate=="告警"' class="right">{{item.connstate}}</span>
					<span style='color:#EAA25C' v-show='item.connstate=="异常"' class="right">{{item.connstate}}</span>
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
	</view>
</template>

<script>
	import Tool from "../util/Tool";
	export default {
		filters: {
			formatTime(date) {
				return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
			}
		},
		data() {
			return {
				//外设相关
				fifterDcode: ['th'],
				sksj_nullimg: false,
				D_D_Data: [],

				not_Show_Values: false,
				S_V_Data: [],
				interval:null
			}
		},
		props: {
			ucode: {
				type: String
			}
		},
		beforeDestroy(){
			if(this.interval){
				console.log('====================')
				clearInterval(this.interval)
			}
		},
		methods: {
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
			this.getDeviceDevice();
			this.InZation_Refresh();
			if(this.interval){
				clearInterval(this.interval)
			}
			this.interval = setInterval(()=>{
				this.InZation_Refresh();
			},4000)
			
		}
	}
</script>

<style lang="scss" scoped>
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
