<template>
	<view class="activityEntrance">
		<image mode="widthFix" class="crownCookies-logo" src="../../static/crownCookiesImg/crownCookiesImgLogo.png"></image>

		<view class="activityEntrance-center-Animation" v-if="isStartAnimation" :style="{ 'margin-top': isOpenAdaptation ? '480rpx' : '340rpx' }">
			<image class="aec-chuanImg" mode="widthFix" :src="staticUrl + 'chuan.png'"></image>
			<image :animation="crownCookiesAni" class="aec-crownCookiesImg" mode="widthFix" :src="staticUrl + 'crownCookiesImg.png'"></image>
			<image :animation="baifenbaiAni" class="aec-baifenbai" mode="widthFix" :src="staticUrl + 'baifenbai.png'"></image>
		</view>
		<view class="activityEntrance-center" v-else :style="{ 'margin-top': isOpenAdaptation ? '334rpx' : '226rpx' }">
			<image class="aec-chuanquqi" mode="widthFix" src="../../static/crownCookiesImg/chuanquqi.png"></image>
			<image class="aec-baifenbai" mode="widthFix" src="../../static/crownCookiesImg/baifenbai.png"></image>
		</view>

		<view :animation="fontMesAni" class="idnex-imgMes" :style="{ opacity: isStartAnimation ? '0' : '1' }">图片仅供参考，产品以实物为准</view>
		<view class="focusGguidance" v-if="isShowGguidance" @click="showGguidanceFun"><image :animation="focusGguidanceAni" :src="staticUrl + 'focusGguidance.png'"></image></view>
		<!-- 抽奖按钮 获取手机号-->
		<view class="flex-xc-yn" :animation="choujiangAni" v-show="isShowluckDrawBtn">
			<view @click="showGetCash" class="choujiangBtn" v-if="isHasPhoneNumber"><image :src="staticUrl + 'dianjichoujiang.png'" mode="widthFix"></image></view>
			<view class="choujiangBtn" v-else>
				<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="btn againGetPhone">
					<image :src="staticUrl + 'dianjichoujiang.png'" mode="widthFix"></image>
				</button>
			</view>
		</view>

		<!-- 规则弹窗 -->
		<activity-rule
			ref="activityRuleChild"
			@activityRuleColse="updateActivityRuleColse"
			:activityRuleSource="activityRuleSource"
			:activityRuleIsShow="activityRuleIsShow"
		></activity-rule>

		<!-- 获取红包动效页面 -->
		<get-cash ref="getCashChild" :getCashIsShow="getCashIsShow" :isStartAnimation="getCashIsStartAnimation" :currentMoney="currentMoney"></get-cash>

		<!-- 引导开启 位置授权 -->
		<wx-open-setting
			:wxOpenSettingIsShow="wxOpenSettingIsShow"
			:isStartAnimation="wxOpenSettingIsStartAnimation"
			@WxOpenSettingColse="WxOpenSettingColse"
			@openSetting="wosOpenSetting"
		></wx-open-setting>

		<custom-footer-bar ref="customFooterBarChild" :cusFooterBarIsShow="cusFooterBarIsShow"></custom-footer-bar>
	</view>
</template>

