<template>
    <div id="home">
        <nav-bar class="home-nav"><div slot="center">时尚购</div></nav-bar>
        <tab-control class="tab-control" :titles="['流行','新款','精选']"
                 ref="tabControl1"
                 @tabClick="tabClick" v-show="isTabFixed"></tab-control>
        <scroll class="content" 
        ref="scroll" 
        :probe-type="3"
         @scroll="contentScroll" 
         :pull-up-load="true"
         @pullingUp="loadMore">
            <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
        <recommend-view :recommends="recommends"></recommend-view>
        <feature-view></feature-view>
        <tab-control :titles="['流行','新款','精选']" ref="tabControl2"
                     @tabClick="tabClick"></tab-control>
                     <!-- 这里的showgoods在computed拼接 -->
        <good-list :goods="showGoods"></good-list>
        
        </scroll>
        <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
        <!-- <ul>
            <li>列表1</li>
            <li>列表2</li>
            <li>列表3</li>
            <li>列表4</li>
            <li>列表5</li>
            <li>列表6</li>
            <li>列表7</li>
            <li>列表8</li>
            <li>列表9</li>
            <li>列表10</li>
            <li>列表11</li>
            <li>列表12</li>
            <li>列表13</li>
            <li>列表14</li>
            <li>列表15</li>
            <li>列表16</li>
            <li>列表17</li>
            <li>列表18</li>
            <li>列表19</li>
            <li>列表20</li>
            <li>列表21</li>
            <li>列表22</li>
            <li>列表23</li>
            <li>列表24</li>
            <li>列表25</li>
            <li>列表26</li>
            <li>列表27</li>
            <li>列表28</li>
            <li>列表29</li>
            <li>列表30</li>
            <li>列表31</li>
            <li>列表32</li>
            <li>列表33</li>
            <li>列表34</li>
            <li>列表35</li>
            <li>列表36</li>
            <li>列表37</li>
            <li>列表38</li>
            <li>列表39</li>
            <li>列表40</li>
            <li>列表41</li>
            <li>列表42</li>
            <li>列表43</li>
            <li>列表44</li>
            <li>列表45</li>
            <li>列表46</li>
            <li>列表47</li>
            <li>列表48</li>
            <li>列表49</li>
            <li>列表50</li>
            <li>列表51</li>
            <li>列表52</li>
            <li>列表53</li>
            <li>列表54</li>
            <li>列表55</li>
            <li>列表56</li>
            <li>列表57</li>
            <li>列表58</li>
            <li>列表59</li>
            <li>列表60</li>
            <li>列表61</li>
            <li>列表62</li>
            <li>列表63</li>
            <li>列表64</li>
            <li>列表65</li>
            <li>列表66</li>
            <li>列表67</li>
            <li>列表68</li>
            <li>列表69</li>
            <li>列表70</li>
            <li>列表71</li>
            <li>列表72</li>
            <li>列表73</li>
            <li>列表74</li>
            <li>列表75</li>
            <li>列表76</li>
            <li>列表77</li>
            <li>列表78</li>
            <li>列表79</li>
            <li>列表80</li>
            <li>列表81</li>
            <li>列表82</li>
            <li>列表83</li>
            <li>列表84</li>
            <li>列表85</li>
            <li>列表86</li>
            <li>列表87</li>
            <li>列表88</li>
            <li>列表89</li>
            <li>列表90</li>
            <li>列表91</li>
            <li>列表92</li>
            <li>列表93</li>
            <li>列表94</li>
            <li>列表95</li>
            <li>列表96</li>
            <li>列表97</li>
            <li>列表98</li>
            <li>列表99</li>
            <li>列表100</li>
        </ul> -->
        
        
    </div>
