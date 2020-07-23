<template>
	<!-- 中出大奖 -->
	<view class="getPrize">
		<view  class="getPrize-center">
			<view :class="[isStartAnimation ? 'comon-initAni' : '','flex-xR-yn','gpc-gan-box']" :animation="gaiAni" >
				<image class="gpc-gan" :src="staticUrl + 'hengzigan.png'"></image>
			</view>
			<view class="gpc-mes">
				<image :class="[isStartAnimation ? 'comon-initAni' : '']" :animation="fontMesAni"  mode="widthFix" :src="staticUrl + 'heziMes.png'"></image>
			</view>
			<view class="flex-xc-yn">
				<view :class="[isStartAnimation ? 'comon-initAni' : '', 'gpc-basbox']"  :animation="diAni">
					<image mode="widthFix" class="" :src="staticUrl + 'hezidi.png'"></image>
				</view>
			</view> 
			<image :class="[isStartAnimation ? 'comon-initAni' : '', 'gpc-guang']" mode="widthFix" :animation="guangAni" :src="staticUrl + 'heziguang.png'" ></image>
			<image :class="[isStartAnimation ? 'comon-initAni' : '', 'gpc-qian']" mode="widthFix" :animation="qianAni" :src="staticUrl + 'heziqian.png'"></image>
			
			<view :class="[isStartAnimation ? 'lijilingqu-initAni' : '', 'gpc-lijilingqu-box','flex-xc-yn']"  :animation="lijilingquAni">
				<image @click="toGetPrize" class="gpc-lijilingqu" :src="staticUrl + 'lijilingqu.png'"></image>
			</view>
			
		</view>
	</view>
</template>
<!-- have read -->
<script>
import { get, post, config } from '@/utils/api.js';
export default {
	name: 'getPrize',
	data() {
		return {
			staticUrl: config.staticUrl,
			isStartAnimation: true ,// 是否开启动画
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
	onShow(){
		this.startAnimation();	
	},
	onLoad(options){
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
			diAnimation.scale(1).step();
			that.diAni = diAnimation.export();
			
			const qianAnimation = wx.createAnimation({
				duration: 500,
				timingFunction: 'ease',
				delay: 500
			});
			qianAnimation.scale(1).step();
			that.qianAni = qianAnimation.export();
			
			const guangAnimation = wx.createAnimation({
				duration: 500,
				timingFunction: 'ease',
				delay: 500
			});
			guangAnimation.scale(1).step();
			that.guangAni = guangAnimation.export();
			
			const fontMesAnimation = wx.createAnimation({
				duration: 500,
				timingFunction: 'ease',
				delay: 500
			});
			fontMesAnimation.scale(1).step();
			that.fontMesAni = fontMesAnimation.export();
			
			const gaiAnimation = wx.createAnimation({
				duration: 500,
				timingFunction: 'ease',
				delay: 500
			});
			gaiAnimation.scale(1).step();
			that.gaiAni = gaiAnimation.export();
			
			// 立即领取按钮 从下向上滑出
			const lijilingquAnimation = wx.createAnimation({
				duration: 500,
				timingFunction: 'ease',
				delay: 1000
			});
			lijilingquAnimation.opacity(1).translateY(0).step();
			that.lijilingquAni = lijilingquAnimation.export();
		},
		toGetPrize(){
			uni.redirectTo({
				url: '../submitUserInformation/submitUserInformation?isGetPrize='+this.isGetPrize
			});
		},
	}
};
</script>

<style scoped lang="scss">
// 红色盒子 初始位置
.comon-initAni {
	transform: scale(.8);
}
// 立即领取 按钮
.lijilingqu-initAni{
	transform: translateY(100px);
	opacity: 0;
}
.getPrize {
	width: 100%;
	height: 100%;
	background: url($crownCookiesImg+'crownCookiesImgBg.jpg') no-repeat center;
	background-size: cover;
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
.gpc-qian{
	width: 100%;
	position: absolute;
	left: 0;
	bottom:-30rpx;
}
.gpc-basbox{
	width: 80%;
	position: relative;
	image {
		width: 100%;
	}
}
.gpc-guang{
	width: 100%;
	position: absolute;
	left:-44rpx;
	bottom:-72rpx;
}
.gpc-gan-box{
	margin-left: 10%;
	width: 80%;
	margin-bottom:70rpx;
}
.gpc-gan{
	width: 64%;
	z-index: 70;
	height: 246rpx;
	margin-right: 40rpx;
}
.gpc-mes{
	z-index: 70;
	width: 80%;
	position: absolute;
	left:50%;
	top:44%;
	transform: translate(-50%,-50%);
	image {
		width: 100%;
	}
}
.gpc-lijilingqu-box{
	position: absolute;
	bottom:-222rpx;
	left: 0;
	width: 100%;
	image{
		width: 40%;
		height: 208rpx;
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
</style>
