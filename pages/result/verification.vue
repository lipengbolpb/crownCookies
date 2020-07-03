<template>
	<view class="verification">
		<scroll-view scroll-y>
			<view class="msg_box">
				<view>
					<image class="prizeImg" :src="checkPrizeRecord.prizeImg" mode="widthFix"></image>
				</view>
				<view>
					<text>中奖码：</text><input type="text" v-model="checkPrizeRecord.prizeVcode" value="checkPrizeRecord.prizeVcode" disabled="disabled"></input>
				</view>
				<view>
					<text>中奖产品：</text><input type="text" v-model="checkPrizeRecord.prizeName" value="checkPrizeRecord.prizeName" disabled="disabled"></input>
				</view>
				<view>
					<text>中奖时间：</text><input type="text" v-model="checkPrizeRecord.earnTime" value="checkPrizeRecord.earnTime" disabled="disabled"></input>
				</view>
				<view>
					<text>截止时间：</text><input type="text" v-model="checkPrizeRecord.expireTime" value="checkPrizeRecord.expireTime" disabled="disabled"></input>
				</view>
				<view>
					<text>联系人：</text><input type="text" v-model="checkPrizeRecord.userName" value="checkPrizeRecord.userName" disabled="disabled"></input>
				</view>
				<view>
					<text>身份证号：</text><input type="text" v-model="checkPrizeRecord.idCard" value="checkPrizeRecord.idCard" disabled="disabled"></input>
				</view>
				<view>
					<text>详细地址：</text><input type="text" v-model="checkPrizeRecord.address" value="checkPrizeRecord.address" disabled="disabled"></input>
				</view>
				<view>
					<text>联系电话：</text><input type="text" v-model="checkPrizeRecord.phoneNum" value="checkPrizeRecord.phoneNum" disabled="disabled"></input>
				</view>
				<view v-if="checkPrizeRecord.checkStatus==1">
					<text>兑奖人员：</text><input type="text" v-model="checkPrizeRecord.checkUserName" value="checkPrizeRecord.checkUserName" disabled="disabled"></input>
				</view>
				<view v-if="checkPrizeRecord.checkStatus==1">
					<text>兑奖时间：</text><input type="text" v-model="checkPrizeRecord.checkTime" value="checkPrizeRecord.checkTime" disabled="disabled"></input>
				</view>
				<view>
					<!-- checkPrizeRecord.checkRemarks || -->
					<text>兑奖备注：</text><input type="text" v-model="checkRemarks" value="checkRemarks" placeholder="备注"
					 :disabled="readOnly"></input>
				</view>
			</view>
			<!-- readOnly|| -->
			<image :src="imgUrl + 'verification.png' " class="sign" mode="widthFix" v-if="checkOver"></image>
			<text class="tip" v-if="needWrite">注：请兑奖人完善个人信息，进行兑奖</text>
			<!-- readOnly?'已兑奖': -->
			<button class="dj" @click="dj" :disabled="readOnly||checkPrizeRecord.checkStatus==1||needWrite">{{checkOver?'已兑奖':'立即兑奖'}}</button>
			
		</scroll-view>
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
			name: 'verification' //大奖核销
			return {
				imgUrl:config.staticUrl,
				checkRemarks:'',
				checkPrizeRecord:'',
				needWrite:true,
				readOnly:false,
				checkOver:false
			}
		},
		/**
		   * 生命周期函数--监听页面加载
		   */
		onLoad: function(options) {
			this.bizcode = options.bizcode;
			this.checkPrizeRecord = this.$store.state.sweepData.reply.checkPrizeRecord;
			console.log(this.checkPrizeRecord);
			
			this.checkPrizeRecord = this.$store.state.sweepData.reply.checkPrizeRecord;
			console.log(this.checkPrizeRecord);
			if (!this.checkPrizeRecord.userName){
				console.log('aaa')
				this.needWrite = true;
			} else {
				console.log('bbb')
				this.needWrite = false;
			}
			
			if(this.checkPrizeRecord.checkStatus == 1){ //已兑奖  禁止输入
			    console.log('啊啊啊啊啊啊')
				this.readOnly  = true;
				this.checkOver = true
			} else {
				console.log('啦啦啦啦')
				this.readOnly  = false;
				this.checkOver = false
			}
			
			if(this.checkPrizeRecord.checkRemarks){
				this.checkRemarks  = this.checkPrizeRecord.checkRemarks
			} else {
				this.checkRemarks  =  this.checkRemarks
			}
			
			console.log(this.needWrite);
			console.log(this.readOnly);
			console.log(this.$store.state.openid)
		},
		
		 /**
		   * 生命周期函数--监听页面显示
		   */
		onShow(){
			
			// if (this.checkPrizeRecord.userName == '' || this.checkPrizeRecord.userName == 'undefined'){//未填写
			//   this.needWrite = true;
			//   this.readOnly = false;
			// }
		},
		 
		 /**
			* 生命周期函数--监听页面隐藏
			*/
	    onHide: function() {
			this.stop = true;
			this.sec = 0
	    },
		 /**
		   * 生命周期函数--监听页面卸载
		   */
		onUnload: function() {
		   this.stop = true;
		   this.sec = 0
		},
		/**
		   * 用户点击右上角分享
		   */
	    onShareAppMessage: function() {
			return {
			  title: '青岛啤酒辽宁',
			  path: '/pages/home/home',
			  imageUrl: this.imgUrl + 'share.png'
			}
	    },
		methods: {
			async checkPrize(){
				uni.showLoading({
					title: '兑奖中',
				})
				var params = {
					"openid": this.$store.state.openid, // this.$store.state.openid
					"checkRemarks": this.checkRemarks,
					"prizeInfoKey": this.checkPrizeRecord.infoKey,
					"projectServerName": 'liaoning',
				};
				console.log(this.$store.state.openid)
				console.log( this.checkRemarks)
				var checkRes = await post('/checkUser/checkPrize', params);
				console.log('checkPrize' + checkRes); // reply result replyTime
				uni.hideLoading();
				
				if (checkRes.result.businessCode == 0) {
				  uni.showModal({
				    title: '提示',
				    content: '兑奖成功！',
				    showCancel: false,
				    confirmText: '我知道了'
				  })
				 this.readOnly = true ; // 禁止生效
				 this.checkOver = true; 
				} else {
				  uni.showModal({
				    title: '提示',
				    content: res.data.result.msg,
				    showCancel: false,
				    confirmText: '我知道了'
				  })
				}
			},
			dj(){
			    console.log('dj');
			    this.checkPrize();
			},		
		}
	}
