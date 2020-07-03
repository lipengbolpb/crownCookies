<template>
  <view class="getMsg">
	  <view id="wrap" v-if="bizcode==12">
	    <view class="tip">为确保您的账号安全，请填写验证信息</view>
	    <view id="tel_box">
	      <input type="number" name="tel" id="tel" value="mobile" placeholder="请输入手机号" maxlength="11" v-model="mobile"></input>
	    </view>
	    <view id="yz_box">
	      <input type="number" name="yz_code" id="yz_code" value="yzval" placeholder="请输入验证码" maxlength="4" v-model="yzval"></input>
	      <text id="get_yz" @tap="getyz">{{sec==0?'获取验证码':sec+'秒后再次获取'}}</text>
	    </view>
	    <button id="tj" @tap="tj">提交信息</button>
	    <view id="tips" v-if="tel">客服电话：{{tel}}</view>
	  </view>
	  <view id="wrap" v-else>
	    <text class="black">您的账号存在可疑风险，为确保您的账号安全，请联系客服\n\n\n电话：{{tel}}</text>
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
			name: 'getMsg'
			return {
				imgUrl:config.staticUrl,
				sec:0,
				bizcode:12,
				tel: '024-31932190',
				reg1 : /^1[0-9]{10}$/,  //手机号
			    reg2 : /^[1-9][0-9xX]{17}$/, //身份证
			    reg3 : /^[0-9]{4}$/, //验证码
			}
		},
		/**
		   * 生命周期函数--监听页面加载
		   */
		onLoad: function(options) {
			this.bizcode = options.bizcode;
		 },
		 
		 /**
			* 生命周期函数--监听页面隐藏
			*/
	    onHide: function() {
			this.stop = true,
			this.sec = 0
	    },
		 /**
		   * 生命周期函数--监听页面卸载
		   */
		onUnload: function() {
		    this.stop = true,
		    this.sec = 0
		},
		/**
		   * 用户点击右上角分享
		   */
	    onShareAppMessage: function() {
			return {
			  title: '青岛啤酒',
			  path: '/pages/home/home',
			  imageUrl: this.imgUrl + 'share.png'
			}
	    },
		methods: {
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
			    }
			},
			// 获取验证码
			async getCaptcha() {
				uni.showLoading({
					title: '获取中...',
				})
				var params = {
					"phonenum": this.mobile,
					"sendtype": 1, //0-一等奖,1-普通(一等奖页面不传，后台默认值，串码页面都传1)
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
			
			tj(){
			    if (!this.reg1.test(this.mobile)) {
			      uni.showModal({
			        title: '提示',
			        content: '请填写正确的手机号！~',
			      })
			    } else if (!this.reg3.test(this.yzval)) {
			      uni.showModal({
			        title: '提示',
			        content: '请填写正确的验证码！~',
			      })
			    } else {
			      //调提交接口
				  this.sub_message();
			    }
			},
			async sub_message(){
				uni.showLoading({
				  title: '提交中',
				})
				var params = {
					"openid": this.$store.state.openid, // this.$store.state.openid
					"phonenum": this.mobile ,
					"captcha":this.yzval,
					"projectServerName": 'liaoning',
				};
				var result = await post('/user/updateUserInfoMobile', params);
				uni.hideLoading();
				console.log(result); // reply result replyTime
				if(result.result.businessCode==0){
				  console.log('可疑' + this.$store.state.qr);
				  uni.redirectTo({
				    url: '../scan/scan?q=' + encodeURIComponent(this.$store.state.qr),
				  })
				}else{
				  uni.showModal({
				    title: '提示',
				    content: result.result.msg,
				  })
				}
			}			
		}
	}
</script>

<style scoped lang="scss">
	
	/* pages/result/getMsg.uniss */
	.getMsg{
	  background: #009040 url('https://xcxsite.vjifen.com/v/lnqp/cash_bg.png') no-repeat bottom center;
	  background-size: 100%;
	  height: 100vh;
	  // overflow: hidden;
	  #wrap{
	    width: 100%;
	    height: 100%;
	    overflow: hidden;
	    background: rgba(0, 0, 0, .7);
	    color: #fff;
		text.black{
		  display: block;
		  text-align: center;
		  padding: 0 100upx;
		  font-size: 28upx;
		  margin: 300upx auto;
		}
		.tip{
		  line-height: 50upx;
		  text-align: center;
		  padding: 100upx 0;
		}
		#tel_box{
		  height: 80upx;
		  line-height: 80upx;
		  display: flex;
		  border-top: 1px #ccc solid;
		  border-bottom: 1px #ccc solid;
		  input{
		    height: 80upx;
		    line-height: 80upx;
		    width: 80%;
		    font-size: 28upx;
		    padding-left: 50upx;
		  }
		}
		#yz_box{
		  height: 80upx;
		  line-height: 80upx;
		  display: flex;
		  border-bottom: 1px #ccc solid;
		  input{
		    height: 80upx;
		    line-height: 80upx;
		    width: 60%;
		    padding-left: 50upx;
		    box-sizing: border-box;
		  }
		}
		#get_yz{
		  width: 40%;
		  text-align: center;
		  border-left: 1px #ccc solid;
		  box-sizing: border-box;
		} 
		#yz_box{
		  bottom: 0;
		}
		#tj{
		  width: 300upx;
		  height: 72upx;
		  color: #c8372c;
		  background: #fbc701;
		  border-radius: 20upx;
		  line-height: 72upx;
		  margin-top: 72upx;
		  text-align: center;
		  display: block;
		  margin: 100upx auto;
		}
		#tips{
		  text-align: center;
		}
	  }
	}
	
</style>
