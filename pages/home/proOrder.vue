<template>
	<view class="wrap" >  
		<!-- 模块 -->
		<view class="box">
		    <image :src=" imgUrl + '2.0/customize.png' "  mode="widthFix"  class="item" @click="customMall"></image>
			<image :src=" imgUrl + '2.0/flagshipStore.png' "  mode="widthFix"  class="item" @click="toFlagMall"></image>
			<image :src=" imgUrl + '2.0/buyArea.png' " mode="widthFix"  class="item" @click="groupBuy"></image>
		</view>
	</view>
</template>

<script> 
	import { get, post, config } from '@/utils/api.js';
	export default {
		name: "brandActive",
		data() {
			return {
				imgUrl: config.staticUrl,
				ipx:false,
				openid:'',				
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
			customMall(){ // 私人定制
				uni.showModal({
					title: '尊敬的用户',
					content: '敬请期待'
				})
			},
			toFlagMall(){  // 官方旗舰店
				wx.navigateToMiniProgram({
				  appId: 'wxb17a1a2610979ad3', //小程序appid
				  path: '',
				  extraData: {
				    foo: 'bar'
				  },
				  envVersion: '', //要打开的小程序版本 develop（开发版），trial（体验版），release（正式版）
				  success(res) {
				    // 打开成功
				  }
				})
			},
			groupBuy(){
				uni.navigateTo({
					url:'./groupBuy'
				})
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
		background-image: url('https://xcxsite.vjifen.com/v/lnqp/2.0/orderBg&gameBg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		display: flex;
	    flex-direction: column;
	    min-height: 100vh;
		.box{
			padding:92rpx 0;
			.item{
				width: 618rpx;
				padding-bottom:98rpx;
				display: block;
				&:nth-last-child(2){
					float: right;
				}
				&:nth-last-child(1){
					padding-bottom:0;
				}
			}
		}
	}
		
	
</style>
