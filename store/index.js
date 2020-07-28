
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


const store = new Vuex.Store({  
    state: {  // 定义常量
		openScan:true,
		userInfo:{},
		isIPX:false,
		staticUrl: 'https://xcxsite.vjifen.com/v/crownCookiesImg/',
		startDate:'2020/08/31 23:59:59',
		qr:'',
		qrcode:'',
		provinceCode:'',
		xcxopenid:'',
		session_key:'',
		openid:'',
		hbopenid:'',
		sweepData:'',
		phoneNumber:'',
		
        login: false,  
        token: '',  
        avatarUrl: '',  
        userName: '' ,
		cart:'',
		orderInfo:{
			allPrice:0,
			discount:.3,
			shopName:'名称',
			dishName:[]
		},
		todos: [
		  { id: 1, text: '...', done: true },
		  { id: 2, text: '...', done: false }
		]
    },  
	
    mutations: {  
		getUserInfo(state,data){
			state.userInfo = data
		},
		userPhone(state,data){
		    state.phoneNumber = data;
		},
	    getOpenid(state,data){
		    state.openid = data;
		},
		getHbopenid(state,data){
			state.hbopenid = data;
		},
		xcxopenid(state,data){
			state.xcxopenid = data;
		},
		session_key(state,data){
			state.session_key = data;
		},
		getQr(state,data){
			state.qr = data;
		},
		getQrcode(state,data){
			state.qrcode = data;
		},
		getProvinceCode(state,data){
			state.provinceCode = data;
		},
		isIPX(state,data){
			state.isIPX = data;
		},
		
		
        login(state, provider) {  
            console.log(state)  
            console.log(provider)  
            state.login = true;  
            state.token = provider.token;  
            state.userName = provider.userName;  
            state.avatarUrl = provider.avatarUrl;  
        },  
        logout(state) {  
            state.login = false;  
            state.token = '';  
            state.userName = '';  
            state.avatarUrl = '';  
        },
		
		sweepQr(state,sweep){
			state.sweepData = sweep
		},
		COMMITORDER(state,data){
			state.orderInfo = order
		},  
		addCart(state,data){
		    state.cart = data;
		},
		updateOpenScan(state,data){
			state.openScan = data
		}
    },
	actions: {
		sweepResult({commit},data){
			commit('sweepQr',data)
		},
		commitOrder({commit},data){
			commit('COMMITORDER',data)
		},

		xcxOpenidGet() { //获取小程序openid
		  var that = this;
		   return new Promise((reslove, reject) => {
			 uni.getStorage({
			   key: 'xcxopenid',
			   complete: function (res) {
				 if (res.errMsg.indexOf('ok') == -1) {
				   // 调用
				   uni.login({
					 success: res => {
					   var params = {
						   'code':res.code,
						   'provinceCode':'hgqq'
					   }
					   uni.request({
						 url: 'https://xcxact.vjifen.com/api/getOpenid',
						 method:'POST',
						 data: params,
						 success: res => {
						   // reslove(res.data)
						   console.log(res.data)
						   that.state.xcxopenid = res.data.data.uinfo.openid;
						   that.state.session_key = res.data.data.uinfo.session_key;
						 },
						 fail: err => {
						   reject(err)
						 }
					   })
					 }
				   })
				 } else {
				   uni.checkSession({
					 success() {
					   console.log('checkSession success', res.data)
					   reslove(res.data)
					 },
					 fail() {
					   uni.login({
						 success: res => {
						   var params = {
							   'code':res.code,
							   'provinceCode':'hgqq'
						   }
						   uni.request({
							 url: 'https://xcxact.vjifen.com/api/getOpenid',
							 method:'POST',
							 data: params,
							 success: res => {
							   // reslove(res.data)
							   console.log(res.data)
							   this.state.xcxopenid = res.data.data.uinfo.openid;
							   this.state.session_key = res.data.data.uinfo.session_key;
							 },
							 fail: err => {
							   reject(err)
							 }
						   })
						 }
					   })
					 }
				   })
				 }
			   },
			 })
		   })
		}		
	},
		
	getters:{
	  doneTodos: state => {
	     return state.todos.filter(todo => todo.done)
	  },
	  doneTodosCount:(state,getters) => {
		  return getters.doneTodos.length
	  }
	}
})  


export default store