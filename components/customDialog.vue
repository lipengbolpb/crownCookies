<template>
	<!-- 弹窗 -->
	<view class="customDialog" v-show="customDialogIsShow">
		<view class="customDialog-mask" :animation="opacityAni" @click="closeCustomDialog"></view>
		<!-- 中大奖后 填写信息成功后 提示弹窗 -->
		<view v-if="customDialogType == 2">
			<view style="opacity: 0;" :animation="opacityAniCen" class="customDialog-center">
				<view class="cdc-titleImg"><image :src="staticUrl + 'tanchuangTop.png'" mode="widthFix"></image></view>
				<view class="cdc-center cdc-center2">
					<p class="cdc-center-p1">我们已经收到了您提交的信息</p>
					<p class="cdc-center-p2">15个工作日内，</p>
					<p class="cdc-center-p3">会有工作人员与您联系</p>
				</view>
				<view class="cdc-confirm" @click="closeCustomDialog">确 定</view>
			</view>
		</view>

		<!-- 底部 按钮 我知道了 弹窗 -->
		<view v-if="customDialogType == 8">
			<view style="opacity: 0;" :animation="opacityAniCen" class="customDialog-center">
				<view class="cdc-titleImg"><image :src="staticUrl + 'tanchuangTop.png'" mode="widthFix"></image></view>
				<view class="cdc-center cdc-center8 flex-xc-yc-dirY">
					<p class="cdc-center-h1">{{ customDialogFontTitle }}</p>
					<p class="cdc-center-p2">{{ customDialogFontCenter }}</p>
				</view>
				<view class="cdc-confirm" @click="closeCustomDialog">我 知 道 了</view>
			</view>
		</view>

		<!-- 图片 关闭按钮 类型弹窗 -->
		<view v-if="customDialogType == 10 || customDialogType == 1">
			<view style="opacity: 0;" :animation="opacityAniCen" class="customDialog-center">
				<view class="cdc-titleImg"><image :src="staticUrl + 'tanchuangTop.png'" mode="widthFix"></image></view>
				<view class="cdc-center cdc-center10 flex-xc-yc" v-if="customDialogType == 10">
					<p class="cdc-center-h1">{{ customDialogFontTitle }}</p>
				</view>
				<view class="cdc-center cdc-center1 flex-xc-yc-dirY" v-if="customDialogType == 1">
					<!-- <p class="cdc-center-p1">{{ customDialogFontP1 }}</p>
					<p class="cdc-center-p2">{{ customDialogFontP2 }}</p>
					<p class="cdc-center-p3">{{ customDialogFontP3 }}</p> -->
					
					<p class="cdc-center-p1">别心急，活动未开始哟～</p>
					<p class="cdc-center-p2">本次活动将于2020年9月1日正式开始</p>
					<p class="cdc-center-p3">敬请期待</p>
				</view>
				<view class="cdc-close" @click="closeCustomDialog"><image :src="staticUrl + 'closeBottom.png'" mode="widthFix"></image></view>
			</view>
		</view>

		<!-- 关注 -->
		<view v-if="customDialogType == 5">
			<view style="opacity: 0;" :animation="opacityAniCen" class="customDialog-center-nobg">
				<!-- <view class="cdc-titleImg"><image :src="staticUrl + 'gaunzhu.png'" mode="widthFix"></image></view> -->
				<view class="cdc-titleImg5"><image :src="staticUrl+'guanzhu.png'" mode="widthFix"></image></view>
				<view class="cdc-close" @click="closeCustomDialog"><image :src="staticUrl + 'closeBottom.png'" mode="widthFix"></image></view>
			</view>
		</view>
	</view>
</template>

