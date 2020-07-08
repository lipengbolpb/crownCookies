<template>
	<!-- 中奖纪录 -->
	<view class="winningRecord flex-xn-yn">
		<view class="wr-center">
			<view class="flex-xc-yn">
				<image class="wrc-titleImg" :src="staticUrl+'wodezhongjiangjilu.png'" mode="widthFix"></image>
			</view>
			<view class="wrc-listBox">
				<view class="wrc-listBox-list flex-xsb-yn">
					<view class="">
						<view class="wrc-listBox-list-mes">扫码中奖</view>
						<view class="wrc-listBox-list-time">中奖时间</view>
					</view>
					<view class="wrc-listBox-list-price">+1.88</view>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
import { get, post, config } from '@/utils/api.js';
export default {
	name: 'winningRecord',
	data() {
		return {
			staticUrl:config.staticUrl,
			showType: false
		};
	},
	methods: {
		// 红包列表
		queryAllGiftsList() {
			uni.showLoading({
				title: '加载红包列表...'
			});
			const params = {
				openid: this.$store.state.openid, //openid
				hbopenid: this.$store.state.hbopenid,
				projectServerName: 'liaoning',
				currentPage: this.currentPage,
				count: this.count
			};
			let backGiftsList = post('/gifts/queryAllGiftsList', params);
			// 				const jo = backGiftsList;
			// 				uni.hideLoading();
			//
			// 				if (jo.result.code === '0') {
			// 					if (jo.result.businessCode === '0') {
			// 						this.restMoney = (Number(jo.reply.totalMoney)).toFixed(2); //账户余额
			// 						this.txnum = (Number(jo.reply.totalMoney)).toFixed(2);
			// 						this.totalMoney = (Number(jo.reply.totalMoney) + Number(jo.reply.giftsMoney)).toFixed(2) //累计红包
			// 						this.moneyList = jo.reply.objList; //红包列表
			// 						if(this.count > jo.reply.objList.length ){
			// 							this.more = false;
			// 						} else {
			// 							this.more = true;
			// 						}
			// 						console.log(this.moneyList)
			// 					} else if (jo.result.businessCode === '2') { //无红包记录
			// 						this.restMoney = '0.00';
			// 						this.totalMoney = '0.00';
			// 						this.noData = true;
			// 					} else { //businessCode:1失败
			// 						uni.showModal({
			// 							title: '尊敬的用户',
			// 							content: '呜呜，系统开了个小差，请稍后重试！',
			// 						})
			// 					}
			// 				} else { //code!='0'
			// 					uni.showModal({
			// 						title: '尊敬的用户',
			// 						content: '呜呜，系统开了个小差，请稍后重试！',
			// 					})
			// 				}
		}
	}
};
</script>

<style lang="scss">
page {
	width: 100%;
	height: 100%;
}
.winningRecord {
	height: 100%;
	background: url($crownCookiesImg+'bg2.png') no-repeat center;
	background-size:cover ;
}
.wr-center {
	border-radius: 20rpx;
	flex: 1;
	margin: 160rpx 30rpx 30rpx 30rpx;
	background: #fff;
	padding: 20rpx;
}
.wrc-listBox-list {
	padding: 20rpx 0;
	border-bottom: 2rpx solid #dedede;
}
.wrc-listBox-list-mes {
	margin-bottom: 10rpx;
	font-size: 32rpx;
	color: #333;
}
.wrc-listBox-list-time {
	font-size: 24rpx;
	color: #999999;
}
.wrc-listBox-list-price {
	font-size: 32rpx;
	color: #f10000;
}
.wrc-titleImg{
	width: 70%;
	margin-bottom: 20rpx;
}
</style>
