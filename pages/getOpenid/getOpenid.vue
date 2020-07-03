<template>
	<view>
		<web-view :src="url" :webview-styles="webviewStyles" @message='getOpenid'></web-view>
	</view>
</template>

<script>
	import {
		get,
		post,
		config
	} from '@/utils/api.js';
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				type:'', //用户openid、红包openid
				url: '',
				appid: ''
			}
		},
		onLoad(options) {
			// console.log('isIPX' + this.$store.state.isIPX);
			console.log(options);
			console.log(config.payAppid_ln)
			console.log(config.wxUrl)

			if (options && options.provinceCode) {
				if (options.provinceCode == 'LN');
				let appid = config.appid_ln;
				let payAppid = config.payAppid_ln;

				console.log(payAppid)

				if (options && options.type == 'hbopenid') {
					this.type = 'hbopenid'
                    this.url  = config.wxUrl + '/wx3/u2mpFromSg?appid=' + payAppid
					console.log(this.url)
				} else {
					this.type = 'openid'
					this.url  = config.wxUrl + '/wx3/u2mpFromSg?appid=' + appid
				}
			}
		},
		onShow() {

		},
		methods: {
			getOpenid: function(e) {
				console.log(e)
				console.log('接收的消息' + e.detail.data)
				let that = this;
				uni.showLoading({
					title: '加载中，请稍后...',
				})
				if (e.detail && e.detail.data[0].openid) {
					if (that.type == 'hbopenid') {
						// this.$store.state.hbopenid = e.detail.data[0].openid;
						let hbopenid = e.detail.data[0].openid;
						console.log(hbopenid)
						that.$store.commit('getHbopenid',hbopenid)
						console.log(hbopenid);
						uni.hideLoading();
						uni.setStorage({
							key: 'userMsg',
							data: {
								provinceCode: that.$store.state.provinceCode,
								openid: that.$store.state.openid,
								hbopenid: e.detail.data[0].openid
							},
						})
					} else {
						// that.$store.state.openid = e.detail.data[0].openid;
						let openid = e.detail.data[0].openid;
						that.$store.commit('getOpenid',openid);
						uni.hideLoading();
						uni.setStorage({
							key: 'userMsg',
							data: {
								provinceCode: that.$store.state.provinceCode,
								openid: e.detail.data[0].openid,
								hbopenid: that.$store.state.hbopenid
							},
						})
					}
				}
			}
		},
		mounted() {
			// this.getOpenid()
		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
