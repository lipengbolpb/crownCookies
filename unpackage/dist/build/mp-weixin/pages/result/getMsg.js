(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/result/getMsg"],{2534:function(t,e,n){},3956:function(t,e,n){"use strict";var o=n("2534"),s=n.n(o);s.a},"45fd":function(t,e,n){"use strict";var o,s=function(){var t=this,e=t.$createElement;t._self._c},i=[];n.d(e,"b",(function(){return s})),n.d(e,"c",(function(){return i})),n.d(e,"a",(function(){return o}))},8514:function(t,e,n){"use strict";n.r(e);var o=n("9ecc"),s=n.n(o);for(var i in o)"default"!==i&&function(t){n.d(e,t,(function(){return o[t]}))}(i);e["default"]=s.a},"946f":function(t,e,n){"use strict";(function(t){n("d916");o(n("66fd"));var e=o(n("e877"));function o(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("543d")["createPage"])},"9ecc":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=i(n("4795")),s=n("51c7");function i(t){return t&&t.__esModule?t:{default:t}}function r(t,e,n,o,s,i,r){try{var c=t[i](r),a=c.value}catch(u){return void n(u)}c.done?e(a):Promise.resolve(a).then(o,s)}function c(t){return function(){var e=this,n=arguments;return new Promise((function(o,s){var i=t.apply(e,n);function c(t){r(i,o,s,c,a,"next",t)}function a(t){r(i,o,s,c,a,"throw",t)}c(void 0)}))}}var a={data:function(){return{imgUrl:s.config.staticUrl,sec:0,bizcode:12,tel:"024-31932190",reg1:/^1[0-9]{10}$/,reg2:/^[1-9][0-9xX]{17}$/,reg3:/^[0-9]{4}$/}},onLoad:function(t){this.bizcode=t.bizcode},onHide:function(){this.stop=!0,this.sec=0},onUnload:function(){this.stop=!0,this.sec=0},onShareAppMessage:function(){return{title:"青岛啤酒",path:"/pages/home/home",imageUrl:this.imgUrl+"share.png"}},methods:{getyz:function(){if(this.sec>0)return!1;/^1[34578]\d{9}$/.test(this.mobile)?this.getCaptcha():t.showModal({title:"提示",content:"请填写正确的手机号！~"})},getCaptcha:function(){var e=this;return c(o.default.mark((function n(){var i,r;return o.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return t.showLoading({title:"获取中..."}),i={phonenum:e.mobile,sendtype:1,projectServerName:"liaoning"},n.next=4,(0,s.post)("/user/getCaptcha",i);case 4:e.yzmRes=n.sent,console.log("getCaptcha"+e.yzmRes),t.hideLoading(),r=e.yzmRes,"0"==r.result.code?"0"==r.result.businessCode?(e.sec=60,e.timer()):"2"===r.result.businessCode?t.showModal({title:"尊敬的用户",content:"您填写的手机号错误，发送验证码失败！"}):t.showModal({title:"尊敬的用户",content:"呜呜，系统开了个小差，请稍后重试！"}):t.showModal({title:"提示",content:r.result.msg});case 9:case"end":return n.stop()}}),n)})))()},timer:function(){var t=this;if(this.stop||this.sec<=0)return this.sec=0,!1;this.sec=this.sec-1,setTimeout((function(){t.timer()}),1e3)},tj:function(){this.reg1.test(this.mobile)?this.reg3.test(this.yzval)?this.sub_message():t.showModal({title:"提示",content:"请填写正确的验证码！~"}):t.showModal({title:"提示",content:"请填写正确的手机号！~"})},sub_message:function(){var e=this;return c(o.default.mark((function n(){var i,r;return o.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return t.showLoading({title:"提交中"}),i={openid:e.$store.state.openid,phonenum:e.mobile,captcha:e.yzval,projectServerName:"liaoning"},n.next=4,(0,s.post)("/user/updateUserInfoMobile",i);case 4:r=n.sent,t.hideLoading(),console.log(r),0==r.result.businessCode?(console.log("可疑"+e.$store.state.qr),t.redirectTo({url:"../scan/scan?q="+encodeURIComponent(e.$store.state.qr)})):t.showModal({title:"提示",content:r.result.msg});case 8:case"end":return n.stop()}}),n)})))()}}};e.default=a}).call(this,n("543d")["default"])},e877:function(t,e,n){"use strict";n.r(e);var o=n("45fd"),s=n("8514");for(var i in s)"default"!==i&&function(t){n.d(e,t,(function(){return s[t]}))}(i);n("3956");var r,c=n("f0c5"),a=Object(c["a"])(s["default"],o["b"],o["c"],!1,null,"069b2fbb",null,!1,o["a"],r);e["default"]=a.exports}},[["946f","common/runtime","common/vendor"]]]);