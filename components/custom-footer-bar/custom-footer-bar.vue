<template>
	<view class="cus-footerbar" v-if="cusFooterBarIsShow">
		<view class="cfb-center flex-xc-yc" :animation="footerbarAni">
			<view class="flex-xc-yc-dirY" @click="jumpFun(1)">
				<image src="../../static/crownCookiesImg/indexTabOff.png"></image>
				<view class="">首页</view>
			</view>
			<view class="flex-xc-yc-dirY" @click="jumpFun(2)">
				<image src="../../static/crownCookiesImg/scanTab.png"></image>
				<view class="">扫一扫</view>
			</view>
			<view class="flex-xc-yc-dirY" @click="jumpFun(3)">
				<image src="../../static/crownCookiesImg/personalCenterTabOff.png"></image>
				<view class="">我的账户</view>
			</view>
		</view>
	</view>
</template>

<script>
import { config } from '@/utils/api.js';
export default {
	name: 'cus-footer-bar',
	props: {
		cusFooterBarIsShow: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			staticUrl: config.staticUrl,
			footerbarAni: ''
		};
	},
	methods: {
		jumpFun(type) {
			if (type == 1) {
				uni.switchTab({
					url: '/pages/index/index'
				});
			} else if (type == 2) {
				uni.switchTab({
					url: '/pages/openScan/openScan'
				});
			} else if (type == 3) {
				uni.switchTab({
					url: '/pages/personalCenter/personalCenter'
				});
			}
		},
		// 开始动画
		startAnimation() {
			console.log(3);
			const that = this;
			const footerbarAnimation = wx.createAnimation({
				duration: 1000,
				timingFunction: 'ease',
				delay: 1500
			});
			footerbarAnimation.opacity(1).step();
			that.footerbarAni = footerbarAnimation.export();
		},
		isStartAnimationFun(e) {
			const that = this;
			this.startAnimation();
		}
	}
};
</script>

<style scoped lang="scss">
.cus-footerbar {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100rpx;
	z-index: 80;
	image {
		width: 36rpx;
		height: 36rpx;
		margin-bottom: 10rpx;
	}
	view {
		font-size: 24rpx;
		color: #666666;
	}
}
.cfb-center {
	background: #fff;
	opacity: 0;
	> view {
		flex: 1;
		height: 100rpx;
	}
}
</style>
