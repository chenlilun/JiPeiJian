<template>
  <div class="main">
    <van-nav-bar
      title="领料单选择"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <!--    <input v-model="qr" style="width: 95%; margin-top: 50px" />
    <van-button
      style="width: 80%; margin-top: 5px"
      type="info"
      @click="callByAndroid(qr)"
      >添加扫码数据</van-button
    > -->
    <van-tabs
      class="type-content"
      color="#1989fa"
      line-width="25px"
      @click="onType"
    >
      <van-tab title="有领料号">
        <div class="index-page">
          <van-cell
            class="line"
            title="领料单日期"
            style="font-size: 23px"
            :value="calendarDate"
            @click="calendarShow = true"
            is-link
          />
          <van-cell
            title="过账日期"
            is-link
            class="line"
            style="font-size: 23px"
            :value="guozhangDate"
            @click="guozhangpop = true"
          />
          <van-cell
            v-show="calendarDate != ''"
            class="line"
            title="领料人搜索"
            style="font-size: 23px"
            @click="showSearch = true"
            is-link
          />
          <van-cell
            class="line"
            title="库存地"
            style="font-size: 20px"
            :value="locationActionText"
            @click="locationAction = true"
            is-link
          />
          <van-cell
            class="line"
            title="成本中心"
            style="font-size: 20px"
            @click="cbzx = true"
            :value="cbzxText"
            is-link
          />
          <van-cell
            class="line"
            title="收货方"
            :value="shouhuoText"
            style="font-size: 20px"
            @click="shouhuo = true"
            is-link
          />
          <div
            class="search-jg"
            v-for="(item, index) in materuakOdd"
            :key="index"
          >
            <div>{{ item.odd }}---{{ item.lnr }}</div>
            <van-button
              style="border-radius: 10px; height: 30px"
              type="info"
              @click="submitlingniaodan(item)"
              >拣配</van-button
            >
          </div>
        </div>
      </van-tab>
      <van-tab title="无领料单">
        <div class="index-page">
          <van-cell
            title="过账日期"
            is-link
            class="line"
            style="font-size: 23px"
            :value="guozhangDate"
            @click="guozhangpop = true"
          />
          <van-cell
            class="line"
            title="库存地"
            style="font-size: 20px"
            :value="locationActionText"
            @click="locationAction = true"
            is-link
          />
          <van-cell
            class="line"
            title="成本中心"
            style="font-size: 20px"
            @click="cbzx = true"
            :value="cbzxText"
            is-link
          />
          <van-cell
            class="line"
            title="收货方"
            :value="shouhuoText"
            style="font-size: 20px"
            @click="shouhuo = true"
            is-link
          />
          <div
            class="index-materuak-item"
            v-for="(item, index) in materuakRequisitionzListType1"
            :key="index"
          >
            <div class="content">
              <div class="text">{{ item.BARCODE }}</div>
            </div>
            <div class="content">
              <div class="title">库存地点:</div>
              <div class="text">{{ item.LGOBE }}</div>
            </div>
            <div class="content">
              <div class="title">成本中心:</div>
              <div class="text">{{ item.KTEXT }}</div>
            </div>
            <div class="content">
              <div class="title">收货方:</div>
              <div class="text">{{ item.WEMPF }}</div>
            </div>
            <div class="content">
              <div class="title">拣配数量</div>
              <input
                class="inp"
                oninput="value=value.replace(/[^\d]/g,'')"
                type="number"
                v-model="item.MENGE"
                style="background-color: #eee"
              />
            </div>
          </div>
          <van-button
            v-show="materuakRequisitionzListType1.length > 0"
            class="submit-but"
            style="
              width: 100%;
              font-size: 23px;
              border-radius: 10px;
              margin-top: 5px;
            "
            type="info"
            @click="submitType"
            >拣配</van-button
          >
        </div>
      </van-tab>
    </van-tabs>

    <van-popup v-model="calendarShow" class="two-pop" position="bottom">
      <van-datetime-picker
        v-model="linliaodantime"
        type="date"
        title="选择领料单日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirm"
        @cancel="calendarShow = false"
      />
    </van-popup>
    <van-popup v-model="guozhangpop" class="two-pop" position="bottom">
      <van-datetime-picker
        v-model="guozhangtime"
        type="date"
        title="选择过账日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirmgz"
        @cancel="guozhangpop = false"
      />
    </van-popup>
    <van-popup
      v-model="showSearch"
      position="bottom"
      class="search-pop"
      :style="{ height: '100%', 'background-color': '#eee' }"
    >
      <div style="background-color: #ffffff height: 300px;padding: 10px;">
        <van-search
          class="line"
          show-action
          v-model="searchlnr"
          placeholder="请输入领料人"
          style="border: 1px solid #ccc"
          @input="onSearch"
          @cancel="showSearch = false"
        />
        <div class="search-jg" v-for="(item, index) in searchList" :key="index">
          <div>{{ item.odd }}---{{ item.lnr }}</div>
          <van-button
            style="border-radius: 10px; height: 30px"
            type="info"
            @click="submitlingniaodan(item)"
            >拣配</van-button
          >
        </div>
      </div>
    </van-popup>
    <!-- 库存搜索 -->
    <van-popup
      v-model="locationAction"
      position="bottom"
      class="search-pop"
      :style="{ height: '100%', 'background-color': '#eee' }"
    >
      <van-search
        class="line"
        show-action
        v-model="locationActionText"
        placeholder="请选择库存地"
        style="border: 1px solid #ccc"
        @input="locationOnSearch"
        @cancel="locationAction = false"
      />
      <div
        class="search-jg"
        v-for="(item, index) in kcListColumns"
        :key="index"
      >
        <div>{{ item.LGOBE + "-" + item.LGORT }}</div>

        <van-button
          style="border-radius: 10px; height: 30px"
          type="info"
          @click="onConfirmkcd(item, index)"
          >确定</van-button
        >
      </div>
    </van-popup>
    <van-popup
      v-model="cbzx"
      class="search-pop"
      :style="{ height: '100%', 'background-color': '#eee' }"
      position="bottom"
    >
      <van-search
        class="line"
        show-action
        v-model="cbzxText"
        placeholder="请选择成本中心"
        style="border: 1px solid #ccc"
        @input="costCenterOnSearch"
        @cancel="cbzx = false"
      />
      <div
        class="search-jg"
        v-for="(item, index) in costCenterListColumns"
        :key="index"
      >
        <div>{{ item.KTEXT + "-" + item.KOSTL }}</div>

        <van-button
          style="border-radius: 10px; height: 35px"
          type="info"
          @click="onConfirmcbzx(item, index)"
          >确定</van-button
        >
      </div>
    </van-popup>
    <van-popup v-model="shouhuo" class="two-pop" position="bottom">
      <van-picker
        show-toolbar
        v-model="shouhuoText"
        title="请选择收货方"
        :columns="receivingPatyListColumns"
        @confirm="onConfirmshf"
        @cancel="shouhuo = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import { format, fromNow } from "silly-datetime";
