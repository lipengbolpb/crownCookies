<template>
	<view class="wrap" >  
		<view class="title" @click="indrouce">
			<text>什么是翻倍卡？</text>
			<image :src=" imgUrl + '2.0/wenhao.png' " mode="widthFix" class="wenhao"></image>
		</view>
		
		<view class="cardList" v-if="hasCard">
			<view class="li" v-for="(item,index) in cards" :key="index" >
				<view class="top">
					<view class="left">
						<!-- imgUrl + '2.0/product.png'  -->
						<image :src="goodsImgRoot + item.skuLogo" mode="widthFix" class="product"></image>
					</view>
					<view class="right info">
						<view class="topPart">
							<view class="skuName">{{item.skuName}}</view>
							<text class="txt">红包 \n ¥<text class="num">2</text>倍</text>
						</view>
						<view class="useTime">有效期：{{item.createTime}}—{{item.expireTime}}</view>
					</view>
				</view>
				<view class="bottom">
					注：扫码消费本产品且中出红包奖项后，金额直接翻倍
				</view>
				<!-- 状态图章 -->
				<image v-if="item.status == 1" :src=" imgUrl + '2.0/used.png' " mode="widthFix" class="status"></image>
				<image v-if="item.status == 0 && item.expipeStatus == 1" :src=" imgUrl + '2.0/overdue.png' " mode="widthFix" class="status"></image>
			</view>	
		</view>
		
		<view class="noCard" v-if="!hasCard"> 
			<image :src=" imgUrl + '2.0/noEquity.png' " mode="widthFix" class="noEquity"></image>
			<view class="tip">暂无相关权益</view>
		</view>
		
		
		<!-- card介绍 -->
		<view class="introduceShadow" v-show="introduceBox">
			<view class="shadowBox">
				<image class="close" @click="close" :src=" imgUrl + '2.0/close.png' " mode="widthFix"></image>
				<view class="title">翻倍卡</view>
				<view class="content">
					<view class="txt">
						扫码可中出此卡，当再次扫码消费同款产品且中出现金红包时，红包金额将会直接翻倍。
					</view>
				</view>
			</view>	
		</view>
		
	</view>
</template>

<script> 
	import { get, post, config } from '@/utils/api.js';
	export default {
		name: "fanbeiCard",
		data() {
			return {
				imgUrl: config.staticUrl,
				goodsImgRoot:config.goodsImgRoot,
				ipx:false,
				openid:'',	
				
				cards:[], //翻倍卡记录
				
				hasCard:false, //拥有卡时
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
		mounted(){
			this.fbCardList();
		},
		methods: {
			//翻倍卡中奖记录list
			async fbCardList(){
				var params = {
					"openid": this.$store.state.openid, 
					"projectServerName": 'liaoning',
				};
				var jo = await post('/gifts/queryAllowanceRecordList', params);
				console.log(jo); //用户抽奖信息结果 reply result replyTime
				if(jo.result.code == 0 ){ // 服务正常
					if (jo.result.businessCode == 0) { //正常  
					    if(jo.reply.length>0){
							this.hasCard = true;
						} else {
							this.hasCard = false;
						}
						this.cards = jo.reply; // 用户本月扫码累计次数
					} else {
						uni.showModal({
							title: '尊敬的用户',
							content: jo.result.msg
						})
					}
				} else {  //服务失败
					uni.showModal({
						title: '尊敬的用户',
						content: jo.result.msg
					})
				}
			},
			
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
		.cardList{
			padding:50rpx 30rpx;
			.li{
				background-image: url('https://xcxsite.vjifen.com/v/lnqp/2.0/listBg.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				margin-bottom: 30rpx;
				position:relative;
				.top{
					display: flex;
					border-bottom: 1rpx solid #f5f5f5;
					.left{
						flex: 0 0 212rpx;
						text-align: center;
						padding-top: 28rpx;
						height: 100%;
						.product{
							// width:92rpx;
							width:48rpx;
						}
					}
					.right{
						flex: 1; /* 随父级变化 */
						position: relative;
						.topPart{
							padding: 64rpx 0 50rpx;
							.skuName{
								font-size:28rpx;
								color:#333;
								text-decoration:underline ;
								text-decoration-color:#136e1d;
								width: 70%;  /* 过长sku折行展示 */
							}
							.txt{
								width: 30%;
								text-align: center;
								color:#fff;
								font-size: 30rpx;
								font-weight: 600;
								line-height: 48rpx;
								position: absolute;
								top: 16rpx;
								right: 0;
								.num{
									font-size:42rpx;
									font-weight: 900;
								}
							}
						}
						.useTime{
							font-size:18rpx;
							color:#666;
							padding-bottom: 44rpx;
						}
					}
				}
				.bottom{
					padding:10rpx 0 40rpx 28rpx;
					font-size:20rpx;
					color:#999;
					text-align: left;
				}
				.status{
					width:152rpx;
					position:absolute;
					right: 72rpx;
					bottom: -12px;
				}
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
