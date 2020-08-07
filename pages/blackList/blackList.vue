<template>
	<!-- 黑名单页面 -->
	<view class="blacklist flex-xn-ys">
		<uni-nav-bar :style="{ 'margin-top': safeAreaTop*2 + 'rpx' }" left-icon="back" @click-left="back" title="皇冠丹麦曲奇"></uni-nav-bar>
		<view class="bl-center" v-if="showType">
			<view class="flex-xc-yn"><image mode="widthFix" class="blc-logo" :src="staticUrl + 'crownCookiesImgLogo.png'"></image></view>
			<p class="blc-title blc-title-ta-center">为确保您的账号安全，请填写验证信息</p>
			<view class="blc-submitBox submitBox">
				<input v-model="phonenum" class="submitBox-input" type="text" value="" placeholder="输入手机号" maxlength="11"/>
				<view class="flex-xsb-yc submitBox-checkCode">
					<input v-model="captcha" class="submitBox-input yamInput" type="text" value="" placeholder="输入验证码" maxlength="4"/>
					<button class="yamButton" @click="getyzm">{{ sec == 0 ? '获取验证码' : sec + '秒后再次获取' }}</button>
				</view>
				<view class="submitBox-submit" @click="submitForm">提交信息</view>
			</view>
			<view class="blc-mobile" @click='callGetPhoneFun'>客服电话：{{ callGetPhone }}</view>
			<view class="flex-xc-yn"><image mode="widthFix" class="blc-crownCookies" :src="staticUrl+'crownCookiesImg.png'"></image></view>
		</view>
		<view class="bl-center" v-else>
			<view class="flex-xc-yn"><image mode="widthFix" class="blc-logo" :src="staticUrl + 'crownCookiesImgLogo.png'"></image></view>
			<p class="blc-title">您的账号存在可疑风险，为确保您的账号安全，</p>
			<p class="blc-p">
				<text class="blc-text">1、关注【Danisa皇冠丹麦曲奇公众号】，</text>
				获得更多活动信息，请截图保存该图片，并在手机相册中进行识别二维码。
			</p>
			<p class="blc-p" @click='callGetPhoneFun'>2、客服电话：{{ callGetPhone }}</p>
			<!-- <view class="flex-xc-yn"><image mode="widthFix" class="blc-officialAccount" :src="staticUrl + 'officialAccountBack.png'"></image></view> -->
			<view class="flex-xc-yn"><image mode="widthFix" :style="{ marginottom: isOpenAdaptation ? '210rpx' : '54rpx' }" class="blc-officialAccount" :src="staticUrl+'erweima.jpeg'"></image></view>
			<view class="flex-xc-yn"><image mode="widthFix" class="blc-crownCookies" :src="staticUrl + 'crownCookiesImg.png'"></image></view>
		</view>
	</view>
</template>

<script>
import { get, requestPost, config } from '@/utils/api.js';
import { getCaptcha, updateUserInfoMobile } from '@/common/getData.js';
import { callPhone} from '@/common/getWxUserInfor.js';
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
const reg1 = /^1[0-9]{10}$/,
	reg2 = /^[1-9][0-9xX]{17}$/,
	reg3 = /^[0-9]{4}$/;
