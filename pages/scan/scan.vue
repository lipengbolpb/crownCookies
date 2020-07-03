<template>
	<!-- 解析二维码 -->
	<!-- 集卡结束的绿主题色 -->
	<view class="scan" id="greenScan">
		<view class="status_bar">
			<view>
				<!-- 这里是状态栏 -->
			</view>
			<view class="title"> 青岛啤酒辽宁 </view>
		</view>
	
		<!--  第一次进入 需要弹出 授权地理位置 -->
		<view class="index" v-if="openid || needLocation">
			<view class="head">
				<image :src="imgUrl + 'logo.png' " mode="widthFix" class="logo"></image>
			</view>
			<image :src="imgUrl + 'scanImg.png'" mode="widthFix" class="scanImg"></image>
		</view>
		<!--  第 n 次点击弹出 授权地理位置 -->
		<view class="opensetting" v-if="needLocation && !againClick">
			<view class="head">
				<!-- 小程序的logo和名字 -->
				<image :src=" imgUrl + 'xcxLogo.jpg' " mode="widthFix" class="headimg"></image>
				<!-- 青岛啤酒辽宁 -->
				<text>畅享青啤</text> <text>申请</text>
				<image :src="imgUrl + 'icon_close_1.png' " @click="cancel" mode="widthFix" class="close"></image>
			</view>
			<view class="content">
				<text>获取您的地理位置信息</text>
				<text>获取地理位置可以给你提供更好的服务</text>
			</view>
			<button @click="openset" class="set">进行授权</button>
		</view>
		<view class="location_fail" v-if="ydLocation">
			<image :src=" imgUrl + 'location_fail.png' " mode="widthFix"></image>
			<button @click="closeLocationTip"></button>
		</view>
	</view>
	
</template>

