<template>
	<view class="hbWrap">
		<view class="title">
			<view class="txt">
				<text>红包余额\n <text class="restMoney">{{restMoney}}</text>元</text>
				<view class="totalMoney">累计获得 ¥{{totalMoney}}元</view>
			</view>
			<view class="tx">
				<!--  大于=1元  -->
				<button class="btn" open-type="getPhoneNumber" v-if="!hasPhone" @getphonenumber="userPhone">立即提现</button>
				<view class="btn" v-else-if="hasPhone"  @click="giveSpackTx" >立即提现</view>
				<!-- <image :src="imgUrl + 'bagTX.png' " mode="widthFix" @click="tx"></image> -->
			</view>
		</view>
		<view v-if="moneyList && moneyList.length" class="list" v-for="(item, index) in moneyList" :key="index">
			<view class="listLeft">
				<text v-if="item.giftsName == '已发红包'">
					<text class="list-title" v-if="item.extractStatus == '0' ">
						提现成功 \n
					</text>
					<text class="list-title" v-if="item.extractStatus == '1' ">
						提现失败_金额已退还 \n
					</text>
					<text class="list-title" v-if="item.extractStatus == '2' ">
						提现处理中 \n
					</text>
				</text>

				<text class="list-title" v-else>
					{{item.giftsName}} \n
				</text>

				<text class="list-time">
					{{item.earnTime}}
				</text>
			</view>
			<view class="listRight">
				<text class="list-money">
					<text v-if=" item.giftsName == '扫码中奖' || item.giftsName == '签到红包' ||  item.giftsName == '集卡红包'  ||  item.giftsName == '翻倍红包'  ||  item.giftsName == '抽奖红包' ||  item.giftsName == '翻倍卡' ">+</text>
					<text v-if=" item.giftsName == '已发红包' ">
						<text v-if=" item.extractStatus == '0' ||   item.extractStatus == '2' ">-</text>
					</text>
					<text v-if="item.extractStatus == '1'">
						<!-- 不加不减 -->
					</text>
					{{item.earnMoney}} <text class="unit">元</text>
				</text>
			</view>
		</view>
		<view class="hb-more" v-if="more" @click="getMore">
			<p>加载更多</p>
		</view>
		<view class="no-data" v-if="!more">
			<p>仅显示近30天的记录</p>
		</view>

		<view class="no-data" v-if="noData">
			<p>您还没有红包记录哦~</p>
		</view>

		<!-- 提现后提示框 -->
		<!-- 提现success -->
		<view class="txOK" v-if="successToast">
			<view class="shadowBox">
				<view class="content">
					<image  :src=" imgUrl + '2.0/txNotice.png' " class="txNotice" mode="widthFix"></image>
					<view class="tip">亲，注意聊天消息里的【服务通知】 看到这样的消息72小时内要点开收钱！</view>
				</view>
				<view class="getBtn"  @click="iknow">知道了</view>
			</view>	
		</view>
		
		<!-- 提现fail -->
		<view class="txToast fail" v-if="failToast">
			<view class="toastWrap failToast">
				<image :src="imgUrl + 'warn.png' " mode="widthFix" class="warn"></image>
				<view class="txTip failTip">
					账户余额大于1元才可提现
				</view>
				<image :src="imgUrl + 'ikonw.png' " mode="widthFix" class="btn failKnow" @click="failIknow"></image>
			</view>
		</view>

		<!-- 手机号授权 -->
		<view class="mobileToast" v-if="mobileToast">
			<view class="toastWrap">
				<image :src="imgUrl + 'telToast.png' " mode="widthFix" class="txTip"></image>
				<!-- <view class="btn" @click="authorTel">再次授权</view> -->
				<button open-type="getPhoneNumber" @getphonenumber="userPhone" class="btn againGetPhone">再次授权</button>
				<image :src="imgUrl + 'closeTel.png' " mode="widthFix" class="close" @click="closeMobile"></image>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		get,
		post,
		config
	} from '@/utils/api.js';
	export default {
		name: 'hbList',
		data() {
			return {
				txnum:'',
				currentPage: 1,
				count:10,
				nextPage: false,
				hbMore: false,
				more:false,
				noData: false,

				imgUrl: config.staticUrl,
				moneyList: [],
				restMoney: 0.00,
				totalMoney: 0.00,
				needTx:false,
				hasPhone: false,
				mobileToast:false,//手机号再次授权

				successToast: false,
				failToast: false,
				hbListRes: '',


			}
		},
		onLoad() {
			const phone = uni.getStorageSync('tel');
			console.log(phone);
			if(phone){
				this.hasPhone = true
			} else {
				this.hasPhone = false
			}
			this.hbList();
		},
		onShow(){
			if(this.needTx) {
				this.giveSpackTx();
			}
		},
		async onReachBottom() {
			uni.showLoading({
				title: '加载中...'
			})
			await this.getMore(); // 下一页
			uni.hideLoading();
			// uni.hideLoading();
		},
		methods: {
			// 加载更多
			async getMore(){
				this.currentPage ++;
				uni.showLoading({
					title: '加载红包列表...',
				})
				var params = {
					"openid": this.$store.state.openid, //openid
					"hbopenid": this.$store.state.hbopenid,
					"projectServerName": 'liaoning',
					"currentPage": this.currentPage,
					"count": this.count
				};
				this.hbListRes = await post('/gifts/queryAllGiftsList', params);
				console.log(this.hbListRes); // reply result replyTime
				var jo = this.hbListRes;
				uni.hideLoading();
				
				if (jo.result.code == '0') {
					if (jo.result.businessCode == '0') {
						this.moneyList = this.moneyList.concat(jo.reply.objList); ////红包列表
						if(this.count > jo.reply.objList.length ){
							this.more = false;
						} else {
							this.more = true;
						}
						console.log(this.moneyList)
						
					} else if (jo.result.businessCode == '2') { //无红包记录
						this.noData = true;
					} else { //businessCode:1失败
						uni.showModal({
							title: '尊敬的用户',
							content: '呜呜，系统开了个小差，请稍后重试！',
						})
					}
				} else { //code!='0'
					uni.showModal({
						title: '尊敬的用户',
						content: '呜呜，系统开了个小差，请稍后重试！',
					})
				}
			},
			// 红包列表
			async hbList() {
				uni.showLoading({
					title: '加载红包列表...',
				})
				var params = {
					"openid": this.$store.state.openid, //openid
					"hbopenid": this.$store.state.hbopenid,
					"projectServerName": 'liaoning',
					"currentPage": this.currentPage,
					"count": this.count
				};
				this.hbListRes = await post('/gifts/queryAllGiftsList', params);
				console.log(this.hbListRes); // reply result replyTime
				var jo = this.hbListRes;
				uni.hideLoading();

				if (jo.result.code === '0') {
					if (jo.result.businessCode === '0') {
						this.restMoney = (Number(jo.reply.totalMoney)).toFixed(2); //账户余额
						this.txnum = (Number(jo.reply.totalMoney)).toFixed(2);
						this.totalMoney = (Number(jo.reply.totalMoney) + Number(jo.reply.giftsMoney)).toFixed(2) //累计红包
						this.moneyList = jo.reply.objList; //红包列表
						if(this.count > jo.reply.objList.length ){
							this.more = false;
						} else {
							this.more = true;
						}
						console.log(this.moneyList)
					} else if (jo.result.businessCode === '2') { //无红包记录
						this.restMoney = '0.00';
						this.totalMoney = '0.00';
						this.noData = true;
					} else { //businessCode:1失败
						uni.showModal({
							title: '尊敬的用户',
							content: '呜呜，系统开了个小差，请稍后重试！',
						})
					}
				} else { //code!='0'
					uni.showModal({
						title: '尊敬的用户',
						content: '呜呜，系统开了个小差，请稍后重试！',
					})
				}
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
								if(this.restMoney >= 1){
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
				if (this.restMoney >= 1) {
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
					if (jo.result.code == '0') {
						if (jo.result.businessCode == '0') {
							// uni.showModal({
							// 	title: '尊敬的用户',
							// 	content: '提现成功',
							// })
							this.successToast = true;
							this.restMoney = 0;
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
								content:jo.result.msg,
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
					} else { //code!='0' 服务失败
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
				this.hbList();
				// uni.switchTab({
				// 	url:'../mine/mine'
				// })
			},
			// 失败的弹框
			failIknow() {
				this.failToast = false;
			},

		}
	}
</script>

<style scoped lang="scss">
	.hbWrap {
		width: 100%;
		height: 100%;
		/* 扩散形状圆形 半径大小(到最近的边) at 圆心位置在50px*² , 起始渐变色 起始渐变位置, 结束渐变色 结算渐变位置 */
		// background-image: radial-gradient(circle closest-side at 50px 50px,#c9151e 20px, #c9151e 70px) ;
		background-size: 100%;
		display: flex;
		flex-direction: column;
		height: 100vh;

		.title {
			position: relative;
			// height: 188upx;
			background: url('https://xcxsite.vjifen.com/v/lnqp/bagBg.png') no-repeat top left;
			background-size: 100% auto;
			-webkit-background-size: 100% auto;
			padding: 24upx 160upx 30upx 24upx;

			.txt {
				font-size: 24upx;
				color: #fff;
				width: 50%;
				padding-left: 170upx;
				display: inline-block;
				float: left;

				text {
					display: inline-block;

					&.restMoney {
						font-size: 36upx;
						color: #fbed81;
						font-weight: bolder;
					}

					&.totalMoney {
						padding-top: 16upx;
					}
				}
			}

			.tx {
				width: 40%;
				position: absolute;
				top: 30%;
				right: 0%;
				float: right;

				image {
					width: 190upx;
					display: inline-block;
					float: right;
				}

				.btn {
					width: 80%;
					background-image: linear-gradient(to right, #85c343, #ead040);
					border-radius: 66upx;
					text-align: center;
					color: #fff;
					font-size: 32upx;
					font-weight: bold;
					letter-spacing: 8upx;
					height: 80rpx;
					line-height: 80rpx;
				}
			}
		}

		.list {
			height: 122upx;
			background: #fff;
			border-bottom: 1upx solid #ccc;
			margin: 0 36upx;

			.listLeft {
				width: 60%;
				padding-top: 6upx;
				display: inline-block;

				.list-title {
					font-size: 28upx;
					color: #333;
					font-weight: bold;
				}

				.list-time {
					font-size: 20upx;
					color: #484848;
				}
			}

			.listRight {
				width: 40%;
				display: inline-block;
				float: right;
				text-align: right;
				line-height: 122upx;

				.list-money {
					font-size: 36upx;
					color: #009140;
					font-weight: bolder;

					.unit {
						font-size: 24upx;
					}
				}
			}
		}

		.no-data,
		.hb-more {
			text-align: center;
			padding: 40upx 0;

			p {
				color: #ccc;
			}
		}

		.txToast {  //提现失败
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
				text-align: center;
				&.failToast {
					width: 626upx;
					height: 540upx;
					background: #fff;
					border-radius: 10upx;
					padding: 40upx 0;

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
					box-shadow: -1px 0px 12px #a7a7a7;
				}
			}
		}

		.mobileToast {
			//手机号再次授权
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
	}

	// .card-content {
	// 	display: flex;
	// 	flex-direction: row;
	// 	justify-content: space-between;
	// 	align-items: center;
	// 	padding: 20upx;
	// }
</style>
