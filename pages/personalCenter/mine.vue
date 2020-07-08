<template>
	<view class="mine">
		<view class="status_bar" :style="[{'height': customBarH + 'px', 'padding-top': statusBarH + 'px','line-height':customBarH - statusBarH + 'px'}]">我的</view>
		<!-- 账户数据 -->
		<view class="account">
			<view class="left">
				<view class="num">
					<view class="data"><text>{{allAccountMoney}}</text>元</view>
					<view class="tit">累计获得</view>
				</view>
			</view>
			<view class="center">
				<button  class="user" open-type="getUserInfo" @getuserinfo="getUserInfoFn" withCredentials="true">
					<image class="avatar" :src="userInfo.avatarUrl || imgUrl + '2.0/avatar.png'"></image>
				</button>
				
				<!-- <view class="txBtn">立即提现</view> -->
				<view class="tx">
					<button class="txBtn" open-type="getPhoneNumber" v-if="!hasPhone" @getphonenumber="userPhone">立即提现</button>
					<view class="txBtn" v-else-if="hasPhone"  @click="giveSpackTx" >立即提现</view>
				</view>
				
			</view>
			<view class="right">  
				<view class="num">
					<view class="data"><text>{{totalMoney}}</text>元</view>
					<view class="tit">账户余额</view>
				</view>
			</view>
		</view>
		<!-- 我的卡包 -->
		<view class="cards">
			<view class="title">我的卡包</view>
			<view class="box">
				<image :src=" imgUrl + '2.0/fanbeiCard.png' " mode="widthFix"  class="item"  @click="toFanbei"></image>
				<image :src=" imgUrl + '2.0/miandanCard.png' " mode="widthFix"  class="item" @click="toMiandan"></image>
				<image :src=" imgUrl + '2.0/youhuiCard.png' " mode="widthFix"  class="item"  @click="toYouhui"></image>
			</view>
		</view>

		<view class="list">
			<view class="li" @click="toBag">
				<view class="tubiao">
					<image :src=" imgUrl + '2.0/hongbao-icon.png' " mode="widthFix" class="icon"></image>
				</view>
				<text class="txt">红包记录</text>
				<image :src=" imgUrl + '2.0/jiantou.png' " mode="widthFix" class="more"></image>
			</view>
			
			<view class="li" @click="toPrize">
				<view class="tubiao">
					<image :src=" imgUrl + '2.0/jiangpin-icon.png' " mode="widthFix" class="icon"></image>
				</view>
				<text class="txt">中奖奖品</text>
				<image :src=" imgUrl + '2.0/jiantou.png' " mode="widthFix" class="more"></image>
			</view>
			<view class="li" >
				<!-- @click="toKefu"   bindcontact="handleContact" -->
				<button class="kefuBtn" open-type="contact" send-message-title="畅享青啤" :send-message-path="sharePath"
				      :send-message-img="shareImg" show-message-card="true">
					<view class="tubiao">
						<image :src=" imgUrl + '2.0/guanzhu-icon.png' " mode="widthFix" class="icon"></image>
					</view>
					<text class="txt">关注公众号</text>
					<image :src=" imgUrl + '2.0/jiantou.png' " mode="widthFix" class="more"></image>
				</button>
			</view> 
			<view class="li" @click="toStrcode">
				<view class="tubiao">
					<image :src=" imgUrl + '2.0/chuanma-icon.png' " mode="widthFix" class="icon"></image>
				</view>
				<text class="txt">串码领奖</text>
				<image :src=" imgUrl + '2.0/jiantou.png' " mode="widthFix" class="more"></image>
			</view>
			<view class="li" @click="toRule" >
				<view class="tubiao">
					<image :src=" imgUrl + '2.0/guize-icon.png' " mode="widthFix" class="icon"></image>
				</view>
				<text class="txt">活动规则</text>
				<image :src=" imgUrl + '2.0/jiantou.png' " mode="widthFix" class="more"></image>
			</view>
			<view class="li" @click="toTel" >
				<view class="tubiao">
					<image :src=" imgUrl + '2.0/tel-icon.png' " mode="widthFix" class="icon"></image>
				</view>
				<text class="txt">客服电话</text>
				<image :src=" imgUrl + '2.0/jiantou.png' " mode="widthFix" class="more"></image>
			</view>
		</view>
		
		<!-- 电话号码box -->
		<view class="telShadow" v-show="telBox">
			<view class="shadowBox">
				<image class="close" @click="telClose" :src=" imgUrl + '2.0/close.png' " mode="widthFix"></image>
				<view class="title">点击拨打客服电话</view>
				<view class="content" @click="callTel">
					<image :src=" imgUrl + '2.0/tel.png' " class="tel" mode="widthFix"></image>
					<text class="telNum">{{tel}}</text>
				</view>
			</view>	
		</view>
		
		
		<!-- 手机号再次授权 -->
		<view class="mobileToast" v-if="mobileToast">
			<view class="toastWrap">
				<image :src="imgUrl + 'telToast.png' " mode="widthFix" class="txTip"></image>
				<!-- <view class="btn" @click="authorTel">再次授权</view> -->
				<button open-type="getPhoneNumber" @getphonenumber="userPhone" class="btn againGetPhone">再次授权</button>
				<image :src="imgUrl + 'closeTel.png' " mode="widthFix" class="close" @click="closeMobile"></image>
			</view>
		</view>
		
		<!-- 新版的 提现成功 -->
		<view class="txOK" v-if="successToast">
			<view class="shadowBox">
				<view class="content">
					<image  :src=" imgUrl + '2.0/txNotice.png' " class="txNotice" mode="widthFix"></image>
					<view class="tip">亲，注意聊天消息里的【服务通知】 看到这样的消息72小时内要点开收钱！</view>
				</view>
				<view class="getBtn" @click="iknow">知道了</view>
			</view>	
		</view>
		
		<!-- 提现fail -->
		<view class="txFail" v-if="failToast">
			<view class="toastWrap failToast">
				<image :src="imgUrl + 'warn.png' " mode="widthFix" class="warn"></image>
				<view class="txTip failTip">
					账户余额大于1元才可提现
				</view>
				<image :src="imgUrl + 'ikonw.png' " mode="widthFix" class="btn failKnow" @click="failIknow"></image>
			</view>
		</view>
		
	</view>