import { Dialog } from "vant";
export default {
  name: "app",
  components: { [Dialog.Component.name]: Dialog.Component },
  data() {
    return {
      qr: "000000001000016550/190328/三角带SPB-2765 GB/T11544 橡胶", //二维码数据
      userId: "",
      name: "",
      userInfoName: "",
      factoryCode: "",
      companyCode: "",
      pdaCode: "",
      calendarDate: "",
      linliaodantime: new Date(2020, 5, 18),
      // linliaodantime: new Date(),
      calendarShow: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2050, 10, 1),
      guozhangDate: require("silly-datetime").format(new Date(), "YYYY-MM-DD"),
      guozhangpop: false,
      guozhangtime: new Date(),
      materuakRequisitionzListType0: [],
      materuakOdd: [],
      materuakRequisitionzListType1: [],
      searchList: [],
      showSearch: false,
      showSearch: false,
      locationAction: false, //库存地
      locationActionText: "", //库存地
      cbzx: false, //成本中心
      cbzxText: "",
      shouhuo: false,
      shouhuoText: "",
      kcList: [], //库存地
      kcListColumns: [],
      costBean: null, //成本中心
      costCenterList: [], //成本中心
      costCenterListColumns: [], //成本中心
      receivingPatyList: [], //收货方
      receivingPatyListColumns: [], //收货方
      tabType: 0,
      searchlnr: "", // 领料人搜索
      locationBean: null, //库存地
      receivingBean: null, //收货方
      usernameCode: "",
      QRNumber: 0,
    };
  },
  methods: {
    costCenterOnSearch() {
      console.log(this.cbzxText);
      this.costCenterListColumns = [];
      this.costCenterList.forEach((i) => {
        if ((i.KTEXT + "-" + i.KOSTL).search(this.cbzxText) != -1) {
          console.log(i.KTEXT + "-" + i.KOSTL);
          this.costCenterListColumns.push(i);
        }
      });
    },

    locationOnSearch() {
      console.log(this.locationActionText);
      this.kcListColumns = [];
      this.kcList.forEach((i) => {
        if ((i.LGOBE + "-" + i.LGORT).search(this.locationActionText) != -1) {
          this.kcListColumns.push(i);
        }
      });
    },

    submitlingniaodan(item) {
      if (this.guozhangDate == "" || this.guozhangDate == null) {
        Toast("请选择过账日期");
        return;
      }

      localStorage.linniaodanitem = JSON.stringify(item);

      this.$cookie.set("guozhangDate", this.guozhangDate);
      this.$router.push("/Home");
    },
    //无领料单 提交
    submitType() {
      if (this.guozhangDate == "" || this.guozhangDate == null) {
        Toast("请选择过账日期");
        return;
      }
      let dataList = [];
      this.materuakRequisitionzListType1.forEach((t) => {
        if (t.KOSTL != null && t.KTEXT != null && t.LGORT != null) {
          dataList.push({
            BARCODE: t.BARCODE, //物料描述
            ITEM: t.ITEM,
            KOSTL: t.KOSTL, //成本中心
            KTEXT: t.KTEXT, //成本中心姓名
            LGORT: t.LGORT, //库存地
            LGOBE: t.LGOBE,
            MENGE: parseInt(t.MENGE),
            WEMPF: t.WEMPF, //收货方
            WERKS: this.factoryCode,
            BUKRS: this.companyCode,
          });
        } else {
          console.log(JSON.stringify(t));
          Toast("请查看库存地,成本中心是否没有选择");
        }
      });
      //console.log(JSON.stringify(dataList));

      if (dataList.length > 0) {
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          message: "提交中",
        });
        this.$api
          .submit({
            BUDAT: this.guozhangDate,
            APPLY_CODE: "",
            SOURCE: "PDA",
            PDA_CODE: this.pdaCode,
            APPLY_USER: this.usernameCode,
            IS_COMMIT: "X", //直接过账
            DATA: dataList,
          })
          .then((res) => {
            Toast.clear();
            //Toast.success(res.MESSAGE + "");
            if (res != null && res.PICKID != "") {
              Dialog.alert({
                title: "返回消息",
                message: res.MESSAGE,
              }).then(() => {
                this.materuakRequisitionzListType1 = [];
              });
            }
          })
          .catch((err) => {
            Toast(err);
          });
      }
    },

    onSearch() {
      console.log(this.searchlnr);
      this.searchList = [];
      this.materuakOdd.forEach((i) => {
        if (i.lnr.search(this.searchlnr) != -1) {
          this.searchList.push(i);
        }
      });
    },
    onType(index, title) {
      this.tabType = index;
      console.log(this.tabType);
    },
    //过账日期选择
    onConfirmgz(date) {
      this.guozhangpop = false;
      this.guozhangDate = require("silly-datetime").format(date, "YYYY-MM-DD");
    },
    //收货
    onConfirmshf(item, index) {
      this.shouhuo = false;
      this.shouhuoText = item;
      this.receivingBean = this.receivingPatyList[index];

      this.$cookie.set("receivingBean", this.receivingBean);

      if (this.materuakRequisitionzListType1.length > 0) {
        this.materuakRequisitionzListType1.map((item) => {
          item.WEMPF = this.receivingBean.WEMPF;
          return item;
        });
      }
    },
    //成本中心
    onConfirmcbzx(item, index) {
      this.cbzx = false;
      this.cbzxText = item.KTEXT + "-" + item.KOSTL;
      this.costBean = item;

      this.$cookie.set("costBean", this.costBean);
      if (this.materuakRequisitionzListType1.length > 0) {
        this.materuakRequisitionzListType1.map((item) => {
          item.KOSTL = this.costBean.KOSTL;
          item.KTEXT = this.costBean.KTEXT;
          return item;
        });
      }
    },
    onConfirmkcd(item, index) {
      this.locationAction = false;
      this.locationActionText = item.LGOBE + "-" + item.LGORT;
      this.locationBean = item;
      this.$cookie.set("locationBean", this.locationBean);
      if (this.materuakRequisitionzListType1.length > 0) {
        this.materuakRequisitionzListType1.map((item) => {
          item.LGORT = this.locationBean.LGORT;
          item.LGOBE = this.locationBean.LGOBE;
          return item;
        });
      }
    },
    onConfirm(date) {
      this.calendarShow = false;
      this.calendarDate = require("silly-datetime").format(date, "YYYY-MM-DD");
      let datatime = require("silly-datetime").format(date, "YYYYMMDD");
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中",
      });
      this.$api
        .getMateruakRequisition({
          APPLYDATE: datatime,
          BUKRS: this.companyCode,
        })
        .then((res) => {
          Toast.clear();
          if (res.APPLYLISTS != null && res.APPLYLISTS.length > 0) {
            this.materuakRequisitionzListType0 = res.APPLYLISTS;

            let odd = [];
            //添加领料单
            this.materuakRequisitionzListType0.forEach((i) => {
              odd.push({ odd: i.APPLY_CODE, lnr: i.APPLY_USER });
            });
            //去重
            odd = this.deWeightFour(odd);
            //按领料单添加数据
            odd = odd.map((item) => {
              item.oddList = [];

              this.materuakRequisitionzListType0.forEach((i) => {
                if (item.odd === i.APPLY_CODE) {
                  i.materialList = []; //物料数组
                  item.oddList.push(i);
                  console.log(JSON.stringify(i.APPLY_CODE));
                }
              });
              return item;
            });
            this.materuakOdd = odd;
            console.log(JSON.stringify(this.materuakOdd));
          } else {
            this.materuakRequisitionzListType0 = [];
            this.materuakOdd = [];
            Toast(this.calendarDate + "没有物料单数据");
          }
        })
        .catch((err) => {
          Toast(err);
        });
    },

    onClickLeft() {
      // Toast("返回");
      window.android.finish();
    },
    deWeightFour(arr) {
      var obj = {};
      arr = arr.reduce(function (a, b) {
        obj[b.odd] ? "" : (obj[b.odd] = true && a.push(b));
        return a;
      }, []);
      return arr;
    },
    callByAndroid(code) {
      //物料 批次
      if (code != null && code != "") {
        this.qr = code.trim();
        console.log(JSON.stringify(this.qr));
        let tm = this.qr;
        // "000000001000016550/190328/三角带SPB-2765 GB/T11544 橡胶"; /*
        // Math.floor(Math.random() * 10) */
        var cc = tm.split("/");
        if (cc.length > 1) {
          this.QRNumber = this.QRNumber + 1;
          console.log(this.QRNumber);
          let bean = {
            SP_CODE: cc[0], //物料号
            BARCODE: tm, //物料描述
            PC: cc[1],
            ITEM: this.QRNumber * 10,
            KOSTL: this.costBean && this.costBean.KOSTL, //成本中心
            KTEXT: this.costBean && this.costBean.KTEXT, //成本中心姓名
            LGORT: this.locationBean && this.locationBean.LGORT, //库存地code
            LGOBE: this.locationBean && this.locationBean.LGOBE, //库存地名字
            MENGE: 1,
            WEMPF: this.receivingBean && this.receivingBean.WEMPF, //收货方
          };
          if (this.tabType == 1) {
            let repetitionFlag1 = true;
            //重复数量加1
            this.materuakRequisitionzListType1.forEach((t) => {
              if (tm == t.BARCODE) {
                t.MENGE = parseInt(t.MENGE) + 1;
                repetitionFlag1 = false;
                return;
              }
            });
            //没重复
            if (repetitionFlag1) {
              this.materuakRequisitionzListType1.push(bean);
            }
          }
        } else {
          Toast("二维码数据错误");
        }
      } else {
        Toast("二维码数据错误");
      }

      //console.log(JSON.stringify(cc));
    },
    //获取成本中心
    getCostCenterData() {
      this.$api.costCenter(this.companyCode).then((res) => {
        if (res != null && Array.isArray(res)) {
          this.costCenterListColumns = [];
          let costc = [];
          this.costCenterList = res.map((item) => {
            this.costCenterListColumns.push(item);
            costc.push(item.KTEXT + "-" + item.KOSTL);
            return item;
          });
          this.onePop = true;
          localStorage.costCenterListColumns = JSON.stringify(costc);
          localStorage.costCenterList = JSON.stringify(this.costCenterList);
        }
        console.log("成本中心", JSON.stringify(res));
      });
    },
    //库存地
    getTheInventoryLocationData() {
      this.$api.theInventoryLocation(this.factoryCode).then((res) => {
        if (res != null && Array.isArray(res)) {
          this.kcListColumns = [];
          let kc = [];
          this.kcList = res.map((item) => {
            this.kcListColumns.push(item);
            kc.push(item.LGOBE + "-" + item.LGORT);
            return item;
          });
          localStorage.kcListColumns = JSON.stringify(kc);
          localStorage.kcList = JSON.stringify(this.kcList);
        }
        console.log("库存地", JSON.stringify(this.kcList));
      });
    },
    //收货方
    getReceivingPatyData() {
      this.$api.receivingPaty(this.companyCode).then((res) => {
        if (res != null && Array.isArray(res)) {
          this.receivingPatyListColumns = [];
          this.receivingPatyList = res.map((item) => {
            this.receivingPatyListColumns.push(item.WEMPF);
            return item;
          });
          localStorage.receivingPatyList = JSON.stringify(
            this.receivingPatyList
          );
          localStorage.receivingPatyListColumns = JSON.stringify(
            this.receivingPatyListColumns
          );
          this.$cookie.set("receivingPatyList", this.receivingPatyList);
        }
        console.log("收货方", JSON.stringify(res));
      });
    },
  },
  created() {
    this.userId = this.$route.query.userId;
    this.name = this.$route.query.name;
    this.userInfoName = this.$route.query.userInfoName;
    this.factoryCode = this.$route.query.factoryCode;
    this.companyCode = this.$route.query.companyCode;
    this.pdaCode = this.$route.query.pdaCode;
    this.usernameCode = this.$route.query.usernameCode;

    this.$cookie.set("factoryCode", this.factoryCode);
    this.$cookie.set("companyCode", this.companyCode);
    this.$cookie.set("pdaCode", this.pdaCode);
    this.$cookie.set("usernameCode", this.usernameCode);
    this.$cookie.set("userInfoName", this.userInfoName);
    this.locationBean = this.$cookie.getJSON("locationBean");
    this.receivingBean = this.$cookie.getJSON("receivingBean");
    this.costBean = this.$cookie.getJSON("costBean");
    if (
      this.locationBean &&
      this.locationBean.LGOBE &&
      this.locationBean.LGORT
    ) {
      this.locationActionText =
        this.locationBean.LGOBE + "-" + this.locationBean.LGORT;
    }
    if (this.receivingBean && this.receivingBean.WEMPF) {
      this.shouhuoText = this.receivingBean.WEMPF;
    }

    if (this.costBean && this.costBean.KOSTL && this.costBean.KTEXT) {
      this.cbzxText = this.costBean.KTEXT + "-" + this.costBean.KOSTL;
    }
    this.getCostCenterData();
    this.getTheInventoryLocationData();
    this.getReceivingPatyData();
    this.onConfirm(new Date());
  },
  mounted() {
    window.callByAndroid = this.callByAndroid;
    window.onresize = () => {
      if (self.oldFullHeight) {
        self.screenHeightNoChange =
          document.documentElement.clientHeight === self.oldFullHeight;
        console.log(" self.screenHeightNoChange " + self.screenHeightNoChange);
      }
    };
    window.addEventListener("resize", function () {
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
      ) {
        window.setTimeout(function () {
          document.activeElement.scrollIntoView();
        }, 0);
      }
    });
  },
};
</script>

<style lang="scss">
@import "./css/index.scss";
</style>
