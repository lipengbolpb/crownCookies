<template>
	<view class="getcash">
		<!-- 签到抽奖开关：switchTurntable 0 未开，1开启 -->
		<!-- 拆开的头部 -->
		<view class="topTip" v-if="opened && bizcode != 11 && reply.switchTurntable == '1' ">
			<view class="leftPart">
				<view class="txt1">您有<text>{{reply.surplusCount}}</text>次抽奖机会</view>
				<view class="txt2">每扫码<text>{{reply.turnaroundCount}}</text>次，将会获得<text>1</text>次抽奖机会</view>
				<view class="progress">
					<view class="hasProgress" :style="'width:' + (reply.turnaroundSignScanCount / reply.turnaroundCount >= 1 ? 1:reply.turnaroundSignScanCount / reply.turnaroundCount) * 100 + '%'">
						<view class="hasNum">{{reply.turnaroundSignScanCount}}</view>
					</view>
					<view class="fullNum">{{reply.turnaroundCount}}</view>
				</view>
			</view>
			<view class="rightPart">
				<view class="btn" @click="toLottery">点击查看</view>
			</view>
		</view>

		<!-- 未拆开的头部 v-if="!opened || bizcode == 11 || reply.switchTurntable == '0' " -->
		<view class="head" v-else>
			<image :src="imgUrl + 'cashLogo.png' " mode="widthFix" class="logo"></image>
		</view>


		<!-- 618广告宣传页面 -->
		<view class="ad618" v-show="show618 && !opened">
			<view class="shadowBox">
				<image class="ad618Img" :src=" imgUrl + '2.0/618ad.png' " mode="widthFix"></image>
				<image class="close618" @click="close618" :src=" imgUrl + '2.0/close618.png' " mode="widthFix"></image>
			</view>
		</view>

		<!-- 618淘口令  中出普通红包时 -->
		<view class="kouling" v-if="((bizcode == 0 && opened) || bizcode == 11) && !getFBcard && !useFBcard && kouling618">
			<view class="shadowBox">
				<image class="close618 vmdclose618" @click="closeTKL" :src=" imgUrl + '2.0/close618.png' " mode="widthFix"></image>
				<image v-if="istaoMember" class="memberImg" :src=" imgUrl + '2.0/618Toast.png' " mode="widthFix"></image>
				<image v-else class="eggImg" :src=" imgUrl + '2.0/taoEgg.png' " mode="widthFix"></image>
				<image class="cliptkl" @click="clipKL" :src=" imgUrl + '2.0/copytkl.png' " mode="widthFix"></image>
			</view>
		</view>

		<view class="hbBag">
			<!-- 未开红包 -->
			<view class="unopen" v-if="(bizcode==0||bizcode==7)&&!opened">
				<image :src=" imgUrl + '2.0/unOpen.png' " mode="widthFix" class="bag"></image>
				<image :src=" imgUrl + '2.0/open.png' " mode="widthFix" class="kaiBtn" :animation="animationKai" @click="open"></image>
			</view>

			<!-- 已开的中出了翻倍卡奖 -->
			<view class="cardFB" v-if="bizcode==0 && opened && getFBcard">
				<!-- <text class="jieti" > 恭喜获得健康步步高红包，下一个更高</text> -->
				<text class="jieti" v-if="scanLadderFlag == '1' "> {{ladder}}</text>

				<view class="cardInfo">
					<view class="cardTitle">
						<view class="cardName">翻倍卡</view>
						<view class="cardSku">{{reply.shortName}}</view>
					</view>
					<view class="cardBox">
						<view class="centerPart">
							<view class="cardType">红包翻倍卡</view>
							<view class="cardValue"> <text>2</text>倍</view>
						</view>
						<view class="rightPart">
							<view class="txt">有效期</view>
							<!-- <view class="useTime" v-if="reply.earnTime && reply.expireTime">{{reply.earnTime.substring(5,10).replace('-','.')}}—{{reply.expireTime.substring(5,10).replace('-','.')}}</view> -->
						</view>
					</view>
					<button class="btn" @click="smallMoneyIknow">我知道了</button>
					<view class="useWay">下一瓶扫码消费中出红包时，金额直接翻倍</view>
				</view>
				<view class="tip">奖项已存入你的账户，请到“我的”中查看</view>
			</view>

			<!-- 使用翻倍卡 金额 X2 -->
			<view class="FBcarduse" v-if="bizcode==0 && opened && useFBcard">
				<text class="jieti" v-if="scanLadderFlag == '1' "> {{ladder}}</text>
				<!-- X2的金币 -->
				<view class="fbcoin" v-show="showX2">
					<view class="bgLight" :animation="animationX2">
						<image class="x2light" :src=" imgUrl + '2.0/fbLight.png' " mode="widthFix" :animation="animationX2Light"></image>
						<image class="fadeCoin" :src=" imgUrl + '2.0/fadeCoin.png' " mode="widthFix"></image>
						<view class="double">
							<image class="fadeX2" :src=" imgUrl + '2.0/fadeX2.png' " mode="widthFix"></image>
							<image class="fadefbTxt" :src=" imgUrl + '2.0/fadefbTxt.png' " mode="widthFix"></image>
						</view>
					</view>
				</view>

				<view class="fbhb">
					<image :src=" imgUrl + '2.0/coin.png' " mode="widthFix" class="coin" :animation="animationTcoin"></image>
					<view class="hbBox">
						<view class="moneyInfo">
							<view class="money" v-show="beforeFB">{{reply.currentMoney/2}}<text>元</text></view>
							<view class="money" v-show="!beforeFB">{{reply.currentMoney}} <text>元</text></view>
						</view>
						<!-- 翻倍后出现按钮 v-show="!beforeFB"-->
						<view class="btnBox" :class="{ 'notShow': beforeFB == true }">
							<!--  大于=1元  -->
							<button class="btn" open-type="getPhoneNumber" @getphonenumber="userPhone" v-if="!hasPhone && reply.totalAccountMoney>=1">立即提现</button>
							<view class="btn" v-else-if="hasPhone && reply.totalAccountMoney>=1" @click="giveSpackTx">立即提现</view>
							<!-- <1元 -->
							<button class="btn" v-else @click="smallMoneyIknow">我知道了</button>
						</view>
						<view class="totalMoney">您的账户余额为{{reply.totalAccountMoney}}元</view>

						<view class="tip">账户余额大于1元，可直接提现</view>
					</view>
				</view>
			</view>


			<!-- 已开的普通红包奖 -->
			<view class="open" v-if="bizcode==0 && opened && !getFBcard && !useFBcard">
				<!-- <text class="jieti" > 恭喜获得健康步步高红包，下一个更高</text> -->
				<text class="jieti" v-if="scanLadderFlag == '1' "> {{ladder}}</text>

				<image :src="imgUrl + 'openBag.png' " mode="widthFix" class="openbag"></image>
				<view class="hbInfo">
					<view class="moneyBox">
						<view class="money" v-if="reply.currentMoney>0">{{reply.currentMoney}}<text>元</text></view>
						<text class="money noMoney" v-else="reply.currentMoney == 0"> 您离红包只差一点点~\n再扫一瓶试试看 </text>
					</view>
					<!--  大于=1元  -->
					<button class="btn" open-type="getPhoneNumber" @getphonenumber="userPhone" v-if="!hasPhone && reply.totalAccountMoney>=1">立即提现</button>
					<view class="btn" v-else-if="hasPhone && reply.totalAccountMoney>=1" @click="giveSpackTx">立即提现</view>
					<!-- <1元 -->
					<button class="btn" v-else @click="smallMoneyIknow">我知道了</button>

					<view class="totalMoney">您的账户余额为{{reply.totalAccountMoney}}元</view>
				</view>
				<view class="tip">
					账户余额大于1元，可直接提现
				</view>
			</view>

			<!-- 重复扫 11 -->
			<view class="open" v-else-if=" bizcode==11 ">
				<image :src="imgUrl + 'openBag.png' " mode="widthFix" class="openbag"></image>
				<view class="hbInfo">
					<view class="moneyBox">
						<text class="money replaceMoney">您已于{{reply.earnTime}}扫过这瓶酒\n并获得¥{{reply.currentMoney}}元</text>
						</text>
					</view>
					<!--  大于=1元  -->
					<button class="btn" open-type="getPhoneNumber" @getphonenumber="userPhone" v-if="!hasPhone && reply.totalAccountMoney>=1">立即提现</button>
					<view class="btn" v-else-if="hasPhone && reply.totalAccountMoney>=1" @click="giveSpackTx">立即提现</view>
					<!-- <1元 -->
					<button class="btn" v-else @click="smallMoneyIknow">我知道了</button>

					<view class="totalMoney">您的账户余额为{{totalMoney}}元</view>

				</view>
				<view class="tip">
					账户余额大于1元，可直接提现
				</view>
			</view>

		</view>

		<view class="bottom clearfix">
			<view class="rule" v-if="opened ||  bizcode == 11 " @click="toRule">活动规则</view>
			<!-- 不显示 -->
			<view class="product" v-else>
				<image :src="imgUrl + '19-2.png' " mode="widthFix" v-if="reply.skuYear == '2018' || reply.skuYear == '2019' " class="proImg"></image>
				<image :src="imgUrl + '19-1.png' " mode="widthFix" class="proImg"></image>
			</view>
		</view>

		<!-- 获得卡片-翻倍卡  -->
		<view class="getCardToast" v-show="getCard">
			<view class="toastWrap">
				<view class="cardBox">
					<view class="getTip" :animation="animationGetTxt">恭喜您获得翻倍卡</view>
					<image :src=" imgUrl + '2.0/getFBlight.png' " mode="widthFix" class="getLight" :animation="animationGetLight"></image>
					<image :src=" imgUrl + '2.0/FBcard.png' " mode="widthFix" class="card" :animation="animationData"></image>
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

		<!-- 提现success -->
		<view class="txOK" v-if="successToast">
			<view class="shadowBox">
				<view class="content">
					<image :src=" imgUrl + '2.0/txNotice.png' " class="txNotice" mode="widthFix"></image>
					<view class="tip">亲，注意聊天消息里的【服务通知】 看到这样的消息72小时内要点开收钱！</view>
				</view>
				<view class="getBtn" @click="TXiknow">知道了</view>
			</view>
		</view>

		<!-- 未关注引导 -->
		<view class="txToast" v-if="gzToast">
			<view class="toastWrap">
				<image :src="imgUrl + 'closeTel.png' " mode="widthFix" class="close" @click="closeGzTip"></image>
				<view class="txTip">
					<text v-if="reply.totalAccountMoney >= 1">
						已将账户余额中的{{reply.totalAccountMoney}}元提现完成
					</text>
				</view>
				<image :src="imgUrl + '2.0/gzToast.png' " mode="widthFix" class="tipImg"></image>

				<!-- 客服消息 -->
				<button class="kefuBtn" open-type="contact" send-message-title="畅享青啤" :send-message-path="sharePath"
				 :send-message-img="shareImg" show-message-card="true">
					<image :src="imgUrl + '2.0/copyGzh.png' " mode="widthFix" class="btn iknow"></image>
				</button>

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
		data() {
			name: 'getcash'
			return {
				bizcode: '',
				result: '',
				reply: '',
				txResult: '',
				hasPhone: false,

				cardImg: '', //获得的卡片

				imgUrl: config.staticUrl,

				sharePath: 'pages/home/home?provinceCode=LN',
				shareImg: '',

				mobileToast: false, // 手机号授权
				getCard: false, //获得集卡
				gzToast: false, //关注弹框
				opened: false, //开红包
				successToast: false, //提现成功
				totalMoney: '',
				needTx: false,
				showAd: false,

				animationData: {}, //卡的动画
				off: false,
				telNum: '',
				//阶梯提示语
				scanLadderFlag: '', // 阶梯开关
				scanLadderNum: '', // 阶梯扫码返回的次数
				ladder: '', //阶梯语

				dayScanNum: '', // 扫码的次数
				userActivityDayScanNum: '', //当前活动的扫码的次数

				animationGetTxt: {}, //文字出现消失
				animationGetLight: {}, //得到卡的背景光动画

				animationKai: {}, //点"开"按钮的动画
				kai: false,
				getFBcard: false, // 中出翻倍卡
				useFBcard: false, //使用翻倍卡
				beforeFB: true, //翻倍之前

				animationTcoin: {}, // Tcoin动画
				animationX2: {},
				showX2: false, // true x2的金币
				animationX2Light: {},

				show618: false, //展示618弹框 true 
				kouling618:false , //展示口令 true
				istaoMember:false, //展示 入会 or 淘彩蛋
			}
		},
		onLoad(options) {

			console.log(options);
			this.bizcode = options.bizcode;
			this.result = this.$store.state.sweepData.result;
			this.reply = this.$store.state.sweepData.reply;

			this.totalMoney = this.$store.state.sweepData.reply.totalAccountMoney; //账户余额提现后变动
			// this.hasPhone = this.$store.state.sweepData.reply.phonenum == undefined ? 0 : this.$store.state.sweepData.reply.phonenum,

			console.log(this.result);
			console.log(this.reply);
			console.log('openid' + this.$store.state.openid)

			console.log('sessionKey' + this.$store.state.session_key)
			this.$store.dispatch('xcxOpenidGet');

			const phone = uni.getStorageSync('tel');
			console.log(phone)
			if (phone) {
				this.hasPhone = true;
				this.telNum = phone
			} else {
				this.hasPhone = false;
				this.telNum = '';
			}

			if (this.reply.dayScanNum < 4 && new Date().getTime()>=new Date(2020,4,25).getTime() && new Date().getTime()<new Date(2020,5,21).getTime()) {
				this.show618 = true; //展示618弹框
			}
			
			if(this.bizcode == 11){
				if (this.reply.taoEasterEgg) { //是否有淘菜单口令 判断是否有淘口令弹框
				    setTimeout(() => {  //看完红包再出现淘口令 1min
				    	this.kouling618 = true;
				    }, 1000) 
				}
			}
			
			if (this.reply.taoMemberOrderFlag == '1') { //淘入会口令标志 1入会  0否
				this.istaoMember = true; // 入会
			} else if (this.reply.taoMemberOrderFlag == '0') {
				this.istaoMember = false // 彩蛋
			}
			

		},
		onUnload() {
			this.animationData = {};
			this.animationKai = {}; // 页面关闭后清空数据
			this.animationGetLight = {};
			this.animationGetTxt = {};

			this.animationTcoin = {};
			this.animationX2 = {};

			this.animationX2Light = {};
		},
		onShow() {

			var animation = uni.createAnimation({
				duration: 1000,
				timingFunction: 'ease',
			})
			this.animation = animation
			console.log(this.animation);

			// 开的动画

			if (this.needTx) {
				this.giveSpackTx();
			}

		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '青岛啤酒',
				path: '/pages/home/home',
				imageUrl: this.imgUrl + 'share.png'
			}
		},

		methods: {
			close618() { //关闭618ad
				this.show618 = false;
			},
			closeTKL() { //关闭淘口令
				this.kouling618 = false;
			},
			clipKL() {
				uni.showToast({
					title: '淘口令复制成功',
				})
				let that = this ;
				uni.setClipboardData({
					data: that.reply.taoEasterEgg, // 淘口令
					success: function(res) {
						uni.getClipboardData({
							// 这个api是把拿到的数据放到电脑系统中的
							success: function(res) {
								console.log(res.data) // data
								console.log(that.show618)
								that.kouling618 = false; //复制关闭弹窗
							}
						})
					}
				})
			},
			getFBiknow() { //中翻倍卡 知道了
				uni.switchTab({
					url: '../home/home'
				})
			},
			toLottery() { // 去抽奖
				uni.redirectTo({ //回不去了昂
					url: '../qd/qd'
				})
			},
			closeAd() { //关闭集卡宣传
				this.showAd = false;
			},

			// 定义动画内容——点击【开】按钮时
			kaiAction() {
				// 定义动画内容
				this.animation.scale(1.3).step({
						duration: 600
					})
					.scale(.8).step({
						duration: 600
					})
				// 导出动画数据传递给data层
				this.animationKai = this.animation.export();
				setTimeout(() => {
					this.getCash();
					console.log('animation End 开启红包')
				}, 1200)
			},
			// 定义动画内容——得到卡的发光动画
			lightAction() {
				// 定义动画内容  .scale(1.2) 光圈变大
				this.animation.translateY(60).rotate(240).scale(2.2).step({
						duration: 3000
					})
					.scale(0).step({
						duration: 1000
					})
				// 导出动画数据传递给data层
				this.animationGetLight = this.animation.export()
			},
			// 定义动画内容——“恭喜xxx”文字出现消失
			TxtAction() {
				// 定义动画内容
				this.animation.opacity(1).step({
						duration: 2000
					})
					.opacity(1).step({
						duration: 2000
					})
				// 导出动画数据传递给data层
				this.animationGetTxt = this.animation.export();
				setTimeout(() => {
					this.getCard = false
				}, 4000);
			},
			// 定义动画内容——翻倍卡出现时
			rotateAndScale() {
				// 定义动画内容
				this.animation.rotate(0).scale(1.1).step({
						duration: 2000
					})
					.scale(1).step({
						duration: 2000
					})
				// 导出动画数据传递给data层
				this.animationData = this.animation.export()

				setTimeout(() => {
					this.animation.scale(0).step({
						duration: 1000
					})
					this.animationData = this.animation.export()
				}, 4000);
			},

			// 使用翻倍卡时
			// 定义动画内容——T金币的动画
			TcoinAction() {
				// 定义动画内容
				this.animation.translateY(-120).step({
					duration: 2000
				})
				// 导出动画数据传递给data层
				this.animationTcoin = this.animation.export()

				setTimeout(() => { //回归原位
					this.animation.translateY(-20).step({
						duration: 400
					})
					this.animationTcoin = this.animation.export()
					this.showX2 = true;
					setTimeout(() => {
						this.X2Action();
						this.X2lightAction();
					}, 400)
				}, 2000);
			},
			// 定义动画内容——使用翻倍红包的发光动画
			X2lightAction() {
				// 定义动画内容
				this.animation.translateY(-40).rotate(180).scaleX(2.6).step({
					duration: 2000,
					transformOrigin: "50% 50% 0"
				})
				// 导出动画数据传递给data层
				this.animationX2Light = this.animation.export()
			},
			// 定义动画内容——X2金币的动画
			X2Action() {
				// 定义动画内容
				this.animation.translateY(120).scale(1).step({
					duration: 2000,
					transformOrigin: "50% 50% 0"
				})
				// 导出动画数据传递给data层
				this.animationX2 = this.animation.export()
				setTimeout(() => { //回归原位
					this.animation.translateY(240).scale(0).step({
						duration: 1000,
						transformOrigin: "50% 50% 0"
					})
					this.showX2 = false;
					this.beforeFB = false;
				}, 3000);
			},
			// 开红包
			open() {
				// 动画
				this.kaiAction();
			},
			getCash() {
				if (this.reply.taoEasterEgg) { //是否有淘菜单口令 判断是否有淘口令弹框
				    setTimeout(() => {  //看完红包再出现淘口令 1min
				    	this.kouling618 = true;
				    }, 2000)
				}
				
				if (this.bizcode == 7) {
					uni.redirectTo({
						// url: '../result/prize?bizcode=7', //去往大奖页面
					})
				} else {
					this.opened = true;
					if (this.bizcode == 11) {
						this.getCard = false; //得到卡Toast不展示出来
					} else {
						if (this.reply.allowanceAStatus == 0) { //翻倍卡  0中出  1使用
							this.getCard = true; //得到卡Toast
							this.off = true; //开启动画
							if (this.off) {
								// 使用动画
								setTimeout(() => {
									this.TxtAction();
									this.lightAction();
									this.rotateAndScale();
								}, 200)
							}
							this.off = !this.off;
							this.getFBcard = true;
							// if (this.reply.cardNo == 'A') {
							// 	this.cardImg = this.imgUrl + 'hongGet.png'
							// } else if (this.reply.cardNo == 'B') {
							// 	this.cardImg = this.imgUrl + 'fuGet.png'
							// } else if (this.reply.cardNo == 'C') {
							// 	this.cardImg = this.imgUrl + 'luGet.png'
							// } else if (this.reply.cardNo == 'D') {
							// 	this.cardImg = this.imgUrl + 'shouGet.png'
							// } else if (this.reply.cardNo == 'E') {
							// 	this.cardImg = this.imgUrl + 'xiGet.png'
							// }
						}

						if (this.reply.allowanceAStatus == 1) { //使用
							this.useFBcard = true; //使用翻倍卡
							// x2的动画
							setTimeout(() => {
								this.TcoinAction();
							}, 800)
						}

						// 添加阶梯提示语
						if (this.reply) {
							if (this.reply.scanLadderFlag) { //阶梯开关
								this.scanLadderFlag = this.reply.scanLadderFlag;
								// scanLadderFlag = 0; //默认关闭
								if (this.scanLadderFlag == '1') { //开启阶梯
									if (this.reply.scanLadderNum) { //阶梯扫码返回的次数
										this.scanLadderNum = this.reply.scanLadderNum;
									}
									switch (this.scanLadderNum) {
										case '1':
											this.ladder = '恭喜获得健康步步高红包，下一个更高';
											break;
										case '2':
											this.ladder = '恭喜获得颜值步步高红包，下一个更高';
											break;
										case '3':
											this.ladder = '恭喜获得收入步步高红包，下一个更高';
											break;
										case '4':
											this.ladder = '恭喜获得友情步步高红包，下一个更高';
											break;
										case '5':
											this.ladder = '恭喜获得爱情步步高红包，下一个更高';
											break;
										case '6':
											this.ladder = '恭喜获得事业步步高红包';
											break;
										default:
											this.ladder = '';
											break;
									}
								} else {
									this.ladder = ' ';
								}
							}
							if (this.reply.dayScanNum) { //扫码的次数
								this.dayScanNum = this.reply.dayScanNum;
							}
							if (this.reply.userActivityDayScanNum) { //当前活动的扫码的次数
								this.userActivityDayScanNum = this.reply.userActivityDayScanNum;
							}
						}
					}
				}
			},
			// 提现成功我知道了
			TXiknow() { //去往首页
				uni.switchTab({
					url: '../home/home',
				})
			},
			smallMoneyIknow() { //非提现【我知道了】
				// uni.switchTab({
				// 	url: '../home/home',
				// })
				this.ifremeber();
			},

			// 微信手机号授权 获取手机号
			userPhone(e) {
				console.log(e)
				console.log(e.detail.errMsg)
				if (e.detail.errMsg.lastIndexOf('ok') != -1) { //成功getPhone
					this.mobileToast = false; //再次授权手机hide
					//解析手机号
					if (this.$store.state.session_key) {
						this.parsePhone(e) //解析手机号码
					} else {
						this.$store.dispatch('xcxOpenidGet')
						this.parsePhone(e)
					}
					console.log(this.$store.state.session_key);
				} else { //取消
					this.mobileToast = true;
				}
			},

			async parsePhone(e) { // 解析手机号
				console.log(e)
				var params = {
					'sessionKey': this.$store.state.session_key,
					'encryptedData': e.detail.encryptedData,
					'iv': e.detail.iv,
					'provinceCode': 'lnqp'
				};
				return new Promise((resolve, reject) => {
					uni.request({
						url: 'https://xcxact.vjifen.com/api/decrypt',
						method: 'POST',
						data: params,
						success: res => {
							console.log(res.data.data.decryptData.phoneNumber);
							var phoneNumber = res.data.data.decryptData.phoneNumber;
							this.$store.commit('userPhone', phoneNumber);
							this.savePhone();
							uni.setStorageSync('tel', phoneNumber);
							this.telNum = phoneNumber
							this.hasPhone = phoneNumber == undefined ? 0 : phoneNumber
							console.log(this.hasPhone);
							if (this.hasPhone) { //有值 提现||存储手机号
								//先判断是否有hpopenid
								if (this.$store.state.hbopenid) {
									this.needTx = true;
									this.giveSpackTx(); //提现
								} else {
									this.needTx = true;
									uni.navigateTo({
										url: '../getOpenid/getOpenid?provinceCode=' + this.$store.state.provinceCode + '&type=hbopenid',
									})
									return
								}
								// this.giveSpackTx(); //提现
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
					"phonenum": this.telNum ? this.telNum : this.$store.state.phoneNumber,
					"isCaptcha": 0,
					"projectServerName": 'liaoning',
				};
				var savePhoneNumber = await post('/user/updateUserInfoMobile', params);
				console.log('savePhoneNumber');
				// uni.showModal({
				// 	title: '尊敬的用户',
				// 	content: '手机号保存成功'
				// })
			},

			/* 判断关注 */
			ifremeber(flag) {
				// vge.o3host  xt.vjifen.com
				// vge.o3host  x.vjifen.com
				let that = this;
				return new Promise((resolve, reject) => {
					uni.showLoading({
						title: '加载中',
					})
					uni.request({
						url: config.wxUrl + '/wx3/uinfo2?openid=' + that.$store.state.openid + '&appid=' + config.appid_ln,
						success: res => {
							uni.hideLoading();
							// reslove(res)
							console.log('判断关注' + res)
							if (res.data.subscribe == '0') { //未关注
								that.gzToast = true;
							} else { // == '1' 已关注用户
								if (flag == 'tx') {
									that.successToast = true;
								} else {
									setTimeout(() => {
										uni.switchTab({
											url: '../home/home',
										})
									}, 1000)
								}
							}
						},
						fail: err => {
							uni.hideLoading();
							reject('关注', err)
						}
					})
				})
			},
			async giveSpackTx() { //提现
				if (!this.$store.state.hbopenid) {
					this.needTx = true;
					uni.navigateTo({
						url: '../getOpenid/getOpenid?provinceCode=' + this.$store.state.provinceCode + '&type=hbopenid',
					})
					return
				}
				console.log(this.needTx)
				uni.showLoading({
					title: '提现中...',
				})
				const phone = uni.getStorageSync('tel');
				var params = {
					"openid": this.$store.state.openid,
					"hbopenid": this.$store.state.hbopenid,
					"phoneNumber": this.telNum,
					"projectServerName": 'liaoning',
				}
				this.txResult = await post('/gifts/getGiftspack', params);
				console.log(this.txResult);
				var jo = this.txResult;
				uni.hideLoading();
				this.needTx = false; //提现成功改变提现状态
				if (jo.result.code == '0') {
					if (jo.result.businessCode == '0') { //提现成功
						// uni.showToast({
						// 	title: '提现成功',
						// 	duration: 2000,
						// })
						this.totalMoney = 0;
						this.ifremeber('tx');

						// setTimeout(() => {
						// 	uni.switchTab({
						// 		url: '../home/home',
						// 	})
						// }, 2000)
					} else if (jo.result.businessCode == '1') {
						uni.showModal({
							title: '提示',
							content: '您的红包金额不足，再喝几瓶攒够1元发红包！',
						})
					} else if (jo.result.businessCode == '2') { //1
						uni.showModal({
							title: '提示',
							content: '呜呜，系统开了个小差，请稍后重试！',
						})
					} else if (jo.result.businessCode == '3') {
						uni.showModal({
							title: '提示',
							content: '根据国家法规对支付服务实名制的要求，请到微信中进行实名认证\n实名认证方法：进入【微信】->【我】->【钱包】->【···】->【支付管理】，即可实名认证。',
						})
					} else if (jo.result.businessCode == '4') {
						uni.showModal({
							title: '提示',
							content: '提现处理中，请稍后查看详细记录',
						})
					} else if (jo.result.businessCode == '-1') {
						uni.showModal({
							title: '提示',
							content: '系统升级中',
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
							content: jo.result.msg,
						})
					}
				} else if (jo.result.code == '-1') {
					uni.showModal({
						title: '尊敬的用户',
						content: '系统升级中...',
					})
				} else { // code!='0' 服务失败
					uni.showModal({
						title: '提示',
						content: '呜呜，服务开了个小差，请稍后重试！',
					})
				}
			},

			closeGzTip() { //关闭公众号授权弹窗
				this.gzToast = false;
				setTimeout(() => {
					uni.switchTab({
						url: '../home/home',
					})
				}, 600)
			},
			toRule() {
				if (this.reply.skuYear == '2018') {
					uni.navigateTo({
						url: '../rule/rule?skuKey=' + '2018',
					})
				} else if (this.reply.skuYear == '2019') {
					uni.navigateTo({
						url: '../rule/rule?skuKey=' + '2019',
					})
				} else if (this.reply.skuYear == '2020') {
					uni.navigateTo({
						url: '../rule/rule?skuKey=' + '2020',
					})
				}

			},
			closeMobile() { //  关闭手机号授权弹窗
				this.mobileToast = false;
			},
		}
	}
</script>

<style scoped lang="scss">
	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 1s;
	}

	button::after {
		border: none;
	}

	button {
		&.kefuBtn {
			background-color: transparent;
		}
	}

	.getcash {
		width: 100%;
		height: 100%;
		background: url('https://xcxsite.vjifen.com/v/lnqp/getcashBg.png') no-repeat top center;
		background-size: 100% 100%;
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;

		.head {
			height: 154upx; //172upx 162upx
			padding: 20upx;
			margin: 0 auto;

			.logo {
				width: 150upx;
				padding-right: 30upx;
			}
		}

		.topTip {
			//数量统计
			// margin:50rpx;
			margin: 50rpx 50rpx 20rpx;
			// padding:20rpx 16rpx 30rpx 30rpx;
			padding: 20rpx 16rpx 0rpx 30rpx;
			// height:170rpx;
			height: 160rpx;
			box-shadow: 0px -4px 5px 2px #dcdcdc;
			background: #fff;
			display: flex;
			border-radius: 10rpx;

			.leftPart {
				flex: 0 0 70%;

				/* 左侧固定70% */
				text {
					color: #009140;
				}

				.txt1 {
					font-size: 26rpx;
					color: #383838;
					padding-bottom: 34rpx;
				}

				.txt2 {
					font-size: 22rpx;
					color: #8a8a8a;
					padding-bottom: 12rpx;
				}

				.progress {
					width: 390rpx;
					height: 30rpx;
					background: #e8e8e8;
					border-radius: 30rpx;
					font-size: 22rpx;
					color: #292929;

					.hasProgress {
						border-radius: 30rpx;
						background: #009140;
						color: #fff;
						text-align: right;
						float: left;

						.hasNum {
							margin-right: 20rpx;
						}
					}

					.fullNum {
						padding-left: 104%
					}
				}
			}

			.rightPart {
				flex: 1;

				/* 随父级变化 */
				.btn {
					background: #ffea9e;
					font-size: 28rpx;
					color: #e72a2c;
					box-shadow: 0px -3px 2px #d9d9d9;
					border-radius: 30rpx;
					margin: 58rpx 0;
					text-align: center;
					line-height: 50rpx;
					z-index: 1;
				}
			}
		}

		.hbBag {
			position: relative;

			.unopen {
				.bag {
					width: 467upx;
					display: block;
					margin: 0 auto;
				}

				.kaiBtn {
					width: 260upx;
					position: absolute;
					top: 24%;
					left: 32%;
				}
			}

			.cardFB {

				//获得翻倍卡
				.cardInfo {
					background-image: url('https://xcxsite.vjifen.com/v/lnqp/2.0/getFBCard.png');
					background-size: 100% 100%;
					background-repeat: no-repeat;
					width: 512rpx;
					text-align: center;
					margin: 0 auto;

					.cardTitle {
						padding-top: 32rpx;

						.cardName {
							font-size: 55rpx;
							color: #fff;
							padding-bottom: 28rpx;
						}

						.cardSku {
							font-size: 24rpx;
							color: #ffea9e;
							padding-bottom: 34rpx;
						}
					}

					.cardBox {
						display: flex;

						.centerPart {
							flex: 0 0 100%;

							/* 左侧固定70% */
							.cardType {
								font-size: 32rpx;
								color: #333;
								margin: 50rpx 0 12rpx;
							}

							.cardValue {
								font-size: 74rpx;
								color: #189734;
								margin-bottom: 50rpx;

								text {
									font-size: 166rpx;
									font-weight: bold;
								}
							}
						}

						.rightPart {
							flex: 1;
							// font-size:30rpx;
							font-size: 22rpx;
							color: #fff;
							width: 20rpx;
							margin: 0 auto;
							line-height: 30rpx;
							position: relative;
							right: 13%;

							.txt {
								width: 40rpx;
								margin: 0 auto;
								position: relative;
								right: 20%;
							}

							.useTime {
								width: 200rpx;
								margin: 0 auto;
								// word-wrap: break-word;/*英文的时候需要加上这句，自动换行*/  
								transform: rotate(90deg);
								position: relative;
								right: 440%;
								top: 18%;
								// top: 22%;
							}
						}
					}

					.btn {
						width: 283rpx;
						margin-top: 94rpx;
						height: 58upx;
						line-height: 58upx;
						margin: 0 auto;
						background: #ffea9e;
						border-radius: 36upx;
						text-align: center;
						color: #e94746;
						font-size: 30upx;
						font-weight: bold;
						letter-spacing: 8upx;
						z-index: 1;
					}

					.useWay {
						font-size: 22rpx;
						color: #ffea9e;
						padding: 40rpx 0 30rpx;
					}
				}

				.tip {
					color: #333;
					font-size: 22upx;
					padding-top: 22upx;
					text-align: center;
				}
			}

			.FBcarduse {

				//使用翻倍卡
				.fbcoin {
					position: fixed;
					background-color: rgba(9, 9, 9, .9);
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					z-index: 2;
					transition: all 0.3s;

					.bgLight {
						width: 400px;
						// position: absolute;
						// top: 50%;
						// left: 50%;
						// -webkit-transform: translate(-50%, -50%);
						// transform: translate(-50%, -50%);
						// padding: 40upx;
						// background-image: url('https://xcxsite.vjifen.com/v/lnqp/2.0/fbLight.png');
						background-size: 100% 100%;
						background-repeat: no-repeat;
						width: 100%;
						top: 10%;
						display: flex;
						/*垂直排列*/
						flex-direction: column;
						align-items: center;
						/*由于flex-direction: column，因此align-items代表的是水平方向*/
						justify-content: center;

						/*由于flex-direction: column，因此justify-content代表的是垂直方向*/
						.x2light {
							position: relative;
							width: 100%;
							transform: scale(2);
						}

						.fadeCoin {
							width: 387rpx;
							position: absolute;
							top: 20%;
							// left: 29%;
							text-align: center;
						}

						.double {
							position: absolute;
							width: 100%;
							top: 26%;
							left: -0%;
							transform: translateY(-120);

							.fadeX2 {
								width: 149rpx;
								display: block;
								margin: 0 auto;
								padding-bottom: 20rpx;
							}

							.fadefbTxt {
								width: 525rpx;
								display: block;
								margin: 0 auto;
							}
						}
					}
				}

				.fbhb {
					background-image: url('https://xcxsite.vjifen.com/v/lnqp/2.0/fanbeiHBbg.png');
					background-size: 100% 100%;
					background-repeat: no-repeat;
					width: 467rpx;
					text-align: center;
					margin: 0 auto;

					.coin {
						width: 387rpx;
						transform: translateY(0);
					}

					.hbBox {
						background-image: url('https://xcxsite.vjifen.com/v/lnqp/2.0/fanbeiHBtop.png');
						background-size: 100% 100%;
						background-repeat: no-repeat;
						width: 467rpx;
						height: 504rpx;
						text-align: center;
						margin: 0 auto;
						position: absolute;
						top: 34%;

						.moneyInfo {
							margin-top: 34%;

							.money {
								color: #ffe59e;
								font-size: 134rpx;
								font-weight: bold;

								text {
									font-size: 60rpx;
									font-weight: normal;
								}
							}
						}

						.btnBox {
							position: relative;
							height: 56rpx;

							&.notShow {
								visibility: hidden;
							}

							&.isShow {}

							.btn {
								background: #ffea9e;
								font-size: 30rpx;
								color: #e72a2c;
								border-radius: 32rpx;
								text-align: center;
								line-height: 56rpx;
								width: 280rpx;
								margin: 0 auto;
								z-index: 1;
							}
						}

						.totalMoney {
							color: #ffe59e;
							font-size: 28rpx;
							padding: 36rpx 0 58rpx;
							// padding: 36rpx 0 68rpx;
						}

						.tip {
							color: #333;
							font-size: 22upx;
							// padding-top:22upx; 
							text-align: center;
						}
					}
				}
			}

			.open {
				color: #ffe59e;
				text-align: center;

				.jieti {
					font-size: 36rpx;
					display: block;
					color: #e94746;
					margin-top: -20px;
					// padding-bottom:20rpx;
				}

				.openbag {
					// width: 464upx;
					width: 444upx;
					margin: 0 auto;
					display: block;
					margin-bottom: 20rpx;
					margin-top: 50rpx;
				}

				.hbInfo {
					position: relative;
					bottom: 340upx;

					.moneyBox {
						padding-bottom: 20upx;

						.money {
							// font-size: 86upx;
							font-size: 76upx;

							text {
								font-size: 60upx;
							}
						}

						.noMoney {
							font-size: 40upx;
						}

						.replaceMoney {
							font-size: 24upx;
						}
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
						bottom: 6%;
						position: relative;
						z-index: 1;
					}

					.totalMoney {
						font-size: 34rpx;
						padding: 20rpx 0;
						// color: #ffe59e;
						// position: relative;
						// text-align: center;
						// bottom: 32%;
					}

				}

				.tip {
					// color: #333;
					// font-size: 26rpx;
					// padding-top: 42rpx; //54rpx
					// // position: relative;
					// // bottom: 28%;
					// // text-align: center;

					color: #333;
					font-size: 26upx;
					padding-top: 42upx;
					bottom: 258upx;
					position: absolute;
					left: 28%;
				}
			}

		}

		.bottom {
			&.clearfix:after {
				content: ".";
				height: 0;
				clear: left;
				visibility: hidden;
			}

			.rule {
				width: 40%;
				display: inline-block;
				float: left;
				margin: 0 auto;
				padding-left: 100upx;
				text-align: left;
				font-size: 32upx;
				color: #fdfdfd;
				text-decoration: underline;
				bottom: 40upx;
				position: absolute;
				letter-spacing: 6upx;
			}

			.product {
				width: 50%;
				// padding: 52upx;
				// margin: 0 auto;
				display: inline-block;
				float: right;
				text-align: right;
				padding: 20upx;
				padding-top: 0;
				position: absolute;
				bottom: 0rpx;
				right: 20rpx;
				z-index: 0;

				.proImg {
					width: 93upx;
					padding-right: 10upx;
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
					z-index: 1;
				}

				.close {
					width: 70upx;
					position: absolute;
					top: 0;
					right: 150rpx;
				}
			}
		}

		.getCardToast {
			position: fixed;
			background-color: rgba(9, 9, 9, .9);
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

				.cardBox {
					.getTip {
						font-size: 56upx;
						color: #fff;
						letter-spacing: 8rpx;
						text-align: center;
						font-weight: bold;
						width: 100%;
						padding-bottom: 80rpx;
						opacity: 0;
					}

					image {
						&.getLight {
							width: 100%;
							position: absolute;
							bottom: -40%;
						}

						&.card {
							width: 432upx;
							margin: 0 auto;
							display: block;
							transform: scale(.2);
							margin-top: -16%;
						}
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

				.content {
					.txNotice {
						width: 592rpx;
						margin: 0 auto;
					}

					.tip {
						font-size: 28rpx;
						color: #fff;
						text-align: center;
						padding: 28rpx 0 168rpx;
					}
				}

				.getBtn {
					width: 304rpx;
					height: 88rpx;
					line-height: 88rpx;
					background: #ffea9e;
					font-size: 38rpx;
					color: #e94746;
					margin: 0 auto;
					text-align: center;
					border-radius: 8rpx;
					box-shadow: -1px 0px 12px #a7a7a7;
				}
			}
		}

		.txToast {
			//提现失败
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

				.close {
					width: 70upx;
					position: absolute;
					top: -30rpx;
					right: 120rpx;
				}

				.txTip {
					// width:70%;
					margin: 0 auto;
					position: relative;
					font-size: 32upx;
					line-height: 46upx;
					color: #ffe59e;
					text-align: center;
				}

				.tipImg {
					width: 564upx;
					display: block;
					margin: 0 auto;
					padding: 52upx 0 30upx;
				}

				.btn {
					width: 394upx;
					padding: 32upx;
					margin: 0 auto;
					display: block;
					z-index: 1;
				}

				.kefuBtn {
					padding: 32upx;
					margin: 0 auto;
					display: block;
					z-index: 1;

					.kefu {
						width: 389rpx;
					}
				}
			}
		}

		.ad618 {
			//618广告
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba(0, 0, 0, 0.8);
			z-index: 999;

			.shadowBox {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				-webkit-transform: translate(-50%, -50%);
				-moz-transform: translate(-50%, -50%);
				border-radius: 10rpx;
				padding: 20rpx;
				width: 100%;

				.ad618Img {
					width: 80%;
					display: block;
					margin: 0 auto;
				}

				.close618 {
					width: 58rpx;
					display: block;
					margin: 0 auto;
					margin-top: 30rpx;
				}
			}
		}

		.kouling {
			//618淘口令
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba(0, 0, 0, 0.8);
			z-index: 999;

			.shadowBox {
				position: absolute;
				// top: 50%;
				top: 42%;
				left: 50%;
				transform: translate(-50%, -50%);
				-webkit-transform: translate(-50%, -50%);
				-moz-transform: translate(-50%, -50%);
				border-radius: 10rpx;
				padding: 20rpx;
				width: 100%;

				.close618 {
					width: 58rpx;
					top: 3%;
					right: 16%;
					position: absolute;
				}

				.memberImg {
					width: 658rpx;
					display: block;
					margin: 0 auto;
				}
                .eggImg{
					width: 630rpx;
					display: block;
					margin: 0 auto;
				}
				.cliptkl {
					width: 330rpx;
					display: block;
					margin: 0 auto;
					margin-top: -20%;
					animation: shake 2s linear both infinite;
				}
			}
		}
		@keyframes shake {
			0%,
			50%,
			100% {
				transform: rotate(0)
			}

			6%,
			32% {
				transform: rotate(10deg)
			}

			19%,
			44% {
				transform: rotate(-10deg)
			}
		}
	}
</style>
