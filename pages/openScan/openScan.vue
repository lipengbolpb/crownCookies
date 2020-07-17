<template>
	<div></div>
</template>

<script>
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
					uni.redirectTo({
					  url: '../activityEntrance/activityEntrance?q=' + encodeURIComponent(res.result),
					  complete() {
					  	getApp().globalData.openQrcode = false
					  }
					})
				},
				fail:function (res){
					uni.switchTab({
					  url: '../home/home',
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
