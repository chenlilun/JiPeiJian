<template>
  <div id="app">
    <van-nav-bar title="领料单" left-text="返回" left-arrow @click-left="onClickLeft" />

    <div class="button-type">
      <van-tabs class="type-content" color="#1989fa" line-width="25px">
        <van-tab title="有领料号">
          <div>
            <div class="calendar">
              <van-cell title="请选择日期" :value="calendarDate" @click="calendarShow=true" />
              <van-calendar :min-date="minDate" v-model="calendarShow" @confirm="onConfirm" />
            </div>
            <div
              class="materuak-item"
              v-for="(item, index) in materuakRequisitionzListType0"
              :key="index"
            >
              <div class="content">
                <div class="title">申请单号:</div>
                <div class="text">{{item.APPLY_CODE}}</div>
              </div>
              <div class="content">
                <div class="title">厂库名称:</div>
                <div class="text">{{item.HOUSE_NAME}}</div>
              </div>
              <div class="content">
                <div class="title">物料号:</div>
                <div class="text">{{item.SP_CODE}}</div>
              </div>
              <div class="content">
                <div class="title">物料描述:</div>
                <div class="text">{{item.SP_DESC}}</div>
              </div>
              <div class="content">
                <div class="title">领料人:</div>
                <div class="text">{{item.APPLY_USER}}</div>
              </div>
              <div class="content">
                <div class="title">申请数量</div>
                <input class="inp" type="number" v-model="item.inputKey" />
              </div>
              <van-button
                v-show="materuakRequisitionzListType0.length>0"
                style="width:100%;margin-top: 20px;"
                type="info"
                @click="submitType0(item)"
              >提交</van-button>
            </div>
          </div>
        </van-tab>
        <van-tab title="无领料号">
          <div>
            <div
              class="materuak-item1"
              v-for="(item, index) in materuakRequisitionzListType1"
              :key="index"
            >
              <div class="content1">
                <div class="title">条码:</div>
                <div class="text">{{item.BARCODE}}</div>
              </div>
              <div class="content">
                <div class="title">数量:</div>
                <div class="text">{{item.MENGE}}</div>
              </div>
              <div class="content">
                <div class="title">成本中心:</div>
                <div class="text">{{item.KOSTL}}</div>
              </div>
            </div>
            <van-button
              v-show="materuakRequisitionzListType1.length>0"
              style="width:90%;margin-top: 20px;margin-bottom: 20px;"
              type="info"
              @click="submitType1"
            >提交</van-button>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div class="type-content"></div>
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
      calendarShow: false,
      minDate: new Date(2019, 0, 1),
      calendarDate: "",
      materuakRequisitionzListType0: [],
      materuakRequisitionzListType1: [
        {
          ITEM: "10",
          BARCODE: "100003001/200281/TEST/1TES3",
          MENGE: 12.5,
          KOSTL: "921012",
        },
        {
          ITEM: "20",
          BARCODE: "100003002/200281/TEST23/1TES3",
          MENGE: 150,
          KOSTL: "921012",
        },
      ],
    };
  },
  methods: {
    submitType0(item) {
      console.log(JSON.stringify(item));
      this.$api
        .submit({
          BUDAT: "",
          APPLY_CODE: item.APPLY_CODE,
          SOURCE: "PDA",
          PDA_CODE: "123456",
          DATA: item.submitList,
        })
        .then((res) => {});
    },
    submitType1() {},
    formatDate(date) {
      console.log(date.getFullYear());
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(date) {
      this.calendarShow = false;
      this.calendarDate = this.formatDate(date);
      //查询

      let datatime = `${this.CurentTime(date)}`;
      this.companyCode = 9200;
      this.$api
        .getMateruakRequisition({
          APPLYDATE: datatime,
          BUKRS: this.companyCode,
        })
        .then((res) => {
          if (res.APPLYLISTS != null && res.APPLYLISTS.length > 0) {
            this.materuakRequisitionzListType0 = res.APPLYLISTS.map((item) => {
              item.inputKey = 0;
              item.submitList = [];
              return item;
            });
            console.log(this.materuakRequisitionzListType0);
          } else {
            this.materuakRequisitionzListType0 = [];
            Toast("没有物料单数据");
          }
        });
    },
    CurentTime(now) {
      var year = now.getFullYear(); //年
      var month = now.getMonth() + 1; //月
      var day = now.getDate(); //日
      var clock = year;
      if (month < 10) clock += "0";
      clock += month;
      if (day < 10) clock += "0";
      clock += day;
      return clock;
    },

    onClickLeft() {
      Toast("返回");
      window.android.finish();
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
    //公司清单
    this.$api.getCompany().then((res) => {
      console.log(res, "res");
      //  Toast(res);
    });
    //工厂清单
    this.$api.getfactory().then((res) => {
      console.log(res, "工厂");
      // Toast(res);
    });

    this.userId = this.$route.query.userId;
    this.name = this.$route.query.name;
    this.username = this.$route.query.username;
    this.factoryCode = this.$route.query.factoryCode;
    this.companyCode = this.$route.query.companyCode;

    // Toast(this.username + this.factoryCode + this.companyCode);
  },
  mounted() {
    window.callByAndroid = this.callByAndroid;
  },
};
</script>

<style lang="scss">
@import "./css/home.scss";
</style>
