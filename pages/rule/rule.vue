<template>
    <view>
		<web-view :webview-styles="webviewStyles" :src="src"></web-view>
        <!-- <web-view :webview-styles="webviewStyles" src="https://uniapp.dcloud.io/static/web-view.html"></web-view> -->
    </view>
</template>

<script>
    export default {
        data() {
            return {
				src:'',
                webviewStyles: {
                    progress: {
                        color: '#FF3333'
                    }
                }
            }
        },
		
		async onLoad(options) {
            if(options.skuKey == 2018 || options.skuKey == 2019){ // 18 、19年
				this.src = 'https://xcxsite.vjifen.com/v/rule/lnRule.html'
			} else if(options.skuKey == 2020) {  //20年
				this.src = 'https://xcxsite.vjifen.com/v/rule/ln20Rule.html'
			} else if(options.sku == 'jk'){
				this.src = 'https://xcxsite.vjifen.com/v/rule/lnjkRule.html'
			} else if(options.sku == 'unYear'){
				this.src = 'https://xcxsite.vjifen.com/v/lnqp/2.0/rule.html'
			}
			console.log(options)
		    console.log(this.src)
		},
    }
</script>

<style>

</style>