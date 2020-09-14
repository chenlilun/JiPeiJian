<template>
  <div id="app">
    <van-nav-bar title="丝车详情" left-text="返回" left-arrow @click-left="onClickLeft" />

    <div></div>
    <div style="margin: 10px;">
      <!-- <van-button round block plain hairline type="primary">{{silkCarCode}}</van-button> -->
      <van-field v-model="silkCarCode" center clearable label="丝车条码" placeholder="请扫描丝车条码">
        <template #button>
          <van-button size="small" type="primary" @click="find">查询</van-button>
        </template>
      </van-field>
    </div>

    <ol style>
      <!-- <li v-for="(item, index ) in list" :key="index">{{ item.batch }}</li> -->
      <main v-for="(item, index ) in list" :key="index">
        <section class="item">
          <!-- <div class="left"></div> -->
          <div class="right">
            <a @click.prevent>数量:{{item.silkCarRowColList.length}}</a>
            <a @click.prevent>{{item.batch}}</a>
            <a @click.prevent>{{item.line+'/'+item.machine+'/'+item.doffNum}}</a>
            <a @click.prevent>{{item.grade}}</a>
          </div>
        </section>
      </main>
    </ol>
    <van-popup
      v-model="show"
      close-icon-position="top-left"
      closeable
      position="right"
      :style="{ height: '100%' , width : '70%'  }   "
    >
      <div style="margin-top: 30px;margin-left: 8px">
        <van-steps direction="vertical" :active="0">
          <van-step v-for="(item  , index) in events" :key="index">
            <div>
              <h3>操作类型:{{item.operate}}</h3>
            </div>
            <h3>操作人:{{item.post+' ' +item.operator}}</h3>
            <h4>时间:{{ getTime(item.operateTime) }}</h4>
            <van-collapse v-model="activeNames">
              <van-collapse-item title="操作丝锭" :name="index">
                <p v-for="(i, index ) in item.silkCodes" :key="index">{{i}}</p>
              </van-collapse-item>
            </van-collapse>
            <van-button
              style="margin-top: 5px"
              type="danger"
              v-if="item.recover"
              @click="recover(item)"
            >撤销</van-button>
            <van-divider
              :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
            >分割线</van-divider>
          </van-step>
        </van-steps>
      </div>
    </van-popup>

    <!-- <van-field readonly name="picker" :value="capacity" label="丝锭数量:" placeholder />
    <van-field readonly :value="capacity" label="线别/位号/落次:" placeholder />-->

    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  </div>
</template>


<script>
// import HelloWorld from "@/components/HelloWorld.vue";
import { Toast } from "vant";
import { Divider } from "vant";
import moment from "moment";
// import { List } from "vant";
var axios = require("axios");

