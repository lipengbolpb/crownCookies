<template>
	<view class="index">
		<image mode="widthFix" class="crownCookies-logo" src="../../static/crownCookiesImg/crownCookiesImgLogo.png"></image>
		<view class="index-center" :style="{ 'margin-top': isOpenAdaptation ? '254rpx' : '156rpx' }">
			<image mode="widthFix" src="../../static/crownCookiesImg/chuanquqi.png"></image>
			<image mode="widthFix" src="../../static/crownCookiesImg/baifenbai.png"></image>
		</view>
		<view class="idnex-imgMes">图片仅供参考，产品以实物为准</view>
		<image class="focusGguidance" :src="staticUrl + 'focusGguidance.png'" @click="focusGguidanceShow"></image>

		<custom-dialog
			@customDialogColse="updateCustomDialog"
			:customDialogFontCenter="customDialogFontCenter"
			:customDialogFontTitle="customDialogFontTitle"
			:customDialogIsShow="customDialogIsShow"
			:customDialogType="customDialogType"
		></custom-dialog>
	</view>
</template>

<script>
import { get, post, config } from '@/utils/api.js';
import { filterArr,getUserDataFun } from '@/common/basicsFun.js';
import { customDialog } from '@/components/customDialog.vue';
import { uniNavBar } from '@/components/uni-nav-bar/uni-nav-bar.vue';
export default {
	name: 'index',
	components: {
		customDialog,
		uniNavBar
	},
	data() {
		return {
			staticUrl: config.staticUrl,

			customDialogType: '10', // 弹窗 类型 5 关注弹窗
			customDialogIsShow: false, //  是否展示弹窗
			customDialogFontTitle: '', //  是否展示弹窗
			customDialogFontCenter: '', //  是否展示弹窗

			customDialogArr: [
				{
					bizcode: '4',
					customDialogType: '10',
					customDialogIsShow: true,
					customDialogFontTitle: '活动未开始',
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
					bizcode: 'isShowGguidance',
					customDialogType: '5',
					customDialogIsShow: true,
					customDialogFontTitle: '',
					customDialogFontCenter: ''
				}
			]
		
		};
	},
	async onLoad(options) {
	  const backGetUserDataFun = await getUserDataFun();
		
	  // businessCode 1 : 这个二维码不存在
	  // businessCode 3 : 这个二维码已过期
	  // businessCode 4 : 活动未开始
	  // businessCode 5 : 活动已截止
	  // businessCode 6 : 系统繁忙
	  // businessCode 19 : 漏码
	  // businessCode 23 : 扫码次数已达上限
	  // businessCode -1 : 系统升级中
	  // businessCode isShowGguidance : 展示 关注公众号 引导 图片
		const that = this;  
		uni.getStorage({
			key:'businessCode',
			success(businessCode) {
				console.log('businessCode-------------');
				console.log(businessCode);
				const bizcodeStatus = businessCode.data.toString();
				const filterData = filterArr('bizcode',bizcodeStatus,that.customDialogArr)[0];
				console.log("filterArr____________")
				console.log(bizcodeStatus);
				console.log(filterData);
				setTimeout(()=>{
					if(filterData){
						that.customDialogType = filterData.customDialogType; // 弹窗 类型 5 关注弹窗
						that.customDialogIsShow = filterData.customDialogIsShow; //  是否展示弹窗
						that.customDialogFontTitle = filterData.customDialogFontTitle;//  是否展示弹窗
						that.customDialogFontCenter = filterData.customDialogFontCenter; //  是否展示弹窗						
					}
				},500)
			}
		})
	},
	computed: {
		// 当窗口 高度 大于800 是 重新 计算 盒子的上边距
		isOpenAdaptation() {
			if (this.windowHeight > 700) {
				return true;
			} else {
				return false;
			}
		}
	},
	onShow() {
		console.log(this.windowHeight);
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

	methods: {
		updateCustomDialog(res) {
			console.log(res);
			this.customDialogIsShow = false;
			uni.removeStorageSync("businessCode");
		},
		focusGguidanceShow(){
			const filterData = filterArr('customDialogType','5',this.customDialogArr)[0];
			console.log("filterArr____________")
			console.log(filterData);
			this.customDialogType = filterData.customDialogType; // 弹窗类型 5 关注弹窗
			this.customDialogIsShow = filterData.customDialogType; //  是否展示弹窗
			this.customDialogFontTitle = filterData.customDialogFontTitle; //  是否展示弹窗
			this.customDialogFontCenter = filterData.customDialogFontCenter; //  是否展示弹窗
		}
	}
};
</script>
<!-- <view class="container" style="background-image:url({{imgBaseUrl}}/bg.jpg) no-repeat;background-size:cover;"></view> -->
<style lang="scss">
.index {
	width: 100%;
	height: 100%;
	background: url($crownCookiesImg+'crownCookiesImgBg.jpg') no-repeat center;
	background-size: cover;
}
.crownCookies-logo {
	width: 180rpx;
	margin-left: 54rpx;
	margin-top: 126rpx;
}
.index-center {
	margin: 156rpx 120rpx 36rpx 54rpx;
	position: relative;
	image {
		width: 100%;
	}
	image:nth-of-type(2) {
		position: absolute;
		bottom: 0;
		left: 0;
	}
}
.focusGguidance {
	position: fixed;
	bottom: 22rpx;
	width: 96%;
	left: 2%;
	height: 170rpx;
}
.idnex-imgMes {
	text-align: center;
	font-size: 24rpx;
	color: #b2bce3;
}
</style>
