<template>
	<!-- 输入信息 领取大奖 -->
	<view class="strCode flex-xn-ys">
		<uni-nav-bar :style="{ 'margin-top': safeAreaTop + 'px' }" left-icon="back" @click-left="back" title="填写信息"></uni-nav-bar>
		<view class="strCode-center">
			<view class="scc-titleImg">
				<image src="../../static/crownCookiesImg/shuruToplogo.png"></image>
				<view class="">请填写中奖人信息</view>
			</view>
			<view class="submitBox">
				<view class="flex-xsb-yc">
					<view class="submitBox-label flex-xsb-yc">
						<text>姓</text>
						<text>名</text>
					</view>
					<input v-model="userName" class="submitBox-input" type="text" value="" placeholder="请输入姓名" />
				</view>
				<view class="flex-xsb-yc">
					<view class="submitBox-label flex-xsb-yc">
						<text>手</text>
						<text>机</text>
						<text>号</text>
					</view>
					<input v-model="phonenum" class="submitBox-input" type="text" value="" placeholder="请输入手机号" />
				</view>
				<view class="flex-xsb-yc">
					<view class="submitBox-label flex-xsb-yc">
						<text>身</text>
						<text>份</text>
						<text>证</text>
						<text>号</text>
					</view>
					<input v-model="idcard" class="submitBox-input" type="text" value="" placeholder="请输入身份证号" />
				</view>
				<!-- <view class="submitBox-submit" @click="submitFun">{{ submitFont }}</view> -->
				<button :disabled='isDisabled' class="submitBox-submit" @click="submitFun">{{ submitFont }}</button>
			</view>
			<view class="flex-xc-yn"><image mode="widthFix" class="stc-crownCookies" src="../../static/crownCookiesImg/crownCookiesImg.png"></image></view>
		</view>
		<custom-dialog
			:customDialogIsShow="customDialogIsShow"
			:customDialogType="customDialogType"
			@customDialogColse="updateCustomDialogColse"
		></custom-dialog>
	</view>
</template>

<script>
import { get, post, config } from '@/utils/api.js';
import { savePrize } from '@/common/getData.js';
import { idcardValidate } from '@/common/basicsFun.js';
import customDialog from '@/components/customDialog.vue';
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
export default {
	components: {
		customDialog,
		uniNavBar
	},
	computed: {
		// 当窗口 高度 大于800 是 重新 计算 盒子的上边距
		safeAreaTop() {
			const userSystemInfo = uni.getStorageSync('userSystemInfo');
			const safeAreaTop = userSystemInfo.safeArea.top;
			return safeAreaTop;
		}
	},
	data() {
		name: 'strcode';
		return {
			openid: '',
			staticUrl: config.staticUrl,
			customDialogType: 2, // 提交成功后 提示
			customDialogIsShow: false,// 提交成功后 提示
			userName: '',
			phonenum: '',
			idcard: '',
			phonenumReg : /^1[0-9]{10}$/,
			submitFont:'提交信息',
			isDisabled:false, //提交按钮 是否 可点击
		};
	},
	async onLoad() { 
	},
	methods: {
		submitFun(){
			const that = this;
// 			that.submitForm();
// 			return false;
			if (that.userName == '' || that.userName == undefined) {
			  uni.showModal({
				title: '提示',
				content: '请填写正确的姓名哦！~',
			  })    
			} else if (!(that.phonenumReg.test(that.phonenum))) {
			  uni.showModal({
				title: '提示',
				content: '请填写正确的手机号！~',
			  }) 
			} else if (!idcardValidate(that.idcard)) {
			  uni.showModal({
				title: '提示',
				content: '请填写正确的身份证号哦！~',
			  }) 
			} else {
				that.submitForm();
			}
		},
		
		submitForm() {
			const that = this;
			const sweepQrcodeData = uni.getStorageSync('sweepQrcodeData');
			const userData = uni.getStorageSync('userData');
			const sweepQrcodeDataReply = sweepQrcodeData.reply;
			const openid = userData.uinfo.openid;
			console.log(sweepQrcodeData);
			const sendParams = {
				openid: openid,
				skukey: sweepQrcodeDataReply.skukey,
				grandPrizeType: sweepQrcodeDataReply.grandPrizeType,
				prizeVcode: sweepQrcodeDataReply.prizeVcode,
				username: this.userName,
				idcard: this.idcard,
				phonenum: this.phonenum
			};
			savePrize(sendParams).then(res => {
				console.log('');
				console.log(res);
				if(res){
					//  显示成功 提示
					this.customDialogType = 2;
					this.customDialogIsShow = true;
				}
			}); 
		},
		updateCustomDialogColse(data) {
			const that = this;
			that.customDialogIsShow = false;
			that.submitFont = '您已提交';
			that.isDisabled = true;
		},
		// 返回
		back() {
			uni.switchTab({
				url:'../index/index'
			})
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
	background-size: cover;
}

.strCode-center {
	flex: 1;
	margin: 54rpx 30rpx 28rpx 30rpx;
	background: #fff;
	padding: 100rpx 20rpx 20rpx 20rpx;
	border-radius: 20rpx;
	position: relative;
}
.submitBox {
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
// .submitBox button {
// 	margin: 0;
// 	color: #221596;
// 	font-size: 30rpx;
// 	background: #fff;
// 	border: 2rpx solid #3c00a6;
// }
.submitBox-checkCode {
	margin-top: 28rpx;
}
.submitBox-strcode {
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
	color: #814e05;
	margin-top: 54rpx;
	border-radius: 20rpx;
	background: linear-gradient(to top, rgba(255, 170, 11, 1), rgba(249, 211, 0, 1));
}
.stc-crownCookies {
	width: 348rpx;
}
.scc-mobile {
	font-size: 26rpx;
	color: #333333;
	text-align: center;
	margin-top: 64rpx;
	margin-bottom: 144rpx;
}
.scc-titleImg {
	width: 440rpx;
	height: 110rpx;
	position: relative;
	position: absolute;
	left: 50%;
	top: -50rpx;
	transform: translateX(-50%);
	// 	background: url($crownCookiesImg+'shuruToplogo.png') no-repeat center;
	// 	background-size:cover ;
	image {
		width: 100%;
		height: 100%;
	}
	> view {
		position: absolute;
		right: 32rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 32rpx;
		color: #ffffff;
	}
}
.submitBox-label {
	width: 130rpx;
	margin-right: 20rpx;
	font-size: 32rpx;
	color: #333333;
}
.submitBox {
	> view:not(:last-child) {
		margin-bottom: 26rpx;
	}
}
</style>
