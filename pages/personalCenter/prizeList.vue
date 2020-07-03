<template>
	<view class="prizeList">
		<!-- tab切换 -->
		<view class="content">
			<view class="tabView">
				<view v-for="(one, index) in tabs " :class="{active:one.isActive}" @click="tabSwitch(index)">{{one.itemName}}</view>
			</view>
			<!-- style="min-height:1000upx" -->
			<scroll-view class="list unGetPrize" v-if="unGetShow" @scrolltolower="nextUnPrize" scroll-y='true' lower-threshold='200' :style="{'min-height': windowHeight-100 + 'px'}">   
				<view class="prizeItem unGetItem" v-if="unGetPrize && unGetPrize.length>0" v-for="(item, index) in unGetPrize" :key="index">
					<view class="topPart">
						<view class="ddl">兑奖截止：{{item.expireTime}}</view>
						<view class="howget" v-if="item.exchangeChannel == 8">抽奖奖品</view>
						<view class="howget" v-else>扫码奖品</view>
					</view>
					<view class="prizeInfo clearfix">
						<view class="prizeImg">
							<image :src="item.prizeImg" mode="widthFix"></image>
						</view>
						<view class="prizeDetail">
							<view class="prizeName">{{item.prizeName}}</view>
							<!-- <view class="prizeSpecs">{{item.specs}}</view> -->
							<view class="btn" @click="gainPrize(item.prizeVcode,item.infoKey)">立即领取</view>
							<view class="prizeTime">中奖时间：{{item.earnTime}}</view>
						</view>
					</view>
				</view>
				<!-- 仅显示近30天的记录 -->
				<view class="nomore" v-if="unGetPrize.length <= count">没有更多记录啦~</view>
			</scroll-view>

			<scroll-view class="list getPrize" v-if="getShow" @scrolltolower="nextGetPrize" scroll-y='true' lower-threshold='200' :style="{'min-height': windowHeight-100 + 'px'}">
				<view class="prizeItem getItem" v-for="(item, index) in getPrize" :key="index" @click="seeForm(index)">
					<view class="topPart">
						<view class="ddl">兑奖截止：{{item.expireTime}}</view>
						<view class="howget" v-if="item.exchangeChannel == 8">抽奖奖品</view>
						<view class="howget" v-else>扫码奖品</view>
					</view>
					<view class="prizeInfo clearfix">
						<view class="prizeImg">
							<image :src="item.prizeImg" mode="widthFix"></image>
						</view>
						<image :src="imgUrl + 'receive.png' " mode="widthFix" class="receive"></image>
						<view class="prizeDetail">
							<view class="prizeName">{{item.prizeName}}</view>
							<!-- <view class="prizeSpecs">{{item.specs}}</view> -->
							<view class="prizeTime">中奖时间：{{item.earnTime}}</view>
						</view>
					</view>
				</view>
				<!-- 仅显示近30天的记录 -->
				<view class="nomore" v-if="getPrize.length <= getCount">没有更多记录啦~</view>
			</scroll-view>

		</view>

		<!-- 表单 -->
		<view class="formToast" v-if="showForm">
			<image :src="imgUrl + '2.0/getClose.png' " class="closeForm" mode="widthFix" @click="formClose"></image>
			<view class="toastWrap">
				<view class="formWrap">
					<view class="rowTit">
						领奖信息
					</view>
					
					<view class="ewm"  v-show="showHXqr">
						<image :src="hxqrImg" class="ewmImg" mode="widthFix"></image>
						<view class="qrTxt">领奖核销码</view>
					</view>
					
					<view class="row">
						<text>联系人</text>
						<input type="text" placeholder="请填写联系人" placeholder-class="placeholder" class="input name" value="userName"
						 v-model="userName" auto-focus   :disabled="isDisabled"></input>
					</view>
					<view class="row">
						<text>身份证号</text>
						<input type="number" placeholder="身份证号" class="input idcard" placeholder-class="placeholder" maxlength="18" value="idcard"
						 v-model="idcard"  :disabled="isDisabled"></input>
					</view>
					<view class="row">
						<text>联系电话</text>
						<input type="number" placeholder="手机号码" class="input tel" placeholder-class="placeholder" maxlength="11" value="mobile"
						 v-model="mobile"  :disabled="isDisabled"></input>
					</view>

					<view class="row">
						<text>所在地区</text>
						<view @tap="togglePopup('bottom','popup')"  :disabled="isDisabled" class="areaInput">
							<span v-for="(item, index) in selectList" :key="index" class="areaValue" v-if="useStatus == 0">
								{{item.txt}}<span v-show="index == 0 || index == 1">—</span>
							</span>
							
							<input type="text" class="input region" v-if="useStatus == 1" value="region"
						 v-model="region" :disabled="isDisabled"></input>
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

						<!-- <input type="text" placeholder="省份、城市、区县" placeholder-class="placeholder" class="input address" value="region" v-model="region"  disabled="true"
							maxlength="50" @click="chooseRegion"></input> -->
					</view>

					<view class="row">
						<text>详细地址</text>
						<input type="text" placeholder="详细地址, 如街道、楼盘号等" placeholder-class="placeholder" class="input address" value="address"
						 v-model="address"  :disabled="isDisabled"></input>
					</view>
					
					<view class="row clearfix"  v-if="useStatus == 0">
						 <text>验证码</text>
						 <input type="number" placeholder="输入验证码" class="input code"  maxlength="4" value="yzval" v-model="yzval" ></input>
						 <view class="yzBtn" @tap="getyz">{{sec==0?'获取验证码':sec+'秒后再次获取'}}</view>
					 </view>
                     
					<view class="choose" v-show="false">选择地址>></view>  <!-- 此次不显示地址列表 -->
                    
					<!-- :class="['btn',subOk?'btnOk':'']" -->
					<view class="btn btnOk" v-if="!seeInfo"  @click="formValue">提交领奖信息</view>
					
					<!-- 查看信息 -->
					<view class="btn btnOk"  v-if="seeInfo"   @click="seeOk">确认</view>
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

		<view class="no-data" v-if="noData">
			<p>暂无数据</p>
		</view>

	</view>
