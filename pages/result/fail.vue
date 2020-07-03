<template>
	<view class="fail">
		<view class="head">
			<image :src="imgUrl + 'logo.png' " mode="widthFix" class="logo"></image>
		</view>
		<view class="tipBox">
			<view class="tip">
				<view class="word-l" >
					<text>{{title}}</text>
					<!-- 你输入的次数太多 -->
				</view>
				<text class="word-s">{{tip}}</text>
			</view>
		</view>
		
		 <view class="batch">
			 <text v-if="batch">批次：{{batch}}\n</text>
			 <text v-if="bizcode==4">服务热线：{{tel}}</text>
	    </view>

		
		<view class="btn" @click="iknow">我知道了</view>
	
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
			name: 'fail'
			return {
				imgUrl: config.staticUrl,
				title:'',
				tip:'',
				bizcode:'',
				batch:'',
				// tel: '15801152037'
				tel:'',
			}
		},
		onLoad(options) {
			if(options.bizcode == 1){
				this.title = '这个二维码\n不存在',
			    this.tip = '',
			    this.bizcode = options.bizcode
			}else if(options.bizcode == 2){
				this.title = '这个二维码\n已被扫',
			    this.tip = '扫码时间：' + this.$store.state.sweepData.reply.earnTime,
			    this.bizcode = options.bizcode
			}else if(options.bizcode == 3){
				this.title = '这个二维码\n已过期',
			    this.tip = '这么好的酒，要学会珍惜哦',
			    this.bizcode = options.bizcode
			}else if(options.bizcode == 4){
				this.title = '活动未开始';
			    this.tip = '心急喝不了好啤酒，再等等哦';
			    this.bizcode = options.bizcode;
				if(this.$store.state.sweepData.reply){
					this.batch = this.$store.state.sweepData.reply.batchName;
					this.tel = this.$store.state.sweepData.reply.activateBatchLinkPhoneNum; //电话号码
				}
			}else if(options.bizcode == 5){
				this.title = '活动已截止', 
			    this.tip = '好酒不等人，下次早点来哦',
			    this.bizcode = options.bizcode
			}else if(options.bizcode == 6){
				this.title = '系统繁忙',
			    this.tip = '稍等片刻，畅想欢聚时刻',
			    this.bizcode = options.bizcode
			}else if(options.bizcode == -1){
				this.title = '系统升级中',
			    this.tip = '稍安勿躁，敬请关注',
			    this.bizcode = options.bizcode
			}else if(options.bizcode == 18){
				this.title = '此码未被使用',
			    this.tip = '',
			    this.bizcode = options.bizcode
			}else if(options.bizcode == 17){
				this.title = '好酒美味\n更需趁早',
			    this.tip = '您扫的这瓶酒\n所属产品批次活动已结束',
			    this.bizcode = options.bizcode;
				if(this.$store.state.sweepData.reply){
					this.batch = this.$store.state.sweepData.reply.batchName
				}
			}else if(options.bizcode == 19){ //漏码
				this.title = '您离红包只差一点点~\n再扫一瓶试试看',
			    this.tip = '',
			    this.bizcode = options.bizcode
			}else{
				this.title = '',
			    this.tip = this.$store.state.sweepData.result.msg,
			    this.fsz =1,
			    this.bizcode = options.bizcode
			}
		},
		methods:{
			iknow(){
				uni.switchTab({
					url:'../home/home'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fail {
		width: 100%;
		height: 100%;
		background-image: linear-gradient(#008838, #003f0a);
		background-size: 100%;
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
		.head {
			height: 186upx;
			padding: 82upx;
			padding-bottom:0;
			.logo {
				width: 150upx;
				padding-right: 30upx;
			}
		}
		.tipBox {
			background: url('https://xcxsite.vjifen.com/v/lnqp/failImg.png') no-repeat bottom center;
			background-size: 100% auto;
			width:100%;
			height:846upx;
			top: -10%;
			position: relative;
			text-align: center;
			.tip{
				position: relative;
				margin:0 auto;
				// left:30%;
				top:40%;
				.word-l{
					font-size:42upx;
					color:#fff473;
					padding-top:40upx;
					font-weight:bold;
				}
				.word-s{
					display: inline-block;
					font-size:24upx;
					color:#fff;
					padding-top:40upx;
				}
			}
		}
		
		.batch{
		  position: absolute;
		  // bottom: 0;
		  bottom: 20rpx;
		  z-index: 1;
		  width: 100%;
		  text-align: center;
		  color: #fff;
		  font-weight: bold;
		  // font-size: 40rpx;
		  font-size: 32rpx;
		  text:nth-of-type(1){
		    font-size: 30upx;
		  }
		}
		.btn{
			width: 380upx;
			height:86upx;
			line-height:86upx;
			margin:0 auto;
			background: #ffea9e;
			border-radius: 36upx;
			text-align: center;
			color:#e94746;
			font-size:32upx;
			font-weight:bold;
			letter-spacing: 8upx;
			bottom: 10%;
			position: relative;
		}
	}
</style>

