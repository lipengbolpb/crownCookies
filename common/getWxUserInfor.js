// 所有获取 微信用户 信息存放
import {
	get,
	requestPost,
	request,
	config
} from '@/utils/api.js';
// 获取地理位置信息
function getCityInfo() {
	return new Promise((resolve, reject) => {
		wx.getLocation({
			success: (data) => {
				var url = 'http://api.map.baidu.com/geocoder?location=纬度,经度&output=输出格式类型&key=用户密钥'
				var latitude = data.latitude,
					longitude = data.longitude;
				wx.request({
					url: 'https://api.map.baidu.com/geocoder',
					method: 'GET',
					dataType: 'json',
					data: {
						key: '4ATeuGLwAt08UunArKywQ1KyYalvpdi8',
						location: latitude + ',' + longitude,
						output: 'json'
					},
					success: (data) => {
						resolve(data.data.result);
					},
					fail: (err) => {
						reject(err);
					}
				})
			},
			fail: (error) => {
				reject(error);
			}
		})
	})
}

/**
 * 获取用户 基础信息
 */
function getUserInfo() {
	return new Promise((resolve, reject) => {
		const that = this;
		uni.getUserInfo({
			success: function(res) {
				console.log(res)
				resolve(res);
				// 存储 头像 昵称 等 基础信息
				uni.setStorage({
					key: 'userInfo',
					data: res.userInfo
				})
			},
			fail: (err) => {
				reject(err);
			}
		})
	})
}

/**
 * 获取用户 位置信息
 */
function getLocation() {
	return new Promise((resolve, reject) => {
		const that = this;
		uni.getLocation({
			type: 'wgs84',
			complete: res => {
				// 经度 longitude
				// 维度 latitude
				//精度 accuracy
				if (res.errMsg == "getLocation:ok") {
					resolve([0, res]);
					// 存储 用户 位置信息
					const data = res || {};
					uni.setStorageSync('userLocation', data);
				} else if (res.errMsg == 'getLocation:fail auth deny' || res.errMsg ==
					'getLocation:fail authorize no response') { //未授权
					resolve([1]); //获取授权
				} else if (res.errMsg == 'getLocation:fail:auth denied') { //取消授权
					resolve([2]);
				} else { // 未打开定位也要允许扫码
					resolve([3]);
				}
			}
		})
	})
}

/**
 * 解析用户手机号
 */
function analysisMobile(session_key, encryptionData) {
	const that = this;
	return new Promise((resolve, reject) => {
		const params = {
			'sessionKey': session_key,
			'encryptedData': encryptionData.encryptedData,
			'iv': encryptionData.iv,
			'provinceCode': 'hgqq'
		};
		uni.request({
			url: 'https://xcxact.vjifen.com/api/decrypt',
			method: 'POST',
			data: params,
			success: res => {
				console.log(res);
				const backData = res.data.data.decryptData;
				uni.setStorage({
					key: 'userMobileData',
					data: backData
				})
				resolve(backData);
			},
			fail: err => {
				uni.showModal({
					title: '提示',
					content: '解析手机号结果' + res.data
				})
				reject('decrypt', err)
			}
		})
	})
}

/**
 * //检测session是否过期
 *	//0未过期 1已过期
 */
const checkSession = () => {
	const promise = new Promise((resolve, reject) => {
		uni.checkSession({
			success() {
				console.log('状态未过期')
				//未过期
				resolve(0)
			},
			fail() {
				console.log('状态已过期')
				//已过期
				resolve(1)
			}
		})
	}).catch(res => {
		uni.showToast({
			icon: 'none',
			title: res.errMsg || '验证session失效',
			duration: 2000
		});
	})

	return promise
}

// 获取 code 
const getCode = function() {
	const promise = new Promise((resolve, reject) => {
		uni.login({
			success: function(loginRes) {
				if (loginRes && loginRes.code) {
					resolve(loginRes.code)
				} else {
					reject(loginRes)
				}
			}
		});
	}).catch(res => {
		uni.showToast({
			icon: 'none',
			title: res.errMsg || '获取code失败',
			duration: 2000
		});
	})
	return promise
}

