<template>
	<!-- 活动主页 -->
	<view class="activityRule" v-if="activityRuleIsShow">
		<view class="activityRule-mask" :animation='opacityAni' @click="closeActivityRule"></view>
		<!-- 来源 活动主页 activity -->
		<view :animation="actAni" :class="[isStartAnimation ? 'activityRule-initAni' : '','activityRule-center']" v-if="activityRuleSource==1">
			<view class="arc-title flex-xc-yn"><text class="arc-title-text">活动规则</text></view>
			<view class="arc-center">
				<p :style="actStyle">在活动时间内，凡购买908g、888g、790g、750g、681g、1010g皇冠丹麦曲奇饼干特别礼盒及576g装皇冠丹麦曲奇饼干（音乐盒特别装）（下称“活动产品”）可通过微信扫描活动产品包装内，<text>邀请函上的抽奖二维码或关注微信公众号“ Danisa皇冠丹麦曲奇”</text>并在相应页面输入邀请函上的序列码，进入活动页面并参与活动，即有机会获得丹麦8日游或微信红包奖品。</p>
			</view>
			<view class="arc-footer" @click="closeActivityRule">
				 <image :src="staticUrl+'haveRead.png'"></image>
			</view>
		</view>
		<!-- 来源 个人中心页面 personalCenter-->
		<view :animation="actAni" :class="[isStartAnimation ? 'activityRule-initAni' : '','activityRule-center']" v-if="activityRuleSource==2">
			<image @click="closeActivityRule" class="arc-close-image" :src="staticUrl+'closeTop.png'" mode="widthFix"></image>
			<view class="arc-title flex-xc-yn"><text class="arc-title-text">活动规则</text></view>
			<view class="arc-center">
				<p>在活动时间内，凡购买908g、888g、790g、750g、681g、1010g皇冠丹麦曲奇饼干特别礼盒及576g装皇冠丹麦曲奇饼干（音乐盒特别装）（下称“活动产品”）可通过微信扫描活动产品包装内，<text>邀请函上的抽奖二维码或关注微信公众号“ Danisa皇冠丹麦曲奇”</text>并在相应页面输入邀请函上的序列码，进入活动页面并参与活动，即有机会获得丹麦8日游或微信红包奖品。</p>
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
		name: "activityRule",
		props: {
			// 页面来源  
			activityRuleSource: {
				type: String,
				default: '1'
			},
			// 是否展示
			activityRuleIsShow:{
				type: Boolean,
				default: false
			},
			// 是否 开启动画
			isStartAnimation:{
				type: Boolean,
				default: true
			},
		},
		data() {
			return {
				staticUrl: config.staticUrl,
				actAni:'', // 动画所需配置
				opacityAni:'', // 动画所需配置
				actStyle:{
					color:"red"
				}
			}
		},
		methods: {
			// 关闭弹窗
			closeActivityRule(){
				const that = this;
				that.actAni = ''; // 动画所需配置
				that.actAniClose = ''; // 动画所需配置
				that.startAnimation('130%');
				that.opacityAnimation(0);
				setTimeout(function(){
				   that.$emit('activityRuleColse',false);
				},900)
			},
			// 开始动画
			startAnimation(position=0) {
				const that = this;
				// 活动规则 从下向上滑出 
				const actAnimation = wx.createAnimation({
					duration: 500,
					timingFunction: 'ease',
					delay: 0
				});
				actAnimation
					.translateY(position)
					.step();
				that.actAni = actAnimation.export();
			},
			// 蒙层 渐入 渐出
			opacityAnimation(opacityVal=0) {
				const that = this;
				// 活动规则 从下向上滑出 
				const opaAnimation = wx.createAnimation({
					duration: 500,
					timingFunction: 'ease',
					delay: 0
				});
				opaAnimation
					.opacity(opacityVal)
					.step();
				that.opacityAni = opaAnimation.export();
			},
 			  
			isStartAnimationFun(e) {
				const that = this;
				that.startAnimation();
				if(that.isStartAnimation){
					that.startAnimation();
					that.opacityAnimation(.6);
				}
			}
			
		}
	}
</script>

<style scoped lang="scss">
	// 动画 初始位置
	.activityRule-initAni{
		transform: translateY(130%);
	}
	 .activityRule-mask{
		 width: 100%;
		 height: 100%;
		 background: #000;
		 position: fixed;
		 top: 0;
		 left: 0;
		 z-index: 50;
		 opacity: 0;
	 }
	 .activityRule-center{
		 width: 100%;
		 max-height: 50%;
		 position: fixed;
		 bottom: 0;
		 z-index: 60;
		 background: #FFF;
		 padding-top:40rpx ;
	 }
	 .arc-title{
		
	 }
	 .arc-title-text{
		 width: 260rpx;
		 height: 68rpx;
		 text-align: center;
		 line-height: 68rpx;
		 font-size:36rpx;
		 color:#0A0061;
		 border-radius: 34rpx;
		 margin-bottom: 30rpx;
		 border: 2rpx solid #1F1295;
	 }
	 .arc-center{
		 padding-left: 32rpx;
		 padding-right: 32rpx;
		 p {
			font-size: 28rpx;
			color: #333;
			line-height: 48rpx;
			text-indent:40rpx;
			text{
				color:#FF8207;
			}
		 }
	 } 
	 .arc-footer{
		 width: 100%;
		 height: 98rpx;
		 margin-top: 24rpx;
		 line-height: 98rpx;
		 image{
			 display: inline-block;
			 width: 100%;
			 height: 100%;
		 }
	 }
	 .arc-close-image{ 
		 width: 60rpx;
		 height: 164rpx;
		 position: absolute;
		 left: 50%;
		 margin-left: -30rpx;
		 top: -130rpx; 
	 }
</style>
