<template>
    <div id="app">
      <router-view/>
    </div>
</template>


<script>
// import HelloWorld from "@/components/HelloWorld.vue";
import { Toast } from "vant";
// import { List } from "vant";
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 1px;
}
.main2 {
    margin: 5px 5px;
    height: 40px;
    display: flex;
    background-color: #cccccc;
    overflow: hidden;
    border-radius: 6px;
}

.main2 > .left {
    flex: 3;
    padding-left: 8px;
    line-height: 40px;
    color: white;
}

.main2 > .right {
    flex: 1;
    line-height: 40px;
    color: red;
}
element.style {
    margin: 0px;
    display: inline-block;
}
.van-field__label {
  -webkit-box-flex: 0;
  -webkit-flex: none;
  flex: none;
  box-sizing: border-box;
  width: 8.2em;
  margin-right: 3.2vw;
  color: #cdffe6;
  text-align: left;
  word-wrap: break-word;
}
/*顶部块样式*/
header {
  width: 100%;
  /*设置为伸缩盒子*/
  display: flex;
}
header > a {
  /*width: 100%;*/
  /*flex:设置当前子元素占据父容器剩余宽度的比例*/
  flex: 1;
}
header > a > img {
  width: 100%;
}
/*主体内容块样式*/
main {
  width: 100%;
  padding: 0 10px;
  /*设置盒模型*/
  box-sizing: border-box;
}
main > .item {
  width: 100%;
  height: 100px;
  background-color: #57c3ae;
  border-radius: 10px;
  margin-top: 10px;
  /*设置为伸缩盒子*/
  display: flex;
}
main > .item:nth-of-type(2) {
  background-color: #33aa46;
}
main > .item:nth-of-type(3) {
  background-color: #aa4b40;
}
main > .item:nth-of-type(4) {
  background-color: #445faa;
}
main > .item > .left {
  flex: 1;
}
main > .item > .right {
  flex: 2;
  /*设置换行显示*/
  flex-wrap: wrap;
  /*设置为伸缩盒子*/
  display: flex;
}
main > .item > .right > a {
  /*如果想让子元素换行显示，必须为子元素设置宽度*/
  width: 50%;
  box-sizing: border-box;
  border-left: 1px solid #fff;
  border-bottom: 1px solid #fff;
  display: block;
  color: #fff;
  line-height: 50px;
  text-align: center;
  text-decoration: none;
}
main > .item > .right > a:nth-last-of-type(-n + 2) {
  border-bottom: none;
}
main > .extra {
  width: 100%;
  display: flex;
}
main > .extra > a {
  flex: 1;
}
main > .extra > a > img {
  width: 100%;
}
/*底部块样式*/
footer {
  width: 100%;
  font-size: 13px;
}
footer > nav {
  width: 100%;
  display: flex;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
footer > nav > a {
  flex: 1;
  line-height: 30px;
  text-align: center;
  color: #888;
  text-decoration: none;
}
footer > .link {
  text-align: center;
  line-height: 25px;
}
footer > .copyRight {
  text-align: center;
}
.van-toast__text {
    margin-top: 2.133vw;
    font-size: 25px;
}
.van-cell__title > span {
    float: left;
    overflow: hidden;
    font-size: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.van-field__control {
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    color: red;
    font-size: 20px;
    line-height: inherit;
    text-align: left;
    background-color: transparent;
    border: 0;
    resize: none;
}
.van-button--small {
    height: 8.533vw;
    padding: 0 2.133vw;
    font-size: 4.2vw;
}
</style>
