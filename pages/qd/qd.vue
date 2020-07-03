<template>
	<view class="wrap">
		<view class="title">签到抽奖</view>
		<view class="tipBtn" v-if="needScan != '0' ">每扫码{{needScan}}次，得1次抽奖机会</view> 
		<view class="account">本月您累计扫码{{userScanMonthCount}}瓶青岛啤酒</view>
		
		<view class="cj">
			<image :src=" imgUrl + '2.0/turn.png' " mode="widthFix" class="turntable" :animation="animationData"></image>
			<image :src=" imgUrl + '2.0/turnCenter.png' " mode="widthFix" class="turnCenter"></image>
		</view>

		<view class="cjBtn" @click="cj">
			<view class="btnName">点击抽奖</view>
			<view class="btnTip">您还有{{hasNum}}次抽奖机会</view>
		</view>

		<view class="tip">注：抽奖机会每个自然月的月底将会自动清零</view>

		<!-- 抽中青啤有一套 -->
		<view class="getqp" v-if="getqp">
			<view class="shadowBox">
				<image class="close" @click="closeGetQp" :src=" imgUrl + '2.0/getClose.png' " mode="widthFix"></image>
				<view class="content">
					<view class="bottom">
						<view class="txt zhuhe"> 恭喜您抽中 </view>
						<view class="txt prize">青岛啤酒有一套</view>
						<view class="getBtn" @click="bigPrize">立即领取</view>
					</view>
				</view>
				<view class="tip">奖项已存入您的账户中，请到“我的”中查看</view>
			</view>
		</view>

		<!-- 抽中红包 -->
		<view class="gethb" v-if="gethb">
			<view class="shadowBox">
				<view class="content">
					<view class="txt zhuhe"> 恭喜你抽中 </view>
					<view class="prize">
						<view class="hbResult">
							<view class="money">
								<text>{{earnMoney}}</text>元
							</view>
							<view class="totalMoney">
								您的账户余额为{{surplusMoney}}元
							</view>
						</view>
					</view>
					<view v-if="overOne" class="getBtn" @click="toMine">去提现</view>

					<view v-if="!overOne">
						<view class="getBtn" @click="toMine">我收下了</view>
						<view class="getBtn again" @click="oneMore">再抽一次</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 未抽中 -->
		<view class="getNull" v-if="getNull">
			<view class="shadowBox">
				<view class="content">
					<view class="nullInfo">
						<image class="sadFace" :src=" imgUrl + '2.0/sadFace.png?v=1' " mode="widthFix"></image>
						<view class="txt">本次你没有抽中奖品</view>
						<view class="txt">继续努力~</view>
					</view>
					<image class="close" @click="closeGetNull" :src=" imgUrl + '2.0/closeNull.png' " mode="widthFix"></image>
				</view>
			</view>
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
		name: "qdGetPrize",
		data() {
			return {
				imgUrl: config.staticUrl,
				ipx: false,
				
				latitude:'', //地理位置
				longitude:'',
				speed:'',
				accuracy :'',
				
				openid: '',
				getqp: false, //抽中青啤有一套
				gethb: false, // 抽中红包
				overOne: false, //抽中金额超过1元
				getNull: false,
				
				userScanMonthCount:'', // 累计次数
				needScan:'',   // 获得1个抽奖机会需要的瓶数
				hasNum:'', // 剩余抽奖次数
				
				animationData:{} ,//旋转动画
				runDegs:'',
				awardsList:[
					'谢谢参与',
					'青啤有一套',
					'随机微信红包', 
					'谢谢参与', 
					'青啤有一套',
					'随机微信红包',
				],
				
				earnMoney:'', //抽中金额
				surplusMoney:'',// 账户余额
			}
		},
		onUnload(){
			this.animationData={}; //清空数据
		},
		async onLoad(options) {
			// let awardsList = ['随机微信红包', '谢谢参与', '随机微信红包', '青啤有一套', '谢谢参与', '青啤有一套'];
			// this.initAwardList(awardsList);
		},
		onShow() {
			var _this = this;
			//调用定位方法
			_this.getUserLocation();
			
			// 动画
			var animation = wx.createAnimation({
			  duration: 4000,
			  timingFunction: 'ease'
			})
			
			this.animation = animation
			console.log(this.animation);
		},
        
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '青岛啤酒',
				path: '/pages/home/home',
				imageUrl: this.imgUrl + 'share.png'
			}
		},
        mounted(){
			this.initData();
		},
		methods: {
			// 初始化 转盘抽奖用户信息
			async initData(){
				var params = {
					"openid": this.$store.state.openid, 
					"projectServerName": 'liaoning',
				};
				var jo = await post('/turnaroundDraw/queryTurnaroundDrawUser', params);
				console.log(jo); //用户抽奖信息结果 reply result replyTime
				if(jo.result.code == 0 ){ // 服务正常
					if (jo.result.businessCode == 0) { //正常  
						this.userScanMonthCount = String(jo.reply.userScanMonthCount); // 用户本月扫码累计次数
						this.needScan = String(jo.reply.turnaroundScan) ; // 获得1个抽奖机会需要的瓶数
						this.hasNum = String(jo.reply.turnaroundSurplusCount);  //抽奖次数
					} else {
						this.userScanMonthCount = '0'; // 用户本月扫码累计次数
						this.needScan = '0' ; // 获得1个抽奖机会需要的瓶数
						this.hasNum = '0';  //抽奖次数
						// uni.showModal({
						// 	title: '尊敬的用户',
						// 	content: jo.result.msg
						// })
					}
				} else {  //服务失败
					uni.showModal({
						title: '尊敬的用户',
						content: jo.result.msg
					})
				}
			},
			cj(){  //点击抽奖
				if(this.hasNum > 0){ //可抽
					this.getLottery(); //抽奖
				} else {
					uni.showModal({
						title: '尊敬的用户',
						content: '您当前抽奖次数为0'
					})
				}
			},
			bigPrize(){ //立即领取
				uni.navigateTo({
					url:'../mine/prizeList'
				})
			},
			toMine(){ //to个人中心
				uni.switchTab({
					url:'../mine/mine'
				})
			},
			oneMore(){ //中红包——再抽一次
				this.gethb = false;
			},
			/**
			  * 初始化抽奖
			*/
		  //   initAwardList: function(list) {
				// // 绘制转盘
				// var awardsList = [];
				// var angle = 360 / list.length;
				// for (var i = 0; i < list.length; i++) {
				//   awardsList.push({
				// 	degree: {
				// 	  item: `${i * angle}deg`,
				// 	  line: `${(i + 0.5) * angle}deg`,
				// 	},
				// 	award: list[i],
				//   })
				// }
		  //   },
		  
			/**
			 * 开始抽奖
			*/
			async getLottery(){
				this.getqp = false;
				this.gethb = false;
				this.overOne = false;
				this.getNull = false;
				
				uni.showLoading({
					title: '抽奖中...',
				})
				var params = {
					"openid": this.$store.state.openid, 
					"projectServerName": 'liaoning',
					"longitude":this.longitude,  //经度
					"latitude":this.latitude     //纬度
				};
				var jo = await post('/turnaroundDraw/exchangetTurnaroundDraw', params);
				console.log(jo); //抽奖结果 reply result replyTime
				uni.hideLoading();
				if(jo.result.code == 0 ){ // 服务正常
				    // this.hasNum = this.hasNum - 1; //可用的次数减少一次 
					// 转动圈数
					let runNum = 6;
					if (jo.result.businessCode == 0) { //正常  
					    this.hasNum = String(jo.reply.surplusCount) ; // 剩余次数
						this.userScanMonthCount = String(jo.reply.userScanMonthCount); // 本月扫码累计次数
						this.needScan = String(jo.reply.turnaroundScan); //一个抽奖机会所需瓶数
						if(jo.reply.prizeType == 'P' || jo.reply.prizeType == 'p'){ //抽中实物奖
						    // 获奖序号
						    var awardIndex = 2 || 5;
						    // 旋转抽奖
						    this.runDegs = this.runDegs || 0;
						    this.runDegs = this.runDegs + (360 - this.runDegs % 360) + (360 * runNum - awardIndex * (360 / this.awardsList.length));
						    // 开始转动
							
							this.animation.rotate(this.runDegs).step();
							this.animationData = this.animation.export()
							// 中奖提示
							setTimeout(() => {
							  console.log('抽中了奖品: ' + awardIndex)
							  this.getqp = true; 
							}, 4000 + 300)
						} else if (jo.reply.prizeType == '0' && jo.reply.earnMoney>0){ //抽到红包
							// 获奖序号
							var awardIndex = 3 || 6;
							// 旋转抽奖
							this.runDegs = this.runDegs || 0;
							this.runDegs = this.runDegs + (360 - this.runDegs % 360) + (360 * runNum - awardIndex * (360 / this.awardsList.length));
							// 开始转动
							// 动画
							this.animation.rotate(this.runDegs).step();
							this.animationData = this.animation.export()
							// 中奖提示
							setTimeout(() => {
							  console.log('抽中了奖品: ' + awardIndex)
							  
							  this.earnMoney = jo.reply.earnMoney; //抽中金额
							  this.surplusMoney = jo.reply.surplusMoney ;//账户余额
							  this.gethb = true;
							  if(jo.reply.earnMoney>=1){
							  	this.overOne = true;
							  } else {
							  	this.overOne = false;
							  }
							}, 4000 + 300)
						} else {  //无中奖
							// 获奖序号
							var awardIndex = 1 || 4;
							// 旋转抽奖
							this.runDegs = this.runDegs || 0;
							this.runDegs = this.runDegs + (360 - this.runDegs % 360) + (360 * runNum - awardIndex * (360 / this.awardsList.length));
							// 开始转动
							// 动画
							this.animation.rotate(this.runDegs).step();
							this.animationData = this.animation.export()
							// 中奖提示
							setTimeout(() => {
							  console.log('抽中了奖品: ' + awardIndex)
							  this.getNull = true;
							}, 4000 + 300)
						}
					} else if(jo.result.businessCode == 8){ //没抽到谢谢惠顾
					
					    this.hasNum = String(jo.reply.surplusCount) ; // 剩余次数
					    this.userScanMonthCount = String(jo.reply.userScanMonthCount); // 本月扫码累计次数
					    this.needScan = String(jo.reply.turnaroundScan); //一个抽奖机会所需瓶数
						
						// 获奖序号
						var awardIndex = 1 || 4;
						// 旋转抽奖
						this.runDegs = this.runDegs || 0;
						this.runDegs = this.runDegs + (360 - this.runDegs % 360) + (360 * runNum - awardIndex * (360 / this.awardsList.length));
						// 开始转动
						// 动画
						this.animation.rotate(this.runDegs).step();
						this.animationData = this.animation.export()
						// 中奖提示
						setTimeout(() => {
						  console.log('抽中了奖品: ' + awardIndex)
						  this.getNull = true;
						}, 4000 + 300)
					} else {
						uni.showModal({
							title: '尊敬的用户',
							content: jo.result.msg
						})
					}
				} else {  //服务失败
					uni.showModal({
						title: '尊敬的用户',
						content: jo.result.msg
					})
				}
			},
			closeGetQp() {
				this.getqp = false;
			},
			closeGetNull() {
				this.getNull = false;
			},

			//定位方法
			getUserLocation: function() {
				var _this = this;
				wx.getSetting({
					success: (res) => {
						// res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
						// res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
						// res.authSetting['scope.userLocation'] == true    表示 地理位置授权
						if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
							//未授权
							wx.showModal({
								title: '请求授权当前位置',
								content: '是否授权您的地理位置',
								success: function(res) {
									if (res.cancel) {
										//取消授权
										// wx.showToast({
										// 	title: '拒绝授权',
										// 	icon: 'none',
										// 	duration: 1000
										// })
									} else if (res.confirm) {
										//确定授权，通过wx.openSetting发起授权请求
										wx.openSetting({
											success: function(res) {
												if (res.authSetting["scope.userLocation"] == true) {
													wx.showToast({
														title: '授权成功',
														icon: 'success',
														duration: 1000
													})
													//再次授权，调用wx.getLocation的API
													_this.geo();
												} else {
													wx.showToast({
														title: '授权失败',
														icon: 'none',
														duration: 1000
													})
												}
											}
										})
									}
								}
							})
						} else if (res.authSetting['scope.userLocation'] == undefined) {
							//用户首次进入页面,调用wx.getLocation的API
							_this.geo();
						} else {
							console.log('授权成功')
							//调用wx.getLocation的API
							_this.geo();
						}
					}
				})
			},

			// 获取定位城市
			geo: function() {
				var _this = this;
				wx.getLocation({
					type: 'wgs84',
					success: function(res) {
						_this.latitude = res.latitude
						_this.longitude = res.longitude
						_this.speed = res.speed
						_this.accuracy = res.accuracy
					},
					fail:function(){
						// wx.showToast({
						// 	title: '已拒绝授权',
						// 	icon: 'none',
						// 	duration: 1000
						// })
					}
				})
			},
		}
	}
