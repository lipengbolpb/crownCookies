<template>
	<view class="personalCenter flex-xn-ys" id="personalCenter">
		<view id="wr-center-top" :style="{ 'margin-top': safeAreaTop*2 + 'rpx' }" >
			<uni-nav-bar title="我的账户"></uni-nav-bar>
			<view class="flex-xc-yn pc-TitleImg-box">
				<image class="pc-TitleImg" :src="staticUrl + 'baifenbaiLogo.png'"></image>
			</view>
			<view class="pc-titleBox pct-common">
				<!-- 头部 展示 头像和昵称 -->
				<view class="pct-userInfor flex-xc-yn">
					<!-- <view class="pct-userInfor-userImg">
						<button class="user" open-type="getUserInfo" @getuserinfo="getUserInfoFn" withCredentials="true">
							<image class="avatar" mode="widthFix" :src="userInfo.avatarUrl || staticUrl + 'shangchuantouxiang.png'"></image>
						</button>
						<view class="pct-userInfor-nickName">{{ nickNameSub }}</view>
					</view> -->
					<view class="pct-userInfor-userImg">
						<image class="avatar" mode="widthFix" :src="userInfo.avatarUrl || staticUrl + 'shangchuantouxiang.png'"></image>
						<view class="pct-userInfor-nickName">{{ nickNameSub }}</view>
					</view>
			
				</view>
				<!-- 累计红包金额 获取丹麦旅游 -->
				<view class="pct-tab flex-xsb-yc">
					<view class="shuxianBox" @click="goWinningRecord">
						<image :src="staticUrl+'hongbaoIcon.png'" class="hongbaoIcon"></image>
						<p class="pct-tab-mes1">累计红包金额</p>
						<p class="pct-tab-mes2">￥ <text>{{ allAccountMoney }}</text> 元</p>
						<view class="shuxian"></view>
					</view>
					<view class="" @click="goSubmitUserInfor">
						<image :src="staticUrl+'danmaiIcon.png'" class="danmaiIcon"></image>
						<p class="pct-tab-mes1">获得丹麦游</p>
						<p class="pct-tab-mes2"><text>{{ totalPrizeNum }}</text> 次</p>
					</view>
				</view>
			</view>
		</view>
		

		<!-- 列表 -->
		
		<scroll-view :style="{ height: scrollViewHeight + 'px',paddingBottom:'20rpx' }" scroll-y="true" class="wrc-listBox">
			<view class="pct-list pct-common flex-xn-yc" v-for="item in pctList" :key="item.id" @click="listNav(item)">
				<image :src="item.icon"></image>
				<view class="">{{ item.name }}</view>
			</view>
		</scroll-view> 
		
		<!-- 活动规则 -->
		<activity-rule ref="activityRuleChild" @activityRuleColse="updateActivityRuleColse" :activityRuleSource="activityRuleSource"
		 :activityRuleIsShow="activityRuleIsShow"></activity-rule>

		<!-- 个人信息授权引导 -->
		<wx-guidance-operation @WXGuidanceOperationClose='WXGuidanceOperationGet' @WXUserInfor='WXUserInfor'
		 :WXGuidanceOperationType='WXGuidanceOperationType' :WXGuidanceOperationIsShow='WXGuidanceOperationIsShow'
		 :WXGuidanceOperationShowData='WXGuidanceOperationShowData'></wx-guidance-operation>

	</view>
</template>