</template>
<script>
    import {
        getHomeMultidata,
        getHomeGoods
    } from "../../network/home.js"
    import {
        debounce
    } from "../../common/utils";

    import TabControl from '../../components/content/tabControl/TabControl'
    import HomeSwiper from './childComps/HomeSwiper'
    import NavBar from '../../components/common/navbar/NavBar'
    import RecommendView from './/childComps/RecommendView'
    import FeatureView from './childComps/FeatureView'
    import GoodList from '../../components/content/goods/GoodList'
    import GoodListItem from '../../components/content/goods/GoodListItem.vue'
    import Scroll from '../../components/common/scroll/scroll'
    import BackTop from '../../components/content/backtop/BackTop'


    export default {
        name: "Home",
        components: {
            NavBar,
            HomeSwiper,
            RecommendView,
            FeatureView,
            TabControl,
            GoodList,
            GoodListItem,
            Scroll,
            BackTop
        },
        computed: {
            showGoods() {
                return this.goods[this.currenType].list
            }
        },
        data() {
            return {
                banners: [],
                recommends: [],
                goods: {
                    'pop': {
                        page: 0,
                        list: []
                    },
                    'new': {
                        page: 0,
                        list: []
                    },
                    'sell': {
                        page: 0,
                        list: []
                    },
                },
                currenType: 'pop',
                isShowBackTop: false,
                tabOffsetTop: 0,
                isTabFixed: false
            }
        },
        created() {
            // 请求的是导航和推荐
            this.getHomeMultidata()
                // 请求商品数据
            this.getHomeGoods('pop')
            this.getHomeGoods('new')
            this.getHomeGoods('sell')


        },
        mounted() {
            // 加载完图片就刷新，中间用防抖来提升性能
            const refresh = debounce(this.$refs.scroll.refresh, 50)
                /* 监听item中图片加载完成 */
            this.$bus.$on("itemImageLoad", () => {
                // console.log('wooooo');
                refresh()
            })
        },
        methods: {
            // 事件监听相关
            tabClick(index) {
                switch (index) {
                    case 0:
                        this.currenType = 'pop'
                        break
                    case 1:
                        this.currenType = 'new'
                        break
                    case 2:
                        this.currenType = 'sell'
                        break
                }
                this.$refs.tabControl2.currentIndex = index;
                this.$refs.tabControl1.currentIndex = index;
            },

            // 网络请求方法
            getHomeMultidata() {
                getHomeMultidata().then(res => {
                    // console.log(res);
                    this.banners = res.data.banner.list;
                    this.recommends = res.data.recommend.list;
                })
            },
            getHomeGoods(type) {
                const page = this.goods[type].page + 1
                getHomeGoods(type, page).then(res => {
                    this.goods[type].list.push(...res.data.list);
                    this.goods[type].page += 1

                    // 完成上拉加载更多
                    this.$refs.scroll.finishPullUp()
                })
            },
            backClick() {

                // 父访问子组件用ref
                this.$refs.scroll.scrollTo(0, 0, 500)
            },
            contentScroll(position) {
                this.isShowBackTop = (-position.y) > 1000
                    /* tabControl 吸顶效果 */
                this.isTabFixed = (-position.y) > this.tabOffsetTop;
            },
            loadMore() {
                this.getHomeGoods(this.currenType)
            },
            swiperImageLoad() {
                /* 获取tabScrollTop */
                // console.log();
                this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
            }
        }
    }
</script>
<style scoped>
    #home {
        height: 100vh;
        position: relative;
    }
    
    .home-nav {
        background: var(--color-tint);
        color: #fff;
        width: 100%;
        position: relative;
        /*position: fixed;*/
        /*left: 0;*/
        /*top: 0;*/
        /*right: 0;*/
        z-index: 9;
    }
    
    .content {
        /*height: calc(100% - 49px);*/
        /*margin-top: 44px;*/
        /* 使内容自动撑大 用calc计算 或者 定位   */
        position: absolute;
        top: 44px;
        bottom: 49px;
        left: 0;
        right: 0;
    }
    
    .tab-control {
        position: relative;
        z-index: 9;
    }
    /*.fixed {*/
    /*  position: fixed;*/
    /*  top: 44px;*/
    /*  left: 0;*/
    /*}*/
    /* #home {
        
        height: 100vh;
    }
    
    .home-nav {
        background-color: var(--color-tint);
        color: #fff;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        z-index: 9;
    }
    
    .tab-control {
        position: sticky;
        top: 44px;
        z-index: 8
    }
    .tab-con {
    position: relative;
    z-index: 9;
  }
    
    .content {
        height: calc(100% - 93px);
        overflow: hidden;
        margin-top: 44px;
    } */
</style>