<template>
  <div id="app">
    <van-nav-bar title="丝车详情" left-text="返回" left-arrow @click-left="onClickLeft" />

    <div class="button-type">
      <van-button type="primary" @click="type(0)">有领料号</van-button>
      <van-button type="info" @click="type(1)">无领料号</van-button>
    </div>
    <div class="type-content">
      <div v-show="numberType==0">
        <van-cell title="请选择日期" :value="calendarDate" @click="calendarShow=true" />
        <van-calendar :min-date="minDate" v-model="calendarShow" @confirm="onConfirm" />
      </div>
      <div v-show="numberType==1"></div>
    </div>

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
      numberType: 0,
      calendarShow: false,
      minDate: new Date(2019, 0, 1),
      calendarDate: "",
    };
  },
  methods: {
    formatDate(date) {
      console.log(date.getFullYear());
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(date) {
      this.calendarShow = false;
      this.calendarDate = this.formatDate(date);
      //查询

      this.$api.getCompany().then((res) => {
        console.log(res, "res");
        Toast(res);
      });
    },
    type(number) {
      this.numberType = number;
    },
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
@import "./css/home.scss";
</style>
