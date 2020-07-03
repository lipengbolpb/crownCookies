<template>

	<view class="homeWrap">
		
	</view>

</template>

<script>
	// , getCityInfo
	import {
		get,
		post,
		config
	} from '@/utils/api.js';
	export default {
		name: "home",
		data() {
			return {
				imgUrl: config.staticUrl,
				
				sharePath:'pages/home/home?provinceCode=LN',
				shareImg:'',
				
				openid: '',
				userInfo: {
					avatarUrl: '',
					nickName: ''
				},

				ipx: false,
				statusBarH: this.StatusBar,
				customBarH: this.CustomBar,

				dotStyle: false,
				cardCur: 0,
				swiperList: [{
					id: 0,
					type: 'image',
					expirationTime:'2020/06/07', //let start_time  = "2019/08/12 12:50:30";
					url: 'https://xcxsite.vjifen.com/v/lnqp/2.0/lnbar0605.jpg?v=1.0.1'
				},{
					id: 1,
					type: 'image',
					url: 'https://xcxsite.vjifen.com/v/lnqp/2.0/banner2.png?v=1.0.1'
				}],
				allAccountMoney:'0', // 累计获得多少钱
				total:'0', //总计喝了多少瓶
				userScanMonthCount:'0',//本月喝了多少瓶
				totalMoney:'0',//账户余额
				
				switchTurntable:'',
			}
		},
		computed:{
		    swiperListNew:function(){
				const nowTimestamp = new Date().getTime();
				const arr = [];
				// 当前时间戳小于等于过期时间 才像新轮播数组中添加
				this.swiperList.forEach((itme)=>{
					if(itme.expirationTime){
						if( nowTimestamp <= new Date(itme.expirationTime).getTime() ){
							arr.push(itme)
						}
					}else{
						arr.push(itme)
					}
				})
		        return arr
		    },
		},
		async onLoad() {
			if (this.$store.state.isIPX) {
				this.ipx = true;
			}
			console.log('openid' + this.$store.state.openid)
			this.openid = this.$store.state.openid;

			let that = this;
			uni.getStorage({
				key: 'userMsg',
				success: function(res) {
					that.openid = res.data.openid
					console.log(that.openid);
					that.$store.commit('getOpenid', res.data.openid);
					if (!that.openid) {
						uni.navigateTo({
							url: '../getOpenid/getOpenid?provinceCode=' + 'LN' + '&type=openid',
						})
					}
				},
				fail: function() {
					if (!that.openid) {
						uni.navigateTo({
							url: '../getOpenid/getOpenid?provinceCode=' + 'LN' + '&type=openid',
						})
					}
					console.log(that.openid);
				}
			})

			uni.getStorage({
				key: 'userInfo',
				success: function(res) {
					console.log(res.data);
					that.userInfo = res.data
				}
			});
		},

		onShow() {
			let that = this;
			uni.getStorage({
				key: 'userMsg',
				success: function(res) {
					console.log(res.data)
					that.openid = res.data.openid
					console.log(that.openid);
					that.$store.commit('getOpenid', res.data.openid);
					if (!that.openid) {
						uni.navigateTo({
							url: '../getOpenid/getOpenid?provinceCode=' + 'LN' + '&type=openid',
						})
					} else {
						that.initData() ; //首页数据展示
					}
					console.log('啦啦啦啦home' + that.$store.state.openid);
				},
				fail: function() {
					if (!that.openid) {
						uni.navigateTo({
							url: '../getOpenid/getOpenid?provinceCode=' + 'LN' + '&type=openid',
						})
					}
					console.log(that.openid);
				}
			})

			// 已授权的 进入回显头像
			uni.getStorage({
				key: 'userInfo',
				success: function(res) {
					console.log(res.data);
					var userInfo = res.data
					that.userInfo.avatarUrl = res.data.avatarUrl;
					// that.userInfo.nickName = res.data.nickName;
				},
				fail: function(res) {
					// 没有头像
				}
			})
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
			
		},
		methods: {
			// 统计数据展示
			async initData() {
				var params = {
					"openid": this.$store.state.openid, // olcf0s5mCNQdBl_4sU3tXY2-Cd6g
					"hbopenid":'',
					"projectServerName": 'liaoning',
				};
				var jo = await post('/turnaroundDraw/queryUserHomePage', params);
				console.log('首页数据' + jo); // reply result replyTime
				if(jo.result.code == 0){
					if (jo.result.businessCode == 0) {
					  this.allAccountMoney = String(jo.reply.allAccountMoney); // 累计获得多少钱
					  this.total = String(jo.reply.total); //总计喝了多少瓶
					  this.totalMoney = String(jo.reply.totalMoney);//账户余额
					  this.userScanMonthCount = String(jo.reply.userScanMonthCount);//本月喝了多少瓶
					  
					  this.switchTurntable = jo.reply.switchTurntable;  //  0为未开，1开启 
					} else {
					   this.allAccountMoney = '0'; // 累计获得多少钱
					   this.total = '0'; //总计喝了多少瓶
					   this.totalMoney = '0';//账户余额
					   this.userScanMonthCount = '0';//本月喝了多少瓶
					  // uni.showModal({
					  //   title: '提示',
					  //   content: jo.result.msg,
					  // })
					}
				} else {
					uni.showModal({
					  title: '提示',
					  content: jo.result.msg,
					})
				}
			},
			/**
			 * 获取用户信息
			 */
			getUserInfoFn() {
				let that = this;
				uni.getUserInfo({
					success: function(res) {
						console.log(res.userInfo);
						that.userInfo.avatarUrl = res.userInfo.avatarUrl;
						that.userInfo.nickName = res.userInfo.nickName;
						// 存储头像
						uni.setStorage({
							key: 'userInfo',
							data: res.userInfo
						})
					}
				})
			},
			cardSwiper(e) {
				this.cardCur = e.detail.current
			},
			scanGetInfo() {
				uni.navigateTo({
					url: './scanPrize'
				})
			},
			brandStory() {
				uni.navigateTo({
					url: './brandStory'
				})
			},
			brandActive() {
				uni.switchTab({
					url: '../brandActive/brandActive'
				})
			},
			proBuy() {
				uni.navigateTo({
					url: './proOrder'
				})
			},
			game() {
				uni.navigateTo({
					url: './game?switchTurntable=' + this.switchTurntable,
				})
			},
			
		}
	}
