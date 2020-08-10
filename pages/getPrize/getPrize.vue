<template>

	<view class="page-template">
		<view class="page-template-wrap page-template-wrap-bg">
			<view class="page-template-wrap-center">
				<!-- 中出大奖 -->
				<view class="getPrize">
					<image mode="widthFix" class="crownCookies-logo" :src="staticUrl+'crownCookiesImgLogo.png'"></image>
					<view class="getPrize-center">
						<view :class="[isStartAnimation ? 'comon-initAni-gan' : '','flex-xR-yn','gpc-gan-box']" :animation="gaiAni">
							<image class="gpc-gan" :src="staticUrl + 'hengzigan.png'"></image>
						</view>
						<view class="gpc-gan-top"></view>
						<view class="gpc-mes">
							<image :class="[isStartAnimation ? 'comon-initAni-fontMes' : '']" :animation="fontMesAni" :src="staticUrl + 'heziMes.png?v=1'"></image>
						</view>
						<view class="flex-xc-yn">
							<view :class="[isStartAnimation ? 'comon-initAni-di' : '', 'gpc-basbox']" :animation="diAni">
								<!-- <view class="gpc-basbox"> -->
								<image mode="widthFix" class="" :src="staticUrl + 'hezidi.png'"></image>
							</view>
						</view>
						<image :class="[isStartAnimation ? 'comon-initAni-guan' : '', 'gpc-guang']" mode="widthFix" :animation="guangAni"
						 :src="staticUrl+'guan01.png'"></image>
						<image :class="[isStartAnimation ? 'comon-initAni-qian' : '', 'gpc-qian']" mode="widthFix" :animation="qianAni"
						 :src="staticUrl + 'heziqian.png'"></image>
						
					</view>
					<!-- 领取按钮 去除动画 -->
					<!-- <view :class="[isStartAnimation ? 'lijilingqu-initAni' : '', 'gpc-lijilingqu-box','flex-xc-yn']" :animation="lijilingquAni"> -->
					<view class="gpc-lijilingqu-box flex-xc-yn" :animation="lijilingquAni">
						<image @click="toGetPrize" class="gpc-lijilingqu vmdLijilingqu" :src="staticUrl + 'lijilingqu.png'"></image>
					</view>
				</view>

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
		name: 'getPrize',
		data() {
			return {
				staticUrl: config.staticUrl,
				isStartAnimation: true, // 是否开启动画
				getPrizeAni: '', // 动画所需配置
				lijilingquAni: '', // 立即领取按钮 动画
				diAni: '', // 立即领取按钮 动画
				guangAni: '', // 光 动画
				qianAni: '', // 钱 动画
				fontMesAni: '', // 提示文字 动画
				gaiAni: '', // 盖 动画
				isGetPrize: false, // 是否已拥有大奖 有（重复扫码） 直接显示信息 没有 显示填写信息
			};
		},
		onShow() {
			const that = this;
			setTimeout(function() {
				that.startAnimation();
			}, 100)
		},
		onReady() {
			console.log('页面在家完成');
		},
		onLoad(options) {
			console.log(options)
			console.log(options.isGetPrize)
			this.isGetPrize = options.isGetPrize || false;
		},
		methods: {
			// 开始动画
			startAnimation() {
				console.log(3);
				const that = this;
				// 整个盒子动效 从小到大
				const diAnimation = wx.createAnimation({
					duration: 500,
					timingFunction: 'ease',
					delay: 500
				});
				diAnimation.opacity(1).step();
				that.diAni = diAnimation.export();

				// 钱
				const qianAnimation = wx.createAnimation({
					duration: 400,
					timingFunction: 'ease',
					delay: 500
				});
				qianAnimation.opacity(1).scale(1).step();
				that.qianAni = qianAnimation.export();
				// 光 动画
				const guangAnimation = wx.createAnimation({
					duration: 1000,
					timingFunction: 'ease',
					delay: 500
				});
				guangAnimation.opacity(1).step();
				that.guangAni = guangAnimation.export();
				// 文字提示
				const fontMesAnimation = wx.createAnimation({
					duration: 300,
					timingFunction: 'ease',
					delay: 800
				});
				fontMesAnimation.opacity(1).scale(1).step();
				that.fontMesAni = fontMesAnimation.export();

				const gaiAnimation = wx.createAnimation({
					duration: 500,
					timingFunction: 'ease',
					delay: 500
				});
				gaiAnimation.opacity(1).translateY(0).step();
				that.gaiAni = gaiAnimation.export();

				// 立即领取按钮 从下向上滑出
				const lijilingquAnimation = wx.createAnimation({
					duration: 300,
					timingFunction: 'ease',
					delay: 500
				});
				lijilingquAnimation.opacity(1).translateY(0).step();
				that.lijilingquAni = lijilingquAnimation.export();
			},
			toGetPrize() {
				uni.redirectTo({
					url: '../submitUserInformation/submitUserInformation?isGetPrize=' + this.isGetPrize
				});
			},
		}
	};
</script>

<style scoped lang="scss">
	.page-template-wrap-bg {
		background: url($crownCookiesImg+'crownCookiesImgBgBig.jpg') no-repeat center;
		background-size: cover;
	}

	.comon-initAni-di {
		opacity: 0;
	}

	// 红色盒子 初始位置
	.comon-initAni {
		transform: scale(.8);
	}

	.comon-initAni-fontMes {
		transform: scale(0);
		opacity: 0;
	}

	.comon-initAni-qian {
		transform: scale(.2);
		opacity: 0;
	}

	// 盖 初始位置
	.comon-initAni-gan {
		transform: translateY(50px);
		opacity: 0;
	}

	.comon-initAni-guan {
		// transform: scale(0);
		// transform: translateY(50px);
		opacity: 0;
	}

	// 立即领取 按钮
	.lijilingqu-initAni {
		transform: translateY(100px);
		opacity: 0;
	}

	.getPrize {
		width: 100%;
		height: 100%;
	}

	.getPrize-center {
		width: 100%;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 60;
		border-radius: 20rpx;
	}

	.gpc-qian {
		width: 100%;
		position: absolute;
		left: 0;
		bottom: -30rpx;
	}

	.gpc-basbox {
		width: 80%;
		position: relative;

		image {
			width: 100%;
		}
	}

	.gpc-guang {
		width: 100%;
		position: absolute;
		left: -5rpx;
		bottom: 238rpx;
	}

	.gpc-gan-box {
		margin-left: 10%;
		width: 80%;
		margin-bottom: 70rpx;
		position: absolute;
		right: 10%;
		top: 0;
		z-index: 70;
	}

	.gpc-gan-top {
		margin-left: 10%;
		width: 80%;
		margin-bottom: 70rpx;
		height: 246rpx;
	}

	.gpc-gan {
		width: 64%;
		z-index: 70;
		height: 246rpx;
		margin-right: 40rpx;
	}

	.gpc-mes {
		z-index: 70;
		width: 80%;
		position: absolute;
		left: 50%;
		top: 44%;
		transform: translate(-50%, -50%);
		image {
			width: 100%;
			height: 200rpx;
		}
	}

	.gpc-lijilingqu-box {
		position: absolute;
		bottom: 60rpx;
		left: 0;
		width: 100%;
		image {
			width: 306rpx;
			height: 209rpx;
			display: block;
		}
	}

	.arc-close-image {
		width: 60rpx;
		height: 164rpx;
		position: absolute;
		left: 50%;
		margin-left: -30rpx;
		top: -130rpx;
	}

	.crownCookies-logo {
		width: 180rpx;
		position: absolute;
		left: 54rpx;
		top: 126rpx;
	}
</style>
