<template>
	<view class="personalCenter">
		<image src="../../static/lnbar0603.png"></image>
		<view class="pc-titleBox pct-common">
			<view class="pct-userInfor flex-xc-yn">
				<view class="pct-userInfor-userImg"><p>上传图片</p></view>
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
		
		<view class="pct-list pct-common flex-xn-yc" v-for="item in pctList" wx-key="index">
			<image :src="item.icon"></image>
			<view class="">{{ item.name }}</view>
		</view>
		
	</view>
</template>

<script>
import { get, post, config } from '@/utils/api.js';
export default {
	name: 'personalCenter',
	data() {
		return {
			// staticUrl: config.staticUrl,
			staticUrl: '../../static/crownCookiesImg/',
			pctList: [
				{
					id: 1,
					isCanClick: true,
					name: '查看中奖纪录',
					icon: '../../static/crownCookiesImg/zhongjiangjiluIcon.png',
					url: ''
				},
				{ 
					id: 2,
					isCanClick: true,
					name: '输入序列号抽奖',
					icon: '../../static/crownCookiesImg/xuliehaoIcon.png', 
					url: '' ,
				},
				{
					id: 3,
					isCanClick: true,
					name: '活动规则',
					icon: '../../static/crownCookiesImg/huodongguizeIcon.png',
					url: ''
				}
			]
		};
	},

	async onLoad() {},

	onShow() {
		console.log(this.$store.state.staticUrl);
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

	mounted() {},
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
			let that = this;
			uni.getUserInfo({
				success: function(res) {
					console.log(res.userInfo);
					that.userInfo.avatarUrl = res.userInfo.avatarUrl;
					that.userInfo.nickName = res.userInfo.nickName;
					// 存储头像
					uni.setStorage({
						key: 'userInfo',
						data: res.userInfo
					});
				}
			});
		},
		cardSwiper(e) {
			this.cardCur = e.detail.current;
		},
		scanGetInfo() {
			uni.navigateTo({
				url: './scanPrize'
			});
		},
		brandStory() {
			uni.navigateTo({
				url: './brandStory'
			});
		},
		brandActive() {
			uni.switchTab({
				url: '../brandActive/brandActive'
			});
		},
		proBuy() {
			uni.navigateTo({
				url: './proOrder'
			});
		},
		game() {
			uni.navigateTo({
				url: './game?switchTurntable=' + this.switchTurntable
			});
		}
	}
};
</script>

<style scoped lang="scss">
.personalCenter {
	width: 100%;
	height: 100%;
	overflow-y: scroll;
	background: #f1f1f1;
}
.pct-common {
	margin: 0 30rpx 30rpx 30rpx;
	background: #fff;
	border-radius: 20rpx;
}
.pct-userInfor-userImg {
	width: 160rpx;
	height: 160rpx;
	border-radius: 80rpx;
	background: #f1f1f1;
	position: relative;
	margin-top: 20rpx;
	margin-bottom: 20rpx;
	p {
		width: 160rpx;
		text-align: center;
		display: inline;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		font-size: 28rpx;
		color: #999999;
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
