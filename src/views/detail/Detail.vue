<template>
    <div id="detail">
        <detail-nav-bar ref="nav" class="detailNav" @titleClick="titleClick"/>
        <scroll class="detailContent" :probeType="3" ref="scroll" @scroll="contentScroll">
            <detail-swiper :top-images="topImages"></detail-swiper>
            <detail-base-info :goods="goods"></detail-base-info>
            <detail-shop-info :shop="shop"></detail-shop-info>
            <detail-images-info @imgLoad="imgLoad" :images-info="detailInfo"></detail-images-info>
            <detail-params-info ref="params" :param-info="paramsInfo"></detail-params-info>
            <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
            <good-list ref="recommend" :goods="recommends"></good-list>
        </scroll>
        <detail-bottom-bar @addCart="addCart"></detail-bottom-bar>
        <back-top @click.native="backTopClick" v-if="isShowBackTop" />

        
    </div>
</template>
<script>
    import DetailNavBar from './childComps/DetailNavBar'
    import DetailSwiper from './childComps/DetailSwiper'
    import DetailBaseInfo from "./childComps/DetailBaseInfo"
    import DetailShopInfo from "./childComps/DetailShopInfo"
    import DetailImagesInfo from "./childComps/DetailImagesInfo"
    import DetailParamsInfo from "./childComps/DetailParamsInfo"
    import DetailCommentInfo from "./childComps/DetailCommentInfo"
    import DetailBottomBar from "./childComps/DetailBottomBar"

    import Scroll from "../../components/common/scroll/scroll";
    import BackTop from '../../components/content/backtop/BackTop';
    import GoodList from "../../components/content/goods/GoodList";

    import {
        backTopMixin
    } from '@/common/mixin';
    import {
        debounce
    } from "../../common/utils";


    import {
        getDetail,
        Goods,
        Shop,
        GoodsParams,
        getRecommend
    } from "../../network/detail";
    export default {
        name: "Detail",
        components: {
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            DetailShopInfo,
            DetailImagesInfo,
            DetailParamsInfo,
            DetailCommentInfo,
            DetailBottomBar,

            BackTop,
            Scroll,
            GoodList
        },
        data() {
            return {
                iid: '',
                topImages: [],
                goods: {},
                shop: {},
                detailInfo: {},
                paramsInfo: {},
                commentInfo: {},
                recommends: [],
                themeTopYs: [],
                getThemeTopY: null,
                currentIndex: 0
            }
        },
        mixins: [backTopMixin],
        created() {
            //1.保存传入的iid
            this.iid = this.$route.params.iid
                // console.log(this.iid);

            //2.根据iid请求详情数据
            getDetail(this.iid).then(res => {

                // console.log(res);
                const data = res.result;
                // 1.获取顶部轮播图数据
                this.topImages = data.itemInfo.topImages
                    // 2.获取商品信息
                this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
                    // 3.获取店铺信息的对象
                this.shop = new Shop(data.shopInfo)
                    // 4.保存商品详情数据
                this.detailInfo = data.detailInfo
                    // 5.保存商品的参数
                this.paramsInfo = new GoodsParams(data.itemParams.info, data.itemParams.rule || {})
                    // 6.获取商品评论  直接给GoodsListItem展示
                    // console.log(this.iid);

                if (data.rate.cRate !== 0) {
                    this.commentInfo = data.rate.list[0];
                }


                // this.$nextTick(() => {
                //     // 根据最新的数据，DOM虽然已经渲染完了
                //     // 单数图片还没加载完

                // })

            })

            //3.请求推荐
            getRecommend().then(res => {
                this.recommends = res.data.list;
            })

            // 4.给getThemeTopY赋值
            this.getThemeTopY = debounce(() => {
                // console.log('---');

                this.themeTopYs = []
                this.themeTopYs.push(0);
                this.themeTopYs.push(this.$refs.params.$el.offsetTop)
                this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
                this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
            }, 100)
        },
        mounted() {
            // 加载完图片就刷新，中间用防抖来提升性能
            const refresh = debounce(this.$refs.scroll.refresh, 50)
                /* 监听item中下方推荐图片加载完成 */
            this.$bus.$on('detailitemImageLoad', () => {
                // console.log('wooooooo');
                refresh();
            })


        },
        methods: {
            imgLoad() {
                console.log('--');
                this.$refs.scroll.refresh()
                this.getThemeTopY()

            },

            titleClick(index) {
                this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
            },

            // 处理滚动事件
            contentScroll(position) {
                // 1.以下有bug，点击导航条会跳转到对应位置但有时候不变色
                // 获取y值
                // const positionY = -position.y
                // let length = this.themeTopYs.length
                // for (let i = 0; i < length; i++) {
                //     if ((this.currentIndex !== i) && (i < length - 1 && positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) ||
                //         (i === length - 1 && positionY > this.themeTopYs[i])) {
                //         this.currentIndex = i;
                //         this.$refs.nav.currentIndex = i;
                //     }
                // }

                // 2.无bug
                let positionY = -position.y;
                let length = this.themeTopYs.length;
                //hack做法，
                for (let i = 0; i < length; i++) {
                    if (this.currentIndex !== i && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) {
                        this.currentIndex = i;
                        this.$refs.nav.currentTitleIndex = i;
                    }
                }
                this.isShowBackTop = Math.abs(position.y) > 1000;
            },
            addCart() {
                // 获取商品信息
                const product = {};
                product.image = this.topImages[0];
                product.title = this.goods.title;
                product.desc = this.goods.desc;
                product.price = this.goods.price;
                product.iid = this.iid
                    // console.log(111);
                    // console.log(product.title);
                    // console.log(product.iid);
                    // console.log(222);
                    // this.$store.dispatch('addCart', product)
                this.$store.dispatch('addCart', product).then((res) => {
                    this.$toast.show(res, 2000);
                });
            },
        }
    }
</script>
<style scoped>
    #detail {
        position: relative;
        z-index: 10;
        background: #fff;
        height: 100vh;
    }
    
    .detailNav {
        position: relative;
        z-index: 9;
        background: #fff;
    }
    
    .detailContent {
        height: calc(100% - 89px);
        width: 100%；
        /* position: absolute;
        top: 44px;
        left: 0;
        right: 0;
        bottom: 58px;
        overflow: hidden; */
        /* height: calc(100% - 44px - 58px);  */
    }
</style>