<script>
import { get, post, config } from '@/utils/api.js';
import { getLocation, analysisMobile, checkSession, getCode, getOpenid, getSettingLocation } from '@/common/getWxUserInfor.js';
import { sweepQrcode, giveSpackTx } from '@/common/getData.js';
import { judgeBusinessCode, filterArr } from '@/common/basicsFun.js';
import { activityRule } from '@/components/activityRule.vue'; // 活动规则
import { wxOpenSetting } from '@/components/wx-open-setting/wx-open-setting.vue'; // 开启 位置 引导
import { getCash } from 'pages/getCash/getCash.vue'; // 获得红包
import { customFooterBar } from '@/components/custom-footer-bar/custom-footer-bar.vue'; // 自定义页脚
export default {
	name: 'activityEntrance',
	components: {
		activityRule,
		getCash,
		wxOpenSetting,
		customFooterBar
	},
	data() {
		return {
			staticUrl: config.staticUrl,
			activityRuleSource: '1', // 活动规则 页面来源
			activityRuleIsShow: false, // 活动规则  是否展示
			getCashIsShow: false, // 中出红包 是否显示
			getCashIsStartAnimation: false, //中出红包  是否 开启动画
			currentMoney: '0.00', //中出红包 中出金额
			isShowGguidance: false, //是否展示 引导关注 公众号 logo
			isStartAnimation: true, // 本页面 是否开启动画
			isShowluckDrawBtn: false, //是否 显示 抽奖按钮
			// isHasPhoneNumber: false, //是否 已获取手机号
			crownCookiesAni: '', //饼干 动画
			baifenbaiAni: '', //百分比 动画
			fontMesAni: '', //饼干动画
			choujiangAni: '', //抽奖按钮 动画
			focusGguidanceAni: '', // 引导关注 公众号图片
			openid: '', // 拿 小程序code换取最终要使用的 openId
			isShowCustomLocation: false, // 是否展示 自定义 定位引导
			wxOpenSettingIsShow: false, //是否展示 位置授权
			wxOpenSettingIsStartAnimation: false, // 位置授权 是否展示动画
			sweepstr: 'JYJ9WM6PX9FU',
			cusFooterBarIsShow: false, //是否展示 页面tab （显示条件：出现 获得红包动效 ）
			giveSpackTxStatusArr: [
				{
					id: 1,
					businessCode: '1',
					title: '提示',
					content: '您的红包金额不足，再喝几瓶攒够1元发红包！'
				},
				{
					id: 2,
					businessCode: '2',
					title: '提示',
					content: '呜呜，系统开了个小差，请稍后重试！'
				},
				{
					id: 3,
					businessCode: '3',
					title: '提示',
					content: '根据国家法规对支付服务实名制的要求，请到微信中进行实名认证\n实名认证方法：进入【微信】->【我】->【钱包】->【···】->【支付管理】，即可实名认证。'
				},
				{
					id: 4,
					businessCode: '4',
					title: '提示',
					content: '提现处理中，请稍后查看详细记录'
				},
				{
					id: 5,
					businessCode: '-1',
					title: '提示',
					content: '系统升级中'
				},
				{
					id: 5,
					businessCode: '-2',
					title: '提示',
					content: '提现操作过于频繁'
				}
			],
			codeType:"1",
		};
	},

	computed: {
		// 当窗口 高度 大于800 是 重新 计算 盒子的上边距
		isOpenAdaptation() {
			if (this.windowHeight > 800) {
				return true;
			} else {
				return false;
			}
		},
		// 获取 接口需要的 openid session_key
		async computedGetOpenid() {
			const that = this;
			const backUserData = await that.getUserDataFun();
			return backUserData.openid || '';
		},

		// 当 显示抽奖按钮时 判断缓存中 是否存在 手机号
		isHasPhoneNumber() {
			const backStorage = uni.getStorageSync('userMobileData').phoneNumber;
			if (backStorage) {
				return true;
			} else {
				return false;
			}
		}
	},
	async onLoad(options) {
		console.log('options');
		console.log(options);

		this.sweepstr = options.sweepstr;
		// 串码类型 扫码串码1 输入串码2
		this.codeType = options.codeType || '1';
		/**
		 * 判断 缓存中 是否 存在 isAgreeRule
		 * 存在并且为true   表示已同意活动规则直接检查缓存中用户位置信息
		 * 不存在        显示 活动规则 （关闭活动规则或者点击同意活动规则检查缓存中用户位置信息）
		 */
		const that = this;

		uni.getStorage({
			key: 'isAgreeRule',
			success(sto) {
				if (sto.data) {
					// 串码类型 扫码串码1 输入串码2
					console.log('串码类型 扫码串码1 输入串码2 ');
					console.log(options.codeType);
					if (options.codeType && options.codeType == 2) {
						console.log('串码类型 扫码串码1 输入串码222 ');
						// 从 输入串码 过来 中区红包 显示 抽奖按钮
						that.isShowluckDrawBtn = true;
						// 获取红包 展示中奖 金额

						uni.getStorage({
							// key:'serialCodeData',
							key: 'sweepQrcodeData',
							success(stoData) {
								const currentMoney = stoData.data.reply.currentMoney || '0.00';
								that.currentMoney = currentMoney;
							}
						});
					} else {
						// 走扫码的逻辑 检测位置微信 调用接口
						that.checkUserLocation();
					}
				}
			},
			fail(err) {
				setTimeout(() => {
					that.activityRuleSource = '1';
					that.activityRuleIsShow = true;
					// 活动规则 启动动画
					that.$refs.activityRuleChild.isStartAnimationFun(true);
				}, 2000);
			}
		});
	},
	onReady() {
		// 开启本页面 动效
		if (this.isStartAnimation) {
			this.startInitAnimation();
		}
	},
	async onShow() {
		this.openid = await this.computedGetOpenid;
		console.log('openid---------------' + this.openid);
		// 是否 从输入串码页面中出红包 是：显示动效 和 抽奖按钮
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内分享按钮
			console.log(res.target);
		}
		return {
			title: '青岛啤酒',
			path: '/pages/index/index',
			imageUrl: this.imgUrl + 'share.png'
		};
	},
	onHide() {
		// 弹出自定义 位置引导弹窗
		this.wxOpenSettingIsShow = false;
	},
	methods: {
		// 显示 中出红包动效
		showGetCash() {
			// 调用提现接口
			// 获取红包成功后 动效开启
			this.getCashSuccessAni();
// 			giveSpackTx().then(businessCode => {
// 				console.log('giveSpackTx');
// 				console.log(businessCode);
// 				if (businessCode == 0) {
// 					// 获取红包成功后 动效开启
// 					this.getCashSuccessAni();
// 				} else {
// 					const filterData = filterArr('businessCode', businessCode, this.giveSpackTxStatusArr)[0];
// 					console.log('filterArr____________');
// 					console.log(filterData);
// 					uni.showModal({
// 						title: filterData.title,
// 						content: filterData.content
// 					});
// 				}
// 			});
		},
		// 获取红包成功后 动效开启
		getCashSuccessAni() {
			this.isShowluckDrawBtn = false; //隐藏抽奖按钮
			this.getCashIsShow = true;
			this.getCashIsStartAnimation = true;
			// 获得红包 启动动画
			this.$refs.getCashChild.isStartAnimationFun(true);
			this.isShowGguidance = true; // 显示 关注公众号引导
			this.cusFooterBarIsShow = true; // 显示 自定义页面 页脚
			this.$refs.customFooterBarChild.isStartAnimationFun(true); //开启tab动效
			setTimeout(() => {
				this.startFocusGguidanceAnimation(); // 显示 关注公众号引导 dongxian
			}, 100);
		},
		async onLoadInit() {},
		// 验证缓存中 是否 存在用户位置
		async checkUserLocation() {
			/**
			 * 获从缓存中  获取 用户位置 信息
			 * 有 直接调用 接口
			 * 没有 调用（）   验证用户位置授权状态 2未操作 1已经授权  0拒绝授权
			 * 		 0 ： 弹出自定义引导，引导用户 开启位置授权（openSetting）
			 * 		 1 :  一般不会存在 缓存中没有数据 然后 已经授权 如果存在还是调用 微信授权
			 * 		 2 :  继续 调用微信授权
			 */
			const that = this;
			const LocationStatus = await getSettingLocation();
			uni.getStorage({
				key: 'userLocation',
				success(res) {
					const userLocation = res.data;
					// 调用接口
					that.getSweepQrcode(userLocation.longitude, userLocation.latitude, that.sweepstr);
				},
				fail(err) {
					if (LocationStatus == 0) {
						// 弹出自定义 位置引导弹窗
						that.wxOpenSettingIsShow = true;
					} else {
						// 弹出 获取位置
						getLocation().then((...res) => {
							const [status, locationData] = Array.from(res[0]);
							// 调用接口
							that.getSweepQrcode(locationData.longitude, locationData.latitude, that.sweepstr);
						});
					}
				}
			});
		},
		// 验证缓存中 是否 存在用户信息（openid、sessiong_key）
		async getUserDataFun() {
			/**
			 * 获从缓存中  获取 用户信息（openid，session_key） 信息
			 * 存在
			 * 		验证session（checkSessionStatus） 是否过期
			 * 			未过期 直接调用 返回 用户信息
			 * 			过期   直接调用 重新调用获取小程序 code （getCode）拿到code 获取用户信息（getOpenid）
			 * 没有 调用（）   验证用户位置授权状态 2未操作 1已经授权  0拒绝授权
			 * 		 0 ： 弹出自定义引导，引导用户 开启位置授权（openSetting）
			 * 		 1 :  一般不会存在 缓存中没有数据 然后 已经授权 如果存在还是调用 微信授权
			 * 		 2 :  继续 调用微信授权
			 */
			let returnUserData = '';
			const that = this;
			//用户缓存信息
			const userData = uni.getStorageSync('userData');
			if (userData) {
				// 如果用户信息存在 判断 session 是否过期 0未过期 1已过期
				const checkSessionStatus = await checkSession();
				if (checkSessionStatus == 0) {
					returnUserData = userData.uinfo;
				} else {
					// 获取 小程序 code 请求接口换取 openid session_key
					const xcxCode = await getCode();
					// 拿小程序 code 换取 openid
					const backOpenidData = await getOpenid(xcxCode, 'hgqq');
					if (backOpenidData.uinfo) {
						returnUserData = backOpenidData.uinfo;
					}
				}
			} else {
				// 获取 小程序 code 请求接口换取 openid
				const xcxCode = await getCode();
				const backOpenidData = await getOpenid(xcxCode, 'hgqq');
				if (backOpenidData.uinfo) {
					returnUserData = backOpenidData.uinfo;
				}
			}
			return returnUserData;
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
		// 开始动画
		startInitAnimation() {
			const that = this;
			// 饼干动画 从无到有
			const crownCookiesAnimation = wx.createAnimation({
				duration: 1000,
				timingFunction: 'ease',
				delay: 500
			});
			crownCookiesAnimation.opacity(1).step();

			// 百分百 中奖logo 从左向右滑出
			const baifenbaiAnimation = wx.createAnimation({
				duration: 500,
				timingFunction: 'ease',
				delay: 500
			});
			baifenbaiAnimation.translateX(0).step();

			// 提示文字动画
			const fontMesAnimation = wx.createAnimation({
				duration: 1000,
				timingFunction: 'ease',
				delay: 1400
			});
			fontMesAnimation.opacity(1).step();
			that.baifenbaiAni = baifenbaiAnimation.export();
			that.crownCookiesAni = crownCookiesAnimation.export();
			that.fontMesAni = fontMesAnimation.export();
		},
		// 开始 抽奖按钮 动画
		startChoujiangAnimation() {
			const that = this;
			// 抽奖按钮 放大缩小
			const choujiangAnimation = wx.createAnimation({
				duration: 200,
				timingFunction: 'ease',
				delay: 10
			});
			choujiangAnimation
				.scale(1.2, 1.2)
				.step()
				.scale(1, 1)
				.step();
			that.choujiangAni = choujiangAnimation.export();
		},
		// 开始 关注 动画
		startFocusGguidanceAnimation() {
			const that = this;
			// 抽奖按钮 放大缩小
			const focusGguidanceAnimation = wx.createAnimation({
				duration: 1000,
				timingFunction: 'ease',
				delay: 1500
			});
			focusGguidanceAnimation.opacity(1).step();
			that.focusGguidanceAni = focusGguidanceAnimation.export();
		},
		// 关闭 活动规则 弹窗
		updateActivityRuleColse(data) {
			const that = this;
			that.activityRuleIsShow = false;
			//是否同意 活动规则 如果 同意一下 存入 缓存 不在弹出
			uni.setStorage({
				key: 'isAgreeRule',
				data: true
			});
			
			if (that.codeType && that.codeType == 2) {
				console.log('串码类型 扫码串码1 输入串码222 ');
				// 从 输入串码 过来 中区红包 显示 抽奖按钮
				that.isShowluckDrawBtn = true;
				// 获取红包 展示中奖 金额
			
				uni.getStorage({
					// key:'serialCodeData',
					key: 'sweepQrcodeData',
					success(stoData) {
						const currentMoney = stoData.data.reply.currentMoney || '0.00';
						that.currentMoney = currentMoney;
					}
				});
			} else {
				// 走扫码的逻辑 检测位置微信 调用接口
				that.checkUserLocation();
			}
			
		},
		// 关闭 授权位置
		WxOpenSettingColse(data) {
			const that = this;
			that.wxOpenSettingIsShow = false;
		},
		// 获取手机号
		async getPhoneNumber(e) {
			const backDetail = e.detail;
			if (backDetail.errMsg.lastIndexOf('ok') != -1) {
				//成功getPhone
				// this.mobileToast = false; //再次授权手机hide
				const userData = uni.getStorageSync('userData');
				//解析手机号
				if (userData.uinfo.session_key) {
					// this.parsePhone(e) //解析手机号码
					const session_key = userData.uinfo.session_key;
					analysisMobile(session_key, backDetail).then(backData => {});
				} else {
					const backUserData = await that.getUserDataFun();
					const session_key = backUserData.session_key;
					analysisMobile(session_key, backDetail);
				}
			} else {
				//取消
				// this.mobileToast = true;
			}
			// 无论是否同意 获取手机号 都调用 展示 红包方法
			this.showGetCash();
		},
		//获取 扫码接口 返回信息 并处理
		getSweepQrcode(longitude = '00', latitude = '00', sweepstr = '') {
			const that = this;
			var sendParams = {
				openid: that.openid,
				sweepstr: sweepstr,
				longitude: longitude, //"经度"
				latitude: latitude, //"纬度"
				nickname: '',
				headimgurl: ''
			};
			// 调用扫码接口
			sweepQrcode(sendParams)
				.then(res => {
					const currentMoney = res.reply.currentMoney || '0.00';
					that.currentMoney = currentMoney;
					console.log('获取 扫码接口 返回信息 并处理');
					return judgeBusinessCode(res);
				})
				.then(
					res => {
						if (res == 0) {
							// 显示 抽奖按钮
							that.isShowluckDrawBtn = true;
							that.startChoujiangAnimation();
						} else {
							uni.redirectTo({
								url: res
							});
						}
					},
					err => {
						// 跳转 首页
						uni.switchTab({
							url: err
						});
					}
				);
		},
		// 跳转到首页 显示 引导关注
		showGguidanceFun() {
			const redirectToUrl = '../index/index';
			uni.setStorage({
				key: 'businessCode',
				data: 'isShowGguidance'
			});
			uni.switchTab({
				url: redirectToUrl
			});
		}
	}
};
</script>
<!-- <view class="container" style="background-image:url({{imgBaseUrl}}/bg.jpg) no-repeat;background-size:cover;"></view> -->
<style scoped lang="scss">
.activityEntrance {
	width: 100%;
	height: 100%;
	background: url($crownCookiesImg+'crownCookiesImgBg.jpg') no-repeat center;
	background-size: cover;
	overflow: hidden;
}
.crownCookies-logo {
	width: 180rpx;
	margin-left: 54rpx;
	margin-top: 126rpx;
}
.activityEntrance-center {
	margin: 226rpx 120rpx 36rpx 54rpx;
	position: relative;
	image {
		width: 100%;
	}
	.aec-baifenbai {
		position: absolute;
		bottom: 0;
		left: 0;
	}
}

