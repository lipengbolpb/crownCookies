(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/result/getcash"],{"1b68":function(t,e,i){},"2e54":function(t,e,i){"use strict";i.r(e);var n=i("9922"),o=i.n(n);for(var a in n)"default"!==a&&function(t){i.d(e,t,(function(){return n[t]}))}(a);e["default"]=o.a},"53db":function(t,e,i){"use strict";var n,o=function(){var t=this,e=t.$createElement;t._self._c},a=[];i.d(e,"b",(function(){return o})),i.d(e,"c",(function(){return a})),i.d(e,"a",(function(){return n}))},9922:function(t,e,i){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=a(i("4795")),o=i("51c7");function a(t){return t&&t.__esModule?t:{default:t}}function s(t,e,i,n,o,a,s){try{var r=t[a](s),c=r.value}catch(u){return void i(u)}r.done?e(c):Promise.resolve(c).then(n,o)}function r(t){return function(){var e=this,i=arguments;return new Promise((function(n,o){var a=t.apply(e,i);function r(t){s(a,n,o,r,c,"next",t)}function c(t){s(a,n,o,r,c,"throw",t)}r(void 0)}))}}var c={data:function(){return{bizcode:"",result:"",reply:"",txResult:"",hasPhone:!1,cardImg:"",imgUrl:o.config.staticUrl,sharePath:"pages/home/home?provinceCode=LN",shareImg:"",mobileToast:!1,getCard:!1,gzToast:!1,opened:!1,successToast:!1,totalMoney:"",needTx:!1,showAd:!1,animationData:{},off:!1,telNum:"",scanLadderFlag:"",scanLadderNum:"",ladder:"",dayScanNum:"",userActivityDayScanNum:"",animationGetTxt:{},animationGetLight:{},animationKai:{},kai:!1,getFBcard:!1,useFBcard:!1,beforeFB:!0,animationTcoin:{},animationX2:{},showX2:!1,animationX2Light:{},show618:!1,kouling618:!1,istaoMember:!1}},onLoad:function(e){var i=this;console.log(e),this.bizcode=e.bizcode,this.result=this.$store.state.sweepData.result,this.reply=this.$store.state.sweepData.reply,this.totalMoney=this.$store.state.sweepData.reply.totalAccountMoney,console.log(this.result),console.log(this.reply),console.log("openid"+this.$store.state.openid),console.log("sessionKey"+this.$store.state.session_key),this.$store.dispatch("xcxOpenidGet");var n=t.getStorageSync("tel");console.log(n),n?(this.hasPhone=!0,this.telNum=n):(this.hasPhone=!1,this.telNum=""),this.reply.dayScanNum<4&&(new Date).getTime()>=new Date(2020,4,25).getTime()&&(new Date).getTime()<new Date(2020,5,21).getTime()&&(this.show618=!0),11==this.bizcode&&this.reply.taoEasterEgg&&setTimeout((function(){i.kouling618=!0}),1e3),"1"==this.reply.taoMemberOrderFlag?this.istaoMember=!0:"0"==this.reply.taoMemberOrderFlag&&(this.istaoMember=!1)},onUnload:function(){this.animationData={},this.animationKai={},this.animationGetLight={},this.animationGetTxt={},this.animationTcoin={},this.animationX2={},this.animationX2Light={}},onShow:function(){var e=t.createAnimation({duration:1e3,timingFunction:"ease"});this.animation=e,console.log(this.animation),this.needTx&&this.giveSpackTx()},onShareAppMessage:function(t){return"button"===t.from&&console.log(t.target),{title:"青岛啤酒",path:"/pages/home/home",imageUrl:this.imgUrl+"share.png"}},methods:{close618:function(){this.show618=!1},closeTKL:function(){this.kouling618=!1},clipKL:function(){t.showToast({title:"淘口令复制成功"});var e=this;t.setClipboardData({data:e.reply.taoEasterEgg,success:function(i){t.getClipboardData({success:function(t){console.log(t.data),console.log(e.show618),e.kouling618=!1}})}})},getFBiknow:function(){t.switchTab({url:"../home/home"})},toLottery:function(){t.redirectTo({url:"../qd/qd"})},closeAd:function(){this.showAd=!1},kaiAction:function(){var t=this;this.animation.scale(1.3).step({duration:600}).scale(.8).step({duration:600}),this.animationKai=this.animation.export(),setTimeout((function(){t.getCash(),console.log("animation End 开启红包")}),1200)},lightAction:function(){this.animation.translateY(60).rotate(240).scale(2.2).step({duration:3e3}).scale(0).step({duration:1e3}),this.animationGetLight=this.animation.export()},TxtAction:function(){var t=this;this.animation.opacity(1).step({duration:2e3}).opacity(1).step({duration:2e3}),this.animationGetTxt=this.animation.export(),setTimeout((function(){t.getCard=!1}),4e3)},rotateAndScale:function(){var t=this;this.animation.rotate(0).scale(1.1).step({duration:2e3}).scale(1).step({duration:2e3}),this.animationData=this.animation.export(),setTimeout((function(){t.animation.scale(0).step({duration:1e3}),t.animationData=t.animation.export()}),4e3)},TcoinAction:function(){var t=this;this.animation.translateY(-120).step({duration:2e3}),this.animationTcoin=this.animation.export(),setTimeout((function(){t.animation.translateY(-20).step({duration:400}),t.animationTcoin=t.animation.export(),t.showX2=!0,setTimeout((function(){t.X2Action(),t.X2lightAction()}),400)}),2e3)},X2lightAction:function(){this.animation.translateY(-40).rotate(180).scaleX(2.6).step({duration:2e3,transformOrigin:"50% 50% 0"}),this.animationX2Light=this.animation.export()},X2Action:function(){var t=this;this.animation.translateY(120).scale(1).step({duration:2e3,transformOrigin:"50% 50% 0"}),this.animationX2=this.animation.export(),setTimeout((function(){t.animation.translateY(240).scale(0).step({duration:1e3,transformOrigin:"50% 50% 0"}),t.showX2=!1,t.beforeFB=!1}),3e3)},open:function(){this.kaiAction()},getCash:function(){var e=this;if(this.reply.taoEasterEgg&&setTimeout((function(){e.kouling618=!0}),2e3),7==this.bizcode)t.redirectTo({});else if(this.opened=!0,11==this.bizcode)this.getCard=!1;else if(0==this.reply.allowanceAStatus&&(this.getCard=!0,this.off=!0,this.off&&setTimeout((function(){e.TxtAction(),e.lightAction(),e.rotateAndScale()}),200),this.off=!this.off,this.getFBcard=!0),1==this.reply.allowanceAStatus&&(this.useFBcard=!0,setTimeout((function(){e.TcoinAction()}),800)),this.reply){if(this.reply.scanLadderFlag)if(this.scanLadderFlag=this.reply.scanLadderFlag,"1"==this.scanLadderFlag)switch(this.reply.scanLadderNum&&(this.scanLadderNum=this.reply.scanLadderNum),this.scanLadderNum){case"1":this.ladder="恭喜获得健康步步高红包，下一个更高";break;case"2":this.ladder="恭喜获得颜值步步高红包，下一个更高";break;case"3":this.ladder="恭喜获得收入步步高红包，下一个更高";break;case"4":this.ladder="恭喜获得友情步步高红包，下一个更高";break;case"5":this.ladder="恭喜获得爱情步步高红包，下一个更高";break;case"6":this.ladder="恭喜获得事业步步高红包";break;default:this.ladder="";break}else this.ladder=" ";this.reply.dayScanNum&&(this.dayScanNum=this.reply.dayScanNum),this.reply.userActivityDayScanNum&&(this.userActivityDayScanNum=this.reply.userActivityDayScanNum)}},TXiknow:function(){t.switchTab({url:"../home/home"})},smallMoneyIknow:function(){this.ifremeber()},userPhone:function(t){console.log(t),console.log(t.detail.errMsg),-1!=t.detail.errMsg.lastIndexOf("ok")?(this.mobileToast=!1,this.$store.state.session_key?this.parsePhone(t):(this.$store.dispatch("xcxOpenidGet"),this.parsePhone(t)),console.log(this.$store.state.session_key)):this.mobileToast=!0},parsePhone:function(e){var i=this;return r(n.default.mark((function o(){var a;return n.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return console.log(e),a={sessionKey:i.$store.state.session_key,encryptedData:e.detail.encryptedData,iv:e.detail.iv,provinceCode:"lnqp"},n.abrupt("return",new Promise((function(e,n){t.request({url:"https://xcxact.vjifen.com/api/decrypt",method:"POST",data:a,success:function(e){console.log(e.data.data.decryptData.phoneNumber);var n=e.data.data.decryptData.phoneNumber;if(i.$store.commit("userPhone",n),i.savePhone(),t.setStorageSync("tel",n),i.telNum=n,i.hasPhone=void 0==n?0:n,console.log(i.hasPhone),i.hasPhone){if(!i.$store.state.hbopenid)return i.needTx=!0,void t.navigateTo({url:"../getOpenid/getOpenid?provinceCode="+i.$store.state.provinceCode+"&type=hbopenid"});i.needTx=!0,i.giveSpackTx()}},fail:function(e){i.hasPhone=!0,t.showModal({title:"提示",content:"解析手机号结果"+res.data}),n("decrypt",e),console.log(res.data)}})})));case 3:case"end":return n.stop()}}),o)})))()},savePhone:function(){var t=this;return r(n.default.mark((function e(){var i;return n.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return i={openid:t.$store.state.openid,phonenum:t.telNum?t.telNum:t.$store.state.phoneNumber,isCaptcha:0,projectServerName:"liaoning"},e.next=3,(0,o.post)("/user/updateUserInfoMobile",i);case 3:e.sent,console.log("savePhoneNumber");case 5:case"end":return e.stop()}}),e)})))()},ifremeber:function(e){var i=this;return new Promise((function(n,a){t.showLoading({title:"加载中"}),t.request({url:o.config.wxUrl+"/wx3/uinfo2?openid="+i.$store.state.openid+"&appid="+o.config.appid_ln,success:function(n){t.hideLoading(),console.log("判断关注"+n),"0"==n.data.subscribe?i.gzToast=!0:"tx"==e?i.successToast=!0:setTimeout((function(){t.switchTab({url:"../home/home"})}),1e3)},fail:function(e){t.hideLoading(),a("关注",e)}})}))},giveSpackTx:function(){var e=this;return r(n.default.mark((function i(){var a,s;return n.default.wrap((function(i){while(1)switch(i.prev=i.next){case 0:if(e.$store.state.hbopenid){i.next=4;break}return e.needTx=!0,t.navigateTo({url:"../getOpenid/getOpenid?provinceCode="+e.$store.state.provinceCode+"&type=hbopenid"}),i.abrupt("return");case 4:return console.log(e.needTx),t.showLoading({title:"提现中..."}),t.getStorageSync("tel"),a={openid:e.$store.state.openid,hbopenid:e.$store.state.hbopenid,phoneNumber:e.telNum,projectServerName:"liaoning"},i.next=10,(0,o.post)("/gifts/getGiftspack",a);case 10:e.txResult=i.sent,console.log(e.txResult),s=e.txResult,t.hideLoading(),e.needTx=!1,"0"==s.result.code?"0"==s.result.businessCode?(e.totalMoney=0,e.ifremeber("tx")):"1"==s.result.businessCode?t.showModal({title:"提示",content:"您的红包金额不足，再喝几瓶攒够1元发红包！"}):"2"==s.result.businessCode?t.showModal({title:"提示",content:"呜呜，系统开了个小差，请稍后重试！"}):"3"==s.result.businessCode?t.showModal({title:"提示",content:"根据国家法规对支付服务实名制的要求，请到微信中进行实名认证\n实名认证方法：进入【微信】->【我】->【钱包】->【···】->【支付管理】，即可实名认证。"}):"4"==s.result.businessCode?t.showModal({title:"提示",content:"提现处理中，请稍后查看详细记录"}):"-1"==s.result.businessCode?t.showModal({title:"提示",content:"系统升级中"}):"-2"==s.result.businessCode?t.showModal({title:"提示",content:"提现操作过于频繁"}):(s.result.businessCode,t.showModal({title:"提示",content:s.result.msg})):"-1"==s.result.code?t.showModal({title:"尊敬的用户",content:"系统升级中..."}):t.showModal({title:"提示",content:"呜呜，服务开了个小差，请稍后重试！"});case 16:case"end":return i.stop()}}),i)})))()},closeGzTip:function(){this.gzToast=!1,setTimeout((function(){t.switchTab({url:"../home/home"})}),600)},toRule:function(){"2018"==this.reply.skuYear?t.navigateTo({url:"../rule/rule?skuKey=2018"}):"2019"==this.reply.skuYear?t.navigateTo({url:"../rule/rule?skuKey=2019"}):"2020"==this.reply.skuYear&&t.navigateTo({url:"../rule/rule?skuKey=2020"})},closeMobile:function(){this.mobileToast=!1}}};e.default=c}).call(this,i("543d")["default"])},"9c72":function(t,e,i){"use strict";(function(t){i("d916");n(i("66fd"));var e=n(i("f0e0"));function n(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,i("543d")["createPage"])},d392:function(t,e,i){"use strict";var n=i("1b68"),o=i.n(n);o.a},f0e0:function(t,e,i){"use strict";i.r(e);var n=i("53db"),o=i("2e54");for(var a in o)"default"!==a&&function(t){i.d(e,t,(function(){return o[t]}))}(a);i("d392");var s,r=i("f0c5"),c=Object(r["a"])(o["default"],n["b"],n["c"],!1,null,"e1461b5a",null,!1,n["a"],s);e["default"]=c.exports}},[["9c72","common/runtime","common/vendor"]]]);