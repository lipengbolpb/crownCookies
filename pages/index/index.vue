<template>
	<view class="index">
		<image mode="widthFix" class="crownCookies-logo" src="../../static/crownCookiesImg/crownCookiesImgLogo.png"></image>
		<view class="index-center">
			<image mode="widthFix" src="../../static/crownCookiesImg/chuanquqi.png"></image>
			<image mode="widthFix" src="../../static/crownCookiesImg/baifenbai.png"></image>
		</view>
		<view class="idnex-imgMes">图片仅供参考，产品以实物为准</view>
		<image class="focusGguidance" :src="staticUrl+'focusGguidance.png'"></image>
	</view>
</template>

<script> 
import {
		get,
		post,
		config
	} from '@/utils/api.js';
	export default {
		name: "index",
		data() {
			return { 
				// staticUrl: config.staticUrl,
				staticUrl: '../../static/crownCookiesImg/',
			}
		},
		 
		async onLoad() { 
		},

		onShow() { 
			console.log(this.$store.state.staticUrl)
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
<!-- <view class="container" style="background-image:url({{imgBaseUrl}}/bg.jpg) no-repeat;background-size:cover;"></view> -->
<style lang="scss">
	.index{
		width: 100%;
		height: 100%;
		background: url($crownCookiesImg+'crownCookiesImgBg.jpg') no-repeat center;
		background-size:cover ;
	}
	.crownCookies-logo{
		width: 180rpx;
		margin-left: 54rpx;
		margin-top: 126rpx;
	}
	.index-center{
		margin: 226rpx 120rpx 36rpx 54rpx;
		position: relative;
		image {
			width: 100%;
		}
		image:nth-of-type(2) {
			position: absolute;
			bottom: 0;
			left: 0;
		}
	}
	.focusGguidance{
		position: fixed;
		bottom: 22rpx;
		width: 96%;
		left: 2%;
		height: 170rpx;
	}
	.idnex-imgMes{
		text-align: center;
		font-size: 24rpx;
		color: #B2BCE3;
	}
</style>