.activityEntrance-center-Animation {
	margin: 226rpx 120rpx 36rpx 54rpx;
	position: relative;
	image {
		width: 100%;
	}
	.aec-baifenbai {
		position: absolute;
		bottom: 0;
		left: 0;
		transform: translateX(-110%);
	}
	.aec-crownCookiesImg {
		// 饼干 初始 状态
		opacity: 0;
		position: absolute;
		top: -156rpx;
		left: 5%;
		width: 82%;
		height: 260rpx;
	}
}
.focusGguidance {
	position: fixed;
	bottom: 120rpx;
	width: 96%;
	left: 2%;
	height: 170rpx;
	z-index: 80;
	image {
		width: 100%;
		height: 100%;
		opacity: 0;
	}
}
.idnex-imgMes {
	text-align: center;
	font-size: 24rpx;
	color: #b2bce3;
}
button {
	margin: 0;
	padding: 0;
	border: 1px solid transparent; //自定义边框
	outline: none; //消除默认点击蓝色边框效果
	background: none;
	border: none;
}
button::after {
	border: none;
}
.choujiangBtn {
	width: 40%;
	margin-top: 34rpx;
	// transform: scale(0.8,0.8);
	// opacity: .3;
	image,
	button {
		width: 100%;
	}
}
</style>
