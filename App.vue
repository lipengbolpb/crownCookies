<script>
	import Vue from 'vue';
	import {
		get,
		post,
		config
	} from '@/utils/api.js';
	export default {
		onLaunch: function() {
			// console.log('App Launch');
			// 判断设备是否为 iPhone X
			this.checkIsIPhoneX();
			// 获取用户信息
			uni.getSetting({
				success: res => {
					if (res.authSetting['scope.userInfo']) {
						// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
						uni.getUserInfo({
							success: res => {
								// 可以将 res 发送给后台解码出 unionId
								var userInfo = res.userInfo;
								this.$store.commit('getUserInfo', userInfo)
								// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
								// 所以此处加入 callback 以防止这种情况
								if (this.userInfoReadyCallback) {
									this.userInfoReadyCallback(res)
								}
							}
						})
					}
				}
			})
			const updateManager = uni.getUpdateManager()

			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				console.log('版本', res.hasUpdate)
			})

			updateManager.onUpdateReady(function() {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate()
						}
					}
				})
			})
			updateManager.onUpdateFailed(function() {
				// 新版本下载失败
			})
			
			uni.getSystemInfo({
				success: function(e) {
					
					uni.setStorage({
						key:"userSystemInfo",
						data:e
					})
					
					// getApp().globalData.userSystemInfo = e;
					
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
			
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		
			
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
					
					Vue.prototype.windowHeight = e.windowHeight;
					console.log('可使用窗口高度:',e.windowHeight);
					
				}
			})
		},

		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			checkIsIPhoneX: function() {
				const self = this;
				uni.getSystemInfo({
					success: function(res) {
						console.log("getSystemInfo")
						console.log(res)
						// 根据 model 进行判断
						if (res.model.search('iPhone X') != -1) {
							self.$store.commit('isIPX', true)
						}
						// 或者根据 screenHeight 进行判断
						// if (res.screenHeight == 812) {
						//   self.globalData.isIPX = true
						// }
					}
				})
			}
		},
		
	}
</script>

<style>
	/*每个页面公共css */
	page {
		height: 100%;
		-webkit-overflow-scrolling: touch;
	}
	.page-template{
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.page-template-wrap{
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
	}
	.page-template-wrap-center{
		width: 100%;
		/* 没有导航 用1334 有导航用 1334-底部导航高度 */
		height: 1334rpx;
		/* height: 1234rpx; */
		overflow: hidden;
		position: absolute;
		top: 50%;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%);
	}
	/* 
	*  x 代表水平方向 y垂直方向
	*  c 居中 （垂直居中、水平居中）
	*  n 不做控制
	*  sb 水平 两端对齐，项目之间的间隔都相等。
	*  */
	/* 水平不做控制 垂直不做控制  */
	.flex-xn-yn{
		display: -webkit-flex; /* Safari */
		display: flex;
	}
	/* 水平居中 垂直不做控制  水平排列*/
	.flex-xc-yn{
		display: -webkit-flex; /* Safari */
		display: flex;
		justify-content:center;
		-webkit-justify-content:center;
	}
	/* 水平不做控制 垂直居中  水平排列*/
	.flex-xn-yc{
		display: -webkit-flex; /* Safari */
		display: flex;
		align-items: center;
		-webkit-align-items: center;
	}
	/* 水平居中 垂直居中  水平排列*/
	.flex-xc-yc{
		display: -webkit-flex; /* Safari */
		display: flex;
		justify-content: center;
		-webkit-justify-content: center;
		align-items: center;
		-webkit-align-items: center;
	}
	/* 水平两端对齐，项目之间的间隔都相等  垂直居中  */
	.flex-xsb-yc{
		display: -webkit-flex; /* Safari */
		display: flex;
		justify-content:space-between;
		-webkit-justify-content:space-between;
		align-items:center;
		-webkit-align-items:center;
	}
	/* 水平两端对齐，项目之间的间隔都相等  垂直居中  */
	.flex-xsb-yn{
		display: -webkit-flex; /* Safari */
		display: flex;
		justify-content:space-between;
		-webkit-justify-content:space-between;
	}
	/* 水平 从右到左  */
	.flex-xR-yn{
		display: -webkit-flex; /* Safari */
		display: flex;
		-webkit-flex-direction:space-between;
		flex-direction:row-reverse;
	}
	/* 垂直 从上到下  */
	.flex-xn-ys{
		display: -webkit-flex; /* Safari */
		display: flex;
		-webkit-flex-direction:column;
		flex-direction:column;
	}
	/*   多个 盒子上下排列 水平居中 垂直居中*/
	.flex-xc-yc-dirY{
		display: -webkit-flex; /* Safari */
		display: flex;
		-webkit-flex-direction:column;
		flex-direction:column;
		justify-content: center;
		-webkit-justify-content: center;
		align-items: center;
		-webkit-align-items: center;
	}
	/*   多个 盒子上下排列 水平居中 垂直从上到下*/
	.flex-xc-ys-dirY{
		display: -webkit-flex; /* Safari */
		display: flex;
		-webkit-flex-direction:column;
		flex-direction:column;
		align-items: center;
		-webkit-align-items: center;
	}
	
	image{
		height: auto;
	}
</style>