</template>

<script>
   import {
		get,
		post,
		config,
		getGiftspack
	} from '@/utils/api.js';
	export default {
		data() {
			name: 'mine'
			return {
				imgUrl: config.staticUrl,
				
				sharePath:'pages/mine/mine?provinceCode=LN',
				shareImg:'',
				
				statusBarH: this.StatusBar,
				customBarH: this.CustomBar,
				userInfo:{
					avatarUrl: '',
					nickName: ''
				},
				telBox:false,
				tel:'024-31932190',
				
				allAccountMoney:'0', // 累计获得多少钱
				total:'0', //总计喝了多少瓶
				userScanMonthCount:'0',//本月喝了多少瓶
				totalMoney:'0',//账户余额
				
				needTx:false,
				hasPhone: false,//是否授权过手机号码
				mobileToast: false, // 手机号授权
				telNum:'',
				successToast: false,
				failToast: false,
			}
		},
		onLoad(options) {
			// const this.userInfo = uni.getStorageSync('userInfo')
			let that = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
			        console.log(res.data);
					that.userInfo = res.data
			    }
			});
			
			
		},
		
		onShow() {
			this.$store.dispatch('xcxOpenidGet'); //解析手机号码
			
			if(this.needTx) {
				console.log('aaa')
				this.giveSpackTx();
			}
			
			// 授权手机号码
			const phone = uni.getStorageSync('tel');
			console.log(phone)
			if(phone){
				this.hasPhone = true;
				this.telNum = phone
			} else {
				this.hasPhone = false;
				this.telNum = '';
			}
			
			
		    let that = this;
		    // 已授权的 进入回显头像
		    uni.getStorage({
		      key: 'userInfo',
		      success: function(res) {
		        console.log(res.data);
				var userInfo = res.data
		        that.userInfo.avatarUrl = res.data.avatarUrl;
				// that.userInfo.nickName = res.data.nickName;
		      },
		      fail: function(res) {
		        // 没有头像
		      }
		    })
			// 获取openid的值  
			uni.getStorage({
				key: 'userMsg',
				success: function(res) {
					that.openid = res.data.openid
					console.log(that.openid);
					that.$store.commit('getOpenid', res.data.openid);
					if (!that.openid) {
						uni.navigateTo({
							url: '../getOpenid/getOpenid?provinceCode=' + 'LN' + '&type=openid',
						})
					} else {
						that.initData();//数据统计     
					}
				},
				fail: function() {
					if (!that.openid) {
						uni.navigateTo({
							url: '../getOpenid/getOpenid?provinceCode=' + 'LN' + '&type=openid',
						})
					}
					console.log(that.openid);
				}
			})
		},
		methods: {
			// 统计数据展示
			async initData() {
				var params = {
					"openid": this.$store.state.openid, // olcf0s5mCNQdBl_4sU3tXY2-Cd6g
					"hbopenid":'',
					"projectServerName": 'liaoning',
				};
				var jo = await post('/turnaroundDraw/queryUserHomePage', params);
				console.log('用户数据' + jo); // reply result replyTime
				if(jo.result.code == 0){
					if (jo.result.businessCode == 0) {
					  this.allAccountMoney = jo.reply.allAccountMoney; // 累计获得多少钱
					  this.total = jo.reply.total; //总计喝了多少瓶
					  this.totalMoney = jo.reply.totalMoney;//账户余额
					  this.userScanMonthCount = jo.reply.userScanMonthCount;//本月喝了多少瓶
					} else {
					   this.allAccountMoney = '0'; // 累计获得多少钱
					   this.total = '0'; //总计喝了多少瓶
					   this.totalMoney = '0';//账户余额
					   this.userScanMonthCount = '0';//本月喝了多少瓶
					  // uni.showModal({
					  //   title: '提示',
					  //   content: jo.result.msg,
					  // })
					}
				} else {
					uni.showModal({
					  title: '提示',
					  content: jo.result.msg,
					})
				}
			},
			
			toFanbei(){
				uni.navigateTo({
					url:'./cardFanbei'
				})
			},
			toMiandan(){
				uni.navigateTo({
					url:'./cardMiandan'
				})
			},
			toYouhui(){
				uni.navigateTo({
					url:'./cardYouhui'
				})
			},
			/**
			 * 获取用户信息
			 */
			getUserInfoFn(){
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
						})
					}
				})
			},
			toBag(){
				uni.navigateTo({
					url:'../mine/hbList'
				})
			},
			toPrize(){
				uni.navigateTo({
					url:'../mine/prizeList'
				})
			},
			toKefu(){ //回复客服消息关注公众号
				
			},
			toStrcode(){
				uni.navigateTo({
					url:'../mine/strCode'
				})
			},
			toRule(){ //活动规则
				uni.navigateTo({
					url:'../rule/rule?sku='+'unYear'
				})
			},
			toTel(){
				this.telBox = true;
			},
			telClose(){
				this.telBox = false;
			},
			callTel(){
				wx.makePhoneCall({
				  phoneNumber: this.tel,
				})
			},
			
			// 微信手机号授权 获取手机号
			userPhone(e) {
				console.log(e.detail.errMsg)
				if (e.detail.errMsg.lastIndexOf('ok') != -1) { //成功
					// uni.showModal({
					// 	title: '提示',
					// 	content: '手机号授权成功',
					// })
					this.mobileToast = false; //再次授权手机hide
					//解析手机号
					if (this.$store.state.session_key) {
						this.parsePhone(e) //解析手机号
					} else {
						this.$store.dispatch('xcxOpenidGet')
						this.parsePhone(e)
					}
					console.log(this.$store.state.session_key);
				} else { //取消
					this.mobileToast = true
				}
			},
			// 解析手机号
			parsePhone(e) {
				var params = {
					'sessionKey' : this.$store.state.session_key,
					'encryptedData' : e.detail.encryptedData,
					'iv' : e.detail.iv,
					'provinceCode' : 'lnqp'
				};
				return new Promise((resolve, reject) => {
					uni.request({
						url: 'https://xcxact.vjifen.com/api/decrypt',
						method:'POST',
						data: params,
						success: res => {
							console.log(res.data.data.decryptData.phoneNumber);
							var phoneNumber =  res.data.data.decryptData.phoneNumber;
							this.$store.commit('userPhone', phoneNumber); 
							this.savePhone();
							uni.setStorageSync('tel', phoneNumber);
							// 0 false 1 true
							this.hasPhone = phoneNumber == undefined ? 1 : phoneNumber
							console.log(this.hasPhone);
							if(this.hasPhone){ //有值 提现||存储手机号
								//先判断是否有hpopenid
								if(this.totalMoney >= 1){
									if (this.$store.state.hbopenid) {
										this.needTx = true;
										this.giveSpackTx(); //提现
									} else {
										this.needTx = true;
										uni.navigateTo({
											url: '../getOpenid/getOpenid?provinceCode=' + 'LN' + '&type=hbopenid',
										})
										return 
									}
								} else {
									this.failToast = true;
								}
							}
						},
						fail: err => {
							this.hasPhone = true;
							
							uni.showModal({
								title: '提示',
								content: '解析手机号结果' + res.data
							})
							reject('decrypt', err)
							console.log(res.data)
						}
					})
				})
			},
			// 保存手机号
			async savePhone() {
				var params = {
					"openid": this.$store.state.openid,
					"projectServerName": 'liaoning',
					"phonenum": this.$store.state.phoneNumber ? this.$store.state.phoneNumber :'' ,
					"isCaptcha": 0
				};
				var savePhoneNumber = await post('/user/updateUserInfoMobile', params);
				console.log('savePhoneNumber');
				// uni.showModal({
				// 	title: 'savePhone 尊敬的用户',
				// 	content: '手机号保存成功'
				// })
			},
			closeMobile() { //  关闭手机号授权弹窗
				this.mobileToast = false;
			},
			// 提现
			async giveSpackTx() {
				if (this.totalMoney >= 1) {
					if ( !this.$store.state.hbopenid) {
						console.log(this.$store.state.hbopenid)
						this.needTx = true;
						uni.navigateTo({
							url: '../getOpenid/getOpenid?provinceCode=' + 'LN' + '&type=hbopenid',
						})
						return 
					}
					console.log(this.$store.state.hbopenid)
					console.log(this.needTx);
					uni.showLoading({
						title: '提现中',
					})
					const params = {
						"openid": this.$store.state.openid,
						"hbopenid": this.$store.state.hbopenid,
						"projectServerName": 'liaoning',
					}
					var jo = await post('/gifts/getGiftspack', params);
					console.log(jo);
					uni.hideLoading();
					
					this.needTx = false;//阻止下次进入页面直接弹出提现提示
					if (jo.result.code == '0') {
						if (jo.result.businessCode == '0') {
							// uni.showModal({
							// 	title: '尊敬的用户',
							// 	content: '提现成功',
							// })
							this.successToast = true;
							this.totalMoney = 0;
						} else if (jo.result.businessCode == '1') { //1
							uni.showModal({
								title: '尊敬的用户',
								content: '您的红包金额不足，再喝几瓶攒够1元发红包！',
							})
						} else if (jo.result.businessCode == '2') { //1
							uni.showModal({
								title: '提示',
								content: '呜呜，系统开了个小差，请稍后重试！',
							})
						} else if (jo.result.businessCode == '4') { //1
							uni.showModal({
								title: '提示',
								content: '提现处理中，请稍后查看详细记录',
							})
						} else if (jo.result.businessCode == '3') { //1
							uni.showModal({
								title: '尊敬的用户',
								content: '根据国家法规对支付服务实名制的要求，请到微信中进行实名认证。实名认证方法：进入【微信】->【我】->【钱包】->【···】->【支付管理】，即可实名认证。',
							})
						} else if (jo.result.businessCode == '-1') { //-1
							uni.showModal({
								title: '提示',
								content: '系统升级中...',
							})
						} else if (jo.result.businessCode == '-2') { //-1
							uni.showModal({
								title: '提示',
								content: '提现操作过于频繁',
							})
						} else if (jo.result.businessCode == '5') { //5
							uni.showModal({
								title: '提示',
								content: jo.result.msg,
							})
						} else {
							uni.showModal({
								title: '提示',
								content: '呜呜，系统开了个小差，请稍后重试！',
							})
						}
					} else if (jo.result.code == '-1') {
						uni.showModal({
							title: '尊敬的用户',
							content: '系统升级中...',
						})
					} else { //code!='0'
						uni.showModal({
							title: '尊敬的用户',
							content: '呜呜，服务开了个小差，请稍后重试！',
						})
					}
				} else {
					this.failToast = true;
				}
			},
			
			iknow() {
				this.successToast = false; //弹框消失
				this.initData();//金额数据统计
			},
			// 失败的弹框
			failIknow() {
				this.failToast = false;
			},
		}
	}
