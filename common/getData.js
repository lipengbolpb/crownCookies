// 所有接口请求存放
import {
	requestGet,
	requestPost,
	config
} from '@/utils/api.js';

// 扫码接口
function sweepQrcode(sendParams) {
	uni.showLoading({
		title: '加载中'
	});
	return new Promise((resolve, reject) => {
		if (sendParams.openid == '') {
			sendParams.openid = uni.getStorageSync("userData").uinfo.openid;
		}
		if(uni.getStorageSync('userInfo')){
			sendParams.nickname = uni.getStorageSync('userInfo').nickName;
			sendParams.headimgurl = uni.getStorageSync('userInfo').avatarUrl;
		}else{
			sendParams.nickname = '';
			sendParams.headimgurl = '';
		} 
		
		console.log('获取 扫码接口 返回信息 并处理');
		// 清除 扫码入口 存储得 标记
		uni.removeStorageSync('isInitsweepstr');
		getApp().globalData.isInitsweepstr='false';
		
		const isInitsweepstr = uni.getStorageSync('isInitsweepstr');
		console.log('getApp().globalData.isInitsweepstr');
		console.log(getApp().globalData.isInitsweepstr);
		console.log(isInitsweepstr);
		
		
		// if(sendParams.sweepstr){
		// 	const storageSweepstr = uni.getStorageSync('sweepstr');
		// }else{
			
		// }
		// uni.setStorage({
		// 	key:"sweepstr",
		// 	data:res.result
		// })
		
		console.log("backParams");
		console.log(sendParams);
		requestPost('/sweep/sweepQrcode', sendParams).then((backParams) => {
			uni.hideLoading();
			// const [e, r] = backParams;
			console.log(backParams);
			if (backParams) {
				uni.setStorage({
					key: 'sweepQrcodeData',
					data: backParams
				})
				uni.setStorage({
					key: 'codeType',
					data: 1
				})
				const backData = backParams.result;
				if (backParams.result.code == 0) {
					if (resolve) {
						resolve(backParams);
					}
				} else {
					uni.showModal({
						title: '扫码接口提示',
						content: '系统开了个小差',
						showCancel: false,
						complete: res => {
							if (res.confirm) {
								uni.switchTab({
									url: '../index/index'
								})
							}
						}
					})
				}
			} else {
				uni.showModal({
					title: '扫码接口提示',
					content: '系统繁忙',
					showCancel: false,
					complete: res => {
						if (res.confirm) {
							uni.switchTab({
								url: '../index/index'
							})
						}
					}
				})
			}
		});
	})
} 
  
// 获取验证码
function getCaptcha(phonenum) {
	uni.showLoading({
		title: '获取中'
	});
	return new Promise((reslove, reject) => {
		const sendParams = {
			phonenum: phonenum,
			sendtype: '1',
		}
		requestPost('/user/getCaptcha', sendParams).then((backParams) => {
			uni.hideLoading();
			reslove(backParams);
		});
		// url: 'https://mapi.vjifen.com/vjifenInterface/user/getCaptcha',
	});
}

// 黑名单 提交
function updateUserInfoMobile(openid, phonenum, captcha) {
	uni.showLoading({
		title: '提交中',
	})
	return new Promise((reslove, reject) => {
		const sendParams = {
			"openid": openid,
			"phonenum": phonenum,
			"captcha": captcha,
		}
		requestPost('/user/updateUserInfoMobile', sendParams).then((backParams) => {
			uni.hideLoading();
			reslove(backParams);
		});
		// url: 'https://mapi.vjifen.com/vjifenInterface/user/getCaptcha',
	});
}

// 中 大奖 填写个人信息
function savePrize(sendParams) {
	uni.showLoading({
		title: '提交中',
	})
	return new Promise((reslove, reject) => {
		requestPost('/user/savePrize', sendParams).then((res) => {
			uni.hideLoading();
			// let [e,r] =res
			console.log(res);
			if (res) {
				const resultData = res.result;
				if (resultData.code == 0) {
					if (resultData.businessCode == 0) { //提交成功
						// 提交成功 then 处理后续逻辑
						reslove(1);
					} else if(resultData.businessCode == 4){
						reslove(4);
					} else {
						uni.showModal({
							title: "提示",
							content: resultData.msg ? resultData.msg : '系统开了个小差',
							showCancel: false
						})
					}
				} else {
					uni.showModal({
						title: "提示",
						content: resultData.msg ? resultData.msg : '系统开了个小差',
						showCancel: false
					})
				}
			} else {
				console.log(e)
				uni.showModal({
					title: "提示",
					content: '系统繁忙',
					showCancel: false
				})
			}
		});
	})
}

// 个人中心 获取展示数据
function queryUserHomePage() {
	const userData = uni.getStorageSync('userData');
	const openid = userData.uinfo.openid;
	var params = {
		openid: openid,
		hbopenid: ''
	};
	const promise = new Promise((reslove, reject) => {
		requestPost('/turnaroundDraw/queryUserHomePage', params).then((jo) => {
			console.log('queryUserHomePage');
			console.log(jo);
			if (jo.result.code == 0) {
				if (jo.result.businessCode == 0) {
					reslove(jo)
				} else {
					reslove()
				}
			} else {
				// uni.showModal({
				// 	title: '提示',
				// 	content: jo.result.msg
				// });
			}
		},(err)=>{
			console.log('queryUserHomePage');
			console.log(err);
		})
	})
	return promise;
}

