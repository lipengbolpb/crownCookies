import Vue from 'vue'
import App from './App'
//挂载Vuex
// 在uni-app中愉快地使用vuex
import store from './store'  
Vue.prototype.$store = store  

Vue.config.productionTip = false


// Vue.prototype.$bus = new Vue();
// vue.$bus.emit()

App.mpType = 'app'

const app = new Vue({
    ...App,
	store   //挂载
})
app.$mount()
