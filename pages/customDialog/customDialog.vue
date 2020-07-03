<template>
	<!-- 弹窗 -->
	<view class="customDialog">
		<view class="customDialog-mask"></view>
		<view class="customDialog-center">
			<view class="cdc-center">
				<p class="cdc-center-p1">别心急，活动未开始呦～</p>
				<p class="cdc-center-p2">本次活动将于2020年9月1日正式开始</p>
				<p class="cdc-center-p3">敬请期待</p>
			</view>
			<view class="cdc-footer-close flex-xc-yn"><image src="../../static/crownCookiesImg/close.png"></image></view>
		</view>
	</view>
</template>

<script>
import { get, post, config } from '@/utils/api.js';
export default {
	name: 'customDialog',
	data() {
		return {
			imgUrl: config.staticUrl,
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
			swiperList: [
				{
					id: 0,
					type: 'image',
					expirationTime: '2020/06/07', //let start_time  = "2019/08/12 12:50:30";
					url: 'https://xcxsite.vjifen.com/v/lnqp/2.0/lnbar0605.jpg?v=1.0.1'
				},
				{
					id: 1,
					type: 'image',
					url: 'https://xcxsite.vjifen.com/v/lnqp/2.0/banner2.png?v=1.0.1'
				}
			],
			allAccountMoney: '0', // 累计获得多少钱
			total: '0', //总计喝了多少瓶
			userScanMonthCount: '0', //本月喝了多少瓶
			totalMoney: '0', //账户余额
			switchTurntable: ''
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
.customDialog-mask {
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	position: fixed;
	top: 0;
	left: 0;
	z-index: 50;
}

.customDialog-center {
	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 60;
	width: 80%;
	transform: translate(-50%, -50%);
}

.cdc-center {
	padding-left: 32rpx;
	padding-right: 32rpx;
	background: #fff;
	// 	background: url(../../static/crownCookiesImg/actStatusBg.png) no-repeat;
	// 	background-size: 100% 100%;
	p {
		font-size: 32rpx;
		line-height: 48rpx;
	}
}
.cdc-center-p1,
.cdc-center-p3 {
	color: #333333;
}
.cdc-center-p2 {
	color: #c60000;
}
.cdc-footer {
	width: 100%;
	height: 98rpx;
	margin-top: 24rpx;
	line-height: 98rpx;
	image {
		display: inline-block;
		width: 100%;
		height: 100%;
	}
}
.cdc-footer-close {
	width: 100%;
	height: 98rpx;
	margin-top: 24rpx;
	line-height: 98rpx;
	image {
		width: 60rpx;
		height: 164rpx;
	} 
}
</style>
