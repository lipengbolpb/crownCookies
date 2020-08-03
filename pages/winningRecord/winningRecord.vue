
<template>
	<!-- 中奖纪录 -->
	<view class="winningRecord flex-xn-ys">
		<uni-nav-bar :style="{ 'margin-top': safeAreaTop*2 + 'rpx' }" left-icon="back" @click-left="back" title="我的中奖记录"></uni-nav-bar>
		<view class="wr-center flex-xn-ys" id="wr-center">
			<view class="flex-xc-yn" id="wr-center-title"><image class="wrc-titleImg" :src="staticUrl + 'wodezhongjiangjilu.png'" mode="widthFix"></image></view>
			<scroll-view v-if="isHasData" :style="{ height: scrollViewHeight + 'px' }" scroll-y="true" class="wrc-listBox" @scrolltolower="lower">
			<!-- <scroll-view v-if="isHasData" :style="{ height: scrollViewHeight + 'px' }" scroll-y="true" class="wrc-listBox"> -->
				<view class="wrc-listBox-list flex-xsb-yn" v-for="item in objList" :key="item.id">
					<view class="">
						<view class="wrc-listBox-list-mes">{{ item.giftsName ? item.giftsName : '扫码中奖' }}</view>
						<view class="wrc-listBox-list-time">{{ item.earnTime }}</view>
					</view>
					<view class="flex-xn-yc">
						<block v-if="item.prizeType=='P'">
							<view class="wrc-listBox-list-danmai">丹麦游一份</view>
						</block>
						<block v-else>
							<view class="wrc-listBox-list-price">¥<text>{{ item.earnMoney }}</text>元</view>
						</block>
					</view>
				</view>
				<view class="clickMore" @click="clickMore" v-show="moneyNext">
					点击加载更多
				</view>
				<view class="clickMore colorGrey" v-show="!moneyNext">
					加载完毕
				</view>
			</scroll-view> 
			
			<block v-else>
				<view class="wrc-nodata flex-xc-yc-dirY">
					<!-- <image :src="staticUrl+'wuzhongjiangjulu.png'" mode="widthFix"></image> -->
					<image src="../../static/crownCookiesImg/zanwujilu.jpg" mode="widthFix"></image>
					<view class="">暂无中奖记录，再接再厉哦～</view>
				</view>
			</block>
			
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
		isHasData(){ 
			if(this.objList.length>0){
				return true;
			}else{
				return false;
			}
			
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
			scrollViewHeight: '' ,//滚动区域的高度
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
				const scrollViewHeight = parseFloat(res[0].height - res[1].height-60).toFixed(2);
				// const scrollViewHeight = 480;
				console.log(res);
				console.log(scrollViewHeight);
				that.scrollViewHeight = scrollViewHeight;
			});
	},
	methods: {
		lower() {
			//上拉加载
			// const that = this;
			// console.log(that.moneyNext);
			// if (that.moneyNext) {
				// this.currentPage++;
			// 	that.initData();
			// } else {
			// 	uni.showToast({
			// 		title: '没有更多了记录了',
			// 		icon: 'none'
			// 	});
			// }
			// console.log(222);
			// console.log(this.moneyNext);
			// console.log(this.currentPage);
		},
		initData() {
			const that = this;
			queryAllGiftsList(that.currentPage, that.count).then(res => {
				if (res && (!res.objList || res.objList.length < that.count)) {
					that.moneyNext = false;
				} else {
					that.moneyNext = true;
				}
				if (that.currentPage == 1) {
					that.objList = res.objList;
				} else {
					if (res.objList && res.objList.length > 0) {
						console.log(2222);
						that.objList = that.objList.concat(res.objList);
					}
				} 
				console.log(that.currentPage);
				console.log(that.count);
				console.log(that.objList);
			});
		},
		clickMore(){
			const that = this;
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
	padding: 32rpx;
}
.wrc-listBox {
	flex: 1;
}
.wrc-listBox-list {
	padding: 20rpx 0;
	border-bottom: 2rpx solid #dedede;
}
.wrc-listBox-list-mes {
	margin-bottom: 16rpx;
	font-size: 32rpx;
	color: #333;
}
.wrc-listBox-list-time {
	font-size: 24rpx;
	color: #999999;
}
.wrc-listBox-list-price {
	font-size: 24rpx;
	color: #f10000;
	text{
		font-size: 36rpx;
	}
}
.wrc-listBox-list-danmai{
	font-size: 30rpx;
	color: #f10000;
}
.wrc-titleImg {
	width: 70%;
	margin-bottom: 20rpx;
}
.wrc-nodata{
	margin-top: 54%;
	transform: translateY(-50%);
	image{
		width: 100%;
	}
	view{
		font-size: 30rpx;
		color: #656565;
		margin-top: 40rpx;
	}
}
.clickMore{
	text-align: center;
	margin-top: 20rpx;
}
.colorGrey{
	color: #999999;
}
</style>