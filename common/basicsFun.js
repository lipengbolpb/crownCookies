// 验证身份证号码
const idcardValidate = (idds) => {
	let weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
		validate = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
	let reg2 = /^[1-9][0-9xX]{17}$/;
	let sum = 0,
		mod = 0,
		ymd = [];
	if (reg2.test(idds)) {
		for (let i = 0; i < 17; ++i) {
			sum += parseInt(idds[i], 10) * weight[i];
			if (i > 5 && i < 14) ymd.push(idds[i]);
		}
		mod = sum % 11;
		return validate[mod] === idds[17].toUpperCase() && reg2.test(idds);
	} else {
		return reg2.test(idds);
	}
}

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
 * 获取用户信息
 */
function bfGetUserInfo() {
	return new Promise((resolve, reject) => {
		 const that = this;
		 uni.getUserInfo({
		 	success: function(res) {
				console.log(res)
				resolve(res);
		 		// 存储头像
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

export {
	bfGetUserInfo
}
