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
				src:'https://xcxsite.vjifen.com/v/lnqp/2.0/groupBuy.html',
                webviewStyles: {
                    progress: {
                        color: '#0DA14C'
                    }
                }
            }
        },
		
		async onLoad(options) {
            
		},
    }
</script>

<style>

</style>