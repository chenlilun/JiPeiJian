<template>
  <div id="app">
    <van-nav-bar title="领料单" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-button style="width:100%;margin-top: 20px;" type="info" @click="callByAndroid">扫码数据</van-button>
    <div class="button-type">
      <van-tabs class="type-content" color="#1989fa" line-width="25px" @click="onType">
        <van-tab title="有领料号">
          <div>
            <div class="calendar">
              <van-cell title="请选择日期" :value="calendarDate" @click="calendarShow=true" />
              <van-calendar :min-date="minDate" v-model="calendarShow" @confirm="onConfirm" />
            </div>
            <div class="materuak-item" v-for="(item, index) in materuakOdd" :key="index">
              <div
                class="content"
                style="background-color: #999;padding-left:5px;padding-right:5px"
              >
                <div class="title">申请单号:</div>
                <div class="text" style="color:#000;">{{item.odd}}</div>
              </div>
              <div class="odd-list" v-for="(odditem, j) in item.oddList" :key="j">
                <div class="content">
                  <div class="title">物料号:</div>
                  <div class="text">{{odditem.SP_CODE}}</div>
                </div>
                <div class="content">
                  <div class="title">厂库名称:</div>
                  <div class="text">{{odditem.HOUSE_NAME}}</div>
                </div>

                <div class="content">
                  <div class="title">物料描述:</div>
                  <div class="text">{{odditem.SP_DESC}}</div>
                </div>
                <div class="content">
                  <div class="title">领料人:</div>
                  <div class="text">{{odditem.APPLY_USER}}</div>
                </div>
                <div class="content">
                  <div class="title">物料总数:</div>
                  <div class="text">{{odditem.APPLY_NUM}}</div>
                </div>
                <!-- 
                   SP_CODE: cc[0], //物料号
          BARCODE: tm, //物料描述
          PC: cc[1], KOSTL: this.costBean.KOSTL, //成本中心
          KTEXT: this.costBean.KTEXT, //成本中心姓名
          LGORT: this.locationBean.LGORT, //库存地
          LGOBE:this.locationBean.LGOBE,
                WEMPF: this.receivingBean.WEMPF, //收货方-->
                <div class="odd-item" v-for="(materialitem, o) in odditem.materialList" :key="o">
                  <div class="content">
                    <div class="title">批次:</div>
                    <div class="text">{{materialitem.PC}}</div>
                  </div>
                  <div class="content">
                    <div class="title">成本中心:</div>
                    <div class="text">{{materialitem.KTEXT}}</div>
                    <div class="change-but" @click="costAction1 = true;temporaryCost=materialitem">改</div>
                  </div>
                  <div class="content">
                    <div class="title">库存地点:</div>
                    <div class="text">{{materialitem.LGOBE}}</div>
                    <div
                      class="change-but"
                      @click="locationAction1 = true;temporaryLocation=materialitem"
                    >改</div>
                  </div>
                  <div class="content">
                    <div class="title">收货方:</div>
                    <div class="text">{{materialitem.WEMPF}}</div>
                    <div
                      class="change-but"
                      @click="receivingAction1 = true;temporaryReceiving=materialitem"
                    >改</div>
                  </div>
                  <div class="content">
                    <div class="title">申请数量</div>
                    <input
                      class="inp"
                      type="number"
                      v-model="materialitem.MENGE"
                      style="background-color: #eee;"
                    />
                  </div>
                </div>
              </div>

              <van-button
                v-show="materuakOdd.length>0"
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
                <div class="text">{{item.BARCODE}}</div>
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
    <van-popup v-model="onePop" :close-on-click-overlay="false" class="one-pop">
      <div class="title">请选择初始值</div>
      <div class="item" @click="costAction = true">
        <div>选择成本中心</div>
        <van-icon name="arrow" />
      </div>
      <div v-show="costActionText!=''" class="text">{{costActionText}}</div>
      <div class="item" @click="locationAction = true">
        <div>选择库存地</div>
        <van-icon name="arrow" />
      </div>
      <div v-show="locationActionText!=''" class="text">{{locationActionText}}</div>
      <div class="item" @click="receivingAction = true">
        <div>选择收货方</div>
        <van-icon name="arrow" />
      </div>
      <div v-show="receivingActionText!=''" class="text">{{receivingActionText}}</div>
      <van-button style="width:100%;margin-top: 20px;" type="info" @click="selectOne">确定</van-button>
    </van-popup>
    <van-action-sheet
      v-model="costAction1"
      :actions="costCenterList"
      @select="changeCBZX"
      :close-on-click-action="true"
    />
    <van-action-sheet
      v-model="locationAction1"
      :actions="kcList"
      @select="changeLocation"
      :close-on-click-action="true"
    />
    <van-action-sheet
      v-model="receivingAction1"
      :actions="receivingPatyList"
      @select="changeReceiving"
      :close-on-click-action="true"
    />
    <van-action-sheet
      v-model="costAction"
      :actions="costCenterList"
      @select="onCostCenterSelect"
      :close-on-click-action="true"
    />
    <van-action-sheet
      v-model="locationAction"
      :actions="kcList"
      @select="onKcSelect"
      :close-on-click-action="true"
    />
    <van-action-sheet
      v-model="receivingAction"
      :actions="receivingPatyList"
      @select="onReceivingSelect"
      :close-on-click-action="true"
    />
  </div>
