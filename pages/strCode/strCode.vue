<template>
	<view class="strCode flex-xn-ys">
		<uni-nav-bar :style="{ 'padding-top': safeAreaTop*2+'rpx' }" left-icon="back" @click-left="back" title="序列码抽奖"></uni-nav-bar>
		<view class="strCode-center">
			<view class="scc-titleImg">
				<image :src="staticUrl+'shuruToplogo.png'"></image>
				<view class="">输入序列码抽奖</view>
			</view>
			<view class="submitBox">
				<input type="text" placeholder="输入12位数字字母序列码" maxlength="12" class="input submitBox-strcode" value="strcode"
				 v-model="serialcode"></input>
				<input class="submitBox-input" type="text" value="" maxlength="11" placeholder="输入手机号" v-model="phone" />
				<view class="flex-xsb-yc submitBox-checkCode">
					<input class="submitBox-input yamInput" type="text" value="" placeholder="输入验证码" maxlength="4" v-model="verifycode" />
					<button class="yamButton" @click="getyzm">{{ sec == 0 ? '获取验证码' : sec + '秒后再次获取' }}</button>
				</view>
				<view class="submitBox-submit vmdChuanmatijiao" @click="submitForm">提交</view>
			</view>
			<view class="scc-mobile" @click='callGetPhoneFun'>客服电话：{{ callGetPhone }}</view>
			<view class="flex-xc-yn">
				<image mode="widthFix" class="stc-crownCookies" :src="staticUrl+'crownCookiesImg.png'"></image>
			</view>
		</view>
		<!-- 引导开启 位置授权 -->
		<wx-open-setting :wxOpenSettingIsShow="wxOpenSettingIsShow" :isStartAnimation="wxOpenSettingIsStartAnimation"
		 @WxOpenSettingColse="WxOpenSettingColse" @openSetting="wosOpenSetting"></wx-open-setting>
		<!-- 自定义 弹窗 -->
		<custom-dialog 
			ref="customDialogChild" 
			@customDialogColse="updateCustomDialog" 
			:customDialogFontCenter="customDialogFontCenter"
			:customDialogFontTitle="customDialogFontTitle" 
			:customDialogIsShow="customDialogIsShow" 
			:customDialogType="customDialogType"
		></custom-dialog>

	</view>

</template>

