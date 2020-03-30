<template>
  <div id="category">
    <!--顶部导航-->
    <nav-bar class="nav-bar"><div slot="center">分类</div></nav-bar>
    <!--侧边导航-->
    <slide-bar :slideBarList="categoryList" @slideBarItemClick="slideBarItemClick" />
    <!--右侧显示-->
    <scroll class="content" ref="scroll" @scroll="scroll" :probeType="3">
      <sub-category :list="subCategoryList[currentIndex]" />
      <nav-tab :navData="titleList" @navClick="navClick" ref="navTab" />
      <goods-list :goodsList="categoryDetailList" />
    </scroll>

  </div>
</template>

<script>
  import SlideBar from './categoryCmps/SlideBar';
  import SubCategory from './categoryCmps/Subcategory';
  import Scroll from "../../components/Scroll";
  import NavTab  from "../../components/NavTab";
  import GoodsList from "../../components/goodsList/GoodsList";
  import NavBar from "../../components/NavBar";

  export default {
    name: "Category",
    data() {
      return {
        activeKey: 0,
        categoryList: [],
        currentIndex: 0,
        //分类内容数据
        subCategoryList: [],
        titleList: ["流行", "新款", "精选"],
        categoryDetailList: [],
        //存储key值
        keyList: []
      }
    },
    components: {
      Scroll,
      SlideBar,
      SubCategory,
      NavTab,
      GoodsList,
      NavBar
    },
    created() {
      this.getCategoryList()
    },

    methods: {
      getCategoryList(){
        this.$http.get('/category').then(res=> {
          //存储左侧主题栏数据
          this.categoryList = res.data.data.category.list;
          this.$nextTick(() => {
            // 读取参数协助右侧top请求对应的数据
            this.getSubCategoryList(this.categoryList[0].maitKey, 0)
            this.getCategoryDetail(this.categoryList[0].miniWallkey, "pop");
            this.keyList.push(this.categoryList[0].maitKey);
          })
        })
      },
      getSubCategoryList(maitKey,index){
        this.$http.get('/subcategory',{
          params: {maitKey}
        }).then(res =>{
          this.subCategoryList[index] = res.data.data.list
        })
      },
      getCategoryDetail(miniWallkey, type) {
        this.$http.get('/subcategory/detail',{
          params: {miniWallkey, type}
        }).then(res => {
          this.categoryDetailList = res.data
        })
      },
      slideBarItemClick({maitKey, index}){
        this.currentIndex = index
        this.$refs.navTab.currentIndex = 0;
        this.getCategoryDetail(this.categoryList[this.currentIndex].miniWallkey, "pop");
        this.keyList[index] = maitKey;
        this.getSubCategoryList(this.categoryList[this.currentIndex].maitKey, index);
        this.$refs.scroll.scrollTo(0, 0, 0);
      },
      //监听scroll当前位置
      scroll(position) {
        //决定显示或隐藏返回顶部按钮
        this.isShowBack = -position.y > 1000;
      },
      navClick(index) {
        const typeList = ["pop", "new", "sell"];
        this.getCategoryDetail(
            this.categoryList[this.currentIndex].miniWallkey,
            typeList[index]
        );
      }
    }
  }
</script>

<style scoped>
  .nav-bar{
    background: #ff8198;
    color: white;
  }

  .active{
    color: #ff8198;
  }
  .content {
    position: fixed;
    top: 44px;
    right: 0;
    bottom: 50px;
    left: 100px;
    overflow: hidden;
  }
</style>