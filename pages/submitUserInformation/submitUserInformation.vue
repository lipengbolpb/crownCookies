<template>
	<!-- 输入信息 领取大奖 -->
	<view class="strCode flex-xn-ys">
		<uni-nav-bar :style="{ 'margin-top': safeAreaTop*2 + 'rpx' }" left-icon="back" @click-left="back" title="填写信息"></uni-nav-bar>
		<!-- <view class="strCode-center" :style="{ 'margin-bottom': isGetPrize==true?'144rpx':'28rpx' }"> -->
		<view class="strCode-center" :style="{'margin-bottom':strCodeCenterMarginBot}">
			<view class="scc-titleImg">
				<image :src="staticUrl+'shuruToplogo.png'"></image>
				<view class="">请填写中奖人信息</view>
			</view>
			<view class="submitBox" :style="{ 'margin-bottom': isShowVerifycode==true?'60rpx':'188rpx' }">
			<!-- <view class="submitBox" :style="{ 'margin-bottom': strCodeCenterMarginBot }"> -->
				<view class="flex-xsb-yc">
					<view class="submitBox-label flex-xsb-yc">
						<text>姓</text>
						<text>名</text>
					</view>
					<input maxlength="20" v-model.trim="userName" :disabled="isGetPrize" class="submitBox-input" type="text" value=""
					 placeholder="请输入姓名" />
				</view>
				<view class="flex-xsb-yc">
					<view class="submitBox-label flex-xsb-yc">
						<text>手</text>
						<text>机</text>
						<text>号</text>
					</view>
					<input maxlength="11" v-model.trim="phonenum" :disabled="isGetPrize" class="submitBox-input" type="text" value=""
					 placeholder="请输入手机号" />
				</view>
				<view class="flex-xsb-yc">
					<view class="submitBox-label flex-xsb-yc">
						<text>身</text>
						<text>份</text>
						<text>证</text>
						<text>号</text>
					</view>
					<input maxlength="18" v-model.trim="idcard" :disabled="isGetPrize" class="submitBox-input" type="text" value=""
					 placeholder="请输入身份证号" />
				</view>
				<view class="flex-xsb-yc submitBox-checkCode" v-if="isShowVerifycode">
					<input :disabled="isGetPrize" class="submitBox-input yamInput" type="text" value="" placeholder="请输入验证码" maxlength="4" v-model="verifycode" />
					<button class="yamButton submitBox-button" @click="getyzm">{{ sec == 0 ? '获取验证码' : sec + '秒后再次获取' }}</button>
				</view>
				
				<!-- <button :disabled="isDisabled" class="submitBox-submit" @click="submitFun">{{ submitFont }}</button> -->
				<button :disabled="isDisabled" :class="[isDisabled?'submitBox-submit-dis':'submitBox-submit','vmdTijiaoxinxi']" @click="submitFun">{{ submitFont }}</button>
				
				<view class="submitBox-mes submitBox-checkCode" v-if="isShowVerifycode">
					*请填写正确的手机号及身份证号码。并保留活动产品的邀请函和购买凭证，以备兑奖查验。
				</view>
				
			</view>
			<view class="flex-xc-yn">
				<image mode="widthFix" class="stc-crownCookies" :src="staticUrl+'crownCookiesImg.png'"></image>
			</view>
		</view>
		<!-- 弹窗 -->
		<custom-dialog ref="customDialogChild" :customDialogIsShow="customDialogIsShow" :customDialogType="customDialogType"
		 @customDialogColse="updateCustomDialogColse"></custom-dialog>
		<!-- 自定义导航 -->
		<custom-footer-bar ref="customFooterBarChild" :cusFooterBarIsShow="cusFooterBarIsShow" :isOpenAdaptation="isOpenAdaptation"></custom-footer-bar>

	</view>
</template>