</script>

<style scoped lang="scss">
	button::after{
	  border:none;
	}
	button {
	  background-color: transparent;
	  height: 113rpx;
	  padding:0;
	  line-height: 113rpx;
	  &.kefuBtn{
		padding-right: 8rpx;
	  }
	}
	input{
	  outline:none;
	  border:none;
	  list-style: none;
	}
	.mine {
		// display: flex;
		// flex-direction: column;
		min-height: 100vh;
		
		// background-color: #f1f1f1;
		// background-image: linear-gradient(to bottom, rgba(255,0,0,0), #f1f1f1);
		background-image: url('https://xcxsite.vjifen.com/v/lnqp/2.0/myBg.png');
		background-size: 100% ;
		background-repeat: no-repeat;
		.status_bar{
		     text-align:center;
			 color:#fff;
			 font-size:30rpx;
			 font-weight: 600;
			 letter-spacing: 6rpx;
		} 
		.account{
			display:flex;
			width:100%;
			height:216rpx;
			position: relative;
			color:#fff;
			.left,.right{
				width: 33.33%;
				text-align: center;
				padding-top:46rpx;
				.num{
					.data{
						position: relative;
						// font-size:24rpx;
						font-size: 26rpx;
						text{
							// font-size:36rpx;
							font-size: 38rpx;
							font-weight: bold;
						}
					}
					.tit{
					    font-size:22rpx;
					}
				}
			}
			.center{
				flex: 1;
				top: -28rpx;
				position: relative;
				text-align: center;
				.avatar {
					width: 110rpx;
					height: 110rpx;
					border-radius: 50%;
					margin:0 auto;
					border: 1rpx solid #187924;
				}
				.txBtn{
					width:226rpx;
					height: 62rpx;
					font-size:28rpx;
					color:#042b00;
					text-align: center;
					line-height:60rpx;
					background: #fff;
					margin: 0 auto;
					border-radius: 12rpx;
					margin-top:58rpx;
				}
			}
		}
		.cards{
			background-image: url('https://xcxsite.vjifen.com/v/lnqp/2.0/myCardBg.png');
			background-size: 627rpx 274rpx;
			background-repeat: no-repeat;
			margin-top:42rpx;
			.title{
				font-size:32rpx;
				color:#fff;
				padding:22rpx 0 0 18rpx;
			}
			.box{
				display: flex;
				flex-flow: wrap;
				justify-content: space-between;
				padding:52rpx 36rpx 76rpx;
				.item{
					width: 202rpx;
				}
			}
		}
		.list{
			padding:56rpx 32rpx ;
			.li{
				padding:0 4rpx;
				height:106upx;
				line-height:106upx;
				border-bottom:1upx solid #609f66;
				&:nth-child(1) .icon{
					width:25rpx;
				}
				&:nth-child(2) .icon{
					width:35rpx;
				}
				&:nth-child(3) .icon{
					width:31rpx;
				}
				&:nth-child(4) .icon{
					width:30rpx;
				}
				&:nth-child(5) .icon{
					width:25rpx;
				}
				&:nth-child(6) .icon{
					width:29rpx;
				}
				.tubiao{
					width: 42rpx;
					display: inline-block;
				}
				.icon{
					width:30rpx;
					display: inline-block;
					vertical-align: middle;
					padding-right:12rpx;
				}
				.txt{
					font-size:32rpx;
					color:#fff;
					width: 90%;
					display: inline-block;
					text-align: left;
				}
				.more{
					width:16rpx;
				}
			}
		}  
	}
	
	.telShadow {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.7);
		z-index: 999;
		.shadowBox {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			-webkit-transform: translate(-50%, -50%);
			-moz-transform: translate(-50%, -50%);
			background: #fff;
			border-radius: 10rpx;
			padding: 20rpx;
			width:70%;
			.close{
				width: 52rpx;
				top: -6%;
				right: -4%;
				position: absolute;
			}
			.title{
				padding:52rpx 0 34rpx;
				font-size:36rpx;
				text-align: center;
				color:#010101;
				text-decoration:underline ;
				text-decoration-color:#136e1d;
				text-decoration-size:8rpx;
				border-bottom: 1rpx dotted #a8a8a8;
			}
			.content{
				text-align: center;
				height: 188rpx;
				line-height: 156rpx;
				.tel{
					width:43rpx;
					vertical-align: middle;
					padding-right: 20rpx;
				}
				.telNum{
					font-size:30rpx;
					color:#272727;
					text-align: center;
				}
			}
		}
	}
	
	.mobileToast {  //手机号再次授权
		position: fixed;
		background-color: rgba(9, 9, 9, .8);
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 2;
		transition: all 0.3s;
		.toastWrap {
			width: 400px;
			position: absolute;
			top: 50%;
			left: 50%;
			-webkit-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
			padding: 40upx;
			.txTip {
				width: 506upx;
				display: block;
				margin: 0 auto;
				padding-top: 20upx;
			}
	
			.btn {
				width: 380upx;
				height: 86upx;
				line-height: 86upx;
				margin: 0 auto;
				background: #ffea9e;
				border-radius: 36upx;
				text-align: center;
				color: #e94746;
				font-size: 32upx;
				font-weight: bold;
				letter-spacing: 8upx;
				position: relative;
				bottom: 90px;
			}
	
			.close {
				width: 70upx;
				position: absolute;
				top: 0;
				right: 150rpx;
			}
		}
	}
	// 提现成功
	.txOK {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.9);
		z-index: 999;
		.shadowBox {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			-webkit-transform: translate(-50%, -50%);
			-moz-transform: translate(-50%, -50%);
			.content{
				.txNotice{
					width:592rpx;
					margin: 0 auto;
				}
				.tip{
					font-size:28rpx;
					color:#fff;
					text-align:center;
					padding:28rpx 0 168rpx;
				}
			}
			.getBtn{
				width:304rpx;
				height:88rpx;
				line-height:88rpx;
				background:#ffea9e;
				font-size:38rpx;
				color:#e94746;
				margin:0 auto;
				text-align: center;
				border-radius: 8rpx;
				box-shadow: -3px 2px 8px #a7a7a7;
			}
		}
	}
	// 提现失败
	.txFail {
		position: fixed;
		background-color: rgba(9, 9, 9, .8);
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 2;
		transition: all 0.3s;
		.toastWrap {
			width: 400px;
			position: absolute;
			top: 50%;
			left: 50%;
			-webkit-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
			padding: 40upx;
			&.failToast {
				width: 626upx;
				height: 540upx;
				background: #fff;
				border-radius: 10upx;
				padding: 40upx 0;
				text-align: center;
				.warn {
					width: 144upx;
					margin: 0 auto;
					display: block;
				}
				.failTip {
					color: #333;
					font-size: 32upx;
					line-height: 40upx;
					font-weight: bold;
					padding: 100upx 0 60upx;
				}
	
				.failKnow {
					width: 364upx;
				}
			}
		}
	}
</style>