<script>
	import {
		get,
		post,
		config
	} from '@/utils/api.js';
	import {
		getFailCount,
		serialCode,
		getCaptcha
	} from '@/common/getData.js';
	import {
		getUserDataFun,
		judgeBusinessStrCode,
		filterArr,
		dateformat
	} from '@/common/basicsFun.js';
	import {
		getLocation,
		getSettingLocation,
		callPhone
	} from '@/common/getWxUserInfor.js';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import {
		wxOpenSetting
	} from '@/components/wx-open-setting/wx-open-setting.vue'; // 开启 位置 引导
	import {
		customDialog
	} from '@/components/customDialog.vue';
	export default {
		components: {
			wxOpenSetting,
			customDialog
		},
		data() {
			name: 'strcode';
			return {
				staticUrl: config.staticUrl,
				openid: '',
				sec: '',
				callGetPhone: '400-007-2959',
				reg1: /[0-9a-zA-Z]{12}/, //串码验证
				reg2: /^1[0-9]{10}/, //手机号验证
				reg3: /[0-9]{4}/, //验证码验证
				userInfo: {
					avatarUrl: '',
					nickName: ''
				},
				serialcode: '', //串码
				verifycode: '', //验证码
				phone: '', //手机号
				wxOpenSettingIsShow: false, //是否展示 位置授权
				wxOpenSettingIsStartAnimation: false, // 位置授权 是否展示动画
				isNeedPhone: '', //是否需要 展 示输入手机号 验证码 

				customDialogType: '2', // 弹窗 类型 5 关注弹窗
				customDialogIsShow: false, //  是否展示弹窗
				customDialogFontTitle: '2', //  是否展示弹窗
				customDialogFontCenter: '3', //  是否展示弹窗

				customDialogArr: [{
						bizcode: '4',
						customDialogType: '10',
						customDialogIsShow: true,
						customDialogFontTitle: '活动未开始',
						customDialogFontCenter: ''
					},
					{
						bizcode: '2',
						customDialogType: '10',
						customDialogIsShow: true,
						customDialogFontTitle: '这个二维码已被扫过',
						customDialogFontCenter: ''
					},
					{
						bizcode: '5',
						customDialogType: '10',
						customDialogIsShow: true,
						customDialogFontTitle: '活动已截止',
						customDialogFontCenter: ''
					},
					{
						bizcode: '6',
						customDialogType: '8',
						customDialogIsShow: true,
						customDialogFontTitle: '系统繁忙',
						customDialogFontCenter: '稍等片刻，我们正在努力加载中~'
					},
					{
						bizcode: '-1',
						customDialogType: '8',
						customDialogIsShow: true,
						customDialogFontTitle: '系统升级',
						customDialogFontCenter: '系统升级，我们正在努力搭建中~'
					},
					{
						bizcode: '1',
						customDialogType: '10',
						customDialogIsShow: true,
						customDialogFontTitle: '这个二维码不存在',
						customDialogFontCenter: ''
					},{
						bizcode: '8',
						customDialogType: '10',
						customDialogIsShow: true,
						customDialogFontTitle: '请输入验证码',
						customDialogFontCenter: ''
					},{
						bizcode: '10',
						customDialogType: '10',
						customDialogIsShow: true,
						customDialogFontTitle: '错误超过6次,请明天再试',
						customDialogFontCenter: ''
					},{
						bizcode: '9',
						customDialogType: '10',
						customDialogIsShow: true,
						customDialogFontTitle: '验证码不正确',
						customDialogFontCenter: ''
					},{
						bizcode: '15',
						customDialogType: '10',
						customDialogIsShow: true,
						customDialogFontTitle: '该二维码已被使用',
						customDialogFontCenter: ''
					},
				],

			};
		},
		async onLoad() {
			this.openid = await this.computedGetOpenid;
			console.log('await this.computedGetOpenid');
			console.log(this.openid);
			this.checkUserLocation();
			const userData = uni.getStorageSync('userData');
			const openid = userData.uinfo.openid;
			if (openid) {
				getFailCount().then(isNeedPhone => {
					// 是否 需要填写手机号
					console.log(isNeedPhone);
					this.isNeedPhone = isNeedPhone;
				});
			} else {
				const backUserData = await getUserDataFun();
				getFailCount().then(isNeedPhone => {
					// 是否 需要填写手机号
					console.log(isNeedPhone);
					this.isNeedPhone = isNeedPhone;
				});
			}
		},
		onHide() {
			// 关闭页面时 关闭位置弹窗 否则开启授权后 还会展示
			this.wxOpenSettingIsShow = false;
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
			// 获取 接口需要的 openid session_key
			async computedGetOpenid() {
				const that = this;
				const backUserData = await getUserDataFun();
				return backUserData.openid || '';
			}
		},
		methods: {
			updateCustomDialog(res) {
				console.log(res);
				this.customDialogIsShow = false;
			},
			getyzm() {
				const that = this;
				if (that.sec > 0) {
					return false;
				}
				console.log(that.phone);
				if (!that.reg2.test(that.phone)) {
					uni.showModal({
						title: '提示',
						content: '请填写正确的手机号！~',
						showCancel: false
					});
				} else {
					getCaptcha(that.phone)
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
			// 拨打电话给收件人
			callGetPhoneFun() {
				callPhone(this.callGetPhone);
			},
			// 关闭 授权位置
			WxOpenSettingColse(data) {
				const that = this;
				that.wxOpenSettingIsShow = false;
			},
			wosOpenSetting() {
				//设置里打开授权地理位置
				// this.againClick = true;
				uni.openSetting({
					complete: res => {
						// 统一在onshow执行地址位置判断
						// this.getLocation();
						// return false
					}
				});
			},
			// 验证缓存中 是否 存在用户位置
			async checkUserLocation() {
				/**
				 * 获从缓存中  获取 用户位置 信息
				 * 有 直接调用 接口
				 * 没有 调用（）   验证用户位置授权状态 2未操作 1已经授权  0拒绝授权
				 * 		 0 ： 弹出自定义引导，引导用户 开启位置授权（openSetting）
				 * 		 1 :  缓存中没有数据 然后 已经授权 如果存在还是调用 微信授权
				 * 		 2 :  继续 调用微信授权
				 */
				const that = this;
				const LocationStatus = await getSettingLocation();
				console.log('LocationStatus');
				console.log(LocationStatus);
				uni.getStorage({
					key: 'userLocation',
					success(res) {
						const userLocation = res.data;
					},
					fail(err) {
						if (LocationStatus == 0) {
							// 弹出自定义 位置引导弹窗
							that.wxOpenSettingIsShow = true;
						} else {
							// 弹出 获取位置
							getLocation().then((...res) => {});
						}
					}
				});
			},

			//提交串码 返回信息 并处理
			getSerialCode(openid, serialcode, phone, verifycode, longitude = '00', latitude = '00') {
				const that = this;
				var sendParams = {
					'openid': openid,
					'serialcode': serialcode, //串码
					"verifycode": verifycode, //手机号
					"phone": phone, //验证码 
					'longitude': longitude, //"经度"
					'latitude': latitude, //"纬度"
					'nickname': '',
					'headimgurl': ''
				};
				// 调用扫码接口
				serialCode(sendParams)
					.then(res => {
						console.log('judgeBusinessStrCode');
						console.log(res);
						return judgeBusinessStrCode(res);
					})
					.then(res => {
						console.log('res 调用扫码接口');
						console.log(res);
						console.log(res)
						uni.navigateTo({
							url: res
						});
					}, res => {

						console.log(res);
						const that = this;
						const bizcodeStatus = res.businessCode.toString();
						const filterData = filterArr('bizcode', bizcodeStatus, that.customDialogArr)[0];
						console.log("filterArr____________")
						console.log(bizcodeStatus);
						console.log(filterData);
						// setTimeout(() => {
							if (filterData) {
								that.customDialogType = filterData.customDialogType; // 弹窗 类型 5 关注弹窗
								that.customDialogIsShow = filterData.customDialogIsShow; //  是否展示弹窗
								that.customDialogFontTitle = filterData.customDialogFontTitle; //  是否展示弹窗
								that.customDialogFontCenter = filterData.customDialogFontCenter; //  是否展示弹窗						
								// 弹窗 启动动画
								that.$refs.customDialogChild.isStartAnimationFun(true);
							}else{
								that.customDialogType = '10'; // 弹窗 类型 5 关注弹窗
								that.customDialogIsShow = true; //  是否展示弹窗
								that.customDialogFontTitle = res.msg; //  是否展示弹窗
								that.customDialogFontCenter = ''; //  是否展示弹窗						
								// 弹窗 启动动画
								that.$refs.customDialogChild.isStartAnimationFun(true);
							}
						// }, 00);

					});
			},
			onHide(){
				this.customDialogIsShow = false; //  隐藏弹窗
			},
			// 提交 串码 字段
			submitForm() {
				// 
				console.log('DateFormat.format(new Date())');
				// const dateStatus =	dateformat('2020/08/31 23:59:59');
				const dateStatus =	dateformat(config.startDate);
				console.log("dateStatus");
				console.log(dateStatus);
				console.log(config.startDate);
				// 前段判断 当前时间是否大于 2020/08/31 23:59:59 大于返回 true 否则 false 
				if(!dateStatus){
					this.customDialogType = '1'; // 弹窗 类型 5 关注弹窗
					this.customDialogIsShow = true; //  是否展示弹窗
					this.$refs.customDialogChild.isStartAnimationFun(true);
				}else{
					const userLocation = uni.getStorageSync('userLocation') || {};
					const longitude = userLocation.longitude || '00';
					const latitude = userLocation.latitude || '00';
					const openid = this.openid;
					
					const serialcode = this.serialcode;
					const phone = this.phone;
					const verifycode = this.verifycode;
					
					console.log(phone.trim());
					console.log(verifycode.trim());
					if (!this.reg1.test(serialcode.trim())) {
						uni.showModal({
							title: '提 示',
							content: '请输入正确的序列码哦！~',
						})
					} else {
						this.getSerialCode(openid, serialcode, phone,verifycode, longitude, latitude);
					}
					
					// 			if(this.isNeedPhone){
					// 				if (!this.reg1.test(serialcode.trim())) {
					// 					uni.showModal({
					// 						title: '提 示',
					// 						content: '请输入正确的序列码哦！~',
					// 					})
					// 				} else if (!this.reg2.test(phone.trim())) {
					// 					uni.showModal({
					// 						title: '提 示',
					// 						content: '请填写正确的手机号！~',
					// 					})
					// 				} else if (!this.reg3.test(verifycode.trim())) {
					// 					uni.showModal({
					// 						title: '提 示',
					// 						content: '请输入正确的验证码~',
					// 					})
					// 				} else {
					// 					this.getSerialCode(openid,serialcode,phone,verifycode,longitude, latitude);
					// 				}
					// 			}else{
					// 				if (!this.reg1.test(serialcode.trim())) {
					// 					uni.showModal({
					// 						title: '提 示',
					// 						content: '请输入正确的序列码哦！~',
					// 					})
					// 				}else{
					// 					this.getSerialCode(openid,serialcode,'','',longitude, latitude);
					// 				}
					// 			}
				}

			},

			// 返回 
			back() {
				uni.navigateBack(1)
			}


		}
	};
</script>

<style scoped lang="scss">
		button::after{
		  border:none;
		}
		button{
			padding: 0;
		}
		input{
		  outline:none;
		  border:none;
		  list-style: none;
		}
	.strCode {
		height: 100%;
		background: url($crownCookiesImg+'bg2.png') no-repeat center;
		background-size: cover;
	}

	.strCode-center {
		flex: 1;
		margin: 54rpx 30rpx 28rpx 30rpx;
		background: #fff;
		padding: 146rpx 40rpx 20rpx 40rpx;
		border-radius: 20rpx;
		position: relative;
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
	}

	.submitBox-checkCode {
		margin-top: 28rpx;
	}

	.submitBox-strcode {
		margin-bottom: 28rpx;
	}

	.submitBox input::-webkit-input-placeholder {
		color: #999999;
	}

	.submitBox .yamInput {
		flex: 1;
		margin-right: 20rpx;
	}

	.submitBox .yamButton {
		width: 260rpx;
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
		// background : linear-gradient(to top,rgba(255, 170, 11, 1),rgba(249, 211, 0, 1));
		background: url($crownCookiesImg+'btnBgR.png') no-repeat;
		background-size: 100% 100%;
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
			right: 48rpx;
			top: 50%;
			transform: translateY(-50%);
			font-size: 32rpx;
			color: #FFFFFF;
		}
	}





	.location_fail {
		/* 获取地理位置失败 */
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
		background: #fff;

		image {
			width: 100%;
			display: block;
			background: #fff;
		}

		button {
			width: 66%;
			height: 100upx;
			bottom: 10%;
			// left: 17%;
			// background: pink;
			opacity: 0;
		}
	}

	.index {
		//地理位置授权
		width: 100%;
		height: 100%;

		.head {
			height: 186upx;
			padding: 82upx;
			padding-bottom: 0;

			.logo {
				width: 150upx;
				padding-right: 30upx;
			}
		}

		.scanImg {
			width: 100%;
			margin: 0 auto;
		}
	}

	.opensetting {
		//地理位置再次授权 
		width: 100%;
		height: 500upx;
		background: #fff;
		position: absolute;
		bottom: 0;
		left: 0;
		box-shadow: 10rpx -10rpx 20rpx #999;
		z-index: 3; // 填写验证信息时在表单上层

		.head {
			height: 120upx;
			line-height: 120upx;
			display: flex;
			color: #333;
			position: relative;

			.headimg {
				width: 60upx;
				height: 60upx;
				border-radius: 50%;
				margin: 12upx 0 30upx 30upx;
				border: 1px #ccc solid;
			}

			.close {
				width: 40upx;
				height: 40upx;
				position: absolute;
				top: 40upx;
				right: 40upx;
			}

			text {
				padding: 0 20upx;

				&:nth-of-type(1) {
					font-size: 40upx;
					color: #000;
					font-weight: bold;
					padding: 0 30upx;
					line-height: 80upx;
				}

				&:nth-of-type(2) {
					font-size: 30upx;
					padding: 0 30upx 0 0;
					color: #333;
					line-height: 80upx;
					display: block;
				}
			}
		}

		.content text {
			&:nth-of-type(1) {
				font-size: 40upx;
				color: #000;
				font-weight: bold;
				padding: 30upx;
			}

			&:nth-of-type(2) {
				font-size: 30upx;
				padding: 0 30upx;
				color: #333;
				line-height: 80upx;
				display: block;
			}
		}

		.set {
			width: 400upx;
			height: 85upx;
			background: #04c05f;
			display: block;
			margin: 50upx auto;
			border-radius: 10upx;
			color: #fff;
			font-size: 32upx;
		}
	}
</style>