</script>

<style scoped lang="scss">
	/* pages/result/verification.wxss */
	page{
	  background: #ebebeb;
	  scroll-view{
	    width: 95%;
	    height: 100%;
	    margin: 0 auto;
		.msg_box{
		  margin: 20rpx auto;
		  border-radius: 10rpx;
		  border: 1px #ccc solid;
		  overflow: hidden;
		  &>view{
			  display: flex;
			  justify-content: center;
			  background: #fff;
			  border-bottom: 1px #ccc solid;
			  font-size: 26rpx;
			  color: #333;
			  &:nth-last-of-type(1){
				border: 0;
			  }
			  &:nth-of-type(1){
			    border: 0;
			  }
		  }
		  view{
			 image{
			   width: 240rpx;
			   display: block;
			   margin: 30rpx auto;
			 }
			 &>input{
			  width: 500rpx;
			  line-height: 80rpx;
			  height: 80rpx;
			  text-align: left;
			}
			&>text{
			  width: 187rpx;
			  text-align: right;
			  line-height: 80rpx;
			}
		  }
		  .prizeImg{
		    width: 240rpx;
		    display: block;
		  }
		}
		.tip{
		  color: #e95a4a;
		  display: block;
		  text-align: center;
		  font-size: 30rpx;
		  font-weight: bold;
		}
		button{
		  background: #51a938;
		  border: 1px #51a938 solid;
		  border-radius: 10rpx;
		  color: #fff;
		  margin: 30rpx auto;
		  &[disabled]{
			  background: #51a938 !important;
			  border: 1px #51a938 solid !important;
			  color: #fff !important;
		   }
		}
		.sign{
		  width: 240rpx;
		  position: absolute;
		  right: 50rpx;
		  top: 40%;
		}
	  }
	}
</style>