<script>
	import {
		get,
		post,
		config
	} from '@/utils/api.js';
	import {
		getUserInfo
	} from '@/common/getWxUserInfor.js';
	import {
		queryUserHomePage,
		giveSpackTx
	} from '@/common/getData.js';
	import activityRule from '@/components/activityRule.vue';
	import {
		getUserDataFun,
		strSub,
		dateformatTemp,
		filterArr
	} from '@/common/basicsFun.js';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import wxGuidanceOperation from '@/components/wx-guidance-operation/wx-guidance-operation.vue'; //个人信息页面授权引导

	import {
		giveSpackTxStatusArr
	} from '@/common/tipConfig.js'

	export default {
		name: 'personalCenter',
		components: {
			activityRule,
			uniNavBar,
			wxGuidanceOperation
		},
		computed: {
			// 当窗口 高度 大于800 是 重新 计算 盒子的上边距
			safeAreaTop() {
				const userSystemInfo = uni.getStorageSync('userSystemInfo');
				let safeAreaTop = '30'
				if (userSystemInfo) {
					safeAreaTop = userSystemInfo.safeArea.top == 0 ? '30' : userSystemInfo.safeArea.top;
				} else {
					safeAreaTop = '30';
				}
				console.log('safeAreaTopsafeAreaTopsafeAreaTopsafeAreaTop');
				console.log(safeAreaTop);
				return safeAreaTop;
			},
			nickNameSub() {
				const initName = this.userInfo.nickName;
				const returnStr = strSub(initName, 14, 7, '...');
				return returnStr;
			}
		},
		data() {
			return {
				activityRuleSource: '2',
				activityRuleIsShow: false,
				isStartAnimation: false,
				staticUrl: config.staticUrl,
				pctList: [{
						id: 1,
						isCanClick: true,
						isShow: true,
						status: 1, // 1 跳转 路径 2 显示弹窗
						name: '查看中奖记录',
						icon: config.staticUrl + 'zhongjiangjiluIcon.png',
						navUrl: '/pages/winningRecord/winningRecord'
					},
					{
						id: 2,
						isCanClick: true,
						isShow: true,
						status: 1, // 1 跳转 路径 2 显示弹窗
						name: '输入序列码抽奖',
						icon: config.staticUrl + 'xuliehaoIcon.png',
						navUrl: '/pages/strCode/strCode'
					},
					{
						id: 3,
						isCanClick: true,
						isShow: true,
						status: 2, // 1 跳转 路径 2 显示弹窗
						name: '活动规则',
						icon: config.staticUrl + 'huodongguizeIcon.png',
						navUrl: ''
					},
					{
						id: 4,
						isCanClick: true,
						isShow: false,
						status: 3, // 1 跳转 路径 2 显示弹窗 3 立即提现
						name: '立即提现',
						icon: config.staticUrl + 'lijitixian.png',
						navUrl: ''
					}
				],
				userInfo: {
					avatarUrl: '',
					nickName: '昵称'
				}, //用户 信息 头像 昵称
				allAccountMoney: 0, // 累计获得多少钱
				totalPrizeNum: 0, // 获取丹麦旅游

				WXGuidanceOperationIsShow: false, //引导操作  是否展示
				WXGuidanceOperationType: '2', // 引导操作类型 1:位置授权 2：个人信息授权
				WXGuidanceOperationShowData: {
					wxTitle: '获取你的昵称、头像、地区及性别',
					wxMes: '获取昵称，头像可以给你提供更好的服务',
					wxButton: '进行授权',
				}, // 引导操作 展示文字
				isShowTixian: false, //是否展示 提现 当 totalMoney>0
				scrollViewHeight:''
			};
		},
		async onLoad() {
			// 获取用户信息 openid seesion_key
			const backGetUserDataFun = await getUserDataFun();
			const that = this;
			// 已授权的 进入回显头像
			uni.getStorage({
				key: 'userInfo',
				success: function(res) {
					const userInfo = res.data;
					that.userInfo.avatarUrl = userInfo.avatarUrl;
					that.userInfo.nickName = userInfo.nickName;
					that.WXGuidanceOperationIsShow = false;
				},
				fail: function(res) {
					// 没有头像
					that.userInfo.avatarUrl = '';
					that.userInfo.nickName = '昵称';
					console.log('显示授权引导弹窗！');
					that.WXGuidanceOperationIsShow = true;
				}
			});
			
			wx.createSelectorQuery()
				.select('#personalCenter')
				.boundingClientRect()
				.select('#wr-center-top')
				.boundingClientRect()
				.exec(function(res) {
					const scrollViewHeight = parseFloat(res[0].height - res[1].height-60).toFixed(2);
					// const scrollViewHeight = 480;
					console.log(res);
					console.log(scrollViewHeight);
					that.scrollViewHeight = scrollViewHeight || 237;
				});
		},
		onHide() {
			this.activityRuleIsShow = false;
		},
		onShow() {
			// 获取展示 信息
			this.init();
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
				title: '皇冠丹麦曲奇',
				path: '/pages/personalCenter/personalCenter',
				imageUrl: this.staticUrl + 'fenxiangImg.png'
			};
		},

		methods: {
			init() {
				queryUserHomePage().then(res => {
					if (res) {
						// 累计红包 金额
						const resreply = res.reply;
						this.allAccountMoney = String(resreply.allAccountMoney);
						// 获取丹麦旅游
						this.totalPrizeNum = String(resreply.totalPrizeNum);
						getApp().globalData.przieUserData = res;

						//是否展示 提现 当 totalMoney>0
						if (resreply.totalMoney > 0 && resreply.totalMoney) {
							this.isShowTixian = true;
						} else {
							this.isShowTixian = false;
							
							this.pctList = this.pctList.slice(0, 3);
						}
						console.log('this.isShowTixian');
						console.log(this.isShowTixian);
					} else {
						this.allAccountMoney = 0;
						// 获取丹麦旅游
						this.totalPrizeNum = 0;
						// 查询信息失败 不显示 提现
						this.isShowTixian = false;
						// 目前 先这样处理 有两处用到
						this.pctList = this.pctList.slice(0, 3);
					}
				});
			},
			/**
			 * 获取用户信息
			 */
			// getUserInfoFn() {
			// 	getUserInfo().then(res => {
			// 		const that = this;
			// 		that.userInfo.avatarUrl = res.userInfo.avatarUrl;
			// 		that.userInfo.nickName = res.userInfo.nickName;
			// 	});
			// },
			// 列表展示
			listNav(navData) {
				const getNavData = navData;
				const that = this;
				console.log(navData);
				if (getNavData.isCanClick) {
					if (getNavData.status == 1) {
						// 跳转
						uni.navigateTo({
							url: getNavData.navUrl
						});
					} else if (getNavData.status == 2) {
						// 显示弹窗
						that.activityRuleIsShow = true;
						that.isStartAnimation = true;
						// 	// 活动规则 启动动画
						that.$refs.activityRuleChild.isStartAnimationFun(true);
					} else if (getNavData.status == 3) {
						// 提现
						that.giveSpackTxFun();
					}
				}
			},
			// 开启活动 活动规则
			updateActivityRuleColse(data) {
				const that = this;
				that.activityRuleIsShow = false;
			},
			// 跳转红包记录页面
			goWinningRecord() {
				uni.navigateTo({
					url: '../winningRecord/winningRecord'
				})
			},
			// 如果中出大奖 点击 进入 填写信息页面 默认展示信息
			// 跳转红包记录页面
			goSubmitUserInfor() {
				// 当 获得 大奖的次数 等于1 时候
				if (this.totalPrizeNum == 1) {
					// 判断 是否过期 
					const expireTime = getApp().globalData.przieUserData.reply.expireTime;
					const replyTime = getApp().globalData.przieUserData.replyTime;
					const expireTimeStatus = dateformatTemp(replyTime, expireTime); //返回 false 说明 当前小于活动截止时间 可以正常扫码 如果true说明当前时间大于截止时间不能扫码 跳转至二维码被扫
					console.log('判断大奖是否到期');
					console.log(expireTime);
					console.log(expireTimeStatus);
					if (getApp().globalData.przieUserData && getApp().globalData.przieUserData.reply.nickName) {
						uni.navigateTo({
							url: `../submitUserInformation/submitUserInformation?isGetPrize=true`
						})
					} else {
						if (expireTimeStatus) {
							uni.navigateTo({
								url: `../codeScanned/codeScanned?bizcode=7`
							})
						} else {
							uni.navigateTo({
								url: `../submitUserInformation/submitUserInformation?isGetPrize=false`
							})
						}
					}
				}
			},

			// 引导操作 
			WXGuidanceOperationGet() {
				this.WXGuidanceOperationIsShow = false;
			},
			WXUserInfor(userInfo) {
				console.log("userInfouserInfouserInfo");
				console.log(userInfo);
				const that = this;
				that.WXGuidanceOperationIsShow = false;
				that.userInfo.avatarUrl = userInfo.avatarUrl;
				that.userInfo.nickName = userInfo.nickName;
			},
			// 提现
			giveSpackTxFun() {
				const that = this;
				giveSpackTx().then(
					res => {
						const businessCode = res.businessCode;
						if (businessCode == 0) {
							// 提现成功
							uni.showToast({
								title: "提现成功！"
							})
							that.init(); //更新数据
						} else if (businessCode == 5) {
							uni.showModal({
								title: '提示',
								content: res.msg
							});
						} else {
							// 提现失败 提示
							// 隐藏 红包收入 图片
							const filterData = filterArr('businessCode', businessCode, giveSpackTxStatusArr)[0];
							uni.showModal({
								title: filterData.title,
								content: filterData.content
							});
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
			}

		}
	};
</script>

<style scoped lang="scss">
	button::after {
		border: none;
	}

	button {
		background-color: transparent;
		height: 113rpx;
		padding: 0;
		line-height: 113rpx;

		&.kefuBtn {
			padding-right: 8rpx;
		}
	}

	.personalCenter {
		width: 100%;
		height: 100%;
		overflow:hidden;
		background: url($crownCookiesImg+'bg2.png') no-repeat center;
		background-size: cover;
		// background-size:100% 100%;
	}
.pc-TitleImg-box{
	height: 234rpx;
}
	.pc-TitleImg {
		width: 80%;
		height: 234rpx;
		// margin-top: 128rpx;
	}

	.pct-common {
		margin: 0 30rpx 30rpx 30rpx;
		background: #fff;
		border-radius: 20rpx;
	}

	.pct-userInfor {
		position: relative;
	}

	.pct-userInfor-userImg {
		width: 154rpx;
		height: 154rpx;
		border-radius: 154rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		background: #f1f1f1;
		padding: 2rpx;

		button,
		image {
			width: 100%;
			height: 100%;
			border-radius: 154rpx;
		}
	}

	.pct-userInfor-nickName {
		position: absolute;
		left: 50%;
		bottom: -20rpx;
		text-align: center;
		font-size: 26rpx;
		color: #656565;
		transform: translateX(-50%);
	}

	.pct-tab {
		image {
			width: 40rpx;
		}

		>view {
			flex: 1;
			text-align: center;
			margin-bottom: 30rpx;

			.pct-tab-mes1 {
				font-size: 30rpx;
				color: #333333;

				text {
					font-size: 36rpx;
				}
			}

			.pct-tab-mes2 {
				font-size: 24rpx;
				color: #f20101;

				text {
					font-size: 36rpx;
				}
			}
		}
	}

	.pct-list {
		height: 130rpx;
		margin-bottom: 20rpx;

		image {
			width: 80rpx;
			height: 80rpx;
			margin-left: 48rpx;
		}

		>view {
			color: #333333;
			font-size: 32rpx;
			margin-left: 34rpx;
		}
	}

	.shuxianBox {
		position: relative;

		.hongbaoIcon {
			height: 44rpx;
		}
	}

	.danmaiIcon {
		height: 44rpx;
	}

	.shuxian {
		width: 2rpx;
		height: 76rpx;
		background: #D0D0D0;
		position: absolute;
		right: 0;
		bottom: 0;
	}
	.wrc-listBox {
		flex: 1;
	}
</style>
