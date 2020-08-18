<template>
	<!-- 中出红包 -->
	<view class="getCash" v-if="getCashIsShow">
		<view class="getCash-mask" @click="closegetCash"></view>
		<view class="getCash-center">
			<view :animation="getCashAni" :class="[isStartAnimation ? 'getCash-initAni' : '', 'gcc-center']">
				<view :animation="cardAni" :class="[isStartAnimation ? 'card-initAni' : '', 'gcc-center-ani']">
					<view class="flex-xc-yn"><image class="gcc-titleImg" mode="widthFix" :src="staticUrl + 'hongbaoTitle.png'"></image></view>
					<view class="flex-xc-yn">
						<view class="gcc-Price">
							<text style="position: relative;">{{ currentMoney }}<text class="gcc-Price-company">元</text></text> 
						</view> 
					</view>
				</view> 
				<image mode="widthFix" class="gcc-center-topImg" :src="staticUrl + 'hongbao03.png'"></image>
			</view>
			<image v-if="getCashIsShowMes"  mode="widthFix" :animation='hongbaoMesAni' class="gcc-hongbaoMes" :src="staticUrl + 'hongbaoMes.png'"></image>
		</view>
	</view>
</template>
<!-- have read -->
<script>
import { get, post, config } from '@/utils/api.js';
export default {
	name: 'getCash',
	props: {
		// 页面来源
		getCashSource: {
			type: String,
			default: '1'
		},
		currentMoney: {
			type: String,
			default: ''
		},
		// 是否展示
		getCashIsShow: {
			type: Boolean,
			default: false
		},
		// 是否展示 红包已存入微信钱包中
		getCashIsShowMes: {
			type: Boolean,
			default: false
		},
		// 是否 开启动画
		isStartAnimation: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			staticUrl: config.staticUrl,
			getCashAni: '', // 动画所需配置
			cardAni: '', // 动画所需配置
			hongbaoMesAni: '' // 动画所需配置
		};
	},
	methods: {
		// 关闭弹窗
		closegetCash() {
			const that = this;
			that.$emit('getCashColse', false);
		},
		// 开始动画
		startAnimation() {
			console.log(3);
			const that = this;
			// 整个盒子动效 从小到大
			const getCashAnimation = wx.createAnimation({
				duration: 500,
				timingFunction: 'ease',
				delay: 500
			});
			getCashAnimation.opacity(1).scale(1).step();
			that.getCashAni = getCashAnimation.export();

			// 盒子内 卡片动向 从下向上滑出
			const cardAnimation = wx.createAnimation({
				duration: 500,
				timingFunction: 'ease',
				delay: 1000
			});
			cardAnimation
				.opacity(1)
				.translateY(0)
				.step();
			that.cardAni = cardAnimation.export();
			
			// 红包提示 hongbaoMesAni
			const hongbaoMesAnimation = wx.createAnimation({
				duration: 500,
				timingFunction: 'ease',
				delay: 500
			});
			hongbaoMesAnimation
				.opacity(1)
				.translateY(0)
				.step();
			that.hongbaoMesAni = hongbaoMesAnimation.export();
			
		},
		// 父组件触发
		isStartAnimationFun(e) {
			const that = this;
			this.startAnimation();
			if (this.isStartAnimation) {
				this.startAnimation();
			}
		}
	}
};
</script>

<style scoped lang="scss">
// 动画 初始位置
.getCash-initAni {
	opacity: 0;
	transform: scale(0.8);
}
.card-initAni {
	opacity: 0;
	transform: translateY(150px);
}
.getCash-mask {
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	position: fixed;
	top: 0;
	left: 0;
	z-index: 50;
}
.getCash-center {
	width: 68%;
	position: fixed;
	top: 46%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 60;
	// height: 642rpx;
	border-radius: 20rpx;
	// overflow: hidden;
}
// 获得 红包 盒子
.gcc-center-ani {
	width: 88%;
	top: 44rpx;
	position: absolute;
	left: 6%;
	z-index: 60;
	height: 440rpx;
	border-radius: 20rpx;
	background: url($crownCookiesImg+'hongbao02.png') no-repeat center;
	background-size: cover;
}

.gcc-center {
	overflow: hidden;
	height: 642rpx;
	background: url($crownCookiesImg+'hongbao01.png') no-repeat center;
	background-size: cover;
}
// 上面盖着的图片
.gcc-center-topImg {
	width: 100%;
	position: absolute;
	left: 0;
	bottom: 0;
	border: 0;
	z-index: 70;
}
// 恭喜你获得 图片
.gcc-titleImg {
	margin-top: 54rpx;
	width: 74%;
}
// 获得的现金
.gcc-Price {
	font-size: 76rpx;
	color: #ff0f00;
	margin-top: 46rpx;
	font-weight: bolder;
	position: relative;
	.gcc-Price-company {
		position: absolute;
		right: -56rpx;
		top: 20rpx;
		font-size: 36rpx;
	}
}
// 红包存入提示
.gcc-hongbaoMes{
	width: 100%;
	height:60rpx;
	margin-top: 24rpx;
	opacity: 0;
}
.arc-close-image {
	width: 60rpx;
	height: 164rpx;
	position: absolute;
	left: 50%;
	margin-left: -30rpx;
	top: -130rpx;
}
</style>
