<template>
    <div class="tab-bar-item" @click="itemClick">
        <div v-if="!isActive"><slot name="item-icon"></slot></div>
        <div v-else><slot name="item-icon-active"></slot></div>
        <div :style="activeStyle"><slot name="item-text"></slot></div>
        </div>
</template>
<script>
    export default {
        name: "TabBarItem",
        props: {
            // 获取路径，等会点击导航条的item的时候，能够跳转指定的路径并且也可以拿来判断要哪个item是激活状态
            path: String,
            activeColor: {
                type: String,
                default: 'red'
            }
        },
        data() {
            return {
                // isActive: true
            }
        },
        computed: {
            isActive() {
                return this.$route.path == this.path
            },
            activeStyle() {
                return this.isActive ? {
                    color: this.activeColor
                } : {}
            }
        },
        methods: {
            itemClick() {
                // 这里当我们点击item时，控制我们跳转向哪个路由
                this.$router.replace(this.path).catch(err => {})
            }
        }
    }
</script>
<style scoped>
    .tab-bar-item {
        flex: 1;
        text-align: center;
        height: 49px;
        font-size: 10px;
    }
    
    .tab-bar-item img {
        height: 24px;
        width: 24px;
        margin-top: 3px;
        vertical-align: middle;
        margin-bottom: 2px;
    }
</style>