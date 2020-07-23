<template>
	<view class="personalCenter flex-xn-ys">
		<uni-nav-bar :style="{ 'margin-top': safeAreaTop + 'px' }" title="我的账户"></uni-nav-bar>
		<view class="flex-xc-yn"><image class="pc-TitleImg" :src="staticUrl + 'baifenbaiLogo.png'"></image></view>
		<view class="pc-titleBox pct-common">
			<!-- 头部 展示 头像和昵称 -->
			<view class="pct-userInfor flex-xc-yn">
				<view class="pct-userInfor-userImg">
					<button class="user" open-type="getUserInfo" @getuserinfo="getUserInfoFn" withCredentials="true">
						<image class="avatar" mode="widthFix" :src="userInfo.avatarUrl || staticUrl + 'shangchuantouxiang.png'"></image>
					</button>
					<view class="pct-userInfor-nickName">{{ nickNameSub }}</view>
				</view>
			</view>
			<!-- 累计红包金额 获取丹麦旅游 -->
			<view class="pct-tab flex-xsb-yc">
				<view class="shuxianBox">
					<image mode="widthFix" :src="staticUrl+'hongbaoIcon.png'"></image>
					<p class="pct-tab-mes1">累计红包金额</p>
					<p class="pct-tab-mes2">￥ <text>{{ allAccountMoney }}</text> 元</p>
					<view class="shuxian"></view>
				</view>
				<view class="">
					<image mode="widthFix" :src="staticUrl+'danmaiIcon.png'"></image>
					<p class="pct-tab-mes1">获取丹麦旅游</p>
					<p class="pct-tab-mes2"><text>{{ totalPrizeNum }}</text> 次</p>
				</view>
			</view>
		</view>

		<!-- 列表 -->
		<view class="pct-list pct-common flex-xn-yc" v-for="item in pctList" :key="item.id" @click="listNav(item)">
			<image :src="item.icon"></image>
			<view class="">{{ item.name }}</view>
		</view>

		<!-- 活动规则 -->
		<activity-rule
			ref="activityRuleChild"
			@activityRuleColse="updateActivityRuleColse"
			:activityRuleSource="activityRuleSource"
			:activityRuleIsShow="activityRuleIsShow"
		></activity-rule>
		
	</view>
</template>

<script>
import { get, post, config } from '@/utils/api.js';
import { getUserInfo } from '@/common/getWxUserInfor.js';
import { queryUserHomePage } from '@/common/getData.js';
import activityRule from '@/components/activityRule.vue';
import { getUserDataFun,strSub } from '@/common/basicsFun.js';
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
export default {
	name: 'personalCenter',
	components: {
		activityRule,
		uniNavBar
	},
	computed: {
		// 当窗口 高度 大于800 是 重新 计算 盒子的上边距
		safeAreaTop() {
			const userSystemInfo = uni.getStorageSync('userSystemInfo');
			const safeAreaTop = userSystemInfo.safeArea.top;
			return safeAreaTop;
		},
		nickNameSub(){
			const initName = this.userInfo.nickName;
			const returnStr = strSub(initName,14,7,'...')
			return returnStr;
		}
	},
	data() {
		return {
			activityRuleSource: '2',
			activityRuleIsShow: false,
			isStartAnimation: false,
			staticUrl: config.staticUrl,
			pctList: [
				{
					id: 1,
					isCanClick: true,
					status: 1, // 1 跳转 路径 2 显示弹窗
					name: '查看中奖记录',
					icon: '/static/crownCookiesImg/zhongjiangjiluIcon.png',
					navUrl: '/pages/winningRecord/winningRecord'
				},
				{
					id: 2,
					isCanClick: true,
					status: 1, // 1 跳转 路径 2 显示弹窗
					name: '输入序列码抽奖',
					icon: '/static/crownCookiesImg/xuliehaoIcon.png',
					navUrl: '/pages/strCode/strCode'
				},
				{
					id: 3,
					isCanClick: true,
					status: 2, // 1 跳转 路径 2 显示弹窗
					name: '活动规则',
					icon: '/static/crownCookiesImg/huodongguizeIcon.png',
					navUrl: ''
				}
			],
			userInfo: {
				avatarUrl: '',
				nickName: ''
			}, //用户 信息 头像 昵称
			allAccountMoney: 0, // 累计获得多少钱
			totalPrizeNum: 0 // 获取丹麦旅游
		};
	},

	async onLoad() {
		// 获取用户信息 openid seesion_key
		const backGetUserDataFun = await getUserDataFun();
		
	},

	onShow() {
		// 获取展示 信息
		queryUserHomePage().then(res => {
			if (res) {
				// 累计红包 金额
				this.allAccountMoney = String(res.allAccountMoney);
				// 获取丹麦旅游
				this.totalPrizeNum = String(res.totalPrizeNum);
			} else {
				this.allAccountMoney = 0;
				// 获取丹麦旅游
				this.totalPrizeNum = 0;
			}
		});
 
		const that = this;
		// 已授权的 进入回显头像
		uni.getStorage({
			key: 'userInfo',
			success: function(res) {
				const userInfo = res.data;
				that.userInfo.avatarUrl = userInfo.avatarUrl;
				that.userInfo.nickName = userInfo.nickName;
			},
			fail: function(res) {
				// 没有头像
				that.userInfo.avatarUrl = '';
				that.userInfo.nickName = '';
			}
		});
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
			title: '皇冠曲奇',
			path: '/pages/personalCenter/personalCenter',
			imageUrl: this.staticUrl+'fenxiangImg.png'
		};
	},

	methods: {
		/**
		 * 获取用户信息
		 */
		getUserInfoFn() {
			getUserInfo().then(res => {
				const that = this;
				that.userInfo.avatarUrl = res.userInfo.avatarUrl;
				that.userInfo.nickName = res.userInfo.nickName;
				
			});
		},

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
				} else {
					// 显示弹窗
					that.activityRuleIsShow = true;
					that.isStartAnimation = true;
					// 	// 活动规则 启动动画
					this.$refs.activityRuleChild.isStartAnimationFun(true);
				}
			}
		},

		// 开启活动 活动规则
		updateActivityRuleColse(data) {
			const that = this;
			that.activityRuleIsShow = false;
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
	overflow-y: scroll;
	background: url($crownCookiesImg+'bg2.png') no-repeat center;
	background-size: cover;
	// background-size:100% 100%;
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
.pct-userInfor{
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
	> view {
		flex: 1;
		text-align: center;
		margin-bottom: 30rpx;
		.pct-tab-mes1 {
			font-size: 30rpx;
			color: #333333;
			text{
				font-size: 36rpx;
			}
		}
		.pct-tab-mes2 {
			font-size: 24rpx;
			color: #f20101;
			text{
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
	> view {
		color: #333333;
		font-size: 32rpx;
		margin-left: 34rpx;
	}
}
.shuxianBox{
	position: relative;
}
.shuxian{
	width: 2rpx;
	height: 76rpx;
	background: #D0D0D0;
	position: absolute;
	right: 0;
	bottom: 0;
}
</style>
