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
            this.src = 'https://xcxsite.vjifen.com/v/lnqp/2.0/dice/index.html'
		    console.log(this.src)
		},
    }
</script>

<style>

</style>