export default {
	components: {
		uniNavBar
	},
	computed: {
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
		// 当窗口 高度 大于800 是 重新 计算 盒子的上边距
		isOpenAdaptation() {
			if (this.windowHeight > 800) {
				return true;
			} else {
				return false;
			}
		},
	},
	name: 'blacklist',
	data() {
		return {
			staticUrl: config.staticUrl,
			showType: false,
			sec: '',
			phonenum: '',
			captcha: '',
			stop: false,
			callGetPhone: '400-007-2959',
		};
	},
	onLoad(options) {
		console.log(options);
		if (options.bizcode == 12) {
			// 展示 输入 手机号
			this.showType = true;
		} else {
			this.showType = false;
		}  
		console.log(this.showType);

		const userData = uni.getStorageSync('userData');
		console.log('调提交接口');
		console.log(userData);
	},
	onHide: function() {
		this.stop = true;
		this.sec = 0;
	},

	onUnload: function() {
		this.stop = true;
		this.sec = 0;
	},
	methods: {
		getyzm() {
			if (this.sec > 0) {
				return false;
			}
			console.log(this.phonenum);
			if (!reg1.test(this.phonenum)) {
				uni.showModal({
					title: '提示',
					content: '请填写正确的手机号！~',
					showCancel: false
				});
			} else {
				getCaptcha(this.phonenum)
					.then(res => {
						if (res.result.businessCode == 0) {
							this.sec = 60;
							this.timer();
						} else {
							uni.showModal({
								title: '提示',
								content: '验证码获取失败！请稍后再试并确认手机号是否输入正确'
							});
						}
					})
					.catch(err => {});
			}
		},
		timer() {
			let timer = null;
			let that = this;
			if (this.stop || this.sec <= 0) {
				this.sec = 0;
				return false;
			}
			this.sec -= 1;
			timer = setTimeout(() => {
				this.timer();
			}, 1000);
		},

		submitForm() {
			if (!reg1.test(this.phonenum)) {
				uni.showModal({
					title: '提示',
					content: '请填写正确的手机号！~',
					showCancel: false
				});
			} else if (!reg3.test(this.captcha)) {
				uni.showModal({
					title: '提示',
					content: '请填写正确的验证码！~',
					showCancel: false
				});
			} else {
				//调提交接口
				const userData = uni.getStorageSync('userData');
				const openid = userData.uinfo.openid;
				updateUserInfoMobile(openid, this.phonenum, this.captcha)
					.then(res => {
						if (res.result.businessCode == 0) {
							const sweepstr = uni.getStorageSync("sweepstr");
							console.log('sweepstrsweepstrsweepstr');
							console.log(sweepstr);
							uni.redirectTo({
								url: '../activityEntrance/activityEntrance?sweepstr=' + encodeURIComponent(sweepstr)
							});
						} else {
							uni.showModal({
								title: '提示',
								content: res.result.msg
							});
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
		},

		// 返回
		back() {
			uni.switchTab({
				url: '../index/index'
			});
		},
		 // 拨打电话给收件人
		callGetPhoneFun() {
			callPhone(this.callGetPhone);
		},
	}
};
</script>

<style lang="scss">
page {
	width: 100%;
	height: 100%;
}
.blc-logo {
	width: 140rpx;
	margin-top: 24rpx;
	margin-bottom: 28rpx;
}
.blacklist {
	height: 100%;
	background: url($crownCookiesImg+'bg2.png') no-repeat center;
	background-size: cover;
	overflow: hidden;
}
.bl-center {
	flex: 1;
	margin: 44rpx 30rpx 30rpx 30rpx;
	background: #fff;
	padding: 40rpx;
	border-radius: 20rpx;
}
.blc-title {
	font-size: 30rpx;
	color: #333333;
}
.blc-title-ta-center{
	text-align: center;
}
.blc-p {
	font-size: 28rpx;
	color: #333333;
	line-height: 50rpx;
}
.blc-text {
	color: #211493;
}
.blc-crownCookies {
	width: 348rpx;
}
.blc-officialAccount {
	margin-bottom: 53rpx;
	margin-top:56rpx;
	width: 300rpx;
}
.blc-submitBox {
	margin-top: 48rpx;
}
.submitBox input {
	height: 100rpx;
	line-height: 100rpx;
	border-radius: 10rpx;
	background: #f5f4f4;
	// margin-bottom: 28rpx;
	padding-left: 32rpx;
	font-size: 28rpx;
}
.submitBox button {
	margin: 0;
	color: #221596;
	font-size: 30rpx;
	background: #fff;
	border: 2rpx solid #3c00a6;
	height: 100rpx;
	line-height: 100rpx;
	background-color: transparent;
	padding: 0;
}
.submitBox-checkCode {
	margin-top: 28rpx;
}
.submitBox input::-webkit-input-placeholder {
	color: #999999;
}
.submitBox .yamInput{
	flex: 1;
	margin-right: 20rpx;
}
.submitBox .yamButton{
	 width: 260rpx;
}
.submitBox-submit {
	width: 78%;
	margin-left: 11%;
	height: 100rpx;
	// background: #f0ad4e;
	background : url($crownCookiesImg+'btnBgR.png') no-repeat;
	background-size:100% 100%;
	text-align: center;
	line-height: 100rpx;
	font-size: 36rpx;
	color: #814e05;
	margin-top: 74rpx;
	border-radius: 20rpx;
}
.blc-mobile {
	font-size: 26rpx;
	color: #333333;
	text-align: center;
	margin-top: 64rpx;
	margin-bottom: 144rpx;
}
</style>
