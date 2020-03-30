<template>
  <div id="detail" class="detail">
    <!--顶部导航-->
    <nav-bar ref="bar">
      <div slot="left" class="back" @click="backClick">
        <img src="~@/assets/img/common/back.svg" alt />
      </div>
      <div slot="center" class="title">
        <div
                v-for="(item,index) in indexList "
                :key="index"
                class="title-item"
                :class="{active:currentIndex===index}"
                @click="titleClick(index)"
        >{{item}}</div>
      </div>
    </nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="currentScroll">
      <!--轮播图-->
      <van-swipe class="swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(image,index) in swipeData" :key="index">
            <img class="img" :src="image"/>
        </van-swipe-item>
      </van-swipe>
      <!-- 详情商品介绍 -->
      <detail-suggest :suggest-data="goodsSuggestData" />
      <!-- 商家店铺展示 -->
      <detail-shop-info :shop-info="shopInfoData" />
      <!-- 商品细节图片展示 -->
      <detail-info :detail-info="detailInfoData" @itemImgLoad="itemImgLoad" />
      <!-- 商品参数展示 -->
      <detail-item-param :item-params="itemParamsData" ref="param" />
      <!-- 商品评论展示 -->
      <detail-rate :rate-data="itemRateData" ref="rate" />
      <!-- 商品推荐 -->
      <div class="goods-title">
        <div>商品推荐</div>
      </div>
      <goods-list :goods-list="RecommendData" ref="goods" />
    </scroll>

    <detail-bottom-nav @addCart="addCart" />
  </div>
</template>

<script>
  import DetailSuggest from "./detailCmps/DetailSuggest";
  import DetailBottomNav from "./detailCmps/DetailBottomNav";
  import DetailInfo from "./detailCmps/DetailInfo";
  import DetailItemParam from "./detailCmps/DetailItemParam";
  import DetailShopInfo from "./detailCmps/DetailShopInfo";
  import DetailRate from "./detailCmps/DetailRate";
  import Scroll from "../../components/Scroll";
  import GoodsList from "../../components/goodsList/GoodsList";
  import NavBar from "../../components/NavBar";
  import { debounce } from "@/common/utils";
  import {
    getDetailData,
    getGoodsInfo,
    getShopInfo,
    getRecommendData
  } from "@/netwrok/detail";
  export default {
    name: "Detail",
    components: {
      DetailSuggest,
      DetailBottomNav,
      DetailInfo,
      DetailItemParam,
      DetailShopInfo,
      DetailRate,
      Scroll,
      GoodsList,
      NavBar
    },
    data() {
      return {
        iid: '',
        indexList: ["商品", "参数", "评论", "推荐"],
        currentIndex: 0,
        swipeData: [],
        goodsSuggestData: {},
        shopInfoData: {},
        detailInfoData: {},
        itemParamsData: {},
        itemRateData: {},
        RecommendData: [],
        themeTopYs: [],
        getThemeTopY: null,
        IsLoad: false
      }
    },
    created() {
      this.iid = this.$route.params.iid
      this.getData(this.iid)
    },
    mounted(){

    },
    methods: {
      getData(){
        getDetailData(this.iid).then(res => {
          console.log(res);
          const data = res.result;
          //保存轮播图数据
          this.swipeData = data.itemInfo.topImages;
          //保存商品介绍数据，放在一个类中（方法2）
          this.goodsSuggestData = new getGoodsInfo(
              data.itemInfo,
              data.columns,
              data.shopInfo
          );
          //保存店铺介绍数据
          this.shopInfoData = new getShopInfo(data.shopInfo);
          //保存商品展示图片数据
          this.detailInfoData = data.detailInfo;
          //保存商品查尺寸规格数据
          this.itemParamsData = data.itemParams;
          //保存商品首评论数据（是否有数据）
          if (data.rate.list) {
            this.itemRateData = data.rate.list[0];
          }
          //隐藏loading
          this.isShowLoading = false;
        });
      },
      backClick() {
        this.$router.go(-1)
      },
      addCart () {
        const product = {};
        product.image = this.swipeData[0];
        product.title = this.goodsSuggestData.title;
        product.style = this.itemRateData.style;
        product.price = this.goodsSuggestData.price;
        product.iid = this.iid;
        //提交mutations
        this.$store.dispatch("addCart", product)
      },
      currentScroll() {

      },
      itemImgLoad() {

      },
      titleClick(index){
        this.currentIndex = index
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300)
      },

      /*getData(id) {
        this.$http.get('/detail', {
          params: {
            iid: this.iid
          }
        }).then(res => {
          const data = res.data.result
        //轮播图
        this.swipeData = data.itemInfo.topImages
        //商品详情信息
        this.goodsSuggestData.title = data.itemInfo.title
        this.goodsSuggestData.price = data.itemInfo.lowNowPrice
        this.goodsSuggestData.oldPrice = data.itemInfo.oldPrice
        this.goodsSuggestData.desc = data.itemInfo.discountDesc
        this.goodsSuggestData.descBGC = data.itemInfo.discountBgColor
        this.goodsSuggestData.columns = data.columns
        this.goodsSuggestData.services = data.shopInfo.services
        this.goodsSuggestData.lowPrice = data.itemInfo.lowPrice
        //店铺信息
        this.shopInfoData.logo =  data.shopInfo.shopLogo
        this.shopInfoData.name =  data.shopInfo.name
        this.shopInfoData.fans =  data.shopInfo.cFans
        this.shopInfoData.sells = data.shopInfo.cSells
        this.shopInfoData.score = data.shopInfo.score
        this.shopInfoData.goods = data.shopInfo.cGoods
        //保存商品展示图片数据
        this.detailInfoData = data.detailInfo;
        //保存商品查尺寸规格数据
        this.itemParamsData = data.itemParams;
        if (data.rate.list) {
          this.itemRateData = data.rate.list[0];
        }
      })
      }*/
  }
  }
</script>

<style>
  .swipe {
    overflow: hidden;
    height: 300px
  }

  .img{
    width: 100%;
  }

  .title {
    display: flex;
  }
  .title-item {
    flex: 1;
    font-size: 13px;
    color: #333;
  }

  .title {
    color: #333;
    font-size: 15px;
  }

  .columns span {
    flex: 1;
    height: 19px;
    display: inline-block;
  }

  .services img {
    width: 14px;
    height: 14px;
  }

  .detail {
    height: 100vh;
    background-color: #fff;
    position: relative;
    z-index: 1;
  }

  .content {
    background-color: #fff;
    height: calc(100% - 44px)
  }

  .back{
    margin-top: 6px;
  }
</style>