<template>
  <div class="main">
    <van-nav-bar
      title="请扫码提交"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <!--  <input v-model="qr" style="width: 95%; margin-top: 50px" />
    <van-button style="width: 80%" type="info" @click="callByAndroid(qr)"
      >添加扫码数据</van-button
    > -->
    <div class="home-page">
      <van-cell
        title="领料单号"
        style="font-size: 20px; align-items: center height: 50px;"
        :value="info.odd"
      />

      <van-cell
        title="领料人"
        style="font-size: 20px; align-items: center"
        :value="info.lnr"
      />
      <div
        class="odd-list"
        v-for="(odditem, index) in info.oddList"
        :key="index"
      >
        <van-cell
          title="物料号"
          style="font-size: 20px; align-items: center"
          :value="odditem.SP_CODE"
        />
        <van-cell
          title="物料描述"
          style="font-size: 20px; align-items: center"
          :value="odditem.SP_DESC"
        />
        <van-cell
          title="库存地点"
          style="font-size: 20px; align-items: center"
          :value="odditem.HOUSE_NAME"
        />

        <van-cell
          title="申请数量"
          style="font-size: 20px; align-items: center"
          :value="odditem.APPLY_NUM"
        />

        <div
          class="index-materuak-item"
          v-for="(item, index1) in odditem.materialList"
          :key="index1"
        >
          <div class="content">
            <div class="text">{{ item.BARCODE }}</div>
          </div>
          <div class="content">
            <div class="title">库存地点:</div>
            <div class="text">{{ item.LGOBE }}</div>
            <div
              class="change-but"
              @click="
                locationAction = true;
                temporaryLocation = item;
              "
            >
              改
            </div>
          </div>
          <div class="content">
            <div class="title">成本中心:</div>
            <div class="text">{{ item.KTEXT }}</div>
            <div
              class="change-but"
              @click="
                cbzx = true;
                temporaryCost = item;
              "
            >
              改
            </div>
          </div>
          <div class="content">
            <div class="title">收货方:</div>
            <div class="text">{{ item.WEMPF }}</div>
            <div
              class="change-but"
              @click="
                shouhuo = true;
                temporaryReceiving = item;
              "
            >
              改
            </div>
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
      </div>

      <van-button
        v-show="info.oddList.length > 0"
        class="submit-but"
        style="
          width: 95%;
          font-size: 23px;
          border-radius: 10px;
          margin-left: 2.5%;
          margin-top: 5px;
        "
        type="info"
        @click="submitType"
        >拣配</van-button
      >
    </div>

    <van-popup v-model="locationAction" class="two-pop" position="bottom">
      <van-picker
        show-toolbar
        title="请选择库存地"
        :columns="kcListColumns"
        @confirm="onConfirmkcd"
        @cancel="locationAction = false"
      />
    </van-popup>
    <van-popup v-model="cbzx" class="two-pop" position="bottom">
      <van-picker
        show-toolbar
        title="请选择成本中心"
        :columns="costCenterListColumns"
        @confirm="onConfirmcbzx"
        @cancel="cbzx = false"
      />
    </van-popup>
    <van-popup v-model="shouhuo" class="two-pop" position="bottom">
      <van-picker
        show-toolbar
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
Toast.setDefaultOptions({ duration: 2500 });
export default {
  name: "app",
  components: {},
  data() {
    return {
      //qr 000000001000016550/190328/三角带SPB-2765 GB/T11544 橡胶
      qr: "000000001000016550/190328/三角带SPB-2765 GB/T11544 橡胶",
      factoryCode: "",
      companyCode: "",
      pdaCode: "",
      info: {},
      cbzx: false,
      shouhuo: false,
      locationAction: false,
      materuakRequisitionzListType: [],
      QRNumber: 0,
      costBean: null,
      locationBean: null,
      receivingBean: null,
      guozhangDate: "",
      kcList: [],
      kcListColumns: [],
      costCenterList: [],
      costCenterListColumns: [],
      receivingPatyList: [],
      receivingPatyListColumns: [],
      temporaryCost: {},
      temporaryLocation: {},
      temporaryReceiving: {},
      fanhui: null,
    };
  },
  methods: {
    onConfirmcbzx(item, index) {
      this.cbzx = false;
      this.temporaryCost.KTEXT = this.costCenterList[index].KTEXT;
      this.temporaryCost.KOSTL = this.costCenterList[index].KOSTL;
    },
    onConfirmshf(item, index) {
      this.shouhuo = false;
      this.temporaryReceiving.WEMPF = this.receivingPatyList[index].WEMPF;
    },
    onConfirmkcd(item, index) {
      this.locationAction = false;
      this.temporaryLocation.LGORT = this.kcList[index].LGORT;
      this.temporaryLocation.LGOBE = this.kcList[index].LGOBE;
    },

    submitType() {
      if (this.guozhangDate == "" || this.guozhangDate == null) {
        Toast("请选择过账日期");
        return;
      }
      let dataList = [];
      let flag = true;
      let flaginfo = true; //判断是否库存地,成本中心,收货方是否没有选择
      this.info.oddList.forEach((i) => {
        i.materialList.forEach((t) => {
          if (
            t.KOSTL != null &&
            t.KTEXT != null &&
            t.LGORT != null &&
            t.WEMPF != null
          ) {
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
          } else {
            flaginfo = false;
            console.log(JSON.stringify(t));
          }
          console.log(
            i.APPLY_NUM +
              "-----" +
              parseInt(t.MENGE) +
              "----" +
              (i.APPLY_NUM <= parseInt(t.MENGE))
          );
          if (i.APPLY_NUM >= parseInt(t.MENGE)) {
            flag = true;
            return;
          } else {
            flag = false;
            Toast("物料号" + i.SP_CODE + "请检查申请数量");
          }
        });
      });
      if (!flaginfo) {
        //有数据没选择库存地,成本中心,收货方
        Toast("有数据库存地,成本中心,收货方没有选择");
        return;
      }

      if (dataList.length > 0) {
        if (flag) {
          Toast.loading({
            duration: 3000, // 持续展示 toast
            forbidClick: true,
            message: "提交中",
          });
          //console.log(JSON.stringify(dataList));
          this.$api
            .submit({
              BUDAT: this.guozhangDate,
              APPLY_CODE: this.info.odd,
              SOURCE: "PDA",
              PDA_CODE: this.pdaCode,
              DATA: dataList,
            })
            .then((res) => {
              Toast.clear();
              Toast.success(res.MESSAGE + "");
              if (res != null && res.PICKID != "") {
                this.info.oddList = [];
                this.fanhui = res;
                this.$router.go(-1);
              }
            })
            .catch((err) => {
              Toast(err);
            });
        }
      } else {
        Toast("请扫描物料");
      }
    },
    onClickLeft() {
      // Toast("返回");
      this.$router.go(-1);
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

          if (this.info.oddList.length > 0) {
            let isFlag = false;
            //Toast(JSON.stringify(this.materuakRequisitionzListType0))
            console.log(JSON.stringify(this.info.oddList));
            this.info.oddList.forEach((i) => {
              if (cc[0] === i.SP_CODE.toString()) {
                isFlag = true;
              }
            });
            if (!isFlag) {
              Toast("没有对应物料号");
              return;
            }
            this.info.oddList.map((item) => {
              if (cc[0] == item.SP_CODE) {
                if (item.materialList.length > 0) {
                  let repetitionFlag = true;
                  //去重
                  item.materialList.forEach((t) => {
                    if (tm == t.BARCODE) {
                      t.MENGE = parseInt(t.MENGE) + 1;
                      repetitionFlag = false;
                      return;
                    }
                  });
                  //没重复
                  if (repetitionFlag) {
                    item.materialList.push(bean);
                  }
                } else {
                  item.materialList.push(bean);
                }
              }

              return item;
            });
            // console.log(JSON.stringify(this.materuakOdd));
          } else {
            Toast("请选择日期获取领料单");
          }

          /*           if (this.info.SP_CODE == cc[0]) {
            let repetitionFlag1 = true;
            //重复数量加1
            this.materuakRequisitionzListType.forEach((t) => {
              if (tm == t.BARCODE) {
                t.MENGE = parseInt(t.MENGE) + 1;
                repetitionFlag1 = false;
                return;
              }
            });
            //没重复
            if (repetitionFlag1) {
              this.materuakRequisitionzListType.push(bean);
            }
          } else {
            Toast("物料号不匹配");
          } */
        } else {
          Toast("二维码数据错误");
        }
      } else {
        Toast("二维码数据错误");
      }

      //console.log(JSON.stringify(cc));
    },
    //获取成本中心
  },
  created() {
    this.factoryCode = this.$cookie.get("factoryCode");
    this.companyCode = this.$cookie.get("companyCode");
    this.pdaCode = this.$cookie.get("pdaCode");
    this.guozhangDate = this.$cookie.get("guozhangDate");
    this.usernameCode = this.$cookie.get("usernameCode");
    this.locationBean = this.$cookie.getJSON("locationBean");
    this.receivingBean = this.$cookie.getJSON("receivingBean");
    this.costBean = this.$cookie.getJSON("costBean");
    this.info = JSON.parse(localStorage.linniaodanitem);
    console.log(JSON.stringify(this.info));
    this.kcList = JSON.parse(localStorage.kcList);
    this.costCenterList = JSON.parse(localStorage.costCenterList);
    this.receivingPatyList = JSON.parse(localStorage.receivingPatyList);
    this.fanhui = null;
    this.costCenterListColumns = JSON.parse(localStorage.costCenterListColumns);
    this.kcListColumns = JSON.parse(localStorage.kcListColumns);
    this.receivingPatyListColumns = JSON.parse(
      localStorage.receivingPatyListColumns
    );
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
  },
};
</script>

<style lang="scss">
@import "./css/home.scss";
</style>
