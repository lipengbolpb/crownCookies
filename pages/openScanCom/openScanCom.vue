<template>
	<div></div>
</template>

<script>
	import { config } from '@/utils/api.js';
	import { dateformat } from '@/common/basicsFun.js';
	export default {
		data() {
			return {
			}
		},
		onShow(){
			if (!getApp().globalData.openQrcode) {
			  getApp().globalData.openQrcode = true;
			  uni.scanCode({
				success: function (res) {
					console.log('条码类型：' + res.scanType);
					console.log('条码内容：' + res.result);
					uni.setStorage({
						key:"codeData",
						data:res
					})
					uni.setStorage({
						key:"sweepstr",
						data:res.result
					})
					const dateStatus =	dateformat(config.startDate);
					console.log("dateStatus");
					console.log(dateStatus);
					console.log(config.startDate);
					uni.setStorage({
						key:"dateStatus",
						data:dateStatus==true?'1':'0'
					})
					uni.setStorage({
						key:"isInitsweepstr",
						data:'true'
					})
					getApp().globalData.isInitsweepstr = 'true';
					if(!dateStatus){
						uni.switchTab({
						  url: '../index/index',
						  complete() {
						  	getApp().globalData.openQrcode = false
						  }
						})
					}else{
						console.log('../activityEntrance/activit');
						uni.redirectTo({
						  url: '../activityEntrance/activityEntrance?openScan=1&q=' + encodeURIComponent(res.result),
						  complete() {
						  	getApp().globalData.openQrcode = false
						  }
						})
					}
				},
				fail:function (res){
					console.log('我是扫一扫页面')
					console.log(res);
					uni.switchTab({
					  url: '../index/index',
					  complete() {
					  	getApp().globalData.openQrcode = false
					  }
					})
				}
			  })
			}													
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}
    .logo{
        height: 200upx;
        width: 200upx;
        margin-top: 200upx;
    }
	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
