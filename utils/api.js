// var host = 'https://douban.uieee.com/v2/movie';
// var host = 'https://douban.uubake.com/v2/movie';

var isOnline = true ;  //  false            

var config = {};
if (isOnline) {
	config = {
		staticUrl: 'https://xcxsite.vjifen.com/v/crownCookiesImg/',
		goodsImgRoot: 'http://img.vjifen.com:8000/images/vma/', //积分商城图片
		qrUrl: 'HTTP://VJ1.TV',
		hxqrUrl: 'HTTP://VJ1.TV/LN/',
		wxUrl: 'https://x.vjifen.com',
		// requestUrl_ln: 'https://lnqp.vjifen.com/DBTLNQPInterface',
		requestUrl_ln:'https://mapi.vjifen.com/vjifenInterface',
		appid_ln: 'wx347148911badcf19',
		payAppid_ln: 'wxa42a20606316e2e9',
		startDate:'2019/08/31 23:59:59',
	}
} else {
	config = {
		staticUrl: 'https://xcxsite.vjifen.com/v/crownCookiesImg/',
		goodsImgRoot: 'http://img.vjifen.com:8000/images/vma/', //积分商城图片
		qrUrl: 'http://xt.vjifen.com',
		hxqrUrl: 'http://xt.vjifen.com/LN/',
		wxUrl: 'https://xt.vjifen.com',
		// requestUrl_ln: 'http://192.168.1.230:8090/vjifenInterface',
		requestUrl_ln: 'https://vtt.vjifen.com:447/vjifenInterface',
		appid_ln: 'wx1ce2ca65ccc5aa5e',
		payAppid_ln: 'wx459ee9aa61f38da3',
		startDate:'2019/08/31 23:59:59', 
	}
}

export {
	config
}

function request(url, method, data = {}) {
	return new Promise((resolve, reject) => {
		data.projectServerName = 'hgquqi';
		uni.request({
			url: config.requestUrl_ln + url,
			method: method,
			data: data,
			header: {
				'Content-Type': 'application/json',
			},
			success: (result) => {
				resolve(result.data);
			},
			fail: (error) => {
				reject(error);
			}
		})
	})
}

export function requestGet(url, data = {}) {
	return request(url, 'GET', data);
}
export function requestPost(url, data = {}) {
	return request(url, 'POST', data);
}

// 验证身份证号码
const idcardValidate = (idds) => {
  let weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
    validate = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  let reg2 = /^[1-9][0-9xX]{17}$/;
  let sum = 0, mod = 0, ymd = [];
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
export {
	idcardValidate
}


export function getCityInfo() {
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