<script>
import { config } from '@/utils/api.js';
export default {
	name: 'customDialog',
	props: {
		// 2 确认弹窗（领取大奖填写信息）
		customDialogType: {
			type: String,
			default: '1'
		},
		customDialogIsShow: {
			type: Boolean,
			default: false
		},
		customDialogFontTitle: {
			type: String,
			default: ''
		},
		customDialogFontCenter: {
			type: String,
			default: ''
		},
		customDialogFontP1: {
			type: String,
			default: ''
		},
		customDialogFontP2: {
			type: String,
			default: ''
		},
		customDialogFontP3: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			staticUrl: config.staticUrl,
			opacityAni: '',
			opacityAniCen: ''
		};
	},
	methods: {
		closeCustomDialog() {
			const that = this;
			that.opacityAnimation('opacityAni', 0, 500);
			that.opacityAnimation('opacityAniCen', 0, 500);
			setTimeout(() => {
				that.$emit('customDialogColse', false);
			}, 500);
		},
		// 蒙层 渐入 渐出
		opacityAnimation(name, opacityVal = 0, duration) {
			const that = this;
			// 活动规则 从下向上滑出 
			const opaAnimation = wx.createAnimation({
				duration: duration,
				timingFunction: 'ease',
				delay: 0
			});
			opaAnimation.opacity(opacityVal).step();
			that[name] = opaAnimation.export();
		},
		isStartAnimationFun(e) {
			const that = this;
			console.log(3333333);
			that.opacityAnimation('opacityAni', 0.6, 500);
			that.opacityAnimation('opacityAniCen', 1, 1000);
		}
	}
};
</script>

<style scoped lang="scss">
.customDialog-mask {
	width: 100%;
	height: 100%;
	background: #000;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 99;
	opacity: 0;
}

.customDialog-center {
	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 100;
	width: 80%;
	background: #fff;
	border-radius: 30rpx;
	transform: translate(-50%, -50%);
	height: 620rpx;
	// overflow: hidden;
}
.customDialog-center-nobg{
	position: absolute;
	top: 48%;
	left: 50%;
	z-index: 100;
	width: 80%;
	border-radius: 30rpx;
	transform: translate(-50%, -50%);
}
.cdc-titleImg {
	position: relative;
	height: 300rpx;
	overflow: hidden;
	border-top-left-radius: 30rpx;
	border-top-right-radius: 30rpx;
	image {
		position: absolute;
		left: -1%;
		top: -2%;
		display: block;
		width: 102%;
	}
}

.cdc-center {
	padding-left: 32rpx;
	padding-right: 32rpx;
	background: #fff;
}
.cdc-center1 {
	border-bottom-left-radius: 30rpx;
	border-bottom-right-radius: 30rpx;
	text-align: center;
	height: 300rpx;
	> p {
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

.cdc-center2 {
	text-align: center;
	> p {
		color: #333333;
		font-size: 32rpx;
		line-height: 48rpx;
	}
}

.cdc-center8,
.cdc-center10 {
	text-align: center;
	> p {
		color: #333333;
		font-size: 28rpx;
		line-height: 48rpx;
	}
	.cdc-center-h1 {
		font-size: 36rpx;
	}
}
.cdc-center8{
	height: 169rpx;
}

.cdc-center10 {
	height: 300rpx;
	line-height: 160rpx;
	border-bottom-left-radius: 30rpx;
	border-bottom-right-radius: 30rpx;
	margin-bottom: 70rpx;
}
.cdc-footer {
	overflow: hidden;
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
.cdc-confirm {
	width: 78%;
	margin-left: 11%;
	height: 100rpx;
	text-align: center;
	line-height: 100rpx;
	font-size: 36rpx;
	color: #814e05;
	margin-top: 30rpx;
	margin-bottom: 30rpx;
	border-radius: 20rpx;
	background: linear-gradient(to top, rgba(255, 170, 11, 1), rgba(249, 211, 0, 1));
}
.cdc-close {
	width: 60rpx;
	position: absolute;
	left: 50%;
	margin-left: -30rpx;
	bottom: -100rpx;
	image {
		width: 100%;
	}
}
.cdc-titleImg5{
	image{
		width: 100%;
	}
}
</style>
