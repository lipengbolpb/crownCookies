<template>
	<view class="strCode">
		 <view class="tipBox">
			 <view class="tip" v-if='ok'>
			 	<text class="word" >
			 		青岛啤酒 \n 码上领
			 	</text>
			 </view>
			 <view class="tip" v-else>
				<view class="word-l" >
					{{title}}
					<!-- 你输入的次数太多 -->
				</view>
				<text class="word-s">{{content}}</text>
			 </view>
		 </view>
		 
		 <view class="inputBox" v-show="showForm">
			 <view class="row">
			 	<input type="text" placeholder="请输入12位字母数字瓶盖码" maxlength="12" class="input strcode" value="strcode"
			 	 v-model="strcode" auto-focus></input>
			 </view>
			 <view class="row"  v-show="status">
			 	<input type="number" placeholder="输入手机号码" class="input tel"  maxlength="11" value="mobile"
			 	 v-model="mobile"></input>
			 </view>	 
			 <view class="row"  v-show="status">
				 <input type="number" placeholder="输入验证码" class="input code"  maxlength="4" value="yzval" v-model="yzval"></input>
				 <view class="yzBtn" @tap="getyz">{{sec==0?'获取验证码':sec+'秒后再次获取'}}</view>
			 </view>			 
		 </view>
		 
		 <view class="warnTip">
			 温馨提示：先输入瓶盖二维码上方6位字符，在输入瓶盖二维码下方6位字符，输入完成后点击“领取红包”按钮
		 </view>
		 
		 <view class="btn" @click="gethb">领取红包</view>
		
		 <text class="tel">{{batch}}</text>
		 

		 <!--  第 n 次点击弹出 授权地理位置 -->
		 <view class="opensetting" v-if="needLocation && !againClick">
		 	<view class="head">
		 		<!-- 小程序的logo和名字 -->
		 		<image :src=" imgUrl + 'xcxLogo.jpg' " mode="widthFix" class="headimg"></image>
		 		<text>畅享青啤</text> <text>申请</text>
		 		<image :src="imgUrl + 'icon_close_1.png' " @click="cancel" mode="widthFix" class="close"></image>
		 	</view>
		 	<view class="content">
		 		<text>获取您的地理位置信息</text>
		 		<text>获取地理位置可以给你提供更好的服务</text>
		 	</view>
		 	<button class="set" @click="openset" >进行授权</button>
		 </view>
		 
		 <view class="location_fail" v-if="ydLocation">
		 	<image :src=" imgUrl + 'location.png' " mode="widthFix"></image>
		 	<button @click="closeLocationTip"></button>
		 </view>
	</view>
</template>

