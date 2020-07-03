<template>
	<!-- 黑名单页面 -->
	<view class="blacklist flex-xn-yn">
		<view class="bl-center" v-if="showType">
			<view class="flex-xc-yn"><image mode="widthFix" class="blc-logo" src="../../static/crownCookiesImg/crownCookiesImgLogo.png"></image></view>
			<p class="blc-title">您的账号存在可疑风险，为确保您的账号安全，</p>
			<p class="blc-p"><text class="blc-text">1、关注【Danisa皇冠丹麦曲奇公众号】，</text>获得更 多活动信息，请截图保存该图片，并在手机相册中 进行识别二维码。</p>
			<p class="blc-p">2、客服电话：400-007-2959</p> 
			<view class="flex-xc-yn"><image mode="widthFix" class="blc-officialAccount" src="../../static/crownCookiesImg/officialAccountBack.png"></image></view>
			<view class="flex-xc-yn"><image mode="widthFix" class="blc-crownCookies" src="../../static/crownCookiesImg/crownCookiesImg.png"></image></view>
		</view>
		<view class="bl-center">
			<view class="flex-xc-yn"><image mode="widthFix" class="blc-logo" src="../../static/crownCookiesImg/crownCookiesImgLogo.png"></image></view>
			<p class="blc-title">为确保您的账号安全，请填写验证信息</p>
			 <view class="blc-submitBox submitBox">
			 	<input class="submitBox-input" type="text" value="" placeholder="输入手机号"/>
				
				<view class="flex-xsb-yc submitBox-checkCode">
					<input class="submitBox-input" type="text" value="" placeholder="输入验证码"/>
					<button type="primary">获取验证码</button>
				</view>
				
				<view class="submitBox-submit"> 提交信息 </view>
			 </view>
			 <view class="blc-mobile"> 客服电话：400-007-2959 </view>
			<view class="flex-xc-yn"><image mode="widthFix" class="blc-crownCookies" src="../../static/crownCookiesImg/crownCookiesImg.png"></image></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'blacklist',
		data() {
			return {
				showType:false
			};
		},
		methods: {
			game() {
				uni.navigateTo({
					url: './game?switchTurntable=' + this.switchTurntable
				});
			}
		}
	};
</script>

<style lang="scss">
page {
	width: 100%;
	height: 100%;
}
.blc-logo {
	width: 140rpx;
}
.blacklist {
	height: 100%;
	background: #f1f1f1;
}
.bl-center {
	flex: 1;
	margin: 136rpx 30rpx 30rpx 30rpx;
	background: #fff;
	padding: 20rpx;
}
.blc-title{
	font-size: 30rpx;
	color: #333333;
}
.blc-p{
	font-size: 28rpx;
	color: #333333;
	line-height: 50rpx;
}
.blc-text{
	color: #211493;
}
.blc-crownCookies{
	width: 348rpx;
}
.blc-officialAccount{
	margin-bottom: 122rpx;
	margin-top: 60rpx;
	width: 300rpx;
}
.blc-submitBox{
	margin-top: 48rpx;
}
.submitBox input{
	height: 100rpx;
	line-height: 100rpx;
	border-radius:10rpx;
	background: #F5F4F4;
	// margin-bottom: 28rpx;
	padding-left: 32rpx;
	font-size: 28rpx;
}
.submitBox button{
	margin: 0;
	color: #221596;
	font-size: 30rpx;
	background: #fff;
	border: 2rpx solid #3C00A6;
}
.submitBox-checkCode{
	margin-top: 28rpx;
}
.submitBox input::-webkit-input-placeholder { 
    color: #999999; 
 }
 .submitBox-submit{
	 width: 78%;
	 margin-left: 16%;
	 height: 100rpx;
	 background: #F0AD4E;
	 text-align: center;
	 line-height: 100rpx;
	 font-size: 36rpx;
	 color: #814E05;
	 margin-top: 54rpx;
 }
 .blc-mobile{
	 font-size: 26rpx;
	 color: #333333;
	 text-align: center;
	 margin-top: 64rpx;
	 margin-bottom: 144rpx;
 }
</style>
