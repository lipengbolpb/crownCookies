<template>
	<!-- 二维码已被扫 -->
	<view class="codeScanned flex-xn-yn">
		<view class="cs-center">
			<view class="flex-xc-yn"><image mode="widthFix" class="csc-crownCookies" src="../../static/crownCookiesImg/crownCookiesImg.png"></image></view>
			<p class="csc-title">这个二维码已被扫过</p>
			<p class="csc-p">每个二维码仅限扫码一次</p> 
			<view class="flex-xc-yn"><image mode="widthFix" class="csc-crownCookies" src="../../static/crownCookiesImg/crownCookiesImg.png"></image></view>
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

<style scoped lang="scss">
 
.codeScanned {
	height: 100%;
	background: #f1f1f1;
}
.cs-center {
	flex: 1;
	margin: 136rpx 30rpx 30rpx 30rpx;
	background: #fff;
	padding: 20rpx;
	text-align: center;
}
.csc-title{
	font-size: 30rpx;
	color: #333333;
}
.csc-p{
	font-size: 28rpx;
	color: #333333;
	line-height: 50rpx;
}
.csc-crownCookies{
	width: 348rpx;
} 
.csc-logo {
	width: 140rpx;
}
</style>
