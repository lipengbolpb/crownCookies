<template>
	<view class="personalCenter">
		<view class="flex-xc-yn"><image class="pc-TitleImg" :src="staticUrl + 'baifenbaiLogo.png'"></image></view>
		<view class="pc-titleBox pct-common">
			<!-- 头部 展示 头像和昵称 -->
			<view class="pct-userInfor flex-xc-yn">
				<view class="pct-userInfor-userImg">
					<button class="user" open-type="getUserInfo" @getuserinfo="getUserInfoFn" withCredentials="true">
						<image class="avatar" mode="widthFix" :src="userInfo.avatarUrl || staticUrl + 'shangchuantouxiang.png'"></image>
					</button>
					<view class="pct-userInfor-nickName">{{ userInfo.nickName }}</view>
				</view>
			</view>
			<!-- 累计红包金额 获取丹麦旅游 -->
			<view class="pct-tab flex-xsb-yc">
				<view class="">
					<image mode="widthFix" src="../../static/crownCookiesImg/hongbaoIcon.png"></image>
					<p class="pct-tab-mes1">累计红包金额</p>
					<p class="pct-tab-mes2">￥{{ allAccountMoney }}元</p>
				</view>
				<view class="">
					<image mode="widthFix" src="../../static/crownCookiesImg/danmaiIcon.png"></image>
					<p class="pct-tab-mes1">获取丹麦旅游</p>
					<p class="pct-tab-mes2">{{ totalPrizeNum }}次</p>
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
import { getUserDataFun } from '@/common/basicsFun.js';
export default {
	name: 'personalCenter',
	components: {
		activityRule
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
					name: '查看中奖纪录',
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
			title: '青岛啤酒',
			path: '/pages/home/home',
			imageUrl: this.imgUrl + 'share.png'
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
	margin-top: 128rpx;
}
.pct-common {
	margin: 0 30rpx 30rpx 30rpx;
	background: #fff;
	border-radius: 20rpx;
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
	text-align: center;
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
		}
		.pct-tab-mes2 {
			font-size: 30rpx;
			color: #f20101;
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
</style>
