(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/mine/prizeList"],{"1f4b":function(e,t,i){"use strict";var s,n=function(){var e=this,t=e.$createElement;e._self._c},r=[];i.d(t,"b",(function(){return n})),i.d(t,"c",(function(){return r})),i.d(t,"a",(function(){return s}))},"3e3c":function(e,t,i){"use strict";i.r(t);var s=i("71b5"),n=i.n(s);for(var r in s)"default"!==r&&function(e){i.d(t,e,(function(){return s[e]}))}(r);t["default"]=n.a},"4e80":function(e,t,i){},"587b":function(e,t,i){"use strict";var s=i("4e80"),n=i.n(s);n.a},"62c1":function(e,t,i){"use strict";(function(e){i("d916");s(i("66fd"));var t=s(i("d2d5"));function s(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,i("543d")["createPage"])},"71b5":function(e,t,i){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=a(i("4795")),n=i("51c7"),r=a(i("aeed")),o=a(i("cf84"));function a(e){return e&&e.__esModule?e:{default:e}}function u(e,t,i,s,n,r,o){try{var a=e[r](o),u=a.value}catch(c){return void i(c)}a.done?t(u):Promise.resolve(u).then(s,n)}function c(e){return function(){var t=this,i=arguments;return new Promise((function(s,n){var r=e.apply(t,i);function o(e){u(r,s,n,o,a,"next",e)}function a(e){u(r,s,n,o,a,"throw",e)}o(void 0)}))}}function h(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}var l=function(){i.e("components/uni-pop").then(function(){return resolve(i("590f"))}.bind(null,i)).catch(i.oe)},d={components:{uniPopup:l},data:function(){var e;return e={imgUrl:n.config.staticUrl,showHXqr:!1,ewmUrl:n.config.hxqrUrl,hxqrImg:"",yzmRes:"",sec:0,yzval:"",currentPage:1,count:10,unCurrentPage:1,unCount:10,getCurrentPage:1,getCount:10,subParams:{prizeVcode:"",infoKey:""},useStatus:0},h(e,"imgUrl",n.config.staticUrl),h(e,"provinceData",r.default),h(e,"cityData",[]),h(e,"areaData",[]),h(e,"selectList",[{txt:"请选择"},{txt:"请选择"},{txt:"请选择"}]),h(e,"region",""),h(e,"tabOne","请选择"),h(e,"indexTab",0),h(e,"proviceShow",!0),h(e,"areaShow",!1),h(e,"cityShow",!1),h(e,"show",!1),h(e,"type",""),h(e,"checkOne",null),h(e,"checkTwo",null),h(e,"checkThree",null),h(e,"seeInfo",!1),h(e,"subOk",!1),h(e,"showtjOK",!1),h(e,"showForm",!1),h(e,"userName",""),h(e,"idcard",""),h(e,"mobile",""),h(e,"region",""),h(e,"address",""),h(e,"tabs",[{idx:1,isActive:!0,itemName:"未领取"},{idx:2,isActive:!1,itemName:"已领取"}]),h(e,"active",!1),h(e,"unGetShow",!0),h(e,"getShow",!1),h(e,"unGetPrize",[]),h(e,"getPrize",[]),h(e,"nuGetNext",!0),h(e,"getNext",!0),h(e,"start",0),h(e,"count",20),h(e,"isEnd",!1),h(e,"noData",!1),h(e,"isDisabled",!1),h(e,"regYzcode",/^[0-9]{4}$/),h(e,"regMobile",/^1[34578]\d{9}$/),h(e,"windowHeight",this.windowHeight),e},onLoad:function(){this.queryPrize()},onShow:function(){0==this.useStatus?(e.showModal({content:this.useStatus}),this.isDisabled=!1):1==this.useStatus&&(e.showModal({content:this.useStatus}),this.isDisabled=!0)},onReachBottom:function(){var t=this;return c(s.default.mark((function i(){return s.default.wrap((function(i){while(1)switch(i.prev=i.next){case 0:if(!t.isEnd){i.next=2;break}return i.abrupt("return");case 2:return e.showLoading({title:"加载中..."}),i.next=5,t.onSearch(!1);case 5:e.hideLoading();case 6:case"end":return i.stop()}}),i)})))()},methods:{queryPrize:function(){var t=this;return c(s.default.mark((function i(){var r,o;return s.default.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return e.showLoading({title:"加载中..."}),r={openid:t.$store.state.openid,hbopenid:"",projectServerName:"liaoning",currentPage:t.currentPage,count:t.count,useStatus:t.useStatus},i.next=4,(0,n.post)("/gifts/queryPrizeList",r);case 4:t.prizeResult=i.sent,console.log(t.prizeResult),e.hideLoading(),o=t.prizeResult,0==o.result.businessCode&&(0==t.useStatus&&(t.unGetPrize=o.reply.prizeRecordAry,o.reply.prizeRecordAry<t.count&&(t.nuGetNext=!1)),1==t.useStatus&&(t.getPrize=o.reply.prizeRecordAry,o.reply.prizeRecordAry<t.count&&(t.getNext=!1)));case 9:case"end":return i.stop()}}),i)})))()},gainPrize:function(e,t){this.clearForm(),this.subParams.prizeVcode=e,this.subParams.infoKey=t,this.showForm=!0},formValue:function(){if(console.log(this.userName),""!==this.userName)if(this.regMobile.test(this.mobile))if((0,n.idcardValidate)(this.idcard))if(""!==this.address){if(!this.regYzcode.test(this.yzval))return e.showModal({title:"温馨提示",content:"请填写正确的验证码哦！~"}),!1;for(var t in this.selectList)if("请选择"==this.selectList[t].txt)return e.showModal({title:"提示",content:"你还没有选择完整的所在地区信息哦~"}),!1;this.sub_message()}else e.showModal({title:"提示",content:"请填写正确的详细地址哦！~"});else e.showModal({title:"提示",content:"请填写正确的身份证号哦！~"});else e.showModal({title:"提示",content:"请填写正确的手机号！~"});else e.showModal({title:"提示",content:"请填写正确的姓名哦！~"})},clearForm:function(){this.userName="",this.idcard="",this.mobile="",this.region="",this.address="",this.yzval="",this.seeInfo=!1},sub_message:function(){var t=this;return c(s.default.mark((function i(){var r,o;return s.default.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return e.showLoading({title:"提交中..."}),r={openid:t.$store.state.openid,username:t.userName,address:t.region+t.address.trim(),idcard:t.idcard,phonenum:t.mobile,prizeVcode:t.subParams.prizeVcode,prizeInfoKey:t.subParams.infoKey,captcha:t.yzval,projectServerName:"liaoning"},i.next=4,(0,n.post)("/user/savePrize",r);case 4:t.tjResult=i.sent,console.log(t.tjResult),e.hideLoading(),o=t.tjResult,0==o.result.businessCode?(t.showtjOK=!0,setTimeout((function(){t.showForm=!1,t.queryPrize()}),2e3),t.clearForm()):e.showModal({title:"温馨提示",content:o.result.msg});case 9:case"end":return i.stop()}}),i)})))()},iknow:function(){this.showForm=!1,this.showtjOK=!1,this.useStatus=1,this.tabSwitch(1),this.queryPrize()},seeForm:function(e){for(var t in this.showHXqr=!1,this.showForm=!0,this.seeInfo=!0,console.log(e),console.log(this.getPrize),this.getPrize)if(t==e){if(console.log(t),"8"==this.getPrize[t].exchangeChannel){this.showHXqr=!0;var i=this.ewmUrl+this.getPrize[t].prizeVcode,s=o.default.createQrCodeImg(i,{size:parseInt(100)});console.log(i),this.hxqrImg=s}else this.showHXqr=!1;this.userName=this.getPrize[t].userName,this.idcard=this.getPrize[t].idCard,this.mobile=this.getPrize[t].phoneNum,console.log(this.getPrize[t].address),void 0==this.getPrize[t].address?(this.region="",this.address=""):(this.region=this.getPrize[t].address.split("-")[0],this.address=this.getPrize[t].address.split("-")[1]),this.isDisabled=!0}},formClose:function(){this.showForm=!1},seeOk:function(){this.showForm=!1},tabSwitch:function(e){for(var t=0;t<this.tabs.length;t++)this.tabs[t].isActive=!1;this.tabs[e].isActive=!0,0==e&&(this.unGetShow=!0,this.getShow=!1,this.currentPage=this.unCurrentPage,this.count=this.unCount,this.useStatus=e,this.isDisabled=!1,this.queryPrize()),1==e&&(this.getShow=!0,this.unGetShow=!1,this.currentPage=this.getCurrentPage,this.count=this.getCount,this.useStatus=e,this.isDisabled=!0,this.queryPrize())},getCaptcha:function(){var t=this;return c(s.default.mark((function i(){var r,o;return s.default.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return e.showLoading({title:"获取中..."}),r={phonenum:t.mobile,projectServerName:"liaoning"},i.next=4,(0,n.post)("/user/getCaptcha",r);case 4:t.yzmRes=i.sent,console.log("getCaptcha"+t.yzmRes),e.hideLoading(),o=t.yzmRes,0==o.result.businessCode?(t.sec=60,t.timer()):e.showModal({title:"提示",content:o.result.msg});case 9:case"end":return i.stop()}}),i)})))()},getyz:function(){if(this.sec>0)return!1;this.regMobile.test(this.mobile)?(this.getCaptcha(),this.sec=0):e.showModal({title:"提示",content:"请填写正确的手机号！~"})},timer:function(){var e=this;if(this.stop||this.sec<=0)return this.sec=0,!1;this.sec=this.sec-1,setTimeout((function(){e.timer()}),1e3)},nextUnPrize:function(t){var i=this;return c(s.default.mark((function t(){var r;return s.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!i.nuGetNext){t.next=11;break}return e.showLoading({title:"加载中",mask:!0}),i.currentPage=i.unCurrentPage+1,i.count=i.unCount,e.showLoading({title:"加载中..."}),r={openid:i.$store.state.openid,hbopenid:"",projectServerName:"liaoning",currentPage:i.currentPage,count:i.count,useStatus:i.useStatus},t.next=8,(0,n.post)("/gifts/queryPrizeList",r);case 8:i.prizeResult=t.sent,e.hideLoading(),i.prizeResult.reply.prizeRecordAry.length>0&&((i.useStatus=0)?i.unGetPrize=i.unGetPrize.concat(i.prizeResult.reply.prizeRecordAry):i.getPrize=i.getPrize.concat(i.prizeResult.reply.prizeRecordAry));case 11:case"end":return t.stop()}}),t)})))()},nextGetPrize:function(t){var i=this;return c(s.default.mark((function t(){var r;return s.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!i.getNext){t.next=11;break}return e.showLoading({title:"加载中",mask:!0}),i.currentPage=i.getCurrentPage+1,i.count=i.getCount,e.showLoading({title:"加载中..."}),r={openid:i.$store.state.openid,hbopenid:"",projectServerName:"liaoning",currentPage:i.currentPage,count:i.count,useStatus:i.useStatus},t.next=8,(0,n.post)("/gifts/queryPrizeList",r);case 8:i.prizeResult=t.sent,e.hideLoading(),i.prizeResult.reply.prizeRecordAry.length>0&&((i.useStatus=0)?i.unGetPrize=i.unGetPrize.concat(i.prizeResult.reply.prizeRecordAry):i.getPrize=i.getPrize.concat(i.prizeResult.reply.prizeRecordAry));case 11:case"end":return t.stop()}}),t)})))()},togglePopup:function(e,t){1!=this.isDisabled&&(this.type=e,"tip"===t?this.show=!0:this.$refs[t].open())},cancel:function(t){if("tip"!==t)for(var i in this.$refs[t].close(),console.log(this.selectList),this.selectList)return console.log("aaa"),"请选择"==this.selectList[i].txt?(console.log("bbb"),void e.showModal({title:"提示",content:"你还没有选择完整的所在地区信息哦~"})):(this.region=this.selectList[0].txt+this.selectList[1].txt+this.selectList[2].txt+"-",console.log(this.region),void(this.show=!1));else this.show=!1},change:function(t){1==t.show?e.hideTabBar():e.showTabBar()},tabEvent:function(e){this.indexTab=e,0==this.indexTab?(this.proviceShow=!0,this.cityShow=!1,this.areaShow=!1,this.checkTwo=null,this.checkThree=null,this.areaData=[],this.selectList[1].txt="请选择",this.selectList[2].txt="请选择"):1==this.indexTab?(this.proviceShow=!1,this.cityShow=!0,this.areaShow=!1,this.checkThree=null,this.selectList[2].txt="请选择"):2==this.indexTab&&(this.proviceShow=!1,this.cityShow=!1,this.areaShow=!0)},provinceEvent:function(e,t){this.checkOne=t,this.selectList[0].txt=e.name,this.indexTab=1,this.proviceShow=!1,this.cityShow=!0,this.areaShow=!1,this.cityData=e.cityList},cityEvent:function(e,t){this.checkTwo=t,this.selectList[1].txt=e.name,this.indexTab=2,this.proviceShow=!1,this.cityShow=!1,this.areaShow=!0,this.areaData=e.areaList},areaEvent:function(e,t){this.checkThree=t,this.selectList[2].txt=e.name}}};t.default=d}).call(this,i("543d")["default"])},d2d5:function(e,t,i){"use strict";i.r(t);var s=i("1f4b"),n=i("3e3c");for(var r in n)"default"!==r&&function(e){i.d(t,e,(function(){return n[e]}))}(r);i("587b");var o,a=i("f0c5"),u=Object(a["a"])(n["default"],s["b"],s["c"],!1,null,"2f5d493c",null,!1,s["a"],o);t["default"]=u.exports}},[["62c1","common/runtime","common/vendor"]]]);