<template>
	<!-- 黑名单页面 -->
	<view class="winningRecord flex-xn-yn">
		<view class="wr-center">
			<view class="wrc-listBox"> 
				<view class="wrc-listBox-list flex-xsb-yn">
					<view class="">
						<view class="wrc-listBox-list-mes">扫码中奖</view>
						<view class="wrc-listBox-list-time">中奖时间</view>
					</view>
					<view class="wrc-listBox-list-price">+1.88</view>
				</view>
			</view>
		</view> 
	</view>
</template>

<script>
	export default {
		name: 'winningRecord',
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
.winningRecord {
	height: 100%;
	background: #f1f1f1;
}
.wr-center {
	border-radius: 20rpx;
	flex: 1;
	margin: 136rpx 30rpx 30rpx 30rpx;
	background: #fff;
	padding: 20rpx;
}
.wrc-listBox-list{
	padding:20rpx 0 ;
	border-bottom:2rpx solid #DEDEDE;
}
.wrc-listBox-list-mes{
	margin-bottom: 10rpx;
	font-size: 32rpx;
	color: #333;
}
.wrc-listBox-list-time{
	font-size: 24rpx;
	color: #999999;
}
.wrc-listBox-list-price{
	font-size: 32rpx;
	color: #F10000;
}
</style>
