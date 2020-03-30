<template>
  <div id="home">
    <!--顶部导航栏-->
    <nav-bar class="home-nav"><div slot="center">易BUY</div></nav-bar>
    <nav-tab :nav-data="['流行','新款','精选']" class="fixed"
             @navClick="navClick" ref="navTab1" v-show="isTabFixed"></nav-tab>

    <!--scroll-->
    <scroll
            class="content"
            ref="scroll"
            :probe-type="3"
            :pull-up-load="true"
            @pullingUp="loadMore"
            @scroll="currentScroll"
    >
    <!--轮播图-->
    <van-swipe class="swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(image,index) in banners" :key="index">
        <img class="img" :src="image.image" @load="ImgLoad"/>
      </van-swipe-item>
    </van-swipe>
    <!--推荐-->

      <home-recommend :recommend="recommends" />
      <home-recommend-bg></home-recommend-bg>
    <nav-tab :nav-data="['流行','新款','精选']"
             @navClick="navClick" ref="navTab2"></nav-tab>
    <goods-list :goods-list="showGoods" />
    </scroll>
    <back-top @click.native="backTopClick" v-show="isShowBackTop"></back-top>


  </div>
</template>

<script>
import Scroll from "../../components/Scroll";
import NavTab from "../../components/NavTab";
import GoodsList from "../../components/goodsList/GoodsList";
import NavBar from "../../components/NavBar";
import BackTop from "../../components/BackTop";
import HomeRecommendBg from "./homeCmps/HomeRecommendBg";
import HomeRecommend from "./homeCmps/HomeRecommend";
export default {
  name: 'Home',
  components: {
    Scroll,
    NavTab,
    GoodsList,
    NavBar,
    BackTop,
    HomeRecommendBg,
    HomeRecommend
  },
  data() {
    return {
      banners: [],
      recommends: [],
      currentType: "pop",
      goodsData: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []}
      },
      tabOffsetTop: 0,
      isLoad: false,
      isTabFixed: false,
      isShowBackTop: false,
    }
  },

  created() {
    this.getList()
    this.getGoods('pop')
    this.getGoods('new')
    this.getGoods('sell')
  },
  mounted() {
    const refresh = this.debounce(this.$refs.scroll.refresh,0.1)
    this.$bus.$on('itemImageLoad',()=>{
      refresh()
    })

  },
  computed: {
    showGoods() {
      return this.goodsData[this.currentType].list
    }
  },
  methods: {
    backTopClick() {
      this.$refs.scroll.scrollTo(0,0)
    },
    currentScroll(position) {
      this.isShowBackTop = -position.y > 1000
      this.isTabFixed = -position.y > this.tabOffsetTop
    },
    ImgLoad() {
      if(!this.isLoad){
        this.tabOffsetTop = this.$refs.navTab2.$el.offsetTop
        this.isLoad = true
      }
    },
    debounce(func, delay){
      let timer = null
      return function(...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(()=>{
          func.apply(this, args)
        },delay)
      }
    },
    getList() {
      this.$http.get('/home/multidata').then(res => {
        this.banners = res.data.data.banner.list
        this.recommends = res.data.data.recommend.list
      })
    },
    getGoods(type) {
      const page = this.goodsData[type].page + 1;
      this.$http.get('/home/data', {
        params: {
          type,
          page
        }
      }).then(res => {
        this.goodsData[type].list.push(...res.data.data.list);
        this.goodsData[type].page += 1;
        this.$refs.scroll.finishPullUp();
      })
    },
    loadMore() {
      this.getGoods(this.currentType);

    },
    navClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.navTab1.currentIndex = index
      this.$refs.navTab2.currentIndex = index
    }
  }
}
</script>

<style scoped>
  .home-nav {
    background-color: var(--color-tint);
    font-size: 15px;
    color: #fff;
    font-weight: 600;
    position: relative;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  .navTab {
    position: relative;
  }
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 0px;
    left: 0;
    right: 0;
  }
  .img{
    width: 100%;
  }
  .fixed {
    position: relative;
    z-index: 9;
    background: white;
  }

</style>