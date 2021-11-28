<template>
    <div class="cart">
        <navbar class="nav-bar">
          <div slot="center">购物车({{cartLength}})</div>
        </navbar>
        <cart-list />
        <cart-bottom-bar/>
    </div>
    <!-- <div>
        <h2>
            购物车
        </h2>
    </div> -->
</template>
<script>
    import navbar from '../../components/common/navbar/NavBar'
    import CartList from './childComps/CartList'
    import CartBottomBar from './childComps/CartBottomBar'

    import {
        mapGetters
    } from 'vuex'

    export default {
        name: "Cart",
        components: {
            navbar,
            CartList,
            CartBottomBar
        },
        computed: {
            // 将getters映射为计算属性
            // 两种写法
            ...mapGetters(['cartLength']),
            /*  ...mapGetters({
            cartLength:'cartLength'
            }) */
        },
    }
</script>
<style scoped>
    /* .cart{
    height: 100vh;
  } */
    
    .nav-bar {
        background-color: var(--color-tint);
        color: #fff;
        position: relative;
        z-index: 9;
    }
</style>