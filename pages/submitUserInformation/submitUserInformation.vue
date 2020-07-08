<template>
	<!-- 输入信息 领取大奖 -->
	<view class="strCode flex-xn-yn">
		<view class="strCode-center">
			<view class="scc-titleImg">
				<image src="../../static/crownCookiesImg/shuruToplogo.png"></image>
				<view class="">请填写中奖人信息</view>
			</view>
			<view class="submitBox">
				
				<view class="flex-xsb-yc">
					<view class="submitBox-label flex-xsb-yc"><text>姓</text><text>名</text></view>
					<input class="submitBox-input" type="text" value="" placeholder="请输入姓名" />
				</view>
				<view class="flex-xsb-yc">
					<view class="submitBox-label flex-xsb-yc"><text>手</text><text>机</text><text>号</text></view>
					<input class="submitBox-input" type="text" value="" placeholder="请输入手机号" />
				</view>
				<view class="flex-xsb-yc">
					<view class="submitBox-label flex-xsb-yc"><text>身</text><text>份</text><text>证</text><text>号</text></view>
					<input class="submitBox-input" type="text" value="" placeholder="请输入身份证号" />
				</view>
				
				<view class="submitBox-submit" @click="aa">提交信息</view>
			</view>
			
			<view class="flex-xc-yn"><image mode="widthFix" class="stc-crownCookies" src="../../static/crownCookiesImg/crownCookiesImg.png"></image></view>
		</view>
		<custom-dialog :customDialogFontP1="customDialogFontP1" :customDialogFontP2="customDialogFontP2" :customDialogFontP3="customDialogFontP3" :customDialogFontCenter='customDialogFontCenter' :customDialogFontTitle='customDialogFontTitle' :customDialogIsShow="customDialogIsShow" :customDialogSource="customDialogSource" @customDialogColse='updateCustomDialogColse'></custom-dialog>
	</view>
</template>
  
<script>
import { get, post, config } from '@/utils/api.js';
import customDialog from '@/components/customDialog.vue';
export default {
	components:{
		customDialog,
	},
	data() {
		name: 'strcode';
		return {
			openid: '',
			staticUrl: config.staticUrl,
			customDialogSource:1,
			customDialogIsShow:false,
			customDialogFontP1:'抱歉，活动已结束。',
			customDialogFontP2:'稍等片刻，我们正在努力加载中~',
			customDialogFontP3:'稍等片刻，我们正在努力加载中~',
		};
	},
	async onLoad() {
// 		this.openid = this.$store.state.openid;
// 		// if (!this.openid) {
// 		// 	uni.navigateTo({
// 		// 		url: '../getOpenid/getOpenid?provinceCode=' + 'LN' + '&type=openid',
// 		// 	});
// 		// }
// 		let that = this;
// 		uni.getStorage({
// 			key: 'userMsg',
// 			success: function(res) {
// 				that.openid = res.data.openid;
// 				console.log(that.openid);
// 				that.$store.commit('getOpenid', res.data.openid);
// 				if (!that.openid) {
// 					uni.navigateTo({
// 						url: '../getOpenid/getOpenid?provinceCode=' + 'LN' + '&type=openid'
// 					});
// 				}
// 			},
// 			fail: function() {
// 				if (!that.openid) {
// 					uni.navigateTo({
// 						url: '../getOpenid/getOpenid?provinceCode=' + 'LN' + '&type=openid'
// 					});
// 				}
// 				console.log(that.openid);
// 			}
// 		});
// 		that.openid = that.$store.state.openid;
// 		console.log(that.openid);
// 		that.init();
// 		that.locationGet(); // 地理位置判断
	},
	async onReachBottom() {
		// if (this.isEnd) return;
		// uni.showLoading({
		// 	title: '加载中...'
		// })
		// await this.onSearch(false); // 下一页
		// uni.hideLoading();
	},
	methods: {
		aa(){
			console.log(3333)
			const that = this;
			that.customDialogIsShow = true;
			console.log(that.customDialogIsShow)
		},
		updateCustomDialogColse(data){
			console.log(33)
			const that = this;
			that.customDialogIsShow = false;
		} 
	}
};
</script>

<style scoped lang="scss">
// 	button::after{
// 	  border:none;
// 	}
// 	input{
// 	  outline:none;
// 	  border:none;
// 	  list-style: none;
// 	}
.strCode {
	height: 100%;
	background: url($crownCookiesImg+'bg2.png') no-repeat center;
	background-size:cover ;
}

.strCode-center {
	flex: 1;
	margin: 194rpx 30rpx 30rpx 30rpx;
	background: #fff;
	padding: 146rpx 20rpx 20rpx 20rpx;
	border-radius: 20rpx;
	position: relative;
}
.submitBox{
	margin-bottom: 188rpx;
}
.submitBox input {
	height: 100rpx;
	line-height: 100rpx;
	border-radius: 10rpx;
	background: #f5f4f4;
	// margin-bottom: 28rpx;
	padding-left: 32rpx;
	font-size: 28rpx;
	flex: 1;
}
.submitBox button {
	margin: 0;
	color: #221596;
	font-size: 30rpx;
	background: #fff;
	border: 2rpx solid #3c00a6;
}
.submitBox-checkCode {
	margin-top: 28rpx;
}
.submitBox-strcode{
	margin-bottom: 28rpx;
}
.submitBox input::-webkit-input-placeholder {
	color: #999999;
}
.submitBox-submit {
	width: 78%;
	margin-left: 11%;
	height: 100rpx;
	text-align: center;
	line-height: 100rpx;
	font-size: 36rpx;
	color: #814E05;
	margin-top: 54rpx;
	border-radius: 20rpx;
	background : linear-gradient(to top,rgba(255, 170, 11, 1),rgba(249, 211, 0, 1));
}
.stc-crownCookies {
	width: 348rpx;
}
.scc-mobile{
	 font-size: 26rpx;
	 color: #333333;
	 text-align: center;
	 margin-top: 64rpx;
	 margin-bottom: 144rpx;
}
.scc-titleImg{
	width:440rpx;
	height: 110rpx;
	position: relative;
	position: absolute;
	left: 50%;
	top:-50rpx;
	transform: translateX(-50%);
// 	background: url($crownCookiesImg+'shuruToplogo.png') no-repeat center;
// 	background-size:cover ;
	image {
		width: 100%;
		height: 100%;
	}
	>view{
		position: absolute;
		right:48rpx;
		top:50%;
		transform: translateY(-50%);
		font-size:32rpx;
		color: #FFFFFF;
	}
}
.submitBox-label{
	width:130rpx;
	margin-right: 20rpx;
	font-size: 32rpx;
	color: #333333;
}
.submitBox{
	>view:not(:last-child){
		margin-bottom: 26rpx;
	}
}
</style>
