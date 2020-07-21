<template>
	<!-- 中奖纪录 -->
	<view class="winningRecord flex-xn-ys">
		<uni-nav-bar :style="{ 'margin-top': safeAreaTop + 'px' }" left-icon="back" @click-left="back" title="我的中奖纪录"></uni-nav-bar>
		<view class="wr-center flex-xn-ys" id="wr-center">
			<view class="flex-xc-yn" id="wr-center-title"><image class="wrc-titleImg" :src="staticUrl + 'wodezhongjiangjilu.png'" mode="widthFix"></image></view>
			<scroll-view :style="{ height: scrollViewHeight + 'px' }" scroll-y="true" class="wrc-listBox" @scrolltolower="lower">
				<view class="wrc-listBox-list flex-xsb-yn" v-for="item in objList" :key="item.id">
					<view class="">
						<view class="wrc-listBox-list-mes">{{ item.giftsName ? item.giftsName : '扫码中奖' }}</view>
						<view class="wrc-listBox-list-time">{{ item.earnTime }}</view>
					</view>
					<view class="wrc-listBox-list-price">+{{ item.earnMoney }}</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { get, post, config } from '@/utils/api.js';
import { queryAllGiftsList } from '@/common/getData.js';
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
export default {
	name: 'winningRecord',
	components: {
		uniNavBar
	},
	computed: {
		// 当窗口 高度 大于800 是 重新 计算 盒子的上边距
		safeAreaTop() {
			const userSystemInfo = uni.getStorageSync('userSystemInfo');
			const safeAreaTop = userSystemInfo.safeArea.top;
			return safeAreaTop;
		}
	},
	data() {
		return {
			staticUrl: config.staticUrl,
			showType: false,
			objList: [], //红包列表
			moneyNext: true,
			count: 10,
			currentPage: 1,
			scrollViewHeight: '' //滚动区域的高度
		};
	},
	async onLoad() {
		this.initData();
		const that = this;
		wx.createSelectorQuery()
			.select('#wr-center')
			.boundingClientRect()
			.select('#wr-center-title')
			.boundingClientRect()
			.exec(function(res) {
				const scrollViewHeight = parseFloat(res[0].height - res[1].height).toFixed(2);
				console.log(res);
				console.log(scrollViewHeight);
				that.scrollViewHeight = scrollViewHeight;
			});
	},
	methods: {
		lower() {
			//上拉加载
			const that = this;
			console.log(that.moneyNext);
			if (that.moneyNext) {
				that.currentPage++;
				that.initData();
			} else {
				uni.showToast({
					title: '没有更多了记录了',
					icon: 'none'
				});
			}
		},
		initData() {
			const that = this;
			queryAllGiftsList(that.currentPage, that.count).then(res => {
				that.objList = res.objList;

				if (res && (!res.objList || res.objList.length < that.count)) {
					that.moneyNext = false;
				} else {
					that.moneyNext = true;
				}
				if (that.currentPage == 1) {
					that.moneyList = res.objList;
				} else {
					if (res.objList && res.objList.length > 0) {
						that.moneyList = that.moneyList.concat(res.objList);
					}
				}
				
			});
		},
		// 返回
		back() {
			uni.navigateBack(1);
		}
	}
};
</script>

<style lang="scss">
page {
	width: 100%;
	height: 100%;
}
.winningRecord {
	height: 100%;
	background: url($crownCookiesImg+'bg2.png') no-repeat center;
	background-size: cover;
}
.wr-center {
	border-radius: 20rpx;
	flex: 1;
	margin: 52rpx 30rpx 30rpx 30rpx;
	background: #fff;
	padding: 20rpx;
}
.wrc-listBox {
	flex: 1;
}
.wrc-listBox-list {
	padding: 20rpx 0;
	border-bottom: 2rpx solid #dedede;
}
.wrc-listBox-list-mes {
	margin-bottom: 10rpx;
	font-size: 32rpx;
	color: #333;
}
.wrc-listBox-list-time {
	font-size: 24rpx;
	color: #999999;
}
.wrc-listBox-list-price {
	font-size: 32rpx;
	color: #f10000;
}
.wrc-titleImg {
	width: 70%;
	margin-bottom: 20rpx;
}
</style>