</template>

<script>
	import {
		get,
		post,
		config,
		idcardValidate,
		getGiftspack
	} from '@/utils/api.js';

	import cityDatas from '../../components/city.area.js';
	import uniPopup from '../../components/uni-pop.vue';
	
	import QR from "@/components/wxqrcode.js" // 二维码生成器

	export default {

		components: {
			uniPopup
		},

		data() {
			name: 'prizeList'
			return {
				imgUrl: config.staticUrl,
				
				showHXqr:false,  //是否展示核销码
				ewmUrl: config.hxqrUrl, //生成的核销码的前缀
				hxqrImg:'',		 // 二维码
				
				yzmRes:'',// 验证码接口数据
				sec:0,
				yzval:'',
				
				currentPage:1, //未领取
				count:10, 
								
				unCurrentPage:1, //未领取
				unCount:10, 
				
				getCurrentPage:1, //已经领取
				getCount:10,
				
				subParams:{
					prizeVcode:'',
					infoKey:''
				},
				
				useStatus:0, //领取状态 0未领取、1已领取
				imgUrl: config.staticUrl,
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
				// end

				seeInfo: false, // 回显form的信息
				subOk: false,
				showtjOK: false, // 提交成功
				showForm: false, // 填写表单
				userName: '',
				idcard:'',
				mobile: '',
				region: '',
				address: '',

				tabs: [{
						idx: 1,
						isActive: true,
						itemName: '未领取'
					},
					{
						idx: 2,
						isActive: false,
						itemName: '已领取'
					},
				],
				active: false,

				unGetShow: true,
				getShow: false,

				unGetPrize: [], //未领取列表
				getPrize: [], //已领取列表
				nuGetNext: true,
				getNext: true,

				start: 0,
				count: 20,
				isEnd: false,
				noData: false,
				isDisabled:false,
				regYzcode:/^[0-9]{4}$/ , //验证验证码
				regMobile:/^1[34578]\d{9}$/, //验证手机号码
				// regMobile:/^1[0-9]{10}$/; //验证手机号
				
				windowHeight:this.windowHeight
			}
		},
		onLoad() {
			this.queryPrize();
		},
		
		onShow(){
			if(this.useStatus == 0){  // 0未领取、1已领取
				uni.showModal({
					content: this.useStatus ,
				})
				this.isDisabled =  false
			} else if( this.useStatus == 1 ){
				uni.showModal({
					content: this.useStatus ,
				})
				this.isDisabled =  true
			}
		},
		async onReachBottom() {
			if (this.isEnd) return;
			uni.showLoading({
				title: '加载中...'
			})
			await this.onSearch(false); // 下一页
			uni.hideLoading();
		},
		methods: {
			// 查询中奖列表[未领取]
			async queryPrize(){
				uni.showLoading({
					title: '加载中...',
				})
				var params = {
					"openid": this.$store.state.openid, // 
					'hbopenid':'',
					"projectServerName": 'liaoning',
					"currentPage": this.currentPage,
					"count":this.count,
					"useStatus":this.useStatus //领取状态 0未领取、1已领取
				};
				this.prizeResult = await post('/gifts/queryPrizeList', params);
				console.log(this.prizeResult); // reply result replyTime
				uni.hideLoading();
				var jo = this.prizeResult;
				
				if (jo.result.businessCode == 0) {
					if(this.useStatus == 0){ // 0未领取
					   this.unGetPrize = jo.reply.prizeRecordAry //未领取列表
					   if (jo.reply.prizeRecordAry < this.count) {
					    	this.nuGetNext  = false
					   }
					}
					if(this.useStatus == 1){  //1已领取
					   this.getPrize = jo.reply.prizeRecordAry  //已领取列表
					    if (jo.reply.prizeRecordAry < this.count) {
					    		this.getNext = false
					    }
					}
				}
			},
			
			// 领取奖品
			gainPrize(prizeVcode,infoKey) {
				this.clearForm();
				this.subParams.prizeVcode = prizeVcode;
				this.subParams.infoKey = infoKey;
				this.showForm = true;
			},
			// 校验表单是否为空
            formValue(){
				console.log(this.userName);
				// this.userName === '' || this.userName.indexOf(' ') !== -1
				if (this.userName === '') {
				  uni.showModal({
					title: '提示',
					content: '请填写正确的姓名哦！~',
				  })
				  return     
				} 
				if (!(this.regMobile.test(this.mobile))) {
				  uni.showModal({
					title: '提示',
					content: '请填写正确的手机号！~',
				  })
				  return  // this.address === '' || this.address.indexOf(' ') !== -1
				}
				if (!idcardValidate(this.idcard)) {
				  uni.showModal({
					title: '提示',
					content: '请填写正确的身份证号哦！~',
				  })
				  return
				}
				if (this.address === '') {
				  uni.showModal({
					title: '提示',
					content: '请填写正确的详细地址哦！~',
				  })
				   return
				}
				if (!(this.regYzcode.test(this.yzval))) {
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
			// 提交表单
			// subForm() {
			// 	// this.formValue();  // 校验表单
			// 	// this.showForm = false;  //表单不显示
			// 	// this.showtjOK = true;   //提交成功显示
			// },
		
			clearForm(){
				this.userName = '';
				this.idcard = '';
				this.mobile = '';
				this.region = '';
				this.address = '';
				this.yzval = '';
				this.seeInfo = false;
			},
			async sub_message() {
				uni.showLoading({
					title: '提交中...',
				})
				var params = {
					"openid": this.$store.state.openid, // 
					"username": this.userName,
					"address":this.region + this.address.trim(),
					"idcard": this.idcard,//'idcard'
					"phonenum":this.mobile,
					"prizeVcode":this.subParams.prizeVcode,
					"prizeInfoKey":this.subParams.infoKey,
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
						this.queryPrize();   // 查询大奖列表
					  }, 2000)
					  this.clearForm();
				} else {
				  uni.showModal({
					title: '温馨提示',
					content: jo.result.msg,
				  })
				}
			 },
			// 成功后我知道了
			iknow() {
				this.showForm = false;
				this.showtjOK = false;
				this.useStatus = 1;
				// 去往已领取tab面
				this.tabSwitch(1);
				this.queryPrize()   // 查询已领取列表
				// ...
			},
			
			// 生成核销二维码 加上前缀啊 hxqrUrl + ‘vcode’
			
			// 已领奖信息 查看form提交信息
			seeForm(idx) {
				this.showHXqr = false;  //是否展示核销码
				this.showForm = true;
				this.seeInfo = true;
				console.log(idx);
				console.log(this.getPrize)
				for(var k in this.getPrize){
					if(k == idx){
						console.log(k);
						if(this.getPrize[k].exchangeChannel == '8'){
							this.showHXqr = true; //展示核销码
							// 二维码
							var qrval = this.ewmUrl + this.getPrize[k].prizeVcode;
							let img = QR.createQrCodeImg(qrval, {
								size: parseInt(100)//二维码大小  
							})
							console.log(qrval)
							this.hxqrImg = img;
						} else {
							this.showHXqr = false;  //是否展示核销码
						}
						
						this.userName = this.getPrize[k].userName;
						this.idcard = this.getPrize[k].idCard;
						this.mobile = this.getPrize[k].phoneNum;
						
						console.log(this.getPrize[k].address)
						if(this.getPrize[k].address == undefined){
							this.region = '';
							this.address = '';
						} else {
							this.region = this.getPrize[k].address.split('-')[0];
							this.address = this.getPrize[k].address.split('-')[1];
						}
						this.isDisabled = true; //禁止输入
					}
				}
			},
			// 关闭按钮
			formClose(){
				this.showForm = false;
			},
			// 关闭已领奖信息form
			seeOk() {
				this.showForm = false;
			},
			//切换选项卡
			tabSwitch(tabIndex) {

				for (var i = 0; i < this.tabs.length; i++) {
					this.tabs[i].isActive = false;
				}
				this.tabs[tabIndex].isActive = true;
				if (tabIndex == 0) {
					this.unGetShow = true;
					this.getShow = false;
					
				    // 未领取
					this.currentPage = this.unCurrentPage;
					this.count = this.unCount;
					this.useStatus = tabIndex; // 未领取 0
					this.isDisabled =  false
					this.queryPrize()    // 查询未领取列表
				}
				if (tabIndex == 1) {
					this.getShow = true;
					this.unGetShow = false;
					
					// 已领取
					this.currentPage = this.getCurrentPage;
					this.count = this.getCount;
					this.useStatus = tabIndex; // 1 已领取
					this.isDisabled =  true
					this.queryPrize()   // 查询已领取列表
				}
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
			    if (!(this.regMobile.test(this.mobile))) {
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
			//下拉未领取
			async nextUnPrize(e) { 
				if (this.nuGetNext) {
				  uni.showLoading({
					title: '加载中',
					mask: true
				  })
				  this.currentPage = this.unCurrentPage + 1;
				  this.count = this.unCount;
				  // this.queryPrize();
				  uni.showLoading({
				  	title: '加载中...',
				  })
				  var params = {
				  	"openid": this.$store.state.openid, // this.$store.state.openid
					"hbopenid":'',
					"projectServerName": 'liaoning',
				  	"currentPage": this.currentPage,
				  	"count":this.count,
				  	"useStatus":this.useStatus //领取状态 0未领取、1已领取
				  };
				  this.prizeResult = await post('/gifts/queryPrizeList', params);
				  uni.hideLoading();
				  if(this.prizeResult.reply.prizeRecordAry.length>0){
					   if(this.useStatus = 0){
						   this.unGetPrize = this.unGetPrize.concat(this.prizeResult.reply.prizeRecordAry); //未领取列表
					   }else{
						   this.getPrize = this.getPrize.concat(this.prizeResult.reply.prizeRecordAry); //已领取列表
					   }
				   }
				}
			},
			//下拉已领取
			async nextGetPrize(e) {
				if (this.getNext) {
				  uni.showLoading({
					title: '加载中',
					mask: true
				  })
				  this.currentPage = this.getCurrentPage + 1;
				  this.count = this.getCount;
				  // this.queryPrize();
				  uni.showLoading({
				  	title: '加载中...',
				  })
				  var params = {
				  	"openid": this.$store.state.openid, // this.$store.state.openid
					"hbopenid":'',
					"projectServerName": 'liaoning',
				  	"currentPage": this.currentPage,
				  	"count":this.count,
				  	"useStatus":this.useStatus //领取状态 0未领取、1已领取
				  };
				  this.prizeResult = await post('/gifts/queryPrizeList', params);
				  uni.hideLoading();
				  if(this.prizeResult.reply.prizeRecordAry.length>0){
					   if(this.useStatus = 0){
						   this.unGetPrize = this.unGetPrize.concat(this.prizeResult.reply.prizeRecordAry); //未领取列表
					   }else{
						   this.getPrize = this.getPrize.concat(this.prizeResult.reply.prizeRecordAry); //已领取列表
					   }
				   }
				}
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
	.prizeList {
		width: 100%;
		height: 100%;
		background: url('https://xcxsite.vjifen.com/v/lnqp/prizeListBg.png') no-repeat top center;
		background-size: 100% 290upx;
		display: flex;
		flex-direction: column;
		height: 100vh;

		.content {
			margin: 0rpx auto;
			border-radius: 10rpx;
			overflow: hidden;

			.tabView {
				color: #fff;
				font-size: 28upx;
				text-align: center;
				padding: 46upx;

				view {
					display: inline-block;
					margin: 0 30px;
					opacity: .6;

					&.active {
						color: #fff;
						opacity: 1;
						border-bottom: 1upx solid #fff;
					}
				}
			}

			.list {
				width: 690upx;
				height: 322upx;
				border-radius: 6upx;
				background: #fff;
				.prizeItem {
					padding: 20upx;
					box-shadow: 0 0 14px #e7e7e7;
					margin-bottom: 60upx;
					background: #fff;
					position: relative;

					&.getItem {

						// padding-bottom:60upx;
						.prizeName {
							padding-bottom: 32upx;
						}

						.prizeTime {
							padding-top: 52upx;
						}
					}
                    
					.topPart{
						width: 100%;
						line-height:86upx;
						text-align: left;
						color: #666;
						font-size: 26upx;
						border-bottom:1px solid #ededed;
						display: flex;
						.ddl {
							flex:0 0 1;
						}
						.howget{
							flex:1;
							color:#008837;
							padding-left: 16%;
						}
					} 
					.prizeInfo {
						// padding: 30upx 0 30upx 30upx;
						padding: 30upx 0 0 30upx;

						.prizeImg {
							width: 30%;
							float: left;

							image {
								width: 160upx;
							}
						}

						.receive {
							width: 122upx;
							position: absolute;
							right: 0;
							top: 0;
						}

						.prizeDetail {
							width: 70%;
							float: left;

							.prizeName {
								color: #333;
								font-size: 32upx;
								padding-left: 50upx;
							}

							.prizeSpecs {
								color: #666;
								font-size: 28upx;
								padding-left: 50upx;
							}

							.prizeTime {
								color: #666;
								font-size: 26upx;
								padding-left: 50upx;
							}

							.btn {
								width: 158upx;
								height: 60upx;
								background: #009140;
								text-align: center;
								color: #fff;
								font-size: 26upx;
								line-height: 60upx;
								border-radius: 36upx;
								margin-left: 260upx;
								margin-bottom: 20upx;
							}
						}
					}
				}

				.nomore {
					text-align: center;
					font-size: 32upx;
					padding-top: 20px;
				}

			}

		}

		.formToast {
			position: fixed;
			background-color: rgba(9, 9, 9, .8);
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 2;
			transition: all 0.3s;
			.closeForm{
				width:53rpx;
				position: absolute;
				top: 10%;
				right: 6%;
			}
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
                    .ewm{
						padding-top:26rpx;
						text-align: center;
						.ewmImg{
							width: 200rpx;
						}
						.qrTxt{
							font-size:22rpx;
							color:#828282;
						}
					} 
					.row {
						height: 90upx;
						line-height: 90upx;
						border-bottom: 1upx solid #f5f5f5;
						color: #999;
						font-size: 28upx;
						margin: 0 20upx;
						.areaInput{
							width: 70%;
							float: left;
							height: 90rpx;
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
							height: 90upx;
							line-height: 90upx;
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
						top: 40rpx;
						position: relative;
						// margin-top: 40upx;
						&.btnOk {
							background: #008c39;
						}
					}
				}
			}
		}

		.no-data {
			text-align: center;
			padding: 40upx 0;

			p {
				color: #ccc;
			}
		}
	}

	.clearfix:after {
		content: ".";
		height: 0;
		clear: left;
		visibility: hidden;
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
</style>