<script>
	import {
		get,
		post,
		config
	} from '@/utils/api.js';
	export default {
		name: "scan",
		data() {
			return {
				imgUrl: config.staticUrl,
				qrcode: '',
				openid: '',
				ydLocation: false, //引导地理位置页面
				needLocation: false,
				againClick: false,
				isOnLoad: false,
				// staticUrl: '',
				longitude: '', // 经度
				latitude: '', // 维度
				accuracy: '', //精度

				userInfo: {
					avatarUrl: '',
					nickName: ''
				},
			}
		},
		onLoad(options) {
			// this.staticUrl = config.staticUrl
			console.log(this.imgUrl);
			console.log(options.q);
			console.log(decodeURIComponent(options.q))
			var qr = decodeURIComponent(options.q);
			this.$store.commit('getQr', qr);
			console.log('二维码' + this.$store.state.qr)
			let that = this;
			let urlParse = [];
			if (qr.indexOf('xt.vjifen.com') != -1) {  //测试二维码
				if(qr.indexOf('/LN/') != -1){ //测试的微信直接打开小程序
					that.qrcode = qr.split('LN/')[1];
				} else {
					that.qrcode = qr.split('v=')[1];
				}
			} else if (qr.indexOf('VJ1.TV/LN/') != -1) {
				that.qrcode = qr.split('LN/')[1];
			} else if (qr.indexOf('vj1.tv/LN/') != -1) {
				that.qrcode = qr.split('LN/')[1];
			} else {
				that.qrcode = '';
				return uni.showModal({
					title: '温馨提示',
					content: '请扫描正确的活动二维码~',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							uni.reLaunch({
								url: '../home/home',
							})
						}
					}
				})
			}

			
			console.log(that.qrcode);
			that.$store.commit('getQrcode', that.qrcode);
			that.isOnLoad = true;

			var provinceCode = 'LN';
			that.$store.commit('getProvinceCode', provinceCode);
			console.log('province' + this.$store.state.provinceCode)


			// 已授权的 进入取得头像昵称
			uni.getStorage({
				key: 'userInfo',
				success: function(res) {
					console.log(res.data);
					var userInfo = res.data
					that.userInfo.avatarUrl = res.data.avatarUrl;
					that.userInfo.nickName = res.data.nickName;
				},
				fail: function(res) {
					// 没有头像
					that.userInfo.avatarUrl = '';
					that.userInfo.nickName = '';
				}
			})

		},
		
		// 用户点击右上角分享
		onShareAppMessage() {
			return {
				title: '青岛啤酒辽宁',
				path: '/pages/home/home',
				imageUrl: this.imgUrl + 'share.png'
			}
		},
		async onShow() {
			if (this.isOnLoad) {
				// 获取的存储的数据【不需要】uni.hideLoading()
				//省区code优先,省区code有变动或者无 需重新获取openid
				// LN
				if (this.$store.state.provinceCode == 'LN') {
					this.openid = this.$store.state.openid;
					console.log(this.openid);
					if (!this.openid) {
						uni.navigateTo({
							url: '../getOpenid/getOpenid?provinceCode=' + this.$store.state.provinceCode + '&type=openid',
						});
					} else {
						this.getLocation(); // 地理位置判断	
					}
				}
			}
		},

		created() {
			// console.log(this.$store.state)
		},
		mounted(){
			this.$store.dispatch('xcxOpenidGet');
		},
		methods: {
			getLocation() {
				uni.getLocation({
					type: 'wgs84',
					complete: res => {
						// reslove(res)
						console.log(res);

						this.longitude = res.longitude; // 经度
						this.latitude = res.latitude; // 维度
						this.accuracy = res.accuracy; //精度

						console.log(this.qrcode)
						if (res.errMsg == "getLocation:ok") {
							console.log(`latitude${res.latitude},longitude${res.longitude}`)
							if (this.qrcode.indexOf('MS_') != -1) {
								this.sweepMS(res.longitude, res.latitude); //扫码接口
							} else {
								this.sweep(res.longitude, res.latitude); //扫码接口
							}
						} else if (res.errMsg == 'getLocation:fail auth deny' || res.errMsg ==
							'getLocation:fail authorize no response') { //未授权
							this.getSetting()
						} else if (res.errMsg == 'getLocation:fail:auth denied') { //取消授权
							if (this.qrcode.indexOf('MS_') != -1) {
								this.sweepMS()
							} else {
								this.sweep()
							}
						} else { // 未打开定位也要允许扫码
							this.ydLocation = true;							
						}
					}
					
				});
			},
			closeLocationTip() {
				this.ydLocation = false;
				uni.showModal({
					title: '温馨提示',
					content: '开启手机定位有机会获得更大的红包哦~，确定不开启手机定位参与本次扫码活动吗？',
					cancelText:'先开定位',
					cancelColor:'#808080',
					confirmText:'直接参与',
					confirmColor:'#4CD964',
					complete:res=>{
						console.log(res);
						if(res.confirm){ // 直接参与
							if (this.qrcode.indexOf('MS_') != -1) { //扫码接口
							   this.sweepMS();  
							} else {
							   this.sweep()
							}
						} else {  //去开定位 再来一遍
							uni.switchTab({
								url:'../home/home'
							})
						}
					}
				})
			},
			getSetting() {
				uni.getSetting({
					complete: res => {
						console.log(res)
						if (res.authSetting) {
							if (res.authSetting['scope.userLocation'] == false) {
								this.needLocation = true;
								if (this.againClick) { //从设置返回并未开启位置
									if (this.qrcode.indexOf('MS_') != -1) {
										this.sweepMS(); //扫码接口
									} else {
										this.sweep(); //扫码接口
									}
								}
							} else if (res.authSetting['scope.userLocation'] == undefined) { //首次拒绝授权
								if (this.qrcode.indexOf('MS_') != -1) {
									return this.sweepMS(); //扫码接口
								} else {
									return this.sweep(); //扫码接口
								}
							}
						} else {
							// 扫码接口
							if (this.qrcode.indexOf('MS_') != -1) {
								this.sweepMS(); //扫码接口
							} else {
								this.sweep(); //扫码接口
							}
						}

					},
				})
			},
			async openset() {  //设置里打开授权地理位置
				this.againClick = true;
				uni.openSetting({
					complete:res => {
						// 统一在onshow执行地址位置判断
						// this.getLocation();
						// return false
					}
				})
			},
			// 获取所存储的变量
			getMsg() {
				uni.getStorage({
					key: 'userMsg',
					complete: res => {
						// reslove(res)
						console.log('getMsg' + res)
					}
				})
			},
			async cancel() {  //取消打开授权设置后执行扫码
				console.log('取消打开授权设置')
				this.againClick = true;
				//扫码接口
				if (this.qrcode.indexOf('MS_') != -1) {
					this.sweepMS(); //执行MS的扫码接口
				} else {
					this.sweep();  //执行扫码接口
				}
			},
			
			async sweep(longitude, latitude) { // 扫二维码
				uni.showLoading({
					title: '红包加载中',
				})
				var params = {
					"openid": this.$store.state.openid,
					// "appletOpenid": this.$store.state.xcxopenid, //通用小程序openid
					"paOpenid": this.$store.state.xcxopenid, //省区小程序openid
					"sweepstr": this.qrcode,
					"longitude": longitude === undefined ? '00' : this.longitude, //"经度"
					"latitude": latitude === undefined ? '00' : this.latitude, //"纬度"
					"projectServerName": 'liaoning',
					"nickname" : this.userInfo.nickName,
                    "headimgurl": this.userInfo.avatarUrl,
				}
				var result = await post('/sweep/sweepQrcode', params);
				console.log(result) // reply  result replyTime
				uni.hideLoading();
				console.log('sweepQrcode', result)
				this.$store.dispatch('sweepResult', result)
				console.log(this.$store.state.sweepData)
				var reply = this.$store.state.sweepData.reply;
				var result = this.$store.state.sweepData.result;
				
				if (result.businessCode == 0) {
					uni.redirectTo({
						url: '../result/getcash?bizcode=' + result.businessCode,
					})
				} else if (result.businessCode == 11) {
					uni.redirectTo({
						url: '../result/getcash?bizcode=' + result.businessCode,
					})
				} else if (result.businessCode == 7) {
					if (reply.username) { //已填写
						uni.redirectTo({
							url: '../result/prize?bizcode=' + result.businessCode + '&isWrite=true',
						})
					} else if (result.msg == '重复扫码') {
						uni.redirectTo({
							url: '../result/prize?bizcode=' + result.businessCode + '&isWrite=false',
						})
					} else {
						uni.redirectTo({  // getcash
							url: '../result/prize?bizcode=' + result.businessCode,
						})
					}
				} else if (result.businessCode == 15) {
					uni.redirectTo({
						// url: '../result/fail?bizcode=' + result.businessCode,
						url: '../result/fail?bizcode=2',
					})
				} else if (result.businessCode == 12) {
					uni.redirectTo({
						url: '../result/getMsg?bizcode=' + result.businessCode,
					})
				} else if (result.businessCode == 13) {
					uni.redirectTo({
						url: '../result/getMsg?bizcode=' + result.businessCode,
					})
				} else if (result.businessCode == 30) {
					uni.redirectTo({
						url: '../result/verification?bizcode=' + result.businessCode,
					})
				} else {
					uni.redirectTo({
						url: '../result/fail?bizcode=' + result.businessCode,
					})
				}
			},
			async sweepMS(longitude, latitude) {
				uni.showLoading({
					title: '红包加载中',
				})
				console.log(this.$store.state.provinceCode);
				if (this.$store.state.provinceCode == 'LN') {
					// console.log(辽宁Qrcode)
				}
				var params = {
					"openid": this.$store.state.openid,
					// "appletOpenid": this.$store.state.xcxopenid, //通用小程序openid
					"paOpenid": this.$store.state.xcxopenid, //省区小程序openid
					"sweepstr": this.qrcode,
					"longitude": this.longitude === undefined ? '00' : this.longitude, //"经度"
					"latitude": this.latitude === undefined ? '00' : this.latitude, //"纬度"
					"projectServerName": 'liaoning',
				}
				var result = await post('/vpoints/seckill/sweepQrcode', params);
				uni.hideLoading();
				console.log('seckill sweepQrcode', result)

				this.$store.dispatch('sweepResult', result)
				console.log(this.$store.state.sweepData)
				var reply = this.$store.state.sweepData.reply;
				var result = this.$store.state.sweepData.result;


				if (result.businessCode == 0) {
					uni.redirectTo({
						url: '../result/getcash?bizcode=' + result.businessCode,
					})
				} else if (result.businessCode == 11) {
					uni.redirectTo({
						url: '../result/getcash?bizcode=' + result.businessCode,
					})
				} else if (result.businessCode == 7) {
					if (result.reply.username) { //已填写
						uni.redirectTo({
							url: '../result/prize?bizcode=' + res.data.result.businessCode + '&isWrite=true',
						})
					} else if (result.msg == '重复扫码') {
						uni.redirectTo({
							url: '../result/prize?bizcode=' + result.businessCode + '&isWrite=false',
						})
					} else {
						uni.redirectTo({
							url: '../result/getcash?bizcode=' + result.businessCode,
						})
					}
				} else if (result.businessCode == 15) {
					uni.redirectTo({
						// url: '../result/fail?bizcode=' + result.businessCode,
						url: '../result/fail?bizcode=2',
					})
				} else if (result.businessCode == 12) {
					uni.redirectTo({
						url: '../result/getMsg?bizcode=' + result.businessCode,
					})
				} else if (result.businessCode == 13) {
					uni.redirectTo({
						url: '../result/getMsg?bizcode=' + result.businessCode,
					})
				} else if (result.businessCode == 30) {
					uni.redirectTo({
						url: '../result/verification?bizcode=' + result.businessCode,
					})
				} else {
					uni.redirectTo({
						url: '../result/fail?bizcode=' + result.businessCode,
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.scan {
		width: 100%;
		height: 100%;
		// background: url('https://xcxsite.vjifen.com/v/lnqp/scanBg.png') no-repeat top center;
		// background-image: linear-gradient(#008838, #003f0a);
		background-image: radial-gradient(circle closest-side at 50px 50px,#c9151e 20px, #c9151e 70px) ;
		background-size: 100% 100%;
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;

		.status_bar {
			height: var(--status-bar-height);
			width: 100%;
			padding-top: 66rpx;

			.title {
				color: #fff;
				text-align: center;
				line-height: 44upx;
			}
		}

		.index {
			width: 100%;
			height: 100%;

			.head {
				height: 186upx;
				padding: 82upx;
				padding-bottom: 0;

				.logo {
					width: 150upx;
					padding-right: 30upx;
				}
			}

			.scanImg {
				// width: 100%;
				// margin: 0 auto;
				
				width: 534rpx;
				margin: 0 auto;
				display: block;
				padding: 22rpx 0;
				-webkit-flex-basis: .5;
				-ms-flex-preferred-size: .5;
				flex-basis: .5;
				margin-bottom: 10rpx;
				position: relative;

			}
		}

		.opensetting {
			width: 100%;
			height: 500upx;
			background: #fff;
			position: absolute;
			bottom: 0;
			left: 0;

			.head {
				height: 120upx;
				line-height: 120upx;
				display: flex;
				color: #333;
				position: relative;

				.headimg {
					width: 60upx;
					height: 60upx;
					border-radius: 50%;
					margin: 12upx 0 30upx 30upx;
					border: 1px #ccc solid;
				}

				.close {
					width: 40upx;
					height: 40upx;
					position: absolute;
					top: 40upx;
					right: 40upx;
				}

				text {
					padding: 0 20upx;

					&:nth-of-type(1) {
						font-size: 40upx;
						color: #000;
						font-weight: bold;
						padding: 0 30upx;
						line-height: 80upx;
					}

					&:nth-of-type(2) {
						font-size: 30upx;
						padding: 0 30upx 0 0;
						color: #333;
						line-height: 80upx;
						display: block;
					}
				}
			}

			.content text {
				&:nth-of-type(1) {
					font-size: 40upx;
					color: #000;
					font-weight: bold;
					padding: 30upx;
				}

				&:nth-of-type(2) {
					font-size: 30upx;
					padding: 0 30upx;
					color: #333;
					line-height: 80upx;
					display: block;
				}
			}

			button {
				width: 400upx;
				height: 85upx;
				background: #04c05f;
				display: block;
				margin: 50upx auto;
				border-radius: 10upx;
				color: #fff;
				font-size: 32upx;
			}
		}

		.location_fail {  /* 获取地理位置失败 */
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
            background: #fff;    
			image {
				width: 100%;
				display: block;
				background: #fff;
			}
			button {
				width: 66%;
				height: 100upx;
				bottom: 10%;
				// left: 17%;
				opacity: 0;
			}
		}
	}
	#greenScan{
		background-image: linear-gradient(#008838, #003f0a);
	}
</style>
