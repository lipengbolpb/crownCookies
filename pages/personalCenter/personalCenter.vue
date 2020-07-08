<template>
	<view class="personalCenter">
		<view class="flex-xc-yn">
			<image class="pc-TitleImg" :src="staticUrl+'baifenbaiLogo.png'" ></image>
		</view>
		<view class="pc-titleBox pct-common">
			<view class="pct-userInfor flex-xc-yn">
				<view class="pct-userInfor-userImg">
					<button class="user" open-type="getUserInfo" @getuserinfo="getUserInfoFn" withCredentials="true">
						<image class="avatar" mode="widthFix" :src="userInfo.avatarUrl || staticUrl + 'avatar.png'"></image> 
					</button>
				</view>
			</view>
			<view class="pct-tab flex-xsb-yc">
				<view class="">
					<image mode="widthFix" src="../../static/crownCookiesImg/hongbaoIcon.png"></image>
					<p class="pct-tab-mes1">累计红包金额</p>
					<p class="pct-tab-mes2">￥8.88元</p>
				</view>
				<view class="">
					<image mode="widthFix" src="../../static/crownCookiesImg/danmaiIcon.png"></image>
					<p class="pct-tab-mes1">获取丹麦旅游</p>
					<p class="pct-tab-mes2">0次</p>
				</view>
			</view>
		</view>
 
		<view class="pct-list pct-common flex-xn-yc" v-for="item in pctList" :key="item.id" @click="listNav(item)">
			<image :src="item.icon"></image>
			<view class="">{{ item.name }}</view>
		</view> 
		
		<!-- 活动规则 -->
		<activity-rule @activityRuleColse="updateActivityRuleColse" :activityRuleSource='activityRuleSource' :activityRuleIsShow='activityRuleIsShow'></activity-rule>
		
	</view>
</template>

<script>
import { get, post, config } from '@/utils/api.js';
import { bfGetUserInfo } from '@/utils/basicsFun.js';
import activityRule from '@/components/activityRule.vue';
export default {
	name: 'personalCenter',
	components: {
		activityRule
	},
	data() {
		return {
			activityRuleSource:'2',
			activityRuleIsShow:false,
			staticUrl: config.staticUrl,
			pctList: [
				{
					id: 1,
					isCanClick: true,
					status:1,// 1 跳转 路径 2 显示弹窗
					name: '查看中奖纪录',
					icon: '/static/crownCookiesImg/zhongjiangjiluIcon.png',
					navUrl: '/pages/personalCenter/winningRecord'
				},
				{
					id: 2,
					isCanClick: true,
					status:1,// 1 跳转 路径 2 显示弹窗
					name: '输入序列号抽奖',
					icon: '/static/crownCookiesImg/xuliehaoIcon.png',
					navUrl: '/pages/personalCenter/strCode'
				},
				{
					id: 3,
					isCanClick: true,
					status:2,// 1 跳转 路径 2 显示弹窗
					name: '活动规则',
					icon: '/static/crownCookiesImg/huodongguizeIcon.png',
					navUrl: ''
				}
			],
			userInfo:{
				avatarUrl: '',
				nickName: ''
			},
		};
	},

	async onLoad() {},

	onShow() {
		console.log(this.$store.state.staticUrl);
		const that = this;
		// 已授权的 进入回显头像
		uni.getStorage({
		  key: 'userInfo',
		  success: function(res) {
			const userInfo = res.data
		    that.userInfo.avatarUrl = res.data.avatarUrl;
		  },
		  fail: function(res) {
		    // 没有头像
			that.userInfo.avatarUrl = '' ;
		  }
		})
		
// 		// 获取openid的值  
// 		uni.getStorage({
// 			key: 'userMsg',
// 			success: function(res) {
// 				that.openid = res.data.openid
// 				console.log(that.openid);
// 				that.$store.commit('getOpenid', res.data.openid);
// 				if (!that.openid) {
// 					uni.navigateTo({
// 						url: '../getOpenid/getOpenid?provinceCode=' + 'LN' + '&type=openid',
// 					})
// 				} else {
// 					that.initData();//数据统计     
// 				}
// 			},
// 			fail: function() {
// 				if (!that.openid) {
// 					uni.navigateTo({
// 						url: '../getOpenid/getOpenid?provinceCode=' + 'LN' + '&type=openid',
// 					})
// 				}
// 				console.log(that.openid);
// 			}
// 		})
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
		// 统计数据展示
		async initData() {
			var params = {
				openid: this.$store.state.openid, // olcf0s5mCNQdBl_4sU3tXY2-Cd6g
				hbopenid: '',
				projectServerName: 'liaoning'
			};
			var jo = await post('/turnaroundDraw/queryUserHomePage', params);
			console.log('首页数据' + jo); // reply result replyTime
			if (jo.result.code == 0) {
				if (jo.result.businessCode == 0) {
					this.allAccountMoney = String(jo.reply.allAccountMoney); // 累计获得多少钱
					this.total = String(jo.reply.total); //总计喝了多少瓶
					this.totalMoney = String(jo.reply.totalMoney); //账户余额
					this.userScanMonthCount = String(jo.reply.userScanMonthCount); //本月喝了多少瓶

					this.switchTurntable = jo.reply.switchTurntable; //  0为未开，1开启
				} else {
					this.allAccountMoney = '0'; // 累计获得多少钱
					this.total = '0'; //总计喝了多少瓶
					this.totalMoney = '0'; //账户余额
					this.userScanMonthCount = '0'; //本月喝了多少瓶
					// uni.showModal({
					//   title: '提示',
					//   content: jo.result.msg,
					// })
				}
			} else {
				uni.showModal({
					title: '提示',
					content: jo.result.msg
				});
			}
		},
		/**
		 * 获取用户信息
		 */
		getUserInfoFn() {
			bfGetUserInfo().then((res)=>{
				const that = this;
				that.userInfo.avatarUrl = res.userInfo.avatarUrl;
				that.userInfo.nickName = res.userInfo.nickName;
			});
		},
		cardSwiper(e) {
			this.cardCur = e.detail.current;
		},
		
		listNav(navData){
			const getNavData = navData;
			const that = this;
			console.log(navData);
			if(getNavData.isCanClick){
				if(getNavData.status==1){
					// 跳转 
					uni.navigateTo({
						url: getNavData.navUrl
					});
				} else {
					// 显示弹窗 
					that.activityRuleIsShow = true;
				}
			}
		},
		
		updateActivityRuleColse(data){
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
	background-size:cover ;
	// background-size:100% 100%;
}
.pc-TitleImg{
	width: 80%;
	height:234rpx;
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
	background: #F1F1F1;
	padding:2rpx;
	button,image {
		width: 100%;
		height: 100%;
		border-radius: 154rpx; 
	}
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
