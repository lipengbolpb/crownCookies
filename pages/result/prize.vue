<template>
	<view class="getcash">
		<view class="head">
			<image :src="imgUrl + 'cashLogo.png' " mode="widthFix" class="logo"></image>
		</view>
		<view class="open">
			<image v-if="reply.prizeType=='R'" src="/static/lnyb.png" mode="widthFix" class="openbag"></image>
			<image v-else :src="imgUrl + 'prize.png' " mode="widthFix" class="openbag"></image>
			<button class="btn"  @click="getPrize" v-show = "!getted">立即领取</button>
			<button class="btn"  @click="toHome" v-show = "getted">我知道了</button>
		</view>
		<view class="tip"> 
			重要提示：<text v-if="reply.prizeType=='R'">因银币增投奖项，兑奖截止2020年8月31日17点，</text> 中奖者需要提供完整的中奖瓶盖或拉环和个人身份证复印件供我公司或我公司委托第三方公司核实确认，中奖奖品到所在城市指定地点领取，最终解释权归青岛啤酒股份有限公司所有。
		</view>
		<view class="bottom clearfix">
			<view class="ruleBox">
				<text class="rule"  @click="toRule">活动规则</text>
				<text class="rule tel"  @click="showTel">兑奖电话</text>
			</view>
			<view class="product">
				<image :src="imgUrl + '19-2.png' " mode="widthFix" v-if="reply.skuYear == '2018' || reply.skuYear == '2019' " class="proImg"></image>
				<image :src="imgUrl + '19-1.png' " mode="widthFix" class="proImg"></image>
			</view>
		</view>
		<!-- 各地电话 -->
		<view class="telToast" v-if="telToast">
			<view class="toastWrap">
				<image :src="imgUrl + 'prizeTelClose.png' " mode="widthFix" class="close" @click="closeTel"></image>
				
				<view class="list">
					<view class="title">
						<text>城市大区</text> <text>咨询电话</text>
					</view>
					<view class='per'>
					   <text>鞍山 </text> <text class="phone" @click="callPhone('0'+ 412 +'-' + 2201124)">0412-2201124</text>
				    </view>
					<view class='per'>
					   <text>朝阳 </text> <text class="phone" @click="callPhone('0'+ 421 +'-'+ 2368822)">0421-2368822</text>
					</view>
					<view class='per'>
					   <text>大连</text> <text class="phone" @click="callPhone(18604948628)">18604948628</text>
					</view>
					<view class='per'>
					   <text>丹东</text> <text class="phone" @click="callPhone('0'+ 415 +'-' + 3107099)">0415-3107099</text>
					</view>
					<view class='per'>
					   <text>抚顺</text> <text class="phone" @click="callPhone('0'+ 24 +'-' + 57854169)">024-57854169</text>
					</view>
					<view class='per'>
					   <text>阜新</text> <text class="phone" @click="callPhone('0'+ 418 +'-' + 6643939)">0418-6643939</text>
					</view>
					<view class='per'>
					   <text>葫芦岛 </text> <text class="phone" @click="callPhone('0'+ 429 +'-' + 2891919)">0429-2891919</text>
					</view>
					<view class='per'>
					   <text>锦州 </text> <text class="phone" @click="callPhone('0'+ 416 +'-' + 3765388)">0416-3765388</text>
					</view>
					<view class='per'>
					   <text>辽阳 </text> <text class="phone" @click="callPhone('0'+ 419 +'-' + 5592877)">0419-5592877</text>
					</view>
					<view class='per'>
					   <text>瓦房店</text> <text class="phone" @click="callPhone('0'+ 411 +'-' + 85770157)">0411-85770157</text>
					</view>
					<view class='per'>
					   <text>营口 </text> <text class="phone" @click="callPhone('0'+ 417 +'-' + 2159897)">0417-2159897</text>
					</view>
					<view class='per'>
					   <text>沈阳 </text> <text class="phone" @click="callPhone('0'+ 24 +'-' + 85614804)">024-85614804</text>
					</view>
					<view class='per'>
					   <text>铁岭</text> <text class="phone" @click="callPhone('0'+ 24 +'-' + 72891919)">024-72891919</text>
					</view>
					<view class='per'>
					   <text>辽宁省区</text> <text class="phone" @click="callPhone('0'+ 24 +'-' + 31932190)">024-31932190</text>
					</view>
					
					<view class="per">
						法定节假日客服电话暂停，请您理解！
					</view>
				</view>
			</view>
		</view>
		<!-- verification.png -->
		<image  v-show = "getted" :src="imgUrl + 'getOver.png' " mode="widthFix" class="gettedPrize"></image>
		
		<!-- 表单 -->
		<view class="formToast" v-if="showForm">
			<view class="toastWrap">
				<view class="formWrap">
					<view class="rowTit">
						领奖信息
					</view>
					<view class="row">
						<text>联系人</text>
						<input type="text" placeholder="请填写联系人" placeholder-class="placeholder" class="input name" value="userName"
						 v-model="userName" auto-focus  ></input>
					</view>
					
					<view class="row">
						<text>身份证号码</text>
						<input type="text" placeholder="身份证号码" class="input idcard" placeholder-class="placeholder" maxlength="18" value="idcard"
						 v-model="idcard" ></input>
					</view>
					
					<view class="row">
						<text>联系电话</text>
						<input type="number" placeholder="手机号码" class="input tel" placeholder-class="placeholder" maxlength="11" value="mobile"
						 v-model="mobile" ></input>
					</view>
		
					<view class="row">
						<text>所在地区</text>
						<view @tap="togglePopup('bottom','popup')"  class="areaInput">
							<span v-for="(item, index) in selectList" :key="index" class="areaValue" >
								{{item.txt}}<span v-show="index == 0 || index == 1">—</span>
							</span>
						</view>
						<uni-popup ref="popup" :type="type" @change="change">
							<view class="select-border">
								<view class="headBox">
									<view class="header">
										<view class="title">
											选择地区
										</view>
										<view class="cancel-icon" @tap="cancel('popup')">
											<!-- X -->
											确认
										</view>
									</view>
									<view class="select-item">
										<view class="select-list" @tap="tabEvent(index)" :class="indexTab == index ? 'selected' : ''" v-for="(item, index) in selectList"
										 :key="index">
											{{item.txt}}
										</view>
									</view>
								</view>
								<view class="select-box">
									<view class="select-item-box">
										<!-- 省 -->
										<view class="province-box" v-show="proviceShow">
											<view class="select-list-cont" @tap="provinceEvent(item,index)" v-for="(item,index) in provinceData" :key="item.code">
												{{item.name}}<span class="check" v-show="index == checkOne">✔</span>
											</view>
										</view>
										<!-- 市 -->
										<view class="city-box" v-show="cityShow">
											<view class="select-list-cont" @tap="cityEvent(item,index)" v-for="(item,index) in cityData" :key="item.code">
												{{item.name}}<span class="check" v-show="index==checkTwo">✔</span>
											</view>
										</view>
										<!-- 区 -->
										<view class="area-box" v-show="areaShow">
											<view class="select-list-cont" @tap="areaEvent(item,index)" v-for="(item,index) in areaData" :key="item.code">
												{{item.name}}<span class="check" v-show="index==checkThree">✔</span>
											</view>
										</view>
									</view>
								</view>
							</view>
						</uni-popup>
					</view>
					<view class="row">
						<text>详细地址</text>
						<input type="text" placeholder="详细地址, 如街道、楼盘号等" placeholder-class="placeholder" class="input address" value="address"
						 v-model="address" ></input>
					</view>
					<view class="row clearfix">
						 <text>验证码</text>
						 <input type="number" placeholder="输入验证码" class="input code"  maxlength="4" value="yzval" v-model="yzval" ></input>
						 <view class="yzBtn" @tap="getyz">{{sec==0?'获取验证码':sec+'秒后再次获取'}}</view>
					 </view>
					<view class="choose" v-show="false">选择地址>></view>  <!-- 此次不显示地址列表 -->   
					<!-- :class="['btn',subOk?'btnOk':'']" -->
					<view class="btn btnOk"  @click="formValue">提交领奖信息</view>
				</view>
			</view>
		</view>
		<!-- 提交成功  -->
		<view class="formToast tjOk" v-if="showtjOK">
			<view class="toastWrap">
				<view class="formWrap">
					<image :src="imgUrl + 'ok.png' " mode="widthFix" class="okIcon"></image>
					<view class="tip">信息提交成功</view>
					<view class="btn btnOk" @click="iknow">我知道了</view>
				</view>
			</view>
		</view>
		
		
		<!-- 获得卡片 -->
		<view class="getCardToast" v-show="getCard">
			<view class="toastWrap">
				<view class="getTip">
					本次获得
				</view>
				<view class="cardBox"> 
					<!-- <image :src="imgUrl + 'fuGet.png' " mode="widthFix" class="card"  :animation="animationData" ></image> -->
					<image :src="cardImg" mode="widthFix" class="card" :animation="animationData"></image>
				</view>
				
				<view class="tipWord">卡片已存入您的账户中，请到集卡活动中查看</view>
				<image :src="imgUrl + 'confirm.png' " mode="widthFix" class="btn" @click="confirm"></image>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {
		get,
		post,
		config,
		idcardValidate
	} from '@/utils/api.js';
	
	import cityDatas from '../../components/city.area.js';
	import uniPopup from '../../components/uni-pop.vue';
	
	export default {
		components: {
			uniPopup
		},
		
		data() {
			name: 'prize'
			return {
				bizcode: '',
				result: '',
				reply: '',
				imgUrl: config.staticUrl,		
				telToast:false, //电话号码弹框
				
				showForm: false, // 填写表单
				showtjOK: false, // 提交成功
				// 省市区地址
				provinceData: cityDatas,
				cityData: [],
				areaData: [],
				selectList: [{
					txt: '请选择'
				}, {
					txt: '请选择'
				}, {
					txt: '请选择'
				}],
				region:'', //所在地区
				tabOne: '请选择',
				indexTab: 0,
				proviceShow: true,
				areaShow: false,
				cityShow: false,
				show: false,
				type: '',
				checkOne: null,
				checkTwo: null,
				checkThree: null,
				//地址弹框 end
				yzmRes:'',// 验证码接口数据
				sec:0,
				yzval:'',
				
				regMobile : /^1[345678]\d{9}$/, //验证手机号 原来
				// regMobile : /^1\d{10}$/, //验证手机号
				regYzcode:/^[0-9]{4}$/,  //验证 验证码格式
				getted:false, //已领取过
				
				
				getCard:false,
				animationData:{} ,//动画
				off: false,
				cardImg: '' //获得的卡片
			}
		},
		onLoad(options) {
			console.log(options);
			this.bizcode = options.bizcode;
			console.log(this.result);
			console.log(this.reply);
			console.log('openid' + this.$store.state.openid) 
			
			this.result = this.$store.state.sweepData.result;
			this.reply = this.$store.state.sweepData.reply;
			
			console.log(this.result);
			console.log(this.reply);
			// prizeType 
			
			// 获得集卡
			if(this.bizcode == 11){
				this.getCard = false; //得到卡Toast不展示出来
			} else {
				if (this.reply.cardNo) {
					this.getCard = true; //得到卡Toast
					this.off = true;  //开启动画
					if (this.off) {
						// 使用动画
						setTimeout(() => {
							this.rotateAndScale()
						},200)
					} else {
						this.norotateAndScale()
					}
					this.off = !this.off;
					if (this.reply.cardNo == 'A') {
						this.cardImg = this.imgUrl + 'hongGet.png'
					} else if (this.reply.cardNo == 'B') {
						this.cardImg = this.imgUrl + 'fuGet.png'
					} else if (this.reply.cardNo == 'C') {
						this.cardImg = this.imgUrl + 'luGet.png'
					} else if (this.reply.cardNo == 'D') {
						this.cardImg = this.imgUrl + 'shouGet.png'
					} else if (this.reply.cardNo == 'E') {
						this.cardImg = this.imgUrl + 'xiGet.png'
					}
				}
			}
			
			if(options.isWrite=="true"){
			  this.getted = true
			}
		},
		onUnload(){
			
		},
		onShow(){
			var animation = uni.createAnimation({
				duration: 1000,
				timingFunction: 'ease',
			})
			this.animation = animation
			console.log(this.animation);
		},
		/**
		* 用户点击右上角分享
		*/
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log(res.target)
			}
			return {
			  title: '青岛啤酒',
			  path: '/pages/home/home',
			  imageUrl: this.imgUrl + 'share.png'
			}
		 },
		
		methods: {
			// 得卡的弹窗关闭
			confirm() {
				this.getCard = false;
			},
			// 定义动画内容
			rotateAndScale() {
				// 定义动画内容
				this.animation.translateY(60).rotate(360).scale(3.2).step()
				// 导出动画数据传递给data层
				this.animationData = this.animation.export()
			},
			
			toHome(){
				uni.switchTab({
					url: '../home/home',
				})
			},
			// 拨打电话
			callPhone(phoneNumber) {
				console.log(phoneNumber);
			    uni.makePhoneCall({
			       phoneNumber: String(phoneNumber),
			       success: function() {
		            console.log("拨打电话成功！")
			       },
			       fail: function() {
			        console.log("拨打电话失败！")
			       }
			    })
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
			showTel(){
				this.telToast = true;
			},
			closeTel(){
				this.telToast = false;
			},
			getPrize(){
				this.showForm = true;
			},
			// 校验表单是否为空
			formValue(){
				console.log(this.userName);
				// this.userName === '' || this.userName.indexOf(' ') !== -1
				if (this.userName == '' || this.userName == undefined) {
				  uni.showModal({
					title: '提示',
					content: '请填写正确的姓名哦！~',
				  })
				  return false     
				} else if (!idcardValidate(this.idcard)) {
				  uni.showModal({
					title: '提示',
					content: '请填写正确的身份证号哦！~',
				  })
				  return
				}else if (!(this.regMobile.test(this.mobile))) {
				  uni.showModal({
					title: '提示',
					content: '请填写正确的手机号！~',
				  })
				  return  // this.address === '' || this.address.indexOf(' ') !== -1
				}else if (this.address == '' || this.address == undefined) {
				  uni.showModal({
					title: '提示',
					content: '请填写正确的详细地址哦！~',
				  })
				   return
				}else if (!(this.regYzcode.test(this.yzval))) {
				  uni.showModal({
					title: '温馨提示',
					content: '请填写正确的验证码哦！~',
				  })
				  return false
				} else {
					for(var x in this.selectList){
					   if(this.selectList[x].txt == '请选择') {//x为数组的下标
					      uni.showModal({
							title: '提示',
							content: '你还没有选择完整的所在地区信息哦~',
					      })
						  return false
					   } 
					}
				}
				this.sub_message();
			},
			
			async sub_message() {
				if (!this.reply || this.reply.prizeVcode == '' || this.reply.prizeVcode == 'undefined') {
					uni.showModal({
					  title: '提示',
					  content: '信息缺失，无法提交信息！',
					})
					return 
				}
				uni.showLoading({
					title: '提交中...',
				})
				var params = {
					"openid": this.$store.state.openid, // 
					"username": this.userName,
					"address":this.region + this.address.trim(),
					"idcard": this.idcard, // 'idcard'
					"phonenum":this.mobile,
					"prizeVcode":this.reply.prizeVcode,
					// "prizeInfoKey":this.reply.grandPrizeType,
					"captcha":this.yzval,
					"projectServerName": 'liaoning',
				};
				this.tjResult = await post('/user/savePrize', params);
				console.log(this.tjResult); // reply result replyTime
				uni.hideLoading();
				var jo = this.tjResult;
				
				if (jo.result.businessCode == 0) {
					 this.showtjOK = true;
					  setTimeout(() => {
						this.showForm = false;
						this.getted = true;  //已兑奖戳 出现  领取按钮消失
					  }, 2000)
					  this.clearForm();
				} else {
				  uni.showModal({
					title: '温馨提示',
					content: jo.result.msg,
				  })
				}
			 },
			 
			 clearForm(){  //  清空表单
			 	this.userName = '';
				this.idcard = '';
			 	this.mobile = '';
			 	this.region = '';
			 	this.address = '';
			 	this.yzval = '';
			 	this.seeInfo = false;
			 },
			// 成功后我知道了
			iknow() {
				this.showForm = false;
				this.showtjOK = false;
			},
			// 获取验证码
			async getCaptcha() {
				uni.showLoading({
					title: '获取中...',
				})
				var params = {
					"phonenum": this.mobile,
					"projectServerName": 'liaoning',
				};
				this.yzmRes = await post('/user/getCaptcha', params);
				console.log('getCaptcha' + this.yzmRes); // reply result replyTime
				uni.hideLoading();
				var jo = this.yzmRes;
				if (jo.result.businessCode == 0) {
				  this.sec = 60;
				  this.timer();
				} else {
				  uni.showModal({
				    title: '提示',
				    content: jo.result.msg,
				  })
				}
			 },
			
			getyz() {
			    if (this.sec > 0) {
			      return false;
			    }
			    if (!(/^1[34578]\d{9}$/.test(this.mobile))) {
			      uni.showModal({
			        title: '提示',
			        content: '请填写正确的手机号！~'
			      })
			    } else {
					this.getCaptcha();
					this.sec = 0;
			    }
			},
			timer() {
				let timer = null;
				if (this.stop || this.sec <= 0) {
				  this.sec = 0;
				  return false;
				}
				this.sec = this.sec - 1;
				timer = setTimeout(() => {
				  this.timer()
				}, 1000);
			},
			
			// 省市区地址
			togglePopup(type, open) {
				if(this.isDisabled == true){
					return  //不可以点击
				} else {
					this.type = type
					if (open === 'tip') {
						this.show = true
					} else {
						this.$refs[open].open()
					}
				}
			},
			cancel(type) {  //取消地选择框
				if (type === 'tip') {
					// 选择地区框消失
					this.show = false
					return		
				}
				this.$refs[type].close();
				console.log(this.selectList);
				// 校验是否没有进行选择
				for(var x in this.selectList){
					console.log('aaa')
				   if(this.selectList[x].txt == '请选择') {//x为数组的下标
				      console.log('bbb');
				      uni.showModal({
						title: '提示',
						content: '你还没有选择完整的所在地区信息哦~',
				      })
					  return
				   } else{
					   this.region = this.selectList[0].txt+this.selectList[1].txt + this.selectList[2].txt + '-';
					   console.log(this.region);
					   // console.log(this.selectList[0].txt)
					   // 选择地区框消失
					   this.show = false
					   return
				   }
				}
			},
			change(e) {
				if (e.show == true) {
					uni.hideTabBar()
				} else {
					uni.showTabBar()
				}
			},
			tabEvent(index) {
				this.indexTab = index
				if (this.indexTab == 0) {
					this.proviceShow = true
					this.cityShow = false
					this.areaShow = false
					// this.checkOne = null
					this.checkTwo = null
					this.checkThree = null
					// this.cityData = []
					this.areaData = []
					// this.selectList[0].txt = "请选择"
					this.selectList[1].txt = "请选择"
					this.selectList[2].txt = "请选择"
				} else if (this.indexTab == 1) {
					this.proviceShow = false
					this.cityShow = true
					this.areaShow = false
					// this.checkTwo = null
					this.checkThree = null
					// this.areaData = []
					// this.selectList[1].txt = "请选择"
					this.selectList[2].txt = "请选择"
				} else if (this.indexTab == 2) {
					this.proviceShow = false
					this.cityShow = false
					this.areaShow = true
				}
			},
			provinceEvent(data, index) {
				this.checkOne = index
				this.selectList[0].txt = data.name
				this.indexTab = 1
				this.proviceShow = false
				this.cityShow = true
				this.areaShow = false
				this.cityData = data.cityList
			},
			cityEvent(data, index) {
				this.checkTwo = index
				this.selectList[1].txt = data.name
				this.indexTab = 2
				this.proviceShow = false
				this.cityShow = false
				this.areaShow = true
				this.areaData = data.areaList
			},
			areaEvent(data, index) {
				this.checkThree = index
				this.selectList[2].txt = data.name
			},
		}
	}