export default {
  name: "app",
  components: {
    // HelloWorld,
  },
  data() {
    return {
      activeNames: ["0"],
      activeNameArray: [],
      showDoff: false,
      lineWeiDoff: "",
      date: "",
      capacity: "",
      show: false,
      events: [],
      silkCarCode: "9700P600002",
      list: [],
      loading: false,
      finished: true,
      refreshing: false,
      userId: "",
      name: "",
      factoryCode: "",
      companyCode: "",
      username: "",
    };
  },
  methods: {
    recover(item) {
      // Toast.loading({
      //     message: '撤销...',
      //     forbidClick: true,
      //     loadingType: 'spinner',
      //     duration:0
      // });
      console.log("aaa");
      let arr = [];
      arr.push(item);

      this.$api
        .silkSeparateRecover({
          post: this.name,
          modifier: this.userId,
          silkCarCode: this.silkCarCode,
          events: arr,
        })
        .then((res) => {
          if (res.data.status === "200") {
            this.find();
            Toast.clear();
            Toast.success(res.data.msg);
          } else {
            Toast.clear();
            Toast(res.data.msg);
          }
        });
    },
    find() {
      if (this.silkCarCode) {
        this.getSilkcarDetails(this.silkCarCode);
      }
    },
    getTime: function (date) {
      return moment(new Date(date)).format("YYYY-MM-DD HH:mm:ss");
    },
    onClickLeft() {
      Toast("返回");
      window.android.finish();
    },
    onClickRight() {
      // Toast("按钮3333");
      // this.$router.push({
      //   path: '/SilkUnbind',
      // })
      this.show = true;
    },
    callByAndroid(code) {
      Toast(code);
      this.silkCarCode = code;
      this.getSilkcarDetails(code);
    },
    getSilkcarDetails: function (code) {
      this.$api.getSilkss(code).then((res) => {
        console.log(res.data);
        if (res.data.status == "200") {
          this.list = [];
          this.events = res.data.data.events;
          if (this.events && this.events.length > 0) {
            this.events.forEach((a) => {
              this.activeNameArray.push(this.activeName);
            });
          }

          res.data.data.spindleLists.forEach((e) => {
            this.list.push(e);
          });
          this.capacity = res.data.data.silkCarRowColList.length;
          if (
            res.data.data.silkCarOnLinePositions &&
            res.data.data.silkCarOnLinePositions.length > 0
          ) {
            this.lineWeiDoff = this.getDoff(
              res.data.data.silkCarOnLinePositions
            );
          }
          this.showDoff =
            res.data.data.doffType === "MANUAL" ||
            res.data.data.doffType === "AUTO";
          this.loading = false;
          this.finished = true;
        } else {
          Toast(res.data.msg);
        }
      });
    },

    getDoff(arr) {
      let s = "";
      arr.forEach((e) => {
        let a = e.lineMachine + "/" + e.doffNo + "  ";
        s = s + a;
      });
      return s;
    },
    onRefresh() {
      // 清空列表数据
      // this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
    },
  },
  created() {
    // console.log($)
    // $.ajax({
    //     url: "http://192.168.0.225:8000/sap/bc/zh/eam/spapplylist?sap-client=222&query=bukrs",
    //     type: "GET",
    //     dataType: "jsonp", //指定服务器返回的数据类型
    //     jsonp: "callback",
    //     jsonpCallback:"message" ,
    //     data: {
    //         username:'zhangyong',
    //         password:'34567890'
    //     },
    //     contentType: 'application/json, text/plain, */*',
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader("Authorization", "Basic emhhbmd5b25nOjM0NTY3ODkw");
    //     },
    //     success: function (data) {
    //         // var result = JSON.stringify(data); //json对象转成字符串
    //         console.log(JSON.stringify(data),'你好')
    //         console.log("aa",'你好')
    //         Toast(data)
    //     },
    //     error: function(jqXHR, textStatus, errorThrown) {
    //         console.log('error ' + textStatus + ' ' + errorThrown);
    //         console.log('jqXHR ' + JSON.stringify(jqXHR) );
    //         Toast('error')
    //     },
    //     recover(item) {
    //         // console.log(item,"aa")
    //     },
    //     complete(a,b){
    //         // console.log(a,'aaaaaaaaaaaaa')
    //         // console.log(b,'bbbbbbbbbbbbb')
    //     },
    //     dataFilter(c,d){
    //         // console.log(c,'ccccc')
    //         // console.log(d,'ddddd')
    //     },
    //
    // });

    this.$api.getCompany().then((res) => {
      console.log(res, "res");
      Toast(res);
    });

    this.userId = this.$route.query.userId;
    this.name = this.$route.query.name;
    this.username = this.$route.query.username;
    this.factoryCode = this.$route.query.factoryCode;
    this.companyCode = this.$route.query.companyCode;
    Toast(this.username + this.factoryCode + this.companyCode);
  },
  mounted() {
    window.callByAndroid = this.callByAndroid;
  },
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 1px;
}

.van-field__label {
  -webkit-box-flex: 0;
  -webkit-flex: none;
  flex: none;
  box-sizing: border-box;
  width: 8.2em;
  margin-right: 3.2vw;
  color: #646566;
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
  height: 150px;
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
  width: 25%;
  box-sizing: border-box;
  border-left: 1px solid #fff;
  border-bottom: 1px solid #fff;
  display: block;
  color: #fff;
  line-height: 50px;
  text-align: center;
  text-decoration: none;
}

main > .item > .right > a:nth-last-of-type(-n + 1) {
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
</style>