//验证授权状态 2未操作 1已经授权  0拒绝授权
const getSetting = function() {
	const promise = new Promise((resolve, reject) => {
		uni.getSetting({
			success(res) {
				let authSetting = res.authSetting
				//授权成功
				if (authSetting['scope.userInfo']) {
					resolve(1)
					return
				}
				//拒绝授权
				if (authSetting['scope.userInfo'] === false) {
					resolve(0)
					return
				}

				resolve(2)
			},
			fail(res) {
				reject(res)
			}
		})
	}).catch(res => {
		uni.showToast({
			icon: 'none',
			title: res.errMsg || '获取授权状态失败',
			duration: 2000
		});
	})
	return promise
}

//验证位置 状态 2未操作 1已经授权  0拒绝授权
const getSettingLocation = function() {
	const promise = new Promise((resolve, reject) => {
		uni.getSetting({
			success(res) {
				let authSetting = res.authSetting
				//授权成功
				if (authSetting['scope.userLocation']) {
					resolve(1)
					return
				}
				//拒绝授权
				if (authSetting['scope.userLocation'] === false) {
					resolve(0)
					return
				}
				resolve(2)
			},
			fail(res) {
				reject(res)
			}
		})
	}).catch(res => {
		uni.showToast({
			icon: 'none',
			title: res.errMsg || '获取位置状态失败',
			duration: 2000
		});
	})
	return promise
}

/**
 * 用 code 交换 openid session_key
 */
const getOpenid = function(code = '', provinceCode = '') {
	const sendUrl = 'https://xcxact.vjifen.com/api/getOpenid';
	const sendData = {
		code,
		provinceCode
	}
	const promise = new Promise((resolve, reject) => {
		uni.request({
			url: sendUrl,
			method: 'POST',
			data: sendData,
			success: (result) => {
				const backData = result.data;
				if (backData.code == 0) {
					//储存用户信息到本地
					let data = backData.data || {};
					uni.setStorageSync('userData', data);
					resolve(backData.data);
				} else {
					console.log(2)
					resolve(result.msg);
				}
			},
			fail: (error) => {
				reject(error);
			}
		});
	})
	return promise
}


// 拨打电话
/**
 * 拨打电话 - 可简单封装工具集
 */
function callPhone(phoneNumber) {
	uni.makePhoneCall({
		phoneNumber: phoneNumber,
		success: function() {
			console.log("拨打电话成功！")
		},
		fail: function() {
			console.log("拨打电话失败！")
		}
	})
}
import { dateformat } from '@/common/basicsFun.js';
// 扫一扫
function wxScanCode() {
	uni.scanCode({
		success: function(res) {
			console.log('条码类型：' + res.scanType);
			console.log('条码内容：' + res.result);
			uni.setStorage({
				key: "codeData",
				data: res
			})
			uni.setStorage({
				key: "sweepstr",
				data: res.result
			})
			const dateStatus = dateformat(config.startDate);
			console.log("dateStatus");
			console.log(dateStatus);
			console.log(config.startDate);
			uni.setStorage({
				key: "dateStatus",
				data: dateStatus == true ? '1' : '0'
			})
			uni.setStorage({
				key: "isInitsweepstr",
				data: 'true'
			})
			getApp().globalData.isInitsweepstr = 'true';
			if (!dateStatus) {
				uni.switchTab({
					url: '../index/index',
					complete() {
						getApp().globalData.openQrcode = false
					}
				})
			} else {
				uni.redirectTo({
					url: '../activityEntrance/activityEntrance?sweepstr=' + encodeURIComponent(res.result)+'&status=1',
					complete() {
						getApp().globalData.openQrcode = false
					}
				})
			}
		},
		fail: function(res) {
			console.log('我是扫一扫页面')
			console.log(res);
			uni.switchTab({
				url: '../index/index',
				complete() {
					getApp().globalData.openQrcode = false
				}
			})
		}
	})
}
export {
	getLocation,
	analysisMobile,
	checkSession,
	getCode,
	getOpenid,
	getSettingLocation,
	getUserInfo,
	callPhone,
	wxScanCode
}