// 获取红包 列表 
function queryAllGiftsList(currentPage, count) {
	const userData = uni.getStorageSync('userData');
	const openid = userData.uinfo.openid;
	const params = {
		openid: openid,
		hbopenid: '',
		currentPage: currentPage,
		count: count
	};
	uni.showLoading({
		title: '加载中',
	})
	const promise = new Promise((reslove, reject) => {
		requestPost('/gifts/queryAllGiftsList', params).then((jo) => {
			setTimeout(function(){uni.hideLoading();},300)
			if (jo.result.code == 0) {
				if (jo.result.businessCode == 0) {
					reslove(jo.reply)
				} else {
					reslove(false)
				}
			} else {
				uni.showModal({
					title: '提示',
					content: jo.result.msg
				});
			}
		})
	})
	return promise;
}

// 输入串码 是 验证 用户 状态
function getFailCount() {
	const userData = uni.getStorageSync('userData');
	const openid = userData.uinfo.openid;
	const sendParams = {
		"openid": openid, // this.$store.state.openid
	};
	return new Promise((reslove, reject) => {
		requestPost('/sweep/getFailCount', sendParams).then((res) => {
			const backRes = res.result;
			if (backRes.code === '0') {
				switch (backRes.businessCode) {
					case '0':
						//只输入验证码
						reslove(false);
						break;
					case '1': // 1 - 程序异常,
						uni.showModal({
							title: '尊敬的用户',
							content: '呜呜，系统开了个小差，请稍后重试！',
						})
						break;
					case '2': // 2 - 需要验证码
						// 手机号 + 验证码 输入
						reslove(true);
						break;
					case '3': // 3 - 错误超过6次  //只输入串码  不用输入 手机号验证码
						reslove(false);
						break;
					default:
						uni.showModal({
							title: '未知返回码',
							content: backRes.businessCode + backRes.msg
						})
				}
			} else {
				uni.showModal({
					title: '尊敬的用户',
					content: '呜呜，系统开了个小差，请稍后重试！',
				})
			}
		})
	})
}

// 输入串码 领取串码
function serialCode(sendParams) {
	return new Promise((resolve, reject) => {
		if (sendParams.openid == '') {
			sendParams.openid = uni.getStorageSync("userData").uinfo.openid;
		}
		if(uni.getStorageSync('userInfo')){
			sendParams.nickname = uni.getStorageSync('userInfo').nickName;
			sendParams.headimgurl = uni.getStorageSync('userInfo').avatarUrl;
		}else{
			sendParams.nickname = '';
			sendParams.headimgurl = '';
		} 
		requestPost('/sweep/serialCode', sendParams).then((backParams) => {
			// const [e, r] = backParams;
			console.log("backParams");
			console.log(backParams);
			if (backParams) {
				uni.setStorage({
					key: 'sweepQrcodeData',
					data: backParams
				})
				// 存储标识 是 扫码：1 还是  串码：2  
				// 
				uni.setStorage({
					key: 'codeType',
					data: 2
				})
				const backData = backParams.result;
				if (backParams.result.code == 0) {
					if (resolve) {
						resolve(backParams);
					}
				} else {
					uni.showModal({
						title: '尊敬的用户',
						content: '呜呜，系统开了个小差，请稍后重试！'
					})
				}
			} else {
				uni.showModal({
					title: '尊敬的用户',
					content: '呜呜，系统开了个小差，请稍后重试！'
				})
			}
		});
	})
}

// 提现 
function giveSpackTx() { //提现
	// 	uni.showLoading({
	// 		title: '提现中...',
	// 	}) 
	return new Promise((resolve, reject) => {
		const userData = uni.getStorageSync('userData');
		const openid = userData.uinfo.openid;

		const userMobileData = uni.getStorageSync('userMobileData') || '';
		const phoneNumber = userMobileData.phoneNumber || '';

		const sendParams = {
			"openid": openid,
			"hbopenid": openid,
			"phoneNumber": phoneNumber,
		}
		console.log("giveSpackTx giveSpackTxgiveSpackTxgiveSpackTx");
		console.log(sendParams);
		requestPost('/gifts/getGiftspack', sendParams).then((backParams) => {
			uni.hideLoading();
			// const [e, r] = backParams;
			console.log("giveSpackTx giveSpackTxgiveSpackTxgiveSpackTx");
			console.log(backParams);
			const backResult = backParams.result;
			if (backResult.code == '0') {
// 				if(backResult.businessCode==5){
// 					uni.showModal({
// 						title: '提示',
// 						content: backResult.msg,
// 					})
// 				} else {
// 					resolve(backResult.businessCode);
// 				}
				resolve(backResult);
			} else if (backResult.code == '-1') {
				reject(backResult.code);
			} else { // code!='0' 服务失败
				reject(backResult.code);
			}
		});
	})
}

export {
	sweepQrcode,
	getCaptcha,
	updateUserInfoMobile,
	savePrize,
	queryUserHomePage,
	queryAllGiftsList,
	getFailCount,
	serialCode,
	giveSpackTx
}
