<template>
	<!-- 活动主页 -->
	<view class="activityRule" v-if="activityRuleIsShow">
		<view class="activityRule-mask" @click="closeActivityRule"></view>
		<!-- 来源 活动主页 activity -->
		<view class="activityRule-center" v-if="activityRuleSource==1">
			{{ activityRuleSource }}
			<view class="arc-title flex-xc-yn"><text class="arc-title-text">活动规则</text></view>
			<view class="arc-center">
				<p>在活动时间内，凡购买908g、888g、790g、750g、681g、1010g皇冠丹麦曲奇饼干特别礼盒及576g装皇冠丹麦曲奇饼干（音乐盒特别装）（下称“活动产品”）可通过微信扫描活动产品包装内，<text>邀请函上的抽奖二维码或关注微信公众号“ Danisa皇冠丹麦曲奇”</text>并在相应页面输入邀请函上的序列号，进入活动页面并参与活动，即有机会获得丹麦8日游或微信红包奖品。</p>
			</view>
			<view class="arc-footer">
				 <image src="../../static/crownCookiesImg/haveRead.png"></image>
			</view>
		</view>
		<!-- 来源 个人中心页面 personalCenter-->
		<view class="activityRule-center" v-if="activityRuleSource==2">
			<image @click="closeActivityRule" class="arc-close-image" :src="staticUrl+'closeTop.png'" mode="widthFix"></image>
			<view class="arc-title flex-xc-yn"><text class="arc-title-text">活动规则</text></view>
			<view class="arc-center">
				<p>在活动时间内，凡购买908g、888g、790g、750g、681g、1010g皇冠丹麦曲奇饼干特别礼盒及576g装皇冠丹麦曲奇饼干（音乐盒特别装）（下称“活动产品”）可通过微信扫描活动产品包装内，<text>邀请函上的抽奖二维码或关注微信公众号“ Danisa皇冠丹麦曲奇”</text>并在相应页面输入邀请函上的序列号，进入活动页面并参与活动，即有机会获得丹麦8日游或微信红包奖品。</p>
			</view>
		</view>
	</view>
</template>
<!-- have read -->
<script>
	import {
		get,
		post,
		config
	} from '@/utils/api.js';
	export default {
		name: "activityRule",
		props: {
			activityRuleSource: {
				type: String,
				default: '1'
			},
			activityRuleIsShow:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				staticUrl: config.staticUrl,
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
		},
		onLoad() {
			var windowW = wx.getSystemInfoSync().windowWidth;
			var windowH = wx.getSystemInfoSync().windowHeight;
			console.log(windowW);
			console.log(windowHeight);
		},

		onShow() { 
			var windowW = wx.getSystemInfoSync().windowWidth;
			var windowH = wx.getSystemInfoSync().windowHeight;
			console.log(windowW);
			console.log(2);
		},
		methods: {
			// 关闭弹窗
			closeActivityRule(){
				const that = this;
				that.$emit('activityRuleColse',false)
			}
			
		}
	}
</script>

<style scoped lang="scss">
	 .activityRule-mask{
		 width: 100%;
		 height: 100%;
		 background: rgba(0,0,0,.5);
		 position: fixed;
		 top: 0;
		 left: 0;
		 z-index: 50;
	 }
	 .activityRule-center{
		 width: 100%;
		 max-height: 50%;
		 position: absolute;
		 bottom: 0;
		 z-index: 60;
		 background: #FFF;
		 padding-top:40rpx ;
	 }
	 .arc-title{
		
	 }
	 .arc-title-text{
		 width: 260rpx;
		 height: 68rpx;
		 text-align: center;
		 line-height: 68rpx;
		 font-size:36rpx;
		 color:#0A0061;
		 border-radius: 34rpx;
		 margin-bottom: 30rpx;
		 border: 2rpx solid #1F1295;
	 }
	 .arc-center{
		 padding-left: 32rpx;
		 padding-right: 32rpx;
		 p {
			font-size: 28rpx;
			color: #333;
			line-height: 48rpx;
			text-indent:40rpx;
			text{
				color:#FF8207;
			}
		 }
	 } 
	 .arc-footer{
		 width: 100%;
		 height: 98rpx;
		 margin-top: 24rpx;
		 line-height: 98rpx;
		 image{
			 display: inline-block;
			 width: 100%;
			 height: 100%;
		 }
	 }
	 .arc-close-image{ 
		 width: 60rpx;
		 height: 164rpx;
		 position: absolute;
		 left: 50%;
		 margin-left: -30rpx;
		 top: -130rpx; 
	 }
</style>
