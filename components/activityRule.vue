<template>
	<!-- 活动主页 -->
	<view class="activityRule" v-if="activityRuleIsShow">
		<view class="activityRule-mask" :animation='opacityAni' @click="closeActivityRule(1)"></view>
		<!-- 来源 活动主页 activity -->
		<view id="wr-center" :animation="actAni" :class="[isStartAnimation ? 'activityRule-initAni' : '','activityRule-center flex-xn-ys']"
		 v-if="activityRuleSource==1">
			<view class="arc-scrollView1">
				<scroll-view scroll-y="true" class="scrollView">
					<!-- 活动规则详情 -->
					<activity-rule-detail></activity-rule-detail>
				</scroll-view>
			</view>
			<view id="wr-center-title" class="arc-footer" @click="consentRule">
				<image :src="staticUrl+'haveRead.png'"></image>
			</view>
		</view>
		<!-- 来源 个人中心页面 personalCenter-->
		<view :animation="actAni" :class="[isStartAnimation ? 'activityRule-initAni' : '','activityRule-center1']" v-if="activityRuleSource==2">
			<image @click="closeActivityRule(2)" class="arc-close-image" :src="staticUrl+'closeTop.png'" mode="widthFix"></image>
			<scroll-view scroll-y="true" class="arc-scrollView">
				<!-- 活动规则详情 -->
				<activity-rule-detail></activity-rule-detail>
			</scroll-view>
		</view>
	</view>
</template>
<!-- have read -->

<script>
	import activityRuleDetail from '@/components/activityRuleDetail.vue';
	import {
		get,
		post,
		config
	} from '@/utils/api.js';
	export default {
		components: {
			activityRuleDetail
		},
		name: "activityRule",
		props: {
			// 页面来源  
			activityRuleSource: {
				type: String,
				default: '1'
			},
			// 是否展示
			activityRuleIsShow: {
				type: Boolean,
				default: false
			},
			// 是否 开启动画
			isStartAnimation: {
				type: Boolean,
				default: true
			},
		},
		data() {
			return {
				staticUrl: config.staticUrl,
				actAni: '', // 动画所需配置
				opacityAni: '', // 动画所需配置
				actStyle: {
					color: "red"
				}
			}
		},
		methods: {
			// 关闭弹窗
			closeActivityRule(type) {
				console.log('closeActivityRule');
				console.log(type);
				const that = this;
				that.actAni = ''; // 动画所需配置
				that.actAniClose = ''; // 动画所需配置
				that.startAnimation('130%');
				that.opacityAnimation(0);
				setTimeout(function() {
					that.$emit('activityRuleColse', false);
				}, 500);
				// if(type==1){
				// 	// 1 来源 活动主页 活动 2个人中心 活动规则弹窗
				// 	//是否同意 活动规则 如果 同意一下 存入 缓存 不在弹出
				// 	uni.setStorage({
				// 		key: 'isAgreeRule',
				// 		data: false
				// 	});
				// }
			},
			consentRule() {
				const that = this;
				that.actAni = ''; // 动画所需配置
				that.actAniClose = ''; // 动画所需配置
				that.startAnimation('130%');
				that.opacityAnimation(0);
				// setTimeout(function() {
					that.$emit('activityRuleColse', false);
				// }, 500);
				//是否同意 活动规则 如果 同意一下 存入 缓存 不在弹出
				uni.setStorage({
					key: 'isAgreeRule',
					data: true
				});
			},
			// 开始动画
			startAnimation(position = 0) {
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
			opacityAnimation(opacityVal = 0) {
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
				if (that.isStartAnimation) {
					that.startAnimation();
					that.opacityAnimation(.6);
				}
			}

		}
	}
</script>

<style scoped lang="scss">
	// 动画 初始位置
	.activityRule-initAni {
		transform: translateY(130%);
	}

	.activityRule-mask {
		width: 100%;
		height: 100%;
		background: #000;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 50;
		opacity: 0;
	}

	.activityRule-center {
		width: 100%;
		height: 40%;
		position: fixed;
		bottom: 0;
		z-index: 60;
		background: #FFF;
		padding-top: 40rpx;
	}

	.activityRule-center1 {
		width: 100%;
		height: 40%;
		position: fixed;
		bottom: 0;
		z-index: 60;
		background: #FFF;
		padding-top: 40rpx;
		padding-bottom: 40rpx;
	}

	.arc-title {}

	.arc-title-text {
		width: 260rpx;
		height: 68rpx;
		text-align: center;
		line-height: 68rpx;
		font-size: 36rpx;
		color: #0A0061;
		border-radius: 34rpx;
		margin-bottom: 30rpx;
		border: 2rpx solid #1F1295;
	}

	.arc-center {
		padding-left: 32rpx;
		padding-right: 32rpx;
		position: relative;

		p {
			font-size: 28rpx;
			color: #333;
			line-height: 48rpx;
			text-indent: 40rpx;

			text {
				color: #FF8207;
			}
		}
	}

	.arc-footer {
		width: 100%;
		height: 98rpx;
		margin-top: 24rpx;
		line-height: 98rpx;
		position: absolute;
		left: 0;
		bottom: 0;

		image {
			display: inline-block;
			width: 100%;
			height: 100%;
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

	.arc-scrollView {
		height: 100%;
	}

	.arc-scrollView1 {
		height: 82%;
	}

	.scrollView {
		height: 100%;
	}
</style>
