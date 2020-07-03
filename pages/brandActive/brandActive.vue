<template>
	<view class="wrap" >  
		<!-- 模块 -->
		<view class="mode">
		    <image :src=" imgUrl + '2.0/PE.png' "  mode="widthFix"  class="item"></image>
			<image :src=" imgUrl + '2.0/music.png'"  mode="widthFix"  class="item"></image>
			<image :src=" imgUrl + '2.0/food.png'" mode="widthFix"  class="item"></image>
			<image :src=" imgUrl + '2.0/beerFestival.png'"   mode="widthFix"  class="item"></image>
			<image :src=" imgUrl + '2.0/mealActive.png'" mode="widthFix"  class="item"></image>
			<image :src=" imgUrl + '2.0/other.png'"   mode="widthFix"  class="item" @click="tip"></image>
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
			tip(){
				uni.showModal({
					title: '尊敬的用户',
					content: '敬请期待'
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
		background-image: url('https://xcxsite.vjifen.com/v/lnqp/2.0/brandActiveBg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		display: flex;
	    flex-direction: column;
	    min-height: 100vh;
		.mode{
			padding:62rpx 20rpx;
			display: flex;
			flex-flow: wrap;
			justify-content: space-between;
			.item{
				width: 341rpx;
				padding-bottom:32rpx;
			}
		}
	}
		
	
</style>