</script>

<style scoped lang="scss">
	button::after {
		border: none;
	}

	button {
		background-color: transparent;
		height: 114rpx;
	}

	.clearfix:after {
		content: ".";
		height: 0;
		clear: left;
		visibility: hidden;
	}

	.homeWrap {
		width: 100%;
		height: 100%;
		/* 扩散形状圆形 半径大小(到最近的边) at 圆心位置在50px*² , 起始渐变色 起始渐变位置, 结束渐变色 结算渐变位置 */
		// background-image: radial-gradient(circle closest-side at 50px 50px,#c9151e 20px, #c9151e 70px) ;
		background: #f9fffb;
		background-size: 100%;
		display: flex;
		flex-direction: column;
		min-height: 100vh;

		.status_bar {
			text-align: center;
			color: #fff;
			position: absolute;
			width: 100%;
			z-index: 1;
		}

		.banner-swiper {
			width: 100%;
			height: 622rpx;

			// position: absolute;
			// top: 0;
			image {
				width: 100%;
			}
		}

		.account {
			display: flex;
			width: 100%;
			height: 216rpx;
			position: relative;
			.left,
			.right {
				width: 33.33%;
				text-align: center;
				padding-top: 46rpx;
				.num {
					.data {
						position: relative;
						z-index: 2;
						// font-size: 24rpx;
						font-size: 26rpx;
						text {
							// font-size: 36rpx;
							font-size: 38rpx;
							font-weight: bold;
						}
					}

					.line {
						height: 8rpx;
						background: #136E1D;
						position: relative;
						width: 50%;
						margin: 0 auto;
						top: -14rpx;
						z-index: 1;
					}

					.tit {
						font-size: 22rpx;
					}
				}
			}

			.center {
				flex: 1;
				top: -34rpx;
				position: relative;
				text-align: center;
				.avatar {
					width: 110rpx;
					height: 110rpx;
					border-radius: 50%;
					margin: 0 auto;
					border: 1rpx solid #187924;
				}

				.num {
					.data {
						position: relative;
						z-index: 2;
						padding-top: 40rpx;
						font-size: 24rpx;

						text {
							font-size: 36rpx;
							font-weight: bold;
						}
					}

					.line {
						height: 8rpx;
						background: #136E1D;
						position: relative;
						width: 50%;
						margin: 0 auto;
						top: -14rpx;
						z-index: 1;
					}

					.tit {
						font-size: 22rpx;
					}
				}
			}
			.kefuBtn{
				// position: absolute;
				// width: 206rpx;
				// right: 0;
				right:16%;
				top: 62%;
				margin: 0;
				padding: 0;
				.kefu {
					width: 115rpx;
				}
			}
		}
		
		.scanGift {
			width: 708rpx;
			height: 222rpx;
			padding: 24rpx 22rpx;
		}

		.mode {
			display: flex;
			flex-flow: wrap;
			justify-content: space-between;
			width: 708rpx;
			padding: 0 22rpx 26rpx;

			.item {
				width: 345rpx;
				padding-bottom: 16rpx;
			}
		}
	}
</style>