</script>
<style scoped lang="scss">
	.wrap {
		width: 100%;
		// height: 100%;
		/* 扩散形状圆形 半径大小(到最近的边) at 圆心位置在50px*² , 起始渐变色 起始渐变位置, 结束渐变色 结算渐变位置 */
		// background-image: radial-gradient(circle closest-side at 50px 50px,#c9151e 20px, #c9151e 70px) ;
		background-image: url('https://xcxsite.vjifen.com/v/lnqp/2.0/cjBg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		display: flex;
		flex-direction: column;
		/*属性规定灵活项目的方向:灵活的项目将垂直显示，正如一个列一样。*/
		justify-content: center;
		/*justify-content 用于设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式:项目位于容器的中心。*/
		align-items: center;
		/*align-items 属性定义flex子项在flex容器的当前行的侧轴（纵轴）方向上的对齐方式:项目位于容器的中心。*/
		height: 100vh;

		/* 100vh = viewport height*/
		.title {
			font-size: 72rpx;
			color: #fff;
			text-align: center;
			font-weight: 900;
			padding: 82rpx 0 48rpx;
			letter-spacing: 16rpx;
		}

		.tipBtn {
			height: 44rpx;
			text-align: center;
			line-height: 44rpx;
			background: #37b418;
			font-size: 24rpx;
			color: #fff;
			margin: 0 auto;
			padding: 0 12rpx;
		}

		.account {
			font-size: 26rpx;
			text-align: center;
			color: #fff;
			margin: 42rpx 0 26rpx;
		}
        .cj{
			position: relative;
			background-image: url('https://xcxsite.vjifen.com/v/lnqp/2.0/shadow.png');
			background-size: 100% 20%;
			background-repeat: no-repeat;
			height: 640rpx;
			background-position-y: 100%;
			.turntable {
				width: 566rpx;
				margin: 0 auto;
			}
			.turnCenter{
				position: absolute;
				width:125rpx;
				top: 32%;
				right: 40%;
			}
		}

		.cjBtn {
			text-align: center;
			height: 98rpx;
			background: #ffea9e;
			margin: 0 auto;
			border-radius: 10rpx;
			margin-bottom: 44rpx;
			padding: 0 40rpx;

			.btnName {
				font-size: 34rpx;
				color: #e94746;
				letter-spacing: 2rpx;
				margin: 8rpx 0;
				font-weight: bold;
			}

			.btnTip {
				font-size: 20rpx;
				color: #490000;
			}
		}

		.tip {
			font-size: 24rpx;
			color: #fff;
			text-align: center;
		}
	}


	.getqp {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.9);
		z-index: 999;

		.shadowBox {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			-webkit-transform: translate(-50%, -50%);
			-moz-transform: translate(-50%, -50%);
			background: #fff;
			border-radius: 10rpx;
			width: 536rpx;
			height: 52%;

			// height: 748rpx;
			.close {
				width: 52rpx;
				top: -4%;
				right: -4%;
				position: absolute;
			}

			.content {
				font-size: 50rpx;
				text-align: center;
				font-weight: 900;
				padding-top: 56rpx;
				background-image: url('https://xcxsite.vjifen.com/v/lnqp/2.0/getqp.png?v=1.0');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				height: 100%;

				.bottom {
					position: relative;
					top: 50%;

					.zhuhe {
						color: #c10000;
					}

					.prize {
						color: #000;
					}

					.getBtn {
						width: 304rpx;
						height: 88rpx;
						line-height: 88rpx;
						margin: 46rpx auto;
						background: #ffea9e;
						font-size: 38rpx;
						color: #e94746;
						text-align: center;
						border-radius: 8rpx;
						box-shadow: -3px 2px 8px #a7a7a7;
					}
				}
			}

			.tip {
				margin-top: 56rpx;
				font-size: 22rpx;
				color: #fff;
				text-align: center;
			}
		}
	}

	.gethb {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.9);
		z-index: 999;

		.shadowBox {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			-webkit-transform: translate(-50%, -50%);
			-moz-transform: translate(-50%, -50%);
			border-radius: 10rpx;

			.content {
				font-size: 50rpx;
				text-align: center;
				font-weight: 900;

				.zhuhe {
					font-size: 40rpx;
					color: #fff;
					text-align: center;
				}

				.prize {
					background-image: url('https://xcxsite.vjifen.com/v/lnqp/2.0/hb.png');
					background-size: 100% 100%;
					background-repeat: no-repeat;
					width: 440rpx;
					height: 627rpx;
					text-align: center;
					margin-top: 36rpx;

					.hbResult {
						position: relative;
						top: 50%;

						.money {
							color: #ffe59e;
							font-size: 56rpx;

							text {
								font-size: 126rpx;
								font-weight: bold;
							}
						}

						.totalMoney {
							color: #ffe59e;
							font-size: 26rpx;
							padding-top: 46rpx;
						}
					}
				}

				.getBtn {
					width: 304rpx;
					height: 88rpx;
					line-height: 88rpx;
					margin: 58rpx auto 0;
					background: #ffea9e;
					font-size: 38rpx;
					color: #e94746;
					text-align: center;
					border-radius: 12rpx;

					&.again {
						background: #f8b370;
					}
				}
			}
		}
	}

	.getNull {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.9);
		z-index: 999;

		.shadowBox {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			-webkit-transform: translate(-50%, -50%);
			-moz-transform: translate(-50%, -50%);

			.content {
				font-size: 50rpx;
				text-align: center;
				font-weight: 900;
				padding-top: 56rpx;
				background-image: url('https://xcxsite.vjifen.com/v/lnqp/2.0/cjNull.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				width: 583rpx;
				height: 665rpx;

				.nullInfo {
					position: relative;
					top: 6%;

					.sadFace {
						width: 144rpx;
						margin: 0 auto 52rpx;
					}

					.txt {
						font-size: 50rpx;
						color: #fff;
						text-align: center;
						line-height: 100rpx;
					}
				}

				.close {
					width: 53rpx;
					margin: 40% auto;
				}
			}
		}
	}
</style>
