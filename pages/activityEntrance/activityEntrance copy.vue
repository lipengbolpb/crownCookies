<template>
	<view class="page-template">
		<view class="page-template-wrap page-template-wrap-bg">
			<view class="page-template-wrap-center">
				
				<!-- 测试动画 -->
				<!-- <view class="devTest" @animationend="transitionendDevTest">  </view> -->
				<view class="activityEntrance">
					<image mode="widthFix" class="crownCookies-logo" :src="staticUrl+'crownCookiesImgLogo.png'"></image>
					<!-- <view class="activityEntrance-center-Animation" v-if="isStartAnimation" :style="{ 'margin-top': isOpenAdaptation ? '512rpx' : '396rpx' }"> -->
					<view class="activityEntrance-center-Animation" v-if="isStartAnimation">
						<!-- <image :animation="chuanAni" @transitionend="transitionend" class="aec-chuanImg" mode="widthFix" :src="staticUrl + 'chuan.png'"></image> -->
						<!-- <image :animation="crownCookiesAni" class="aec-crownCookiesImg" mode="widthFix" :src="staticUrl + 'crownCookiesImg.png'"></image> -->
						<!-- <image @animationend="transitionend" class="aec-chuanImg" mode="widthFix" :src="staticUrl + 'chuan.png'"></image> -->
						<image :class="aecChuanImg" @animationend="transitionend" mode="widthFix" :src="staticUrl + 'chuan.png'"></image>
						<image :class="aecCrownCookiesImg" mode="widthFix" :src="staticUrl + 'crownCookiesImg.png'"></image>
						<!-- <image :animation="baifenbaiAni" @transitionend="transitionend" class="aec-baifenbai" mode="widthFix" :src="staticUrl + 'baifenbai.png'"></image> -->
						
						<view class="aec-baifenbai-box">
							<!-- <image :class="aecBaifenbai" class="aec-baifenbai" mode="widthFix" :src="staticUrl + 'baifenbai.png'"></image> -->
							<image :class="aecBaifenbai" class="aec-baifenbai" :src="staticUrl + 'baifenbai.png'"></image>
						</view>
						
					</view>
					<view class="activityEntrance-center" v-else :style="{ 'margin-top': isOpenAdaptation ? '334rpx' : '226rpx' }">
						<image class="aec-chuanquqi" mode="widthFix" :src="staticUrl+'chuanquqi.png'"></image>
						<image class="aec-baifenbai" mode="widthFix" :src="staticUrl+'baifenbai.png'"></image>
					</view>
					<!-- <view :animation="fontMesAni"  @transitionend="transitionendOpenSetting" class="idnex-imgMes" :style="{ opacity: isStartAnimation ? '0' : '1' }">图片仅供参考，产品以实物为准1</view> -->
					<!-- <view :animation="fontMesAni" class="idnex-imgMes" :style="{ opacity: isStartAnimation ? '0' : '1' }">图片仅供参考，产品以实物为准</view> -->
					<view class="idnex-imgMes" >图片仅供参考，产品以实物为准</view>
					
					<!-- 抽奖按钮 获取手机号-->
					<!-- <view class="flex-xc-yn" :animation="choujiangAni" v-show="isShowluckDrawBtn"> -->
					<view class="flex-xc-yn" v-if="isShowluckDrawBtn">
						<view @click.once="luckDrawFun" class="choujiangBtn vmdChoujiang" v-if="isHasPhoneNumber">
							<image :src="staticUrl + 'dianjichoujiang.png'"></image>
						</view>
						<view class="choujiangBtn" v-else>
							<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="btn againGetPhone vmdChoujiang">
								<image :src="staticUrl + 'dianjichoujiang.png'"></image>
							</button>
						</view>
					</view>
					
				</view>
				
			</view>
			<!-- 引导关注 -->
			<view class="focusGguidance" v-if="isShowGguidance" @click="showGguidanceFun" :style="{ bottom: isOpenAdaptation ? '170rpx' : '120rpx' }">
				<image :animation="focusGguidanceAni" :src="staticUrl + 'focusGguidance.png'"></image>
			</view>
			<!-- 规则弹窗 -->
			<activity-rule ref="activityRuleChild" @activityRuleColse="updateActivityRuleColse" :activityRuleSource="activityRuleSource"
			 :activityRuleIsShow="activityRuleIsShow"></activity-rule>
			<!-- 获取红包动效页面 -->
			<get-cash ref="getCashChild" :getCashIsShow="getCashIsShow" :getCashIsShowMes="getCashIsShowMes" :isStartAnimation="getCashIsStartAnimation"
			 :currentMoney="currentMoney"></get-cash>
			<!-- 引导开启 位置授权 -->
			<wx-open-setting :wxOpenSettingIsShow="wxOpenSettingIsShow" :isStartAnimation="wxOpenSettingIsStartAnimation"
			 @WxOpenSettingColse="WxOpenSettingColse" @openSetting="wosOpenSetting"></wx-open-setting>
			<!-- 自定义导航 -->
			<custom-footer-bar ref="customFooterBarChild" :cusFooterBarIsShow="cusFooterBarIsShow" :isOpenAdaptation="isOpenAdaptation"></custom-footer-bar>
			<!-- 自定义 -->
			<custom-dialog ref="customDialogChild" @customDialogColse="updateCustomDialog" :customDialogIsShow="customDialogIsShow"
			 :customDialogType="customDialogType"></custom-dialog>
		</view>
	</view>
