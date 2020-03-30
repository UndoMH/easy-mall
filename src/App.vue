<template>
  <div id="app">
    <keep-alive exclude="Detail">
      <router-view></router-view>
    </keep-alive>
    <main-tab-bar />
  </div>
</template>

<script>
  import MainTabBar from "@/components/tabbar/MainTabBar";

  export default {
    data(){
      return {
        active: 0
      }
    },
    components: {
      MainTabBar
    },
  }

</script>
<style>
  @import "assets/css/base.css";

</style>