<script>
	import {
		get,
		post,
		config
	} from '@/utils/api.js';
	import {
		savePrize,
		getCaptcha
	} from '@/common/getData.js';
	import {
		idcardValidate
	} from '@/common/basicsFun.js';
	import customDialog from '@/components/customDialog.vue';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import {
		customFooterBar
	} from '@/components/custom-footer-bar/custom-footer-bar.vue'; // 自定义页脚
	export default {
		components: {
			customDialog,
			uniNavBar,
			customFooterBar
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
				console.log(this.windowHeight);
				if (this.windowHeight > 800) {
					return true;
				} else {
					return false;
				}
			},
			strCodeCenterMarginBot(){
				let returnNum = 0;
				if(this.isGetPrize==true){
					if(this.isOpenAdaptation==true){
						returnNum = '184rpx';
					}else{
						returnNum = '144rpx';
					}
				}else{
					if(this.isOpenAdaptation==true){
						returnNum = '28rpx'
					}else{
						returnNum = '28rpx'
					}
				}
				console.log('returnNum');
				console.log(returnNum);
				return returnNum;
			}
		},
		data() {
			name: 'strcode';
			return {
				openid: '',
				staticUrl: config.staticUrl,
				customDialogType: 2, // 提交成功后 提示
				customDialogIsShow: false, // 提交成功后 提示
				userName: '',
				phonenum: '',
				verifycode: '', //验证码
				isShowVerifycode: false, //当领取过 大奖以后不展示 验证码盒子
				idcard: '',
				phonenumReg: /^1[0-9]{10}$/, //手机号验证
				codeReg: /[0-9]{4}/, //验证码验证
				submitFont: '提交',
				isDisabled: false, //提交按钮 是否 可点击
				isGetPrize: false, // 是否已拥有大奖 有（重复扫码） 直接显示信息 没有 显示填写信息
				cusFooterBarIsShow: false,
				sec: '',
			};
		},
		async onLoad(options) {
			const that = this;
			console.log(options);
			this.isGetPrize = options.isGetPrize == 'true' ? true : false;
			console.log(this.isGetPrize);
			console.log('getApp().globalData.przieUserData');
			let przieUserData = '';
			if(getApp().globalData.przieUserData){
				przieUserData = getApp().globalData.przieUserData.reply; // 获取个人中心页面 返回填写大奖的信息
			}else{
				przieUserData = '';
			}
			console.log(22222);
			console.log(przieUserData);
			// 如果已领取大奖 回显信息
			if (this.isGetPrize == true) {
				const sweepQrcodeData = uni.getStorageSync('sweepQrcodeData');
				if (sweepQrcodeData.reply) {
					if(sweepQrcodeData.reply.username){
						that.userName = sweepQrcodeData.reply.username;
						that.phonenum = sweepQrcodeData.reply.phonenum;
						that.idcard = sweepQrcodeData.reply.idcard;
					}else if (przieUserData!=undefined) {
						that.userName = przieUserData.nickName;
						that.phonenum = przieUserData.phonenum;
						that.idcard = przieUserData.idcard;
					}
				} else if (przieUserData!=undefined) {
					that.userName = przieUserData.nickName;
					that.phonenum = przieUserData.phonenum;
					that.idcard = przieUserData.idcard;
				} else {
					that.userName = '';
					that.phonenum = '';
					that.idcard = '';
				}
				that.submitFont = '您已提交';
				that.isDisabled = true;
				// 显示 自定tab
				this.cusFooterBarIsShow = true;
				this.$refs.customFooterBarChild.isStartAnimationFun(true); //开启tab动效
				this.isShowVerifycode = false; //隐藏 获取二维码结构
			} else {
				// 显示 自定tab
				this.cusFooterBarIsShow = false;
				this.isShowVerifycode = true; //显示 获取二维码结构
			}
		},
		methods: {
			submitFun() {
				const that = this;
				if (that.userName == '' || that.userName == undefined) {
					uni.showModal({
						title: '提示',
						content: '请填写正确的姓名哦！~'
					});
				} else if (!that.phonenumReg.test(that.phonenum)) {
					uni.showModal({
						title: '提示',
						content: '请填写正确的手机号！~'
					});
				} else if (!that.codeReg.test(that.verifycode)) {
					uni.showModal({
						title: '提示',
						content: '请输入正确的验证码！~'
					});
				} else if (!idcardValidate(that.idcard)) {
					uni.showModal({
						title: '提示',
						content: '请填写正确的身份证号哦！~'
					});
				} else {
					that.submitForm();
				}
			},
			submitForm() {
				const that = this;
				const sweepQrcodeData = uni.getStorageSync('sweepQrcodeData');
				const userData = uni.getStorageSync('userData');
				const openid = userData.uinfo.openid;
				let sweepQrcodeDataReply = '';
				let przieUserData = ''; // 获取个人中心页面 返回填写大奖的信息
				
				if(sweepQrcodeData){
					sweepQrcodeDataReply = sweepQrcodeData.reply;
				}else{
					sweepQrcodeDataReply = '';
				}
				
				if(getApp().globalData.przieUserData){
					przieUserData = getApp().globalData.przieUserData.reply; // 获取个人中心页面 返回填写大奖的信息
				}else{
					przieUserData = '';
				}
				
				let skukey = '';
				let grandPrizeType = '';
				let prizeVcode = '';
				if(sweepQrcodeDataReply){
					 skukey = sweepQrcodeDataReply.skukey || przieUserData.skukey;
					 grandPrizeType = sweepQrcodeDataReply.grandPrizeType || przieUserData.grandPrizeType;
					 prizeVcode = sweepQrcodeDataReply.prizeVcode || przieUserData.prizeVcode;
				}else{
					 skukey = przieUserData.skukey;
					 grandPrizeType = przieUserData.grandPrizeType;
					 prizeVcode = przieUserData.prizeVcode;
				}
			    
				const sendParams = {
					openid: openid,
					skukey: skukey,
					grandPrizeType: grandPrizeType,
					prizeVcode: prizeVcode,
					username: this.userName,
					idcard: this.idcard,
					phonenum: this.phonenum,
					captcha: this.verifycode
				};
				savePrize(sendParams).then(res => {
					console.log(res);
					if (res==1) {
						//  显示成功 提示
						that.customDialogType = 2;
						that.customDialogIsShow = true;
						// 弹窗 启动动画
						that.$refs.customDialogChild.isStartAnimationFun(true);
					}else if(res==4){
						const redirectToUrl = `../codeScanned/codeScanned?bizcode=7`;
						uni.navigateTo({
							url:redirectToUrl
						})
					}
				});
			},
			updateCustomDialogColse(data) {
				const that = this;
				that.customDialogIsShow = false;
				that.submitFont = '您已提交'
				// 显示 自定tab
				that.cusFooterBarIsShow = true;
				that.$refs.customFooterBarChild.isStartAnimationFun(true); //开启tab动效
				that.isGetPrize = true;
				that.isDisabled = true;
				that.isShowVerifycode = false; // 提交成功后 隐藏 提示语和 验证码
			},
			// 返回
			back() {
				uni.switchTab({
					url: '../index/index'
				});
			},
			getyzm() {
				const that = this;
				if (that.sec > 0) {
					return false;
				}
				console.log(that.phonenum);
				if (!that.phonenumReg.test(that.phonenum)) {
					uni.showModal({
						title: '提示',
						content: '请填写正确的手机号！~',
						showCancel: false
					});
				} else {
					getCaptcha(that.phonenum)
						.then(res => {
							if (res.result.businessCode == 0) {
								that.sec = 60;
								that.timer();
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

		}
	};
</script>

<style scoped lang="scss">
	button::after {
		border: none;
	}

	button {
		padding: 0;
	}

	button::after {
		border: none;
	}

	input {
		outline: none;
		border: none;
		list-style: none;
	}

	button[disabled] {
		color: #A87328 !important;
	}
	.strCode {
		overflow: hidden;
		height: 100%;
		background: url($crownCookiesImg+'bg2.png') no-repeat center;
		background-size: cover;
	}

	.strCode-center {
		flex: 1;
		margin-top: 54rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
		background: #fff;
		padding: 100rpx 40rpx 20rpx 40rpx;
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

	.submitBox-input {
		color: #333;
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
	.submitBox-submit-dis {
		width: 78%;
		margin-left: 11%;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 36rpx;
		color: #814e05;
		margin-top: 54rpx;
		border-radius: 20rpx;
		background: linear-gradient(to top,rgba(255, 204, 36, .5),rgba(255, 204, 36, .5));
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

		>view {
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
		>view:not(:last-child) {
			margin-bottom: 26rpx;
		}
	}

	.submitBox .yamButton {
		width: 260rpx;
	}

	.submitBox .yamInput {
		flex: 1;
		margin-right: 20rpx;
	}

	.submitBox-button {
		margin: 0;
		color: #221596;
		font-size: 30rpx;
		background: #fff;
		border: 2rpx solid #3c00a6;
		height: 100rpx;
		line-height: 100rpx;
		background-color: transparent;
	}
	.submitBox-mes{
		width: 90%;
		margin-left: 5%;
		font-size: 26rpx;
		line-height: 36rpx;
		color: #221596;
		text-align: center;
	}
</style>
