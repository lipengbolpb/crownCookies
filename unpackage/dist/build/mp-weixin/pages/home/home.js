(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/home/home"],{1548:function(e,t,n){"use strict";n.r(t);var o=n("6005"),r=n.n(o);for(var a in o)"default"!==a&&function(e){n.d(t,e,(function(){return o[e]}))}(a);t["default"]=r.a},"1b7f":function(e,t,n){"use strict";var o,r=function(){var e=this,t=e.$createElement;e._self._c},a=[];n.d(t,"b",(function(){return r})),n.d(t,"c",(function(){return a})),n.d(t,"a",(function(){return o}))},"1cd8":function(e,t,n){"use strict";(function(e){n("d916");o(n("66fd"));var t=o(n("7a92"));function o(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("543d")["createPage"])},"3cc5":function(e,t,n){},6005:function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=a(n("4795")),r=n("51c7");function a(e){return e&&e.__esModule?e:{default:e}}function i(e,t,n,o,r,a,i){try{var u=e[a](i),c=u.value}catch(s){return void n(s)}u.done?t(c):Promise.resolve(c).then(o,r)}function u(e){return function(){var t=this,n=arguments;return new Promise((function(o,r){var a=e.apply(t,n);function u(e){i(a,o,r,u,c,"next",e)}function c(e){i(a,o,r,u,c,"throw",e)}u(void 0)}))}}var c={name:"home",data:function(){return{imgUrl:r.config.staticUrl,sharePath:"pages/home/home?provinceCode=LN",shareImg:"",openid:"",userInfo:{avatarUrl:"",nickName:""},ipx:!1,statusBarH:this.StatusBar,customBarH:this.CustomBar,dotStyle:!1,cardCur:0,swiperList:[{id:0,type:"image",expirationTime:"2020/06/07",url:"https://xcxsite.vjifen.com/v/lnqp/2.0/lnbar0605.jpg?v=1.0.1"},{id:1,type:"image",url:"https://xcxsite.vjifen.com/v/lnqp/2.0/banner2.png?v=1.0.1"}],allAccountMoney:"0",total:"0",userScanMonthCount:"0",totalMoney:"0",switchTurntable:""}},computed:{swiperListNew:function(){var e=(new Date).getTime(),t=[];return this.swiperList.forEach((function(n){n.expirationTime?e<=new Date(n.expirationTime).getTime()&&t.push(n):t.push(n)})),t}},onLoad:function(){var t=this;return u(o.default.mark((function n(){var r;return o.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:t.$store.state.isIPX&&(t.ipx=!0),console.log("openid"+t.$store.state.openid),t.openid=t.$store.state.openid,r=t,e.getStorage({key:"userMsg",success:function(t){r.openid=t.data.openid,console.log(r.openid),r.$store.commit("getOpenid",t.data.openid),r.openid||e.navigateTo({url:"../getOpenid/getOpenid?provinceCode=LN&type=openid"})},fail:function(){r.openid||e.navigateTo({url:"../getOpenid/getOpenid?provinceCode=LN&type=openid"}),console.log(r.openid)}}),e.getStorage({key:"userInfo",success:function(e){console.log(e.data),r.userInfo=e.data}});case 6:case"end":return n.stop()}}),n)})))()},onShow:function(){var t=this;e.getStorage({key:"userMsg",success:function(n){console.log(n.data),t.openid=n.data.openid,console.log(t.openid),t.$store.commit("getOpenid",n.data.openid),t.openid?t.initData():e.navigateTo({url:"../getOpenid/getOpenid?provinceCode=LN&type=openid"}),console.log("啦啦啦啦home"+t.$store.state.openid)},fail:function(){t.openid||e.navigateTo({url:"../getOpenid/getOpenid?provinceCode=LN&type=openid"}),console.log(t.openid)}}),e.getStorage({key:"userInfo",success:function(e){console.log(e.data);e.data;t.userInfo.avatarUrl=e.data.avatarUrl},fail:function(e){}})},onShareAppMessage:function(e){return"button"===e.from&&console.log(e.target),{title:"青岛啤酒",path:"/pages/home/home",imageUrl:this.imgUrl+"share.png"}},mounted:function(){},methods:{initData:function(){var t=this;return u(o.default.mark((function n(){var a,i;return o.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return a={openid:t.$store.state.openid,hbopenid:"",projectServerName:"liaoning"},n.next=3,(0,r.post)("/turnaroundDraw/queryUserHomePage",a);case 3:i=n.sent,console.log("首页数据"+i),0==i.result.code?0==i.result.businessCode?(t.allAccountMoney=String(i.reply.allAccountMoney),t.total=String(i.reply.total),t.totalMoney=String(i.reply.totalMoney),t.userScanMonthCount=String(i.reply.userScanMonthCount),t.switchTurntable=i.reply.switchTurntable):(t.allAccountMoney="0",t.total="0",t.totalMoney="0",t.userScanMonthCount="0"):e.showModal({title:"提示",content:i.result.msg});case 6:case"end":return n.stop()}}),n)})))()},getUserInfoFn:function(){var t=this;e.getUserInfo({success:function(n){console.log(n.userInfo),t.userInfo.avatarUrl=n.userInfo.avatarUrl,t.userInfo.nickName=n.userInfo.nickName,e.setStorage({key:"userInfo",data:n.userInfo})}})},cardSwiper:function(e){this.cardCur=e.detail.current},scanGetInfo:function(){e.navigateTo({url:"./scanPrize"})},brandStory:function(){e.navigateTo({url:"./brandStory"})},brandActive:function(){e.switchTab({url:"../brandActive/brandActive"})},proBuy:function(){e.navigateTo({url:"./proOrder"})},game:function(){e.navigateTo({url:"./game?switchTurntable="+this.switchTurntable})}}};t.default=c}).call(this,n("543d")["default"])},"7a92":function(e,t,n){"use strict";n.r(t);var o=n("1b7f"),r=n("1548");for(var a in r)"default"!==a&&function(e){n.d(t,e,(function(){return r[e]}))}(a);n("b640");var i,u=n("f0c5"),c=Object(u["a"])(r["default"],o["b"],o["c"],!1,null,"c47418e0",null,!1,o["a"],i);t["default"]=c.exports},b640:function(e,t,n){"use strict";var o=n("3cc5"),r=n.n(o);r.a}},[["1cd8","common/runtime","common/vendor"]]]);