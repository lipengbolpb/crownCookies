(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/result/verification"],{"4b19":function(e,t,c){"use strict";c.r(t);var n=c("bc74"),o=c.n(n);for(var r in n)"default"!==r&&function(e){c.d(t,e,(function(){return n[e]}))}(r);t["default"]=o.a},"65cd":function(e,t,c){"use strict";var n=c("fd4e"),o=c.n(n);o.a},a666:function(e,t,c){"use strict";c.r(t);var n=c("e561"),o=c("4b19");for(var r in o)"default"!==r&&function(e){c.d(t,e,(function(){return o[e]}))}(r);c("65cd");var i,s=c("f0c5"),a=Object(s["a"])(o["default"],n["b"],n["c"],!1,null,"7c8703fe",null,!1,n["a"],i);t["default"]=a.exports},bc74:function(e,t,c){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(c("4795")),o=c("51c7");function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t,c,n,o,r,i){try{var s=e[r](i),a=s.value}catch(l){return void c(l)}s.done?t(a):Promise.resolve(a).then(n,o)}function s(e){return function(){var t=this,c=arguments;return new Promise((function(n,o){var r=e.apply(t,c);function s(e){i(r,n,o,s,a,"next",e)}function a(e){i(r,n,o,s,a,"throw",e)}s(void 0)}))}}var a={data:function(){return{imgUrl:o.config.staticUrl,checkRemarks:"",checkPrizeRecord:"",needWrite:!0,readOnly:!1,checkOver:!1}},onLoad:function(e){this.bizcode=e.bizcode,this.checkPrizeRecord=this.$store.state.sweepData.reply.checkPrizeRecord,console.log(this.checkPrizeRecord),this.checkPrizeRecord=this.$store.state.sweepData.reply.checkPrizeRecord,console.log(this.checkPrizeRecord),this.checkPrizeRecord.userName?(console.log("bbb"),this.needWrite=!1):(console.log("aaa"),this.needWrite=!0),1==this.checkPrizeRecord.checkStatus?(console.log("啊啊啊啊啊啊"),this.readOnly=!0,this.checkOver=!0):(console.log("啦啦啦啦"),this.readOnly=!1,this.checkOver=!1),this.checkPrizeRecord.checkRemarks?this.checkRemarks=this.checkPrizeRecord.checkRemarks:this.checkRemarks=this.checkRemarks,console.log(this.needWrite),console.log(this.readOnly),console.log(this.$store.state.openid)},onShow:function(){},onHide:function(){this.stop=!0,this.sec=0},onUnload:function(){this.stop=!0,this.sec=0},onShareAppMessage:function(){return{title:"青岛啤酒辽宁",path:"/pages/home/home",imageUrl:this.imgUrl+"share.png"}},methods:{checkPrize:function(){var t=this;return s(n.default.mark((function c(){var r,i;return n.default.wrap((function(c){while(1)switch(c.prev=c.next){case 0:return e.showLoading({title:"兑奖中"}),r={openid:t.$store.state.openid,checkRemarks:t.checkRemarks,prizeInfoKey:t.checkPrizeRecord.infoKey,projectServerName:"liaoning"},console.log(t.$store.state.openid),console.log(t.checkRemarks),c.next=6,(0,o.post)("/checkUser/checkPrize",r);case 6:i=c.sent,console.log("checkPrize"+i),e.hideLoading(),0==i.result.businessCode?(e.showModal({title:"提示",content:"兑奖成功！",showCancel:!1,confirmText:"我知道了"}),t.readOnly=!0,t.checkOver=!0):e.showModal({title:"提示",content:res.data.result.msg,showCancel:!1,confirmText:"我知道了"});case 10:case"end":return c.stop()}}),c)})))()},dj:function(){console.log("dj"),this.checkPrize()}}};t.default=a}).call(this,c("543d")["default"])},bde1:function(e,t,c){"use strict";(function(e){c("d916");n(c("66fd"));var t=n(c("a666"));function n(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,c("543d")["createPage"])},e561:function(e,t,c){"use strict";var n,o=function(){var e=this,t=e.$createElement;e._self._c},r=[];c.d(t,"b",(function(){return o})),c.d(t,"c",(function(){return r})),c.d(t,"a",(function(){return n}))},fd4e:function(e,t,c){}},[["bde1","common/runtime","common/vendor"]]]);