</template>

<script>
	import {
		get,
		post,
		config
	} from '@/utils/api.js';
	import {
		getLocation,
		analysisMobile,
		checkSession,
		getCode,
		getOpenid,
		getSettingLocation
	} from '@/common/getWxUserInfor.js';
	import {
		sweepQrcode,
		giveSpackTx
	} from '@/common/getData.js';
	import {
		judgeBusinessCode,
		filterArr,
		dateformat
	} from '@/common/basicsFun.js';
	import {
		activityRule
	} from '@/components/activityRule.vue'; // 活动规则
	import {
		wxOpenSetting
	} from '@/components/wx-open-setting/wx-open-setting.vue'; // 开启 位置 引导
	import {
		getCash
	} from 'pages/getCash/getCash.vue'; // 获得红包
	import {
		customFooterBar
	} from '@/components/custom-footer-bar/custom-footer-bar.vue'; // 自定义页脚
	import {
		customDialog
	} from '@/components/customDialog.vue'; // 自定义页脚
	export default {
		name: 'activityEntrance',
		components: {
			activityRule,
			getCash,
			wxOpenSetting,
			customFooterBar,
			customDialog
		},
		data() {
			return {
				aecChuanImg:'aec-chuanImg',
				aecCrownCookiesImg:'aec-crownCookiesImg',
				// aecBaifenbai:'aec-baifenbai',
				aecBaifenbai:'',
				staticUrl: config.staticUrl,
				isTransitionend: false, //动画是否执行完毕
				activityRuleSource: '1', // 活动规则 页面来源
				activityRuleIsShow: false, // 活动规则  是否展示
				getCashIsShow: false, // 中出红包 是否显示
				getCashIsShowMes: false, // 中出红包 是否显示 红包已存入微信红包中
				getCashIsStartAnimation: false, //中出红包  是否 开启动画
				currentMoney: '', //中出红包 中出金额
				isShowGguidance: false, //是否展示 引导关注 公众号 logo
				isStartAnimation: true, // 本页面 是否开启动画
				isShowluckDrawBtn: false, //是否 显示 抽奖按钮
				isHasPhoneNumber: false, //是否 已获取手机号
				chuanAni: '', //船 动画
				crownCookiesAni: '', //饼干 动画
				baifenbaiAni: '', //百分比 动画
				fontMesAni: '', //饼干动画
				choujiangAni: '', //抽奖按钮 动画
				focusGguidanceAni: '', // 引导关注 公众号图片
				openid: '', // 拿 小程序code换取最终要使用的 openId
				isShowCustomLocation: false, // 是否展示 自定义 定位引导
				wxOpenSettingIsShow: false, //是否展示 位置授权
				wxOpenSettingIsStartAnimation: false, // 位置授权 是否展示动画
				sweepstr: 'JYJ9CSJ8W79P',
				cusFooterBarIsShow: false, //是否展示 页面tab （显示条件：出现 获得红包动效 ）
				fromOpenSetting: false,
				giveSpackTxStatusArr: [{
						id: 1,
						businessCode: '1',
						title: '提示',
						content: '您的红包金额不足，攒够0.3元可提现！'
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
				codeType: '1',
				customDialogIsShow: false, // 自定义 弹窗  关注引导
				customDialogType: '', // 自定义 弹窗  关注引导
				businessCode: '' // 用于点击抽奖按钮 区分 红包 还是 大奖
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
		},
		onLoad(options) {
			console.log('页面参数 options 176');
			console.log(options);
			const sweepstrUrl = decodeURIComponent(options.q);
			if (options.openScan != 1 && sweepstrUrl) {
				getApp().globalData.isInitsweepstr = 'true';
			}
			const that = this;
			// 串码类型 扫码串码1 输入串码2
			that.codeType = options.codeType || '1';
			if (that.codeType == 2) {
				this.sweepstr = '';
			} else { 
				if (sweepstrUrl.indexOf('xt.vjifen.com') != -1) {
					//测试二维码
					if (sweepstrUrl.indexOf('/LN/') != -1) {
						//测试的微信直接打开小程序
						that.sweepstr = sweepstrUrl.split('LN/')[1];
					} else {
						that.sweepstr = sweepstrUrl.split('v=')[1];
					}
				} else if (sweepstrUrl.indexOf('VJ1.TV/') != -1) {
					that.sweepstr = sweepstrUrl.split('QQ/')[1];
				} else if (sweepstrUrl.indexOf('vj1.tv/') != -1) {
					that.sweepstr = sweepstrUrl.split('QQ/')[1];
				} else {
					that.sweepstr = '';
					return uni.showModal({
						title: '温馨提示',
						content: '请扫描正确的活动二维码~',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.reLaunch({
									url: '../index/index'
								});
							}
						}
					});
				}
			}
		},
		onReady() {
			console.log('woshi onReady');
			console.log(this.isStartAnimation);
			// 开启本页面 动效
			// if (this.isStartAnimation) {
			// 	this.resetInitAnimation();
			// 	this.startInitAnimation();
			// }
			setTimeout(() => {
				this.resetInitAnimation();
				this.startInitAnimation();
			}, 100)

		},
		async onShow() {
			console.log("页面 onshow 21122333");
			console.log(this.wxOpenSettingIsShow);
			console.log(this.isStartAnimation);
			// 清除 动画效果
			this.crownCookiesAni = 'aec-crownCookiesImg'; //饼干 动画
			this.chuanAni = 'aec-chuanImg'; //船 动画
			this.baifenbaiAni = 'aec-baifenbai'; //百分比 动画
			this.fontMesAni = 'idnex-imgMes'; //饼干动画
			this.choujiangAni = ''; //抽奖按钮 动画
			this.focusGguidanceAni = ''; // 引导关注 公众号图片
			this.isTransitionend = false;
			this.openid = await this.computedGetOpenid;
			// this.init();
			this.aecBaifenbai = '';
			setTimeout(() => {
				this.resetInitAnimation();
				this.startInitAnimation();
				this.aecBaifenbai = 'aec-baifenbai-end';
			}, 100)
		},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内分享按钮
			}
			return {
				title: '皇冠丹麦曲奇',
				path: '/pages/index/index',
				imageUrl: this.staticUrl + 'fenxiangImg.png'
			};
		},
		onHide() {
			// 清除 动画效果
			const wxOpenSettingIsShow = this.wxOpenSettingIsShow;
			this.crownCookiesAni = 'aec-crownCookiesImg'; //饼干 动画
			this.chuanAni = 'aec-chuanImg'; //饼干 动画
			this.baifenbaiAni = 'aec-baifenbai'; //百分比 动画
			this.fontMesAni = 'idnex-imgMes'; //饼干动画
			this.choujiangAni = ''; //抽奖按钮 动画
			this.focusGguidanceAni = ''; // 引导关注 公众号图片
			this.isTransitionend = false;
			this.wxOpenSettingIsShow = false;
			this.wxOpenSettingIsShow = false;
			this.resetInitAnimation();
		},
		methods: {
			transitionend() {
				this.isTransitionend = true;
				console.log('动画 执行完毕');
				console.log(this.isTransitionend);
				if (this.fromOpenSetting) {
					this.getSweepQrcode('', '', this.sweepstr);
				} else {
					this.init();
				}
			},
			// 测试 动画
			transitionendDevTest() {
				console.log('我是 测试动画 执行完成之后！');

			},
			transitionendOpenSetting() {
				console.log(4444);
				this.getSweepQrcode('', '', this.sweepstr);
			},
			// 页面初始化
			init() {
				const that = this;
				/**
				 * 判断 缓存中 是否 存在 isAgreeRule
				 * 存在并且为true   表示已同意活动规则直接检查缓存中用户位置信息
				 * 不存在        显示 活动规则 （关闭活动规则或者点击同意活动规则检查缓存中用户位置信息）
				 */
				uni.getStorage({
					key: 'isAgreeRule',
					success(sto) {
						if (sto.data) {
							// 串码类型 扫码串码1 输入串码2
							console.log('串码类型 扫码串码1 输入串码2 ');
							console.log(that.codeType);
							if (that.codeType && that.codeType == 2) {
								// 从 输入串码 过来 中区红包 显示 抽奖按钮
								that.isShowluckDrawBtn = true;
								that.startChoujiangAnimation();
								// 获取红包 展示中奖 金额
								uni.getStorage({
									// key:'serialCodeData',
									key: 'sweepQrcodeData',
									success(stoData) {
										const currentMoney = stoData.data.reply.currentMoney || '';
										that.currentMoney = currentMoney;
										const res = stoData.data;
										if (res.reply.phonenum) {
											// 不拉去手机号授权
											that.isHasPhoneNumber = true;
										} else {
											// 拉起手机号授权
											// 当 显示抽奖按钮时 判断缓存中 是否存在 手机号
											const backStorage = uni.getStorageSync('userMobileData').phoneNumber;
											if (backStorage) {
												that.isHasPhoneNumber = true;
											} else {
												that.isHasPhoneNumber = false;
											}
										}
									}
								});
							} else {
								// const isInitsweepstr = uni.getStorageSync('isInitsweepstr');
								if (getApp().globalData.isInitsweepstr == 'true') {
									// 走扫码的逻辑 检测位置微信 调用接口
									that.checkUserLocation(true);
								} else {
									return false;
								}

							}
						} else {
							// 继续弹出 活动规则
							that.activityRuleSource = '1';
							that.activityRuleIsShow = true;
							// 活动规则 启动动画
							that.$refs.activityRuleChild.isStartAnimationFun(true);
						}
					},
					fail(err) {
						that.activityRuleSource = '1';
						that.activityRuleIsShow = true;
						// 活动规则 启动动画
						that.$refs.activityRuleChild.isStartAnimationFun(true);
					}
				});
			},
			// 点击抽奖按钮 判断 中大奖 还是 红包
			luckDrawFun() {
				const that = this;
				const businessCode = this.businessCode;
				if (businessCode == 0) { //中出红包
					that.showGetCash()
				} else if (businessCode == 7) { // 中出 大奖
					const redirectToUrl = `../getPrize/getPrize?bizcode=${businessCode}&isGetPrize=false`;
					uni.redirectTo({
						url: redirectToUrl
					});
				}
				console.log(this.businessCode)
			},
			// 显示 中出红包动效
			showGetCash() {
				// 调用提现接口
				// 获取红包成功后 动效开启
				const that = this;
				giveSpackTx().then(
					res => {
						// 获取红包成功后 动效开启
						that.getCashSuccessAni();
						const businessCode = res.businessCode;
						if (businessCode == 0) {
							// 显示 红包收入 图片
							that.getCashIsShowMes = true;
						} else if (businessCode == 5) {
							setTimeout(function() {
								uni.showModal({
									title: '提示',
									content: res.msg
								});
							}, 2000);
						} else {
							// 提现失败 提示
							// 隐藏 红包收入 图片
							setTimeout(function() {
								that.getCashIsShowMes = false;
								const filterData = filterArr('businessCode', businessCode, that.giveSpackTxStatusArr)[0];
								uni.showModal({
									title: filterData.title,
									content: filterData.content
								});
							}, 2000);
						}
					},
					errCode => {
						if (errCode == '-1') {
							uni.showModal({
								title: '尊敬的用户',
								content: '系统升级中...'
							});
						} else {
							uni.showModal({
								title: '提示',
								content: '呜呜，服务开了个小差，请稍后重试！'
							});
						}
					}
				);
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
				setTimeout(() => {
					this.$refs.customFooterBarChild.isStartAnimationFun(true); //开启tab动效
					this.startFocusGguidanceAnimation(); // 显示 关注公众号引导 dongxian
				}, 1000);
			},
			// 验证缓存中 是否 存在用户位置
			async checkUserLocation(status = false) {
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
						if (userLocation.longitude) {
							that.getSweepQrcode(userLocation.longitude, userLocation.latitude, that.sweepstr, status);
						} else {
							that.getSweepQrcode('', '', that.sweepstr, status);
						}
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
								if (status == 0) {
									that.getSweepQrcode(locationData.longitude, locationData.latitude, that.sweepstr);
								} else {
									that.getSweepQrcode('', '', that.sweepstr);
								}
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
			// 打开微信 位置授权页面
			wosOpenSetting() {
				//设置里打开授权地理位置
				// this.againClick = true;
				uni.openSetting({
					complete: res => {
						console.log('我是设置里打开授权地理位置');
						// 统一在onshow执行地址位置判断
						// this.getLocation();
						// return false
						const that = this;
						that.wxOpenSettingIsShow = false;
						// 开启本页面 动效
						if (this.isStartAnimation) {
							this.resetInitAnimation();
							this.startInitAnimation();
						}
						// 关闭了 也要继续往下走
						// 继续调用 接口
						that.fromOpenSetting = true;
						// that.getSweepQrcode('', '', that.sweepstr);

						that.aecChuanImg = '';
						that.aecCrownCookiesImg = '';
						that.aecBaifenbai = '';
						
						setTimeout(()=>{
							that.aecChuanImg = 'aec-chuanImg';
							that.aecCrownCookiesImg = 'aec-crownCookiesImg';
							that.aecBaifenbai = 'aec-baifenbai-end';
						},10)

					}
				});
			},
			// 开始动画
			startInitAnimation() {
				const that = this;
				// 船 从无到有
				const chuanAnimation = wx.createAnimation({
					duration: 1000,
					timingFunction: 'ease',
					delay: 100
				});
				chuanAnimation.opacity(1).step();

				// 饼干动画 从无到有
				const crownCookiesAnimation = wx.createAnimation({
					duration: 1000,
					timingFunction: 'ease',
					delay: 100
				});
				crownCookiesAnimation.opacity(1).step();

				// 百分百 中奖logo 从左向右滑出
				const baifenbaiAnimation = wx.createAnimation({
					duration: 1000,
					timingFunction: 'ease',
					delay: 100
				});
				baifenbaiAnimation.translateX(0).step();
				// 提示文字动画
				const fontMesAnimation = wx.createAnimation({
					duration: 300,
					timingFunction: 'ease',
					delay: 100
				});
				fontMesAnimation.opacity(1).step();
				setTimeout(function() {
					that.baifenbaiAni = baifenbaiAnimation.export();
					that.crownCookiesAni = crownCookiesAnimation.export();
					that.chuanAni = chuanAnimation.export();
					that.fontMesAni = fontMesAnimation.export();
				}, 10)
			},
			// 重置动画
			resetInitAnimation() {
				const that = this;
				// 船 从无到有
				const chuanAnimation = wx.createAnimation({
					duration: 1,
					timingFunction: 'ease',
					delay: 0
				});

				chuanAnimation.opacity(0).step();
				// 饼干动画 从无到有
				const crownCookiesAnimation = wx.createAnimation({
					duration: 1,
					timingFunction: 'ease',
					delay: 0
				});
				crownCookiesAnimation.opacity(0).step();
				// 百分百 中奖logo 从左向右滑出
				const baifenbaiAnimation = wx.createAnimation({
					duration: 1,
					timingFunction: 'ease',
					delay: 0
				});
				baifenbaiAnimation.translateX('-110%').step();
				// 提示文字动画
				const fontMesAnimation = wx.createAnimation({
					duration: 1,
					timingFunction: 'ease',
					delay: 0
				});
				fontMesAnimation.opacity(0).step();
				setTimeout(function() {
					that.baifenbaiAni = baifenbaiAnimation.export();
					that.crownCookiesAni = crownCookiesAnimation.export();
					that.chuanAni = chuanAnimation.export();
					that.fontMesAni = fontMesAnimation.export();
				}, 10)
			},
			// 开始 抽奖按钮 动画
			startChoujiangAnimation() {
				const that = this;
				// 抽奖按钮 放大缩小
				const choujiangAnimation = wx.createAnimation({
					// duration: 200,
					duration: 1,
					timingFunction: 'ease',
					delay: 10
				});
				choujiangAnimation
					.scale(1, 1)
					.step();
				that.choujiangAni = choujiangAnimation.export();
			},
			// 开始 关注 动画
			startFocusGguidanceAnimation() {
				const that = this;
				const focusGguidanceAnimation = wx.createAnimation({
					duration: 1,
					timingFunction: 'ease',
					delay: 1
				});
				focusGguidanceAnimation.opacity(1).step();
				that.focusGguidanceAni = focusGguidanceAnimation.export();
			},
			// 关闭 活动规则 弹窗
			updateActivityRuleColse(data) {
				const that = this;
				that.activityRuleIsShow = false;
				if (that.codeType && that.codeType == 2) {
					// 从 输入串码 过来 中区红包 显示 抽奖按钮
					that.isShowluckDrawBtn = true;
					that.startChoujiangAnimation();
					// 获取红包 展示中奖 金额
					uni.getStorage({
						// key:'serialCodeData',
						key: 'sweepQrcodeData',
						success(stoData) {
							const currentMoney = stoData.data.reply.currentMoney || '';
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
				// 关闭了 也要继续往下走
				// 继续调用 接口
				that.getSweepQrcode('', '', that.sweepstr);
			},
			// 获取手机号
			async getPhoneNumber(e) {
				const backDetail = e.detail;
				if (backDetail.errMsg.lastIndexOf('ok') != -1) {
					//成功getPhone
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

				}
				// 无论是否同意 获取手机号 都调用方法
				this.luckDrawFun();
			},
			//获取 扫码接口 返回信息 并处理
			getSweepQrcode(longitude = '00', latitude = '00', sweepstr = '', status = false) {
				console.log('getSweepQrcodegetSweepQrcodegetSweepQrcodegetSweepQrcode');
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
						console.log(sendParams);
						const currentMoney = res.reply.currentMoney || '';
						that.currentMoney = currentMoney;
						// 判断是否 返回手机号 如果有 不在 弹出授权
						if (res.reply.phonenum) {
							// 不拉去手机号授权
							that.isHasPhoneNumber = true;
						} else {
							// 拉起手机号授权
							// 当 显示抽奖按钮时 判断缓存中 是否存在 手机号
							const backStorage = uni.getStorageSync('userMobileData').phoneNumber;
							if (backStorage) {
								that.isHasPhoneNumber = true;
							} else {
								that.isHasPhoneNumber = false;
							}
						}
						// 清除 扫码入口 存储得 标记
						uni.removeStorageSync('isInitsweepstr');
						getApp().globalData.isInitsweepstr == 'false';
						return judgeBusinessCode(res);
					})
					.then(
						res => {
							if (res == 0 || res == 7) {
								// 显示 抽奖按钮
								that.businessCode = res;
								that.isShowluckDrawBtn = true;
								that.startChoujiangAnimation();
							} else {
								if (status) {
									if (that.isTransitionend) {
										console.log('动画结束后 调用方法');
										// 当统一活动规则和位置授权后 再跳转
										uni.redirectTo({
											url: res
										});
									} else {
										console.log('没有拿到 isTransitionend 659');
										uni.redirectTo({
											url: res
										});
									}
								} else {
									// 等本页动画执行完 在进行跳转
									uni.redirectTo({
										url: res
									});
								}

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
			// 跳转到首页显示引导关注 8.7号修改成当前页面弹出引导弹窗不在跳转
			showGguidanceFun() {
				const redirectToUrl = '../index/index';
				uni.setStorage({
					key: 'businessCode',
					data: 'isShowGguidance'
				});
				// uni.switchTab({
				// 	url: redirectToUrl
				// });
				const that = this;
				that.customDialogIsShow = true;
				that.customDialogType = '5';
				// 	// 活动规则 启动动画
				that.$refs.customDialogChild.isStartAnimationFun(true);

			},
			updateCustomDialog(res) {
				console.log(res);
				this.customDialogIsShow = false;
				uni.removeStorageSync("businessCode");
			},

		}
	};

	// 1 没有同意 活动规则 和 位置授权 
	// 2 同意 活动规则和位置授权 直接调用接口
	// 2.1 同意活动规则 没有同意 位置授权 显示自定义位置授权（ 从自定义授权返回  ）
	// 2.2  
	// 3 从 输入串码过来 中出大奖
	// 4 重新进入小程序 
	// 5 重复 扫码 
</script>
<!-- <view class="container" style="background-image:url({{imgBaseUrl}}/bg.jpg) no-repeat;background-size:cover;"></view> -->
<style scoped lang="scss">
	.page-template-wrap-bg {
		background: url($crownCookiesImg+'crownCookiesImgBgBig.jpg') no-repeat center;
		background-size: cover;
	}

	.activityEntrance {
		width: 100%;
		height: 100%;
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
			// position: absolute;
			// bottom: 0;
			// left: 0;
		}
	}

	@mixin mixin-ani($aniName, $aniTime, $visited) {
		animation: $aniName $aniTime;
		-moz-animation: $aniName $aniTime;
		/* Firefox */
		-webkit-animation: $aniName $aniTime;
		/* Safari and Chrome */
		-o-animation: $aniName $aniTime;
		/* Opera */
	}
	@mixin mixin-ani-end($aniName, $aniTime, $visited) {
		animation: $aniName $aniTime;
		-moz-animation: $aniName $aniTime;
		/* Firefox */
		-webkit-animation: $aniName $aniTime;
		/* Safari and Chrome */
		-o-animation: $aniName $aniTime;
		/* Opera */
		
		animation-fill-mode:forwards;
		-moz-animation-fill-mode:forwards;
		-webkit-animation-fill-mode:forwards;
		-o-animation-fill-mode:forwards;
	}
	.activityEntrance-center-Animation {
		margin: 352rpx 120rpx 16rpx 54rpx;
		position: relative;

		image {
			width: 100%;
		}
		.aec-baifenbai-box{
			width: 100%;
			position: absolute;
			bottom: 20rpx;
		}
		.aec-baifenbai {
			// left: 0;
			// transform: translateX(-100%);
			// @include mixin-ani(keyframesTranslateX, 1s, '');
			// @include mixin-ani-end(keyframesTranslateX, 1s, '');
			// @include mixin-ani(keyframesOpacity, 1s, '');
			
			width: 100%;
			height: 227rpx;
			transform: translateX(-110%);
			transition: .9s ease ; 
		}
		.aec-baifenbai-end {
			width: 100%;
			height: 227rpx;
			transform: translateX(0);
			transition: .9s ease ; 
		}

		.aec-crownCookiesImg {
			// 饼干 初始 状态
			opacity: 1;
			position: absolute;
			top: -156rpx;
			left: 5%;
			width: 82%;
			height: 260rpx;
			@include mixin-ani(keyframesOpacity, 1s, '');
		}

		.aec-chuanImg {
			opacity: 1;
			@include mixin-ani(keyframesOpacity, 1s, '');
		}
	}
	
	.focusGguidance {
		position: fixed;
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
	
	// 文字提示
	.idnex-imgMes {
		text-align: center;
		font-size: 24rpx;
		color: #b2bce3;
		opacity: 1;
		@include mixin-ani(keyframesOpacity, .3s, '');
		// letter-spacing: 8rpx; // 文字 横向间距
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
		width: 306rpx;
		height: 209rpx;
		margin-top: 61rpx;

		// transform: scale(0.8,0.8);
		// opacity: .3;
		image,
		button {
			height: 209rpx;
			width: 100%;
		}
	}

	.devTest {
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		top: 0;
		left: 0;

		animation: myfirst 5s;
		-moz-animation: myfirst 5s;
		/* Firefox */
		-webkit-animation: myfirst 5s;
		/* Safari and Chrome */
		-o-animation: myfirst 5s;
		/* Opera */

		animation-delay: 2s;
		-webkit-animation-delay: 2s;
		/* Safari 和 Chrome */

	}

	@keyframes myfirst {
		0% {
			background: red;
		}

		25% {
			background: yellow;
		}

		50% {
			background: blue;
		}

		75% {
			background: green;
		}

		100% {
			background: red;
		}
	}

	// 透明度变化
	@keyframes keyframesOpacity {
		0% {
			opacity: 0;
		}

		50% {
			opacity: 0.5;
		}

		100% {
			opacity: 1;
		}
	}
	
	// 位置 从左到右 横移
	@keyframes keyframesTranslateX {
		0% {
			transform: translate3d(-210%,0,0);
		}
		100% {
			transform: translate3d(-100%,0,0);
		}
	}
	
</style>
