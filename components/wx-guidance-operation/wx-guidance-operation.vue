<template>
	<!-- 打开 微信相关的引导操作 目前涉及到 位置授权 和 用户信息授权 -->
	<view class="wx-guidance-operation" v-if="WXGuidanceOperationIsShow">
		<view class="activityRule-mask" @click="WXGuidanceOperationClose"></view>
		<view class="activityRule-center">
			<!--  第 n 次点击弹出 授权地理位置 -->
			<view class="opensetting">
				<view class="head">
					<!-- 小程序的logo和名字 -->
					<image :src="staticUrl + 'crownCookiesImgLogo.png'" mode="widthFix" class="headimg"></image>
					<text>Danisa皇冠丹麦曲奇</text>
					<text>申请</text>
					<image :src="staticUrl+'closeimg.png'" @click="WXGuidanceOperationClose" mode="widthFix" class="close"></image>
				</view>
				<view class="content">
					<text>{{ WXGuidanceOperationShowData.wxTitle }}</text>
					<text>{{ WXGuidanceOperationShowData.wxMes }}</text>
				</view>
				<block v-if="WXGuidanceOperationType==1">
					<!-- 打开位置授权设置 -->
					<button @click="openSetting" class="set">{{ WXGuidanceOperationShowData.wxButton }}</button>
				</block>
				<block v-else>
					<!-- 引导 个人信息授权 -->
					<button class="set" open-type="getUserInfo" @getuserinfo="getUserInfoFn" withCredentials="true">
						{{ WXGuidanceOperationShowData.wxButton }}
					</button>
				</block>
				
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
	import {
		getUserInfo
	} from '@/common/getWxUserInfor.js';
	export default {
		name: 'activityRule',
		props: {
			// 是否展示
			WXGuidanceOperationIsShow: {
				type: Boolean,
				default: false
			},
			// 引导操作类型 1:位置授权 2：个人信息授权
			WXGuidanceOperationType: {
				type: String,
				default: ''
			},
			// 展示文字 和 按钮上的 文字
			WXGuidanceOperationShowData: {
				type: Object,
				default: {
					wxTitle: '获取您的地理位置信息',
					wxMes: '获取地理位置可以给你提供更好的服务',
					wxButton: '进行授权',
				}
			},
		},
		data() {
			return {
				staticUrl: config.staticUrl,
				actAni: '', // 动画所需配置
				actStyle: {
					color: 'red'
				}
			};
		},
		methods: {
			// 关闭弹窗
			WXGuidanceOperationClose() {
				const that = this;
				that.$emit('WXGuidanceOperationClose', false);
			},
			// 关闭弹窗
			openSetting() {
				const that = this;
				that.$emit('openSetting', false);
			},

			// 开始动画
			startAnimation() {
				console.log(3);
				const that = this;
				// 活动规则 从下向上滑出
				const actAnimation = wx.createAnimation({
					duration: 500,
					timingFunction: 'ease',
					delay: 500
				});
				actAnimation.translateY(0).step();

				that.actAni = actAnimation.export();
			},
			isStartAnimationFun(e) {
				console.log('e');
				console.log(e);
				const that = this;
				this.startAnimation();
				if (this.isStartAnimation) {
					this.startAnimation();
				}
			},
			/**
			 * 获取用户信息
			 */
			getUserInfoFn() {
				getUserInfo().then(res => {
					const that = this;
					that.$emit('WXUserInfor',res.userInfo);
				});
			},

		}
	};
</script>

<style scoped lang="scss">
	// 动画 初始位置
	.activityRule-initAni {
		transform: translateY(100%);
	}

	.activityRule-mask {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 50;
	}

	.activityRule-center {
		width: 100%;
		max-height: 50%;
		position: fixed;
		bottom: 0;
		z-index: 60;
		background: #fff;
		padding-top: 40rpx;
	}

	.arc-title {}

	.arc-title-text {
		width: 260rpx;
		height: 68rpx;
		text-align: center;
		line-height: 68rpx;
		font-size: 36rpx;
		color: #0a0061;
		border-radius: 34rpx;
		margin-bottom: 30rpx;
		border: 2rpx solid #1f1295;
	}

	.arc-center {
		padding-left: 32rpx;
		padding-right: 32rpx;

		p {
			font-size: 28rpx;
			color: #333;
			line-height: 48rpx;
			text-indent: 40rpx;

			text {
				color: #ff8207;
			}
		}
	}

	.arc-footer {
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

	.arc-close-image {
		width: 60rpx;
		height: 164rpx;
		position: absolute;
		left: 50%;
		margin-left: -30rpx;
		top: -130rpx;
	}

	.opensetting {
		width: 100%;
		height: 464upx;
		background: #fff;
		position: absolute;
		bottom: 0;
		left: 0;

		.head {
			height: 120upx;
			line-height: 120upx;
			display: flex;
			color: #333;
			position: relative;

			.headimg {
				width: 60upx;
				height: 60upx;
				border-radius: 50%;
				margin: 34upx 0 30upx 30upx;
				border: 1px #ccc solid;
			}

			.close {
				width: 40upx;
				height: 40upx;
				position: absolute;
				top: 20upx;
				right: 26upx;
			}

			text {
				padding: 0 20upx;

				&:nth-of-type(1) {
					font-size: 34upx;
					color: #333333;
					font-weight: bold;
					padding: 0 30upx;
				}

				&:nth-of-type(2) {
					font-size: 30upx;
					padding: 0 30upx 0 0;
					color: #333;
					display: block;
				}
			}
		}

		.content text {
			&:nth-of-type(1) {
				font-size: 40upx;
				color: #000;
				font-weight: bold;
				padding: 30upx;
			}

			&:nth-of-type(2) {
				font-size: 30upx;
				padding: 0 30upx;
				color: #333;
				line-height: 80upx;
				display: block;
			}
		}

		button {
			width: 400upx;
			height: 85upx;
			background: #04c05f;
			display: block;
			margin: 50upx auto;
			border-radius: 10upx;
			color: #fff;
			font-size: 32upx;
		}
	}
</style>