</template>


<script>
import { Toast } from "vant";
export default {
  name: "app",
  components: {},
  data() {
    return {
      temporaryCost: {},
      temporaryLocation: {},
      temporaryReceiving: {},
      costAction1: false,
      locationAction1: false,
      receivingAction1: false,
      costBean: {},
      locationBean: {},
      receivingBean: {},
      costActionText: "",
      receivingActionText: "",
      locationActionText: "",
      locationAction: false,
      receivingAction: false,
      costAction: false,
      onePop: false,
      costCenterPop: false,
      locationPop: false,
      receivingPatyPop: false,
      date: "",
      show: false,
      list: [],
      userId: "",
      name: "",
      factoryCode: "",
      companyCode: "",
      username: "",
      calendarShow: false,
      minDate: new Date(2019, 0, 1),
      calendarDate: "",
      materuakRequisitionzListType0: [],
      materuakOdd: [],
      tabType: 0,
      materuakRequisitionzListType1: [],
      APPLYLISTS: [
        {
          APPLY_CODE: "SQ2006000071",
          APPLY_NUM: 30.0,
          APPLY_USER: "丁琼",
          FACTORY: "9210",
          HOUSE_CODE: "9308",
          HOUSE_NAME: "",
          ID: "",
          SP_CODE: "000000001800875298",
          SP_DESC: "扁锉mm 粗齿",
          SP_UNIT: "EA",
        },
        {
          APPLY_CODE: "SQ2006000071",
          APPLY_NUM: 300.0,
          APPLY_USER: "丁琼",
          FACTORY: "9210",
          HOUSE_CODE: "9301",
          HOUSE_NAME: "五金劳保库",
          ID: "",
          SP_CODE: "000000001800886355",
          SP_DESC: "印刷册（逸暻化纤）POY工序流程卡12锭",
          SP_UNIT: "BEN",
        },
        {
          APPLY_CODE: "SQ2006000071",
          APPLY_NUM: 10.0,
          APPLY_USER: "丁琼",
          FACTORY: "9210",
          HOUSE_CODE: "9301",
          HOUSE_NAME: "五金劳保库",
          ID: "",
          SP_CODE: "000000001000062410",
          SP_DESC: "视镜SF31 PN16 DN25 FF 20#+石英玻璃",
          SP_UNIT: "EA",
        },
        {
          APPLY_CODE: "SQ2006000072",
          APPLY_NUM: 300.0,
          APPLY_USER: "丁琼",
          FACTORY: "9210",
          HOUSE_CODE: "9301",
          HOUSE_NAME: "五金劳保库",
          ID: "",
          SP_CODE: "000000001800886355",
          SP_DESC: "印刷册（逸暻化纤）POY工序流程卡12锭",
          SP_UNIT: "BEN",
        },
        {
          APPLY_CODE: "SQ2006000072",
          APPLY_NUM: 10.0,
          APPLY_USER: "丁琼",
          FACTORY: "9210",
          HOUSE_CODE: "9301",
          HOUSE_NAME: "五金劳保库",
          ID: "",
          SP_CODE: "000000001000062410",
          SP_DESC: "视镜SF31 PN16 DN25 FF 20#+石英玻璃",
          SP_UNIT: "EA",
        },
        {
          APPLY_CODE: "SQ2006000073",
          APPLY_NUM: 10.0,
          APPLY_USER: "丁琼",
          FACTORY: "9210",
          HOUSE_CODE: "9301",
          HOUSE_NAME: "五金劳保库",
          ID: "",
          SP_CODE: "000000001000062410",
          SP_DESC: "视镜SF31 PN16 DN25 FF 20#+石英玻璃",
          SP_UNIT: "EA",
        },
      ],
      QRNumber: 0,
      costCenterList: [], //成本中心
      kcList: [], //库存地点
      receivingPatyList: [], //收货方
    };
  },
  methods: {
    selectOne() {
      if (this.costActionText != "") {
        this.onePop = false;
      } else {
        Toast("请选择成本中心");
      }
    },
    changeCBZX(item) {
      this.temporaryCost.KTEXT = item.KTEXT;
      this.temporaryCost.KOSTL = item.KOSTL;
    },
    changeLocation(item) {
      this.temporaryLocation.LGORT = item.LGORT;
      this.temporaryLocation.LGOBE = item.LGOBE;
    },
    changeReceiving(item) {
      this.temporaryReceiving.WEMPF = item.WEMPF;
    },
    onCostCenterSelect(item, b, c) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.costAction = false;
      this.costActionText = item.name;
      this.costBean = item;
    },
    onKcSelect(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.locationAction = false;
      this.locationActionText = item.name;
      this.locationBean = item;
    },
    onReceivingSelect(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.receivingAction = false;
      this.receivingActionText = item.name;
      this.receivingBean = item;
    },
    submitType0(item) {
      console.log(JSON.stringify(item));
      let dataList = [];
      item.oddList.forEach((i) => {
        let num = 0;
        i.materialList.forEach((t) => {
          num = num + parseInt(t.MENGE);
          dataList.push({
            BARCODE: t.BARCODE, //物料描述
            ITEM: t.ITEM,
            KOSTL: t.KOSTL, //成本中心
            KTEXT: t.KTEXT, //成本中心姓名
            LGORT: t.LGORT, //库存地
            LGOBE: t.LGOBE,
            MENGE: parseInt(t.MENGE),
            WEMPF: t.WEMPF, //收货方
          });
        });
        console.log(num, i.APPLY_NUM);
        if (i.APPLY_NUM != num) {
          Toast("物料号" + i.SP_CODE + "请检查申请数量");
          return;
        }
      });
      //console.log(JSON.stringify(dataList));
      this.$api
        .submit({
          BUDAT: "",
          APPLY_CODE: item.APPLY_CODE,
          SOURCE: "PDA",
          PDA_CODE: "123456",
          DATA: dataList,
        })
        .then((res) => {})
        .catch((err) => {
          //console.log(JSON.stringify(err));
        });
    },
    submitType1() {},
    onType(index, title) {
      this.tabType = index;
      console.log(this.tabType);
    },
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
          if (res.APPLYLISTS != null /*&& res.APPLYLISTS.length > 0 */) {
            this.materuakRequisitionzListType0 = this.APPLYLISTS;

            let odd = [];
            //添加领料单
            this.materuakRequisitionzListType0.forEach((i) => {
              odd.push({ odd: i.APPLY_CODE });
            });
            //去重
            odd = this.deWeightFour(odd);
            //按领料单添加数据
            odd = odd.map((item) => {
              item.oddList = [];

              this.materuakRequisitionzListType0.forEach((i) => {
                if (item.odd === i.APPLY_CODE) {
                  i.materialList = []; //物料数组
                  /*  i.inputKey = 0;
                  i.costCenter = "";
                  i.theInventoryLocation = "";
                  i.receivingPaty = ""; */
                  item.oddList.push(i);
                  console.log(JSON.stringify(i.APPLY_CODE));
                }
              });
              return item;
            });
            this.materuakOdd = odd;
            console.log(JSON.stringify(this.materuakOdd));
          } else {
            this.materuakOdd = [];
            Toast("没有物料单数据");
          }
        });
    },
    //对象去重
    deWeightFour(arr) {
      var obj = {};
      arr = arr.reduce(function (a, b) {
        obj[b.odd] ? "" : (obj[b.odd] = true && a.push(b));
        return a;
      }, []);
      return arr;
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
      // Toast("返回");
      window.android.finish();
    },

    callByAndroid(code) {
      // Toast(code);
      //物料 批次
      let tm =
        "000000001000062410/190328/三角带SPB-2765 GB/T11544 橡胶" +
        Math.floor(Math.random() * 10);

      var cc = tm.split("/");
      if (cc.length > 1) {
        this.QRNumber = this.QRNumber + 1;
        console.log(this.QRNumber);
        let bean = {
          SP_CODE: cc[0], //物料号
          BARCODE: tm, //物料描述
          PC: cc[1],
          ITEM: this.QRNumber * 10,
          KOSTL: this.costBean.KOSTL, //成本中心
          KTEXT: this.costBean.KTEXT, //成本中心姓名
          LGORT: this.locationBean.LGORT, //库存地code
          LGOBE: this.locationBean.LGOBE, //库存地名字
          MENGE: 0,
          WEMPF: this.receivingBean.WEMPF, //收货方
        };
        if (this.tabType == 0) {
          if (this.materuakOdd.length > 0) {
            let isFlag = false;
            this.materuakRequisitionzListType0.forEach((i) => {
              if (cc[0] == i.SP_CODE) {
                isFlag = true;
              }
            });
            if (!isFlag) {
              Toast("没有对应物料号");
              return;
            }
            this.materuakOdd.map((item) => {
              item.oddList = item.oddList.map((i) => {
                if (cc[0] == i.SP_CODE) {
                  if (i.materialList.length > 0) {
                    let repetitionFlag = true;
                    i.materialList.forEach((t) => {
                      if (tm == t.BARCODE) {
                        repetitionFlag = false;
                        return;
                      }
                    });
                    //没重复
                    if (repetitionFlag) {
                      i.materialList.push(bean);
                    }
                  } else {
                    i.materialList.push(bean);
                  }
                }
                return i;
              });
              return item;
            });
            // console.log(JSON.stringify(this.materuakOdd));
          } else {
            Toast("请选择日期获取领料单");
          }
        } else if (this.tabType == 1) {
          this.materuakRequisitionzListType1.push(bean);
        }
      }
      //console.log(JSON.stringify(cc));
    },
    getSilkcarDetails(code) {},

    getDoff(arr) {
      let s = "";
      arr.forEach((e) => {
        let a = e.lineMachine + "/" + e.doffNo + "  ";
        s = s + a;
      });
      return s;
    },

    //获取成本中心
    getCostCenterData() {
      this.$api.costCenter().then((res) => {
        if (res != null && Array.isArray(res)) {
          this.costCenterList = res.map((item) => {
            item.name = item.KTEXT;
            return item;
          });
          this.onePop = true;
        }
        console.log("成本中心", JSON.stringify(res));
      });
    },
    //库存地
    getTheInventoryLocationData() {
      this.$api.theInventoryLocation().then((res) => {
        if (res != null && Array.isArray(res)) {
          this.kcList = res.map((item) => {
            item.name = item.LGOBE;
            return item;
          });
        }
        console.log("库存地", JSON.stringify(this.kcList));
      });
    },
    //收货方
    getReceivingPatyData() {
      this.$api.receivingPaty().then((res) => {
        if (res != null && Array.isArray(res)) {
          this.receivingPatyList = res.map((item) => {
            item.name = item.WEMPF;
            return item;
          });
        }
        console.log("收货方", JSON.stringify(res));
      });
    },
  },
  created() {
    //公司清单
    /*  this.$api.getCompany().then((res) => {
      console.log(res, "res");
      //  Toast(res);
    });
    //工厂清单
    this.$api.getfactory().then((res) => {
      console.log(res, "工厂");
      // Toast(res);
    }); */

    this.userId = this.$route.query.userId;
    this.name = this.$route.query.name;
    this.username = this.$route.query.username;
    this.factoryCode = this.$route.query.factoryCode;
    this.companyCode = this.$route.query.companyCode;

    this.getCostCenterData();
    this.getTheInventoryLocationData();
    this.getReceivingPatyData();
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
