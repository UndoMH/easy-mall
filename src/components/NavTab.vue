<template>
  <div class="nav-tab">
    <div
      class="nav-item"
      v-for="(item,index) in navData"
      :key="index"
      :class="{active:currentIndex===index}"
      @click="itemClick(index)"
    >
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "NavTab",
    props: {
      navData: Array,
      default() {
        return [];
      }
    },
    data() {
      return {
        currentIndex: 0
      };
    },
    methods: {
      //获取点击事件，返回当前点击的index，并传递给组件
      itemClick(index) {
        this.currentIndex = index;
        this.$emit("navClick", index);
      }
    }
  };
</script>
<style scoped>
  .nav-tab {
    display: flex;
    text-align: center;
    height: 40px;
    line-height: 40px;
    font-size: 15px;
  }
  .nav-item {
    flex: 1;
  }

  .nav-item span {
    display: inline-block;
    padding: 0 5px;
  }

  .active {
    color: var(--color-high-text);
  }

  .active span {
    border-bottom: 2px solid var(--color-tint);
  }
</style>