<script>
	import { get, post,config } from '@/utils/api.js';
	export default {
		data() {
			name:'strcode'
			return {
				openid:'',
				imgUrl:config.staticUrl,
				strcode:'',//串码
				mobile:'',//手机号
				yzval:'',  //验证码
				sec:0,
				yzval:'',
				ok:true,
				status:false, //需要验证
				yzmRes:'',//验证码接口
				strcodeResult:'',//串码领红包接口
				
				
				reg1 : /[0-9a-zA-Z]{12}/, //串码验证
				reg2 : /^1[0-9]{10}/,     //手机号验证
				reg3 : /[0-9]{4}/,        //验证码验证
				
				title:'',
				content:'',
				batchName:'',
				earnTime:'',
				
				ydLocation:false, //引导授权地址
				needLocation: false,
				againClick: false,
				isOnLoad: false,
				longitude :'', // 经度
				latitude :'', // 维度
				accuracy :'', //精度
				isLoad:false,

				userInfo: {
					avatarUrl: '',
					nickName: ''
				},
				showForm:true,//展示输入框
			}
		},
		async onLoad() {
			this.openid = this.$store.state.openid
			// if (!this.openid) {
			// 	uni.navigateTo({
			// 		url: '../getOpenid/getOpenid?provinceCode=' + 'LN' + '&type=openid',
			// 	});
			// } 
			let that = this;
			uni.getStorage({
				key:'userMsg',
				success: function (res) {
					that.openid = res.data.openid
					console.log(that.openid);
					that.$store.commit('getOpenid', res.data.openid);
					if(!that.openid){
						 uni.navigateTo({
							url: '../getOpenid/getOpenid?provinceCode=' + 'LN' + '&type=openid',
						 })
					}
				},
				fail:function(){
					if(!that.openid){
						 uni.navigateTo({
							url: '../getOpenid/getOpenid?provinceCode=' + 'LN' + '&type=openid',
						 })
					}
					console.log(that.openid);
				}
			})
            that.openid = that.$store.state.openid
			console.log(that.openid)
			that.init();
			that.locationGet(); // 地理位置判断	
			
		},
		async onShow(){
			// 已授权的 进入取得头像昵称
			uni.getStorage({
				key: 'userInfo',
				success: function(res) {
					console.log(res.data);
					var userInfo = res.data
					that.userInfo.avatarUrl = res.data.avatarUrl;
					that.userInfo.nickName = res.data.nickName;
				},
				fail: function(res) {
					// 没有头像
					that.userInfo.avatarUrl = '';
					that.userInfo.nickName = '';
				}
			})
		},
		async onReachBottom () {
			// if (this.isEnd) return;
			// uni.showLoading({
			// 	title: '加载中...'
			// })
			// await this.onSearch(false); // 下一页
			// uni.hideLoading();
		},
		methods: {
			locationGet() {
				uni.getLocation({
					type: 'wgs84',
					complete: res => {
						// reslove(res)
						console.log(res); 
			
						this.longitude = res.longitude; // 经度
						this.latitude = res.latitude; // 维度
						this.accuracy = res.accuracy; //精度
			
						if (res.errMsg == "getLocation:ok") {
							console.log(`latitude${res.latitude},longitude${res.longitude}`)
							this.longitude = res.longitude; // 经度
							this.latitude = res.latitude; // 维度
							this.accuracy = res.accuracy; //精度
							return 
						} else if (res.errMsg == 'getLocation:fail auth deny' || res.errMsg ==
							'getLocation:fail authorize no response') { //未授权
							this.getSetting();
							return 
						} else if (res.errMsg == 'getLocation:fail:auth denied') { //取消授权
							this.longitude = ''; // 经度
							this.latitude = ''; // 维度
							this.accuracy = ''; //精度
							return 
						} else { // 未打开定位也要允许扫码
							this.ydLocation = true;
							this.showForm = false;
						}
					}
				});
			},
			closeLocationTip() {
				this.ydLocation = false;
				this.showForm = true;
				uni.showModal({
					title: '温馨提示',
					content: '开启手机定位有机会获得更大的红包哦~，确定不开启手机定位参与本次扫码活动吗？',
					cancelText:'先开定位',
					cancelColor:'#808080',
					confirmText:'直接参与',
					confirmColor:'#4CD964',
					complete:res=>{
						console.log(res);
						if(res.confirm){ // 直接参与
							uni.showModal({
								tip:'温馨提示',
								content:'您拒绝了授权地理位置哦~'
							})
							this.longitude = ''; // 经度
							this.latitude = ''; // 维度
						} else {  //去开定位
						    this.needLocation = true;
							this.againClick = false;
							console.log('aa')
							// this.locationGet();
						}
					}
				})
			},
			getSetting() {   // 获取用户的当前设置
				uni.getSetting({
					complete: res => {
						console.log(res)
						if (res.authSetting) {
							if (res.authSetting['scope.userLocation'] == false) {
								this.needLocation = true;
								if (this.againClick) { //从设置返回并未开启位置
									this.longitude = ''; // 经度
									this.latitude = ''; // 维度
									this.accuracy = ''; //精度
								}
							} else if (res.authSetting['scope.userLocation'] == undefined) { //首次拒绝授权
								this.longitude = ''; // 经度
								this.latitude = ''; // 维度
								this.accuracy = ''; //精度
							}
						} 
					},
				})
			},
			
			async openset() {  //设置里打开授权地理位置
				this.againClick = true;
				uni.openSetting({  // 进入设置界面，返回用户设置的操作结果。
					complete: (res) => {
						console.log(res);
						if(res.errMsg == 'openSetting:ok'){
							this.locationGet();
						} else {
							this.longitude = ''; // 经度
							this.latitude = ''; // 维度
							this.accuracy = ''; //精度
							uni.showModal({
								tip:'提示',
								content:'您拒绝了授权地理位置'
							})
							this.ydLocation = true;
							this.showForm = false;
						}
					} 
				})
			},
			async cancel() {  //取消打开授权设置后执行扫码
				console.log('取消打开授权设置')
				this.againClick = true;
			},
			async init() {
				uni.showLoading({
					title: '加载中...',
				})
				var params = {
					"openid": this.$store.state.openid, // this.$store.state.openid
					"projectServerName": 'liaoning',
				};
				this.initResult = await post('/sweep/getFailCount', params);
				console.log(this.initResult); // reply result replyTime
				uni.hideLoading();
				var jo = this.initResult;
				if (jo.result.code === '0') {
					switch (jo.result.businessCode) {
						case '0':
							this.status = false; //只输入验证码
							break;
						case '1': // 1 - 程序异常,
							uni.showModal({
								title: '尊敬的用户',
								content: '呜呜，系统开了个小差，请稍后重试！',
							})
							break;
						case '2': // 2 - 需要验证码
						    this.status = true;  //手机号 + 验证码 输入
							break;
						case '3': // 3 - 错误超过6次
						    this.status = false; //只输入验证码
							break;
						default:
							uni.showModal({
								title: '未知返回码',
								content: jo.result.businessCode + jo.result.msg
							})
					}
				} else { //code!='0'
					uni.showModal({
						title: '尊敬的用户',
						content: '呜呜，系统开了个小差，请稍后重试！',
					})
				}
			},
			gethb(){
				 if (!this.status) { //不需要验证码
					if (this.strcode.length < 12 || this.strcode.indexOf(' ') !== -1) {
						uni.showModal({
							title: '提示',
							content: '填写的串码有误，请仔细核对您的串码！',
						})
						return;
					} else {
						let that = this;     // that.$store.state.openid
						return new Promise((resolve, reject) => {
							uni.request({
								url: config.wxUrl + '/wx3/uinfo2?openid=' + this.$store.state.openid + '&appid=' + config.appid_ln,
								success: res => {
									// reslove(res)
									console.log('串码领红包'+ res)
									this.sendcode();  //串码接口
								},
								fail: err => {
									reject('串码领奖', err)
								}
							})
						})
					}
				} else { //需要验证码
					if (!this.reg1.test(this.strcode.trim())) {
						uni.showModal({
							title: '提 示',
							content: '请填写正确的瓶盖串码哦！~',
						})
					} else if (!this.reg2.test(this.mobile)) {
						uni.showModal({
							title: '提 示',
							content: '请填写正确的手机号！~',
						})
					} else if (!this.reg3.test(this.yzval)) {
						uni.showModal({
							title: '提 示',
							content: '请输入正确的验证码~',
						})
					} else {
						let that = this;     // that.$store.state.openid
						return new Promise((resolve, reject) => {
							uni.request({
								url: config.wxUrl + '/wx3/uinfo2?openid=' + this.$store.state.openid + '&appid=' + config.appid_ln,
								success: res => {
									// reslove(res)
									console.log('串码领红包'+ res)
									this.sendcode(); //串码接口
								},
								fail: err => {
									reject('串码领奖', err)
								}
							})
						})
					}
				}
			},
			async sendcode() {
				uni.showLoading({
					title: '领取中...',
				})
				var params = {
					"openid": this.$store.state.openid, // this.$store.state.openid
					"serialcode": this.strcode.trim(),
					"verifycode":this.yzval,
					"phone":this.mobile,
					"longitude": this.longitude ? this.longitude : this.$store.state.longitude, //"经度"
					"latitude": this.latitude ?  this.latitude : this.$store.state.latitude, //"纬度"
					"projectServerName": 'liaoning',
					"nickname" : this.userInfo.nickName,
                    "headimgurl": this.userInfo.avatarUrl,
				};
				this.strcodeResult = await post('/sweep/serialCode', params);
				console.log(this.strcodeResult); // reply result replyTime
	            uni.hideLoading();
				
				this.$store.dispatch('sweepResult', this.strcodeResult)
				console.log(this.$store.state.sweepData)
				var reply = this.$store.state.sweepData.reply;
				var result = this.$store.state.sweepData.result;
				
				var jo = this.strcodeResult;
				if (jo.result.code === '0') {
					if (jo.result.businessCode) {
						this.ok = false;
						if(jo.result.businessCode=='30'){//大奖核销
							wx.redirectTo({
								url: '../result/verification?bizcode=' + jo.result.businessCode,
							})
						}else if(jo.result.businessCode == 0){ // 普通奖
							wx.redirectTo({
								url:'../result/getcash?bizcode=' + jo.result.businessCode,
								// url: '../result/getcash?bizcode=' + jo.result.businessCode+ '&totalAccountMoney=' +jo.reply.totalAccountMoney + '&currentMoney=' + jo.reply.currentMoney+ '&batchName=' + jo.reply.batchName+ '&earnTime=' + jo.reply.earnTime+ '&codeContentUrl=' + jo.reply.codeContentUrl,
							})
							return;
						}else if(jo.result.businessCode == 1){ // 1 - 该积分码不存在"
					    	this.title = '这个串码不存在';
					    	this.content = '仔细核对盖码哦~';
					    	return;
					    }else if(jo.result.businessCode == 2){ // 2 - 该积分码已经被使用过
							this.title = '这个串码已被扫';
							this.content =  '扫码时间:' + jo.reply.earnTime + '\n再扫一瓶试试看~';
							return;
						}else if(jo.result.businessCode == 3){ //  3 - 积分码已过期
							this.title = '这个串码已过期';
							this.content = '这么好的啤酒要学会珍惜~';
							return;
						}else if(jo.result.businessCode == 4){ // 4 - 活动未开始
							this.title = '活动未开始';
							this.content = '亲再等等哦~';
							this.batch = jo.reply.batchName + '\n服务热线：15321413736'
							return;
						}
						else if(jo.result.businessCode == 5){ // 5 - 活动已结束
							this.title = '活动已截止';
							this.content = '下次早点来哦~';
							return;
						}else if(jo.result.businessCode == 6){ // 6 - 积分码异常(通常为服务器报错)
							this.title = '系统升级中';
							this.content = '亲稍安勿躁，敬请期待~';
							return;
						}else if(jo.result.businessCode == 7){ // 大奖
							wx.redirectTo({
								url: '../result/prize?bizcode=' + jo.result.businessCode,
							})
							return;
						}else if(jo.result.businessCode == 8){ //8-需要验证码
                        	uni.showModal({
                        	  title: '提示',
                        	  content: '请输入验证码！'
                        	})
                        	this.status = true;
                        	return;
                        }else if(jo.result.businessCode == 9){ //9-验证码不正确
							uni.showModal({
							  title: '提示',
							  content: '您输入的验证码不正确，请重新输入！'
							})  
							return;
						} else if(jo.result.businessCode == 10){ //10-错误超过6次,请明天再试
							this.title = '错误次数过多';
							this.content = '明天再来试试吧'; 
							return;
						} else if(jo.result.businessCode == 11){
							wx.redirectTo({
								url: '../result/getcash?bizcode='  + jo.result.businessCode+ '&totalAccountMoney=' +jo.reply.totalAccountMoney + '&currentMoney=' + jo.reply.currentMoney+ '&batchName=' + jo.reply.batchName+ '&earnTime=' + jo.reply.earnTime+ '&codeContentUrl=' + jo.reply.codeContentUrl,
							})
							return;
						} else if(jo.result.businessCode == 12){ //可疑用户
							wx.redirectTo({
								url: '../result/getMsg?bizcode=' + jo.result.businessCode,
							})
							return;
						} else if(jo.result.businessCode == 13){ // 黑名单
							wx.redirectTo({
								url: '../result/getMsg?bizcode=' + jo.result.businessCode,
							})
							return;
						} else if(jo.result.businessCode == 14){ // 与12相同
							wx.redirectTo({
								url: '../result/getMsg?bizcode=' + jo.result.businessCode,
							})
							return;
						} else if(jo.result.businessCode == 15){ //他人重复扫大奖
							wx.redirectTo({
								// url: '../result/fail?bizcode=' + jo.result.businessCode,
								url: '../result/fail?bizcode=2',
							})
							return;
						} else if(jo.result.businessCode == -1){ //他人重复扫大奖
							this.title = '系统升级中';
							this.content = '酒香不怕巷子深，稍后再试吧';
							return;
						} else if(jo.result.businessCode == 17){ //酒品已过期
							this.title = '好酒美味 更需趁早';
							this.content = '您扫的这瓶酒 \n 所属产品批次活动已结束';
							return;
						} else {
							if (jo.reply) {
								this.batchName = jo.reply.batchName === undefined ? '' : jo.reply.batchName;
								this.earnTime = jo.reply.earnTime === undefined ? '' : jo.reply.earnTime;
							} else {
								this.earnTime = '';
							}
							wx.redirectTo({
								url: '../result/fail?bizcode=' + jo.result.businessCode + '&batchName' + this.batchName + '&earnTime' + this.earnTime,
							})
						}							
					}
				} else { //code!='0'
				    this.ok = true;
					uni.showModal({
					  title: '尊敬的用户',
					  content: '呜呜，系统开了个小差，请稍后重试！'
					})
				}
			},
			
			
			getyz() {
			    if (this.sec > 0) {
			      return false;
			    }
				if (!this.reg1.test(this.strcode)) {
					uni.showModal({
					  title: '提示',
					  content: '请填写正确的瓶盖串码哦！~'
					})
				}
			    if (!(/^1[34578]\d{9}$/.test(this.mobile))) {
			      uni.showModal({
			        title: '提示',
			        content: '请填写正确的手机号！~'
			      })
			    } else {
					this.getCaptcha();
			    }
			},
			// 获取验证码
			async getCaptcha() {
				uni.showLoading({
					title: '获取中...',
				})
				var params = {
					"phonenum": this.mobile,
					"sendtype": 1 ,//0-一等奖,1-普通(一等奖页面不传，后台默认值，串码页面都传1)
					"projectServerName": 'liaoning',
				};
				this.yzmRes = await post('/user/getCaptcha', params);
				console.log('getCaptcha' + this.yzmRes); // reply result replyTime
				uni.hideLoading();
				var jo = this.yzmRes;
				
				if (jo.result.code == '0') {
					if (jo.result.businessCode == '0') {
						//成功，开始倒计时
						this.sec = 60;
						this.timer();
					} else if (jo.result.businessCode === '2') { //1
						uni.showModal({
						  title: '尊敬的用户',
						  content: '您填写的手机号错误，发送验证码失败！',
						})
					} else {
						uni.showModal({
						  title: '尊敬的用户',
						  content: '呜呜，系统开了个小差，请稍后重试！',
						})
					}
				} else { //code!='0'
					uni.showModal({
					  title: '提示',
					  content: jo.result.msg,
					})
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
		}
	}
</script>

<style scoped lang="scss">
	button::after{
	  border:none;
	}
	input{
	  outline:none;
	  border:none;
	  list-style: none;
	}
	.strCode {
		// width:100%;
		height: 100%;
		background-image: linear-gradient(#f2f2f2, #ffffff);
		/* 扩散形状圆形 半径大小(到最近的边) at 圆心位置在50px*² , 起始渐变色 起始渐变位置, 结束渐变色 结算渐变位置 */
		// background-image: radial-gradient(circle closest-side at 50px 50px,#c9151e 20px, #c9151e 70px) ;
		background-size: 100%;
		display: flex;
		flex-direction: column;
		// height: 100vh;	
		padding:66upx 20upx 0;
		.tipBox{
			background: url('https://xcxsite.vjifen.com/v/lnqp/strCodeBg.png') no-repeat top center;
			background-size: 100%;
			width:530upx;
			height:382upx;
			margin:0 auto;
			.tip{
				text-align: center;
				padding-top: 40rpx;
				.word{
					font-size:72upx;
					color:#4eac6d;
					font-weight:bold;
				}
				.word-l{
					font-size:50upx;
					color:#4eac6d;
					padding-top:40upx;
				}
				.word-s{
					font-size:24upx;
					color:#666;
					padding-top:40upx;
				}
			}
		}
		.inputBox{
			margin:60upx 10upx 20upx;
			border:1px solid #008c39;
			border-radius: 18upx;
			.row{
				height:96upx;
				color: #000000;
				font-family: "微软雅黑", "Microsoft YaHei";
				color:#000;
				font-size:30upx;
				// border-bottom:1upx solid #cecece;
				border-top:1upx solid #cecece;
				position:relative;
				&:nth-child(1){ //3
					// border-bottom:none;
					border-top:none; 
				}
				.input{
					// text-indent: 46upx;
					padding-left: 46rpx;
					height:96upx;
					line-height:96upx;
				}
				.yzBtn{
					width:40%;
					height: 60upx;
					position: absolute;
					top: 12px;
					right: 0;
					font-size: 24rpx;
					color: #008c39;
					border-left: 1upx solid #008c39;
					text-align: center;
					line-height:60upx;
					z-index: 1;  // 10
				}	
			}
		}
		.warnTip{
			font-size:24upx;
			color:#666;
			padding:40upx;
			line-height:60upx;
		}
		.btn{
			width: 380upx;
			height:86upx;
			line-height:86upx;
			margin:0 auto;
			background: #008c39;
			border-radius: 36upx;
			text-align: center;
			color:#fff;
			font-size:32upx;
			font-weight:bold;
		}
		.location_fail {  /* 获取地理位置失败 */
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index:10;
			background: #fff;
			image {
				width: 100%;
				display: block;
				background: #fff;
			}
			button {
				width: 66%;
				height: 100upx;
				bottom:10%;
				// left: 17%;
				// background: pink;
				opacity: 0;
			}
		}
		
		.index { //地理位置授权
			width: 100%;
			height: 100%;
		
			.head {
				height: 186upx;
				padding: 82upx;
				padding-bottom: 0;
		
				.logo {
					width: 150upx;
					padding-right: 30upx;
				}
			}
		
			.scanImg {
				width: 100%;
				margin: 0 auto;
			}
		}
		
		.opensetting { //地理位置再次授权
			width: 100%;
			height: 500upx;
			background: #fff;
			position: absolute;
			bottom: 0;
			left: 0;
			box-shadow: 10rpx -10rpx 20rpx #999;
			z-index:3;  // 填写验证信息时在表单上层
			.head {
				height: 120upx;
				line-height: 120upx;
				display: flex;
				color: #333;
				position: relative;
		
				.headimg {
					width: 60upx;
					height: 60upx;
					border-radius: 50%;
					margin: 12upx 0 30upx 30upx;
					border: 1px #ccc solid;
				}
		
				.close {
					width: 40upx;
					height: 40upx;
					position: absolute;
					top: 40upx;
					right: 40upx;
				}
		
				text {
					padding: 0 20upx;
		
					&:nth-of-type(1) {
						font-size: 40upx;
						color: #000;
						font-weight: bold;
						padding: 0 30upx;
						line-height: 80upx;
					}
		
					&:nth-of-type(2) {
						font-size: 30upx;
						padding: 0 30upx 0 0;
						color: #333;
						line-height: 80upx;
						display: block;
					}
				}
			}
		
			.content text {
				&:nth-of-type(1) {
					font-size: 40upx;
					color: #000;
					font-weight: bold;
					padding: 30upx;
				}
		
				&:nth-of-type(2) {
					font-size: 30upx;
					padding: 0 30upx;
					color: #333;
					line-height: 80upx;
					display: block;
				}
			}
		
			.set {
				width: 400upx;
				height: 85upx;
				background: #04c05f;
				display: block;
				margin: 50upx auto;
				border-radius: 10upx;
				color: #fff;
				font-size: 32upx;
			}
		}
	}
    
</style>
