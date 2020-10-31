<template>
  <div id="app">
    <router-view />
  </div>
</template>


<script>
import RouterView from "@/components/RouterView";
export default {
  name: "App",
  components: {
    RouterView,
  },
};
</script>

<style lang="scss">
.van-toast--text {
  .van-toast__text {
    font-size: 23px;
    word-break: break-all;
  }
}
</style>