</script>

<style scoped lang="scss">
	.getcash {
		width: 100%;
		height: 100%;
		background: url('https://xcxsite.vjifen.com/v/lnqp/getcashBg.png') no-repeat top center;
		background-size: 100% 100%;
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
		position: relative;
		.head {
			padding: 20upx;
			margin: 0 auto;
			.logo {
				width: 150upx;
				padding-right: 30upx;
			}
		}			
		.open {
			// position: relative;
			// color: #ffe59e;
			// text-align: center;
			// height:630upx;
			// top: 4%;
			
// 			position: absolute;
// 			top: 15%;
// 			left: 20%;
// 			height: 630rpx;
			position: relative;
			color: #ffe59e;
			text-align: center;
			.openbag {
				width: 464upx;
				margin: 0 auto;
				display: block;
			}
			.btn {
				width: 320rpx;
				height: 86rpx;
				line-height: 86rpx;
				margin: 0 auto;
				background: #ffea9e;
				border-radius: 36rpx;
				text-align: center;
				color: #e94746;
				font-size: 32rpx;
				font-weight: bold;
				letter-spacing: 8rpx;
				position: absolute;
				bottom: 30rpx;
				left: 50%;
				margin-left:-160rpx;
			}
		}
		.tip {
			padding:0 160upx;
			color: #333;
			font-size: 22rpx;
			text-align: center;
			
// 			bottom: 24%;
// 			position: absolute;
			margin-top:10upx;
		}	
		.bottom {
			&.clearfix:after {
				content: ".";
				height: 0;
				clear: left;
				visibility: hidden;
			}
			.ruleBox{
				bottom: 40upx;
				position: absolute;
				.rule {
					padding-left: 50upx;
					text-align: left;
					font-size: 32upx;
					color: #fdfdfd;
					text-decoration: underline;
					letter-spacing: 6upx;
				}
				.tel{
					z-index: 10;
				}
			}
			.product {
				width: 50%;
				display: inline-block;
				float: right;
				text-align: right;
				padding: 20upx;
				padding-top: 0;
				position: absolute;
				bottom: 0rpx;
				right: 20rpx;
				.proImg {
					width: 93upx;
					padding-right: 10upx;
				}
			}
		}
		.telToast {  //电话号码
			position: fixed;
			background-color: rgba(9, 9, 9, .8);
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 2;
			transition: all 0.3s;
			.toastWrap {
				width: 70%;
				// height:70%;
				position: absolute;
				top: 50%;
				left: 50%;
				-webkit-transform: translate(-50%, -50%);
				transform: translate(-50%, -50%);
				padding: 40upx;
				background: url('https://xcxsite.vjifen.com/v/lnqp/telBg.png') no-repeat top center;		
				background-size: 100% 120%;
				.close {
					width: 80upx;
					position: absolute;
					top: -80upx;
					right: 0upx;
				}
				.list{
					text-align: center;
					font-size: 26upx;
					.title{
						color:#fee9b5;
						padding:60upx 20upx 10upx;
						text{
							display: inline-block;
							width:40%;
						}
					}
					.per{
						color:#fff;
						padding:10upx;
						height: 36rpx;
						text{
							display: inline-block;
							width:40%;
						}
					}
				}
			}
		}
		.formToast {  //领取大奖表单
			position: fixed;
			background-color: rgba(9, 9, 9, .8);
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 2;
			transition: all 0.3s;
			.toastWrap {
				width: 636upx;
				position: absolute;
				top: 50%;
				left: 50%;
				-webkit-transform: translate(-50%, -50%);
				transform: translate(-50%, -50%);
				padding: 40upx;
		
				.formWrap {
					background: #fff;
					border-radius: 10upx;
					padding-bottom: 80upx;
		
					.okIcon {
						width: 140upx;
						display: block;
						margin: 0 auto;
						padding-top: 40upx;
					}
		
					.tip {
						text-align: center;
						color: #000;
						font-size: 38upx;
						line-height: 120upx;
						position: relative;
					}
		
					.rowTit {
						height: 120upx;
						line-height: 120upx;
						background: #008c39;
						text-align: center;
						letter-spacing: 8upx;
						font-size: 42upx;
						color: #fff;
					}
		
					.row {
						height: 120upx;
						line-height: 120upx;
						border-bottom: 1upx solid #c3c3c3;
						color: #999;
						font-size: 28upx;
						margin: 0 20upx;
						.areaInput{
							width: 70%;
							float: left;
							height: 120rpx;
							overflow: scroll;
							.areaValue{
								text-overflow: clip;
								white-space: nowrap;
		
							}
						}
						text {
							display: inline-block;
							float: left;
							width: 30%;
						}
		
						.input {
							width: 70%;
							float: left;
							height: 120upx;
							line-height: 120upx;
						}
						.code{
							width:30%;
						}
						.yzBtn{
							width: 40%;
							font-size: 24rpx;
							color: #008c39;
							// border-left: 1rpx solid #008c39;
							text-align: center;
							z-index: 10;
							position: absolute;
							right: 30upx;
							line-height: 120upx;
						}	
					}
		
					.choose {
						color: #008c39;
						font-size: 26upx;
						text-align: right;
						padding: 30upx 20upx 0 0;
					}
		
					.btn {
						width: 340upx;
						height: 80upx;
						line-height: 80upx;
						border-radius: 50upx;
						margin: 0 auto;
						display: block;
						background: #b8b8b8;
						color: #fff;
						text-align: center;
						margin-top: 40upx;
		
						&.btnOk {
							background: #008c39;
						}
					}
				}
			}
		}
		
		.getCardToast {  //获得集卡
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
		
				.getTip,
				.tipWord {
					width: 70%;
					margin: 0 auto;
					position: relative;
					font-size: 40upx;
					line-height: 46upx;
					color: #fff5aa;
					text-align: center;
					font-weight: bold;
				}
		
				.tipWord {
					font-size: 26upx;
					padding: 30upx 0;
				}
		        .cardBox{
					width: 416upx;
					height: 540rpx;
					margin: 0 auto;
					padding-top: 100rpx;
					image {
						display: block;
						margin: 0 auto;
						padding: 32upx;
						&.card {
							// width: 416upx;
							width: 116upx;
							padding-bottom: 32upx;
						}
					}
				}
				.btn {
					width: 260upx;
					padding-top: 0;
					margin: 0 auto;
					display: block;
				}
			}
		}
		
		.gettedPrize{
			width:240upx;
			position: absolute;
			top: 20%;
			left: 50%;
		}
		.headBox {
			position: fixed;
			top: 0;
			width: 100%;
			background: #fff;
			z-index: 2;
		}
		
		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			// padding: 35upx;
			padding: 20upx;
			padding-bottom: 0;
			height: 40rpx;
		}
		
		.title {
			font-size: 34upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
		}
		
		.cancel-icon {
			font-size: 34upx;
			color: rgba(153, 153, 153, 1);
		}
		
		.check {
			padding-left: 17upx;
			// color: #FF7E28;
			color: #008737;
		}
		
		.select-box {
			height: 200upx;
			// height: 1024upx;
			height: 200rpx;
			top: 200rpx;
			position: relative;
		}
		
		.select-item {
			display: flex;
			align-items: center;
			padding-left: 50upx;
			margin-bottom: 20upx;
			border-bottom: 1px solid #F6F6F6;
		}
		
		.select-list {
			// width: 120upx;
			// height:120upx;
			text-align: center;
			// overflow: hidden;
			/*超出部分隐藏*/
			text-overflow: ellipsis;
			/* 超出部分显示省略号 */
			white-space: nowrap;
			/*规定段落中的文本不进行换行 */
			font-size: 30upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #008737;
			// color: rgba(51, 51, 51, 1);
			margin-right: 30upx;
			border-bottom: 1px solid #FFFFFF;
		}
		
		.select-list-cont {
			padding-left: 67upx;
			font-size: 30upx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			line-height: 40px;
		}
		
		.selected {
			// border-bottom: 1px solid #F0AD4E;
			// color: rgba(255, 133, 0, 1);
			border-bottom: 1px solid #008737;
			color: #008737;
		}
		
		.select-border {
			height: 600upx;
		}
	}
</style>
