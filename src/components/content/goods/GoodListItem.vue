<template>
    <div class="goods-item" @click="goodsItemClick">
        <div>
            <img v-lazy="showimage" alt="" @load="imageLoad">
            <div class="goods-info">
                <p>{{goodsItem.title}}</p>
                <span class="price">{{goodsItem.price}}</span>
                <span class="collect">{{goodsItem.cfav}}</span>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "GoodListItem",
        props: {
            goodsItem: {
                type: Object,
                default () {
                    return {}
                }

            }
        },
        computed: {
            showimage() {
                return this.goodsItem.image || this.goodsItem.show.img
            }
        },
        methods: {
            imageLoad() {
                // 若激活的路径是home则向home发送事件，若是detail则向detail发送
                if (this.$route.path.indexOf('/home') != -1) {
                    this.$bus.$emit("itemImageLoad");
                } else if (this.$route.path.indexOf('/detail') != -1) {
                    this.$bus.$emit("detailitemImageLoad");
                }
                /* if (this.$route.path.indexOf("home") != -1) {
                    this.$bus.$emit("goodsImgLoadEvent");
                } else if (this.$route.path.indexOf("detail") != -1) {
                    this.$bus.$emit("detailScrollEvent");
                } */
            },
            goodsItemClick() {
                console.log('jumping to detail page');
                this.$router.push('/detail/' + this.goodsItem.iid);
            }
        }

    }
</script>
<style scoped>
    .goods-item {
        padding-bottom: 40px;
        position: relative;
        width: 48%;
    }
    
    .goods-item img {
        width: 100%;
        height: 230px;
        border-radius: 5px;
    }
    
    .goods-info {
        font-size: 12px;
        position: absolute;
        bottom: 5px;
        left: 0;
        right: 0;
        overflow: hidden;
        text-align: center;
    }
    
    .goods-info p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 3px;
    }
    
    .goods-info .price {
        color: var(--color-high-text);
        margin-right: 20px;
    }
    
    .goods-info .collect {
        position: relative;
    }
    
    .goods-info .collect::before {
        content: '';
        position: absolute;
        left: -15px;
        top: -1px;
        width: 14px;
        height: 14px;
        background: url("../../../assets/img/common/collect.svg") 0 0/14px 14px;
    }
</style>