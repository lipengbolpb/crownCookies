<template>
	<view class="cus-footerbar" v-if="cusFooterBarIsShow" :style="{ 'height': isOpenAdaptation ? '160rpx' : '100rpx' }">
		<!-- <view class="cfb-center flex-xc-yn" :style="{ 'height': isOpenAdaptation ? '160rpx' : '100rpx' }" :animation="footerbarAni"> -->
		<view :class="['cfb-center',isOpenAdaptation?'flex-xc-yn':'flex-xc-yc']" :style="{ 'height': isOpenAdaptation ? '150rpx' : '100rpx'}" :animation="footerbarAni">
			<view :class="[isOpenAdaptation?'flex-xc-ys-dirY':'flex-xc-yc-dirY']" @click="jumpFun(1)" :style="{'margin-top':isOpenAdaptation ? '10rpx' : '0' }">
				<image :src="staticUrl+'indexTabOff.png'"></image>
				<view class="">首页</view>
			</view>
			<view :class="[isOpenAdaptation?'flex-xc-ys-dirY':'flex-xc-yc-dirY']" @click="jumpFun(2)" :style="{'margin-top':isOpenAdaptation ? '10rpx' : '0' }">
				<image :src="staticUrl+'scanTabOn.png'"></image>
				<view class="">扫一扫</view>
			</view>
			<view :class="[isOpenAdaptation?'flex-xc-ys-dirY':'flex-xc-yc-dirY']" @click="jumpFun(3)" :style="{'margin-top':isOpenAdaptation ? '10rpx' : '0' }">
				<image :src="staticUrl+'personalCenterTabOff.png'"></image>
				<view class="">我的账户</view>
			</view>
		</view>
	</view>
</template>

<script>
import { config } from '@/utils/api.js';
import { wxScanCode } from '@/common/getWxUserInfor.js';
export default {
	name: 'cus-footer-bar',
	props: {
		cusFooterBarIsShow: {
			type: Boolean,
			default: false
		},
		isOpenAdaptation: {
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
				uni.redirectTo({
					url: '/pages/openScanCom/openScanCom'
				});
				
				// 调用微信扫一扫
				// wxScanCode();
				
			} else if (type == 3) {
				uni.switchTab({
					url: '/pages/personalCenter/personalCenter'
				});
			}
		},
		// 开始动画
		startAnimation() {
			const that = this;
			const footerbarAnimation = wx.createAnimation({
				duration: 1,
				timingFunction: 'ease',
				delay: 1
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
		width: 54rpx;
		height: 54rpx;
		margin-bottom: 4rpx;
	}
	view {
		font-size: 24rpx;
		color: #666666;
	}
}
.cfb-center {
	opacity: 0;
	background: #fff;
	> view {
		flex: 1;
	}
}
</style>
