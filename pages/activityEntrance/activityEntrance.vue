<template>
	<view class="activityEntrance">
		<image mode="widthFix" class="crownCookies-logo" src="../../static/crownCookiesImg/crownCookiesImgLogo.png"></image>
		<view class="activityEntrance-center">
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
		name: "activityEntrance",
		data() {
			return { 
				staticUrl: config.staticUrl,
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
		
		methods: {
			
		}
	}
</script>
<!-- <view class="container" style="background-image:url({{imgBaseUrl}}/bg.jpg) no-repeat;background-size:cover;"></view> -->
<style lang="scss">
	.activityEntrance{
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
	.activityEntrance-center{
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
