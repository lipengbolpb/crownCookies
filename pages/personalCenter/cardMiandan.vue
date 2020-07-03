<template>
	<view class="wrap" >  
		<view class="title" @click="indrouce">
			<text>什么是免单卡？</text>
			<image :src=" imgUrl + '2.0/wenhao.png' " mode="widthFix" class="wenhao"></image>
		</view>
		
		<view class="noCard">
			<image :src=" imgUrl + '2.0/noEquity.png' " mode="widthFix" class="noEquity"></image>
			<view class="tip">暂无相关权益</view>
		</view>
		
		
		<!-- card介绍 -->
		<view class="introduceShadow" v-show="introduceBox">
			<view class="shadowBox">
				<image class="close" @click="close" :src=" imgUrl + '2.0/close.png' " mode="widthFix"></image>
				<view class="title">免单卡</view>
				<view class="content">
					<view class="txt">
						如果你的账户中存有此卡，在其有效期之内，再次扫码消费对应产品时，青啤奖给予你免单，免单金额将会发送到您的账户中。
					</view>
				</view>
			</view>	
		</view>
		
	</view>
</template>

<script> 
	import { get, post, config } from '@/utils/api.js';
	export default {
		name: "miandanCard",
		data() {
			return {
				imgUrl: config.staticUrl,
				ipx:false,
				openid:'',	
				introduceBox:false,
			}
		},
		async onLoad() {
		  
		},
		
		onShow(){
			
		},
		
	   /**
	   * 用户点击右上角分享
	   */
		onShareAppMessage(res) {
		    if (res.from === 'button') {// 来自页面内分享按钮
		      console.log(res.target)
		    }
		    return {
			  title: '青岛啤酒',
			  path: '/pages/home/home',
			  imageUrl: this.imgUrl + 'share.png'
		    }
		 },
		
		methods: {
			indrouce(){
				this.introduceBox = true;
			},
			close(){
				this.introduceBox = false;
			}
		}
	}
</script>

<style scoped lang="scss">
	.wrap {
		width:100%;
		// height: 100%;
		/* 扩散形状圆形 半径大小(到最近的边) at 圆心位置在50px*² , 起始渐变色 起始渐变位置, 结束渐变色 结算渐变位置 */
		// background-image: radial-gradient(circle closest-side at 50px 50px,#c9151e 20px, #c9151e 70px) ;
		background-image: url('https://xcxsite.vjifen.com/v/lnqp/2.0/cardBg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		display: flex;
	    flex-direction: column;
	    min-height: 100vh;
		.title{
			padding: 32rpx 0 0 20rpx;
			font-size:32rpx;
			font-weight: bold;
			color:#fff;
			text-decoration:underline ;
			text-decoration-color:#c1d8c4;
			.wenhao{
				width:22rpx;
			}
		}
		.noCard{
			position: absolute;
			top: 40%;
			left: 0%;
			bottom: 0;
			right: 0;
			.noEquity{
				width: 181rpx;
				display: block;
				margin: 0 auto;
			}
			.tip{
				text-align: center; 
				font-size:40rpx;
				color: #fff;
				padding-top:70rpx;
			}
		}
	}
	
	.introduceShadow {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.7);
		z-index: 999;
		.shadowBox {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			-webkit-transform: translate(-50%, -50%);
			-moz-transform: translate(-50%, -50%);
			background: #fff;
			border-radius: 10rpx;
			padding: 20rpx;
			width:70%;
			.close{
				width: 52rpx;
				top: -6%;
				right: -4%;
				position: absolute;
			}
			.title{
				padding:34rpx 0 ;
				font-size:50rpx;
				text-align: center;
				color:#010101;
				text-decoration:underline ;
				text-decoration-color:#136e1d;
				text-decoration-size:8rpx;
				border-bottom: 1rpx dotted #a8a8a8;
			}
			.content{
				text-align: center;
				.txt{
					font-size:30rpx;
					color:#272727;
					text-align: left;
					padding: 40rpx 20rpx;
					line-height: 50rpx;
				}
			}
		}
	}
		
	
</style>
