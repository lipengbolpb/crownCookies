<template>
	<!-- 二维码已被扫 -->
	<view class="codeScanned flex-xn-ys">
		<uni-nav-bar :style="{ 'margin-top': safeAreaTop*2 + 'rpx' }" left-icon="back" @click-left="back" title="皇冠丹麦曲奇"></uni-nav-bar>
		<view class="cs-center">
			<view class="flex-xc-yn" :style="{ 'margin-top': isOpenAdaptation ? '100rpx' : '0' }">
				<image mode="widthFix" class="csc-cuowuerweima" :src="staticUrl + 'cuowuerweima.png'"></image>
			</view>
			<block v-if="isexpireTimeStatus==true">
				<p class="csc-title">奖项已过期</p>
				<p class='csc-p'></p>
			</block>
			<block v-else>
				<p class="csc-title">{{ mesFontTitle }}</p>
				<!-- <p class="csc-title">这个二维码已被扫过</p> -->
				<p :class="[showType==1?'csc-p1':'csc-p']">
					<view class="csc-currentMoney">  {{ mesFontCurrentMoney }} </view>{{ mesFont }}
				</p> 
			</block>
			<view class="flex-xc-yn"><image mode="widthFix" class="csc-crownCookies" :src="staticUrl + 'crownCookiesImg.png'"></image></view>

		</view>
	</view>
</template>

<script>
import { get, post, config } from '@/utils/api.js';
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
export default {
	components: {
		uniNavBar
	},
	name: 'blacklist',
	computed: {
		// 当窗口 高度 大于800 是 重新 计算 盒子的上边距
		isOpenAdaptation() {
			if (this.windowHeight > 800) {
				return true;
			} else {
				return false;
			}
		},
		// 当窗口 高度 大于800 是 重新 计算 盒子的上边距
		safeAreaTop() {
			const userSystemInfo = uni.getStorageSync('userSystemInfo');
			let safeAreaTop = '30'
			if(userSystemInfo){
				safeAreaTop = userSystemInfo.safeArea.top==0?'30':userSystemInfo.safeArea.top;
			} else {
				safeAreaTop = '30';
			}
			console.log('safeAreaTopsafeAreaTopsafeAreaTopsafeAreaTop');
			console.log(safeAreaTop);
			return safeAreaTop;
		},
	},
	onLoad(options){
		console.log("options----------------");
		console.log(options);
		console.log(options.bizcode);
		if(options.bizcode == 11){
			// 本人重复扫码
			console.log(uni.getStorageSync('sweepQrcodeData'));
			const earnTime = uni.getStorageSync('sweepQrcodeData').reply.earnTime || '';
			const currentMoney = uni.getStorageSync('sweepQrcodeData').reply.currentMoney || '';
			console.log(earnTime);
			console.log(currentMoney);
			
			this.mesFont = `您已于 ${ earnTime } 扫过这个二维码`;
			this.mesFontCurrentMoney=`并获得 ${ currentMoney }元`;
			this.showType = '1';
			this.mesFontTitle = '这个二维码已被您扫过';
			this.isexpireTimeStatus = false;
		}else if(options.bizcode == 7){
			this.isexpireTimeStatus = true;
		}else{
			// 已被他人扫码
			this.mesFont = '每个二维码仅限扫码一次';
			this.mesFontTitle = '这个二维码已被扫过';
			this.mesFontCurrentMoney=``;
			this.showType = '2';
			this.isexpireTimeStatus = false;
		}
	},
	data() {
		return {
			mesFont:'每个二维码仅限扫码一次',
			mesFontCurrentMoney:'',
			staticUrl: config.staticUrl,
			showType:'1',
			isexpireTimeStatus:false,// 默认 没有过期 如果bizcode==7 说明从大奖过来并且大奖已过期
			mesFontTitle:'这个二维码已被扫过'
		};
	},
	methods: {
		game() {
			uni.navigateTo({
				url: './game?switchTurntable=' + this.switchTurntable
			});
		},
		// 返回
		back() {
			uni.switchTab({
				url: '../index/index'
			});
		}
	}
};
</script>

<style scoped lang="scss">
.codeScanned {
	height: 100%;
	background: url($crownCookiesImg+'bg2.png') no-repeat center;
	background-size: cover;
}
.cs-center {
	flex: 1;
	margin: 24rpx 30rpx 30rpx 30rpx;
	background: #fff;
	padding: 20rpx;
	text-align: center;
	border-radius: 20rpx;
}
.csc-title {
	font-size: 36rpx;
	color: #333333;
	margin-bottom: 24rpx;
}
.csc-p {
	font-size: 26rpx;
	color: #666666;
	line-height: 50rpx;
	margin-bottom: 126rpx;
	position: relative;
}
.csc-p1{
	font-size: 26rpx;
	color: #666666;
	line-height: 50rpx;
	margin-bottom: 40rpx;
	margin-top: 86rpx;
	position: relative;
}
.csc-currentMoney{
	width: 100%;
	position: absolute;
	left: 0;
	top: -60rpx;
	text-align: center;
	font-size: 36rpx;
	color: #FF0F00;
}
.csc-crownCookies {
	width: 348rpx;
}
.csc-cuowuerweima {
	width: 552rpx;
	margin-bottom: 60rpx;
}
.csc-logo {
	width: 140rpx;
}
</style>
