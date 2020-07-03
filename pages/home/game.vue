<template>
	<view class="wrap" >  
		<!-- 模块 -->
		<view class="box">
		    <image :src=" imgUrl + '2.0/sign.png'"  mode="widthFix"  class="item sign" @click="qdGetPrize"></image>
			<image :src=" imgUrl + '2.0/yaotouzi.png'"  mode="widthFix"  class="item shake" @click="playMahjong"></image>
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
				switchTurntable:'',		
			}
		},
		async onLoad(options) {
			console.log(options)
		    this.switchTurntable = options.switchTurntable;
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
			qdGetPrize(){ //签到抽奖  
			    if(this.switchTurntable == '0' ){ //  0未开，1开启 
					uni.showModal({
					  title: '温馨提示',
					  content: '敬请期待',
					})
				} else { // if(this.switchTurntable == '1')
					uni.navigateTo({
						url:'../qd/qd'
					})
				} 
			},
			playMahjong(){ //摇骰子
				uni.navigateTo({
					url:'./mahjong'
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
		flex-direction: column;/*属性规定灵活项目的方向:灵活的项目将垂直显示，正如一个列一样。*/
		justify-content: center;/*justify-content 用于设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式:项目位于容器的中心。*/
		align-items: center;/*align-items 属性定义flex子项在flex容器的当前行的侧轴（纵轴）方向上的对齐方式:项目位于容器的中心。*/
		height: 100vh; /* 100vh = viewport height*/
		.box{
			padding-top:112rpx;
			.item{
				&.sign{
					width:678rpx;
					padding-bottom:162rpx;
				}
				&.shake{
					width:661rpx;
					float: right;
				}
			}
		}
	}
</style>
