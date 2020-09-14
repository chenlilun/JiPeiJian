<template>
    <div id="app">
        <van-nav-bar
                title="自动线落筒"
                left-text="返回"
                right-text=""
                left-arrow
                @click-left="onClickLeft"
                @click-right="onClickRight"
        />

        <div style="margin: 10px;">
            <!-- <van-button round block plain hairline type="primary">{{silkCarCode}}</van-button> -->
            <van-field v-model="silkCarCode" center clearable label="丝车条码" placeholder="请扫描丝车条码">
                <template #button>
                    <van-button size="small" type="primary" @click="find">查询</van-button>
                </template>
            </van-field>
        </div>
        <div style="overflow: hidden;text-align: left;margin-left: 10px">设置等级</div>
        <div style="overflow: hidden;margin-top: 8px">
            <a v-for="(item, index ) in gradeData" :key="index" @click.prevent="chooseOne(index)" style="float: left">
                <van-button :type="item.firstRate?'warning':'primary'" style="margin : 5px;width: 60px ; float: left">
                    {{item.grade}}
                </van-button>
            </a>
        </div>
        <!--一共几个机台或者几个丝锭-->
        <div style="text-align: left">
            <div class="main" v-for="(item, index ) in silkCodeList" :key="index">
                <div class="left">{{item}}</div>
                <div class="right" @click="deleteSilk(index)">
                    删除
                </div>
            </div>
        </div>
        <!--整车 按位-->
        <div style="float: left" v-if="false">
            <div style="float: left">
                <a v-for="(item, index ) in weiList" :key="index" @click.prevent="chooseWei(index)"
                   style="float: left ; overflow: hidden">
                    <van-button :color="weiPosition===index?'#C11C1B':'#5b53aa'" style="margin : 5px;width: 80px ; float: left;overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;">{{item.lineMachine+'-'+item.doffNo}}
                    </van-button>
                </a>
            </div>
        </div>
        <div style="text-align: left">
            <div class="main" v-for="(item, index ) in silkCodeList" :key="index">
                <div class="left">{{item}}</div>
                <div class="right" @click="deleteSilk(index)">
                    删除
                </div>
            </div>
        </div>

        <van-collapse v-model="activeName" accordion @change="change">
            <div v-for="(item, index ) in this.data.silkCarRowColList" :key="index">
                <van-collapse-item
                        :title="(item.batchNo===null||typeof(item.batchNo)===undefined||item.batchNo==='')?'未落筒':item.canModify?('已扫码'+item.showInfo):'已落筒'"
                        :value="(item.batchNo===null||typeof(item.batchNo)===undefined||item.batchNo==='')?'未落筒':item.canModify?'待提交':'已落筒'"
                        :border="true" value-class="van-cell__value">
                    <div class="van-collapse-item-div">{{item.silkCode===null?'请扫描机台':item.canModify===true
                        ?item.showInfo:(item.batchNo+" "+item.silkCode+'-'+item.doffNo)
                        }}
                    </div>
                </van-collapse-item>
            </div>
            <van-button type="danger" block hairline="hairline" v-if="hairline"
                        style="margin:  15px auto;overflow: hidden ;display: inline" @click="dingDeng">落筒提交
            </van-button>
            <!--            <van-collapse-item title="标题2" name="2">内容</van-collapse-item>-->
            <!--            <van-collapse-item title="标题3" name="3">内容</van-collapse-item>-->
        </van-collapse>

        <!--        <van-cell is-link @click="showPopup">展示弹出层</van-cell>-->
        <van-popup
                v-model="show"
                closeable
                position="bottom"
                :style="{ height: '30%' }"
        >
            <div v-for="(item, index ) in this.doffNoPop" :key="index" @click="doffNoPopChoose(index)">

                    <div class="van-collapse-item-div">
                        {{item.batchNo+"  "+item.lineName+'-'+item.machinName+'-'+item.doffNo}}
                    </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    Array.prototype.pushNoRepeat = function () {
        for (let i = 0; i < arguments.length; i++) {
            let ele = arguments[i];
            if (this.indexOf(ele) == -1) {
                this.push(ele);
            }
        }
    };
    // import HelloWorld from "@/components/HelloWorld.vue";
    import {Toast} from "vant";

    import {Swipe, SwipeItem, Row, Col} from "vant";
    Toast.setDefaultOptions({ duration: 4000 });
    export default {
        name: "DoffAuto",
        components: {
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [Row.name]: Row,
            [Col.name]: Col

        },
        data() {
            return {
                doffNoPop : [] ,
                show: false,
                activeName: 0,
                activeNames: [1],
                weiPosition: -1,
                weiList: [
                    {
                        "doffNo": "车",
                        "lineMachine": "整",
                    }],
                userId: '',
                hairline: false,
                name: '',
                silkCodeList: [],
                data: '',
                gradeData: [],
                radio: '1',
                showDoff: false,
                lineWeiDoff: "",
                date: "",
                capacity: "",
                show: false,
                silkCarCode: "",
                list: [],
                loading: false,
                finished: true,
                refreshing: false,
                currentScanMachineQrCode : '' ,
            };
        },
        methods: {
            doffNoPopChoose(i){  // 弹框选择
                if(this.currentScanMachineQrCode){
                    //去重扫过的机台
                    for (let i = 0; i < this.data.silkCarRowColList.length ; i++) {
                        let a = this.data.silkCarRowColList[i]
                        if(this.data.silkCarRowColList[i].silkCode && a.canModify&&this.data.silkCarRowColList[i].silkCode===code.split(',')[0]){
                            this.data.silkCarRowColList[i].silkCode =null
                            this.data.silkCarRowColList[i].doffNo =null
                            this.data.silkCarRowColList[i].batchNo =null
                            this.data.silkCarRowColList[i].canModify =null
                            this.data.silkCarRowColList[i].showInfo =null
                        }
                    }

                    this.data.silkCarRowColList[this.activeName].silkCode =this.currentScanMachineQrCode.split(',')[0]
                    this.data.silkCarRowColList[this.activeName].doffNo =this.doffNoPop[i].doffNo
                    this.data.silkCarRowColList[this.activeName].batchNo =this.doffNoPop[i].batchNo
                    this.data.silkCarRowColList[this.activeName].canModify =true
                    this.data.silkCarRowColList[this.activeName].showInfo =this.doffNoPop[i].batchNo
                        + " "+ this.doffNoPop[i].lineName+'-'+this.doffNoPop[i].machinName+'-'+this.doffNoPop[i].doffNo
                    this.hairline = true
                    this.activeName = this.getActiveName()
                }
                this.show = false;

                //选择下一个空位置落筒

            },
            showPopup() {
                this.show = true;
            },
            change(val) { // 手风琴改变时候回调
                console.log("aa" + val)
            },
            dingDeng() {
                // let arr  = []
                // // if( !this.silkCodeList|| this.silkCodeList.length==0||!this.silkCarCode){
                // //     Toast("请输入完整信息")
                // //     return
                // // }
                // this.silkCodeList.forEach(a=>{
                //     arr.push({silkCode:a})
                // })
                // Toast(arr + "xx")
                //不通批号不能提交
                let batNo = ''
                let isCan = true ;
                if(this.data.silkCarRowColList){
                    // a.batchNo==='null'||
                    this.data.silkCarRowColList.filter(a=>a.batchNo!=null). forEach((item,index)=>{
                            if(index>0){
                                if(item.batchNo!=batNo){
                                    isCan = false ;
                                }
                            }
                            if(index===0){
                                batNo = item.batchNo
                            }
                            console.log(index,"index")
                            console.log(item,"item")



                    })
                }
                if(!isCan){
                    Toast("一辆车不能落不同批号")
                    return;
                }

                this.data.silkCode= this.silkCarCode
                this.data.userId= this.userId
                this.data.grade= this.gradeData.find(a => a.firstRate).grade
                // this.data.silkCarRowColList.forEach((a , index)=>{
                //     if((typeof a.canModify === "undefined")||!a.canModify){
                //         this.data.silkCarRowColList.splice(index,1)
                //     }
                // })
                for (let i = 0; i < this.data.silkCarRowColList.length ; i++) {
                    let a = this.data.silkCarRowColList[i]
                    if((typeof a.canModify === "undefined")||!a.canModify){
                        this.data.silkCarRowColList.splice(i,1)
                        i--;
                    }
                }

                this.$api.manualDoff(this.data).then((res) => {

                    if (res.data.status === '200') {
                        this.silkCodeList = []
                        this.hairline = false
                        this.data = ''
                        this.silkCarCode = ''
                        this.weiPosition = 0

                        Toast.success(res.data.msg)
                    } else {
                        Toast(res.data.msg)
                    }
                });
            },
            deleteSilk(index) {
                this.silkCodeList.splice(index, 1)
                console.log(this.silkCodeList, "444232")
            },
            chooseOne(clickIndex) {
                this.gradeData.forEach((e, index) => {
                    if (index === clickIndex) {
                        this.gradeData[index].firstRate = true
                    } else {
                        this.gradeData[index].firstRate = false
                    }

                })

            },
            chooseWei(clickIndex) {
                this.weiPosition = clickIndex
                this.silkCodeList = []
                if (clickIndex === 0) {
                    this.data.silkCarRowColList.forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode)
                    })
                } else {
                    this.data.silkCarRowColList.filter(a => a.orderBy == this.weiList[clickIndex].orderBy).forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode)
                    })
                }

                this.hairline = true
            },
            find() {
                if (this.silkCarCode) {
                    this.getSilkcarDetails(this.silkCarCode);
                }
            },
            onClickLeft() {
                Toast("返回");
                window.android.finish();
            },
            onClickRight() {
                // this.activeName = 2
                // this.show = true;
                // this.callByAndroid("5f3a2d5021145958d161fa34,D1,02A")
                Toast("aaaa")
            },
            callByAndroid(code) {
                Toast(code)
                if (code) {
                    if (this.$myUtils.checkIsSilkCar(code)) { // 丝车
                        this.silkCarCode = code;
                        this.getSilkcarDetails(code);
                    } else if (this.$myUtils.checkIsSilk(code)) { //丝锭
                        if (this.data) {
                            // Toast(JSON.stringify(this.data.silkCarRowColList+'sssss' ))
                            if (this.isContentThisSilk(code, this.data.silkCarRowColList)) {
                                // 解绑的丝锭数组


                                // this.silkCodeList.pushNoRepeat({"silkCode": code})
                                this.silkCodeList.pushNoRepeat(code)

                                this.hairline = true
                            } else {
                                Toast("请扫描正确丝锭")
                            }
                        } else {
                            Toast('请先扫描丝车')
                        }
                    } else if (this.$myUtils.checkMachine(code) ) {
                        console.log("机台")

                        if(!this.data.silkCarRowColList[this.activeName].canModify&&this.data.silkCarRowColList[this.activeName].silkCode){
                            Toast("已经落筒过了，请重新选择位置")
                            return
                        }
                        if(this.activeName==-1){
                            Toast("请选择落筒位置")
                            return;
                        }
                        if(this.data===''||this.data===null){
                            Toast("请先扫描丝车")
                            return;
                        }
                        this.$api.getMqDoffMessage({

                            lineName: code.split(',')[1],
                            machineName: code.split(',')[2]

                        }).then((res) => {
                            if (res.data.status === '200') {

                                this.doffNoPop = res.data.data
                                if(this.doffNoPop.length>1){
                                    this.showPopup()
                                    this.currentScanMachineQrCode = code  ;
                                }else {
                                    //控制删除重复扫过的机台
                                    for (let i = 0; i < this.data.silkCarRowColList.length ; i++) {
                                        let a = this.data.silkCarRowColList[i]
                                        if(this.data.silkCarRowColList[i].silkCode && a.canModify&&this.data.silkCarRowColList[i].silkCode===code.split(',')[0]){
                                            this.data.silkCarRowColList[i].silkCode =null
                                            this.data.silkCarRowColList[i].doffNo =null
                                            this.data.silkCarRowColList[i].batchNo =null
                                            this.data.silkCarRowColList[i].canModify =null
                                            this.data.silkCarRowColList[i].showInfo =null
                                        }
                                    }

                                    this.data.silkCarRowColList[this.activeName].silkCode =code.split(',')[0]
                                    this.data.silkCarRowColList[this.activeName].doffNo =this.doffNoPop[0].doffNo
                                    this.data.silkCarRowColList[this.activeName].batchNo =this.doffNoPop[0].batchNo
                                    this.data.silkCarRowColList[this.activeName].canModify =true
                                    this.data.silkCarRowColList[this.activeName].showInfo =this.doffNoPop[0].batchNo
                                        + " "+ this.doffNoPop[0].lineName+'-'+this.doffNoPop[0].machinName+'-'+this.doffNoPop[0].doffNo
                                    this.activeName = this.getActiveName()
                                    this.hairline = true
                                }

                            } else {
                                Toast(res.data.msg)
                            }
                            console.log(res.data);
                        })
                    } else {
                        Toast('不符合规则')
                    }
                }

            },
            isContentThisSilk(silk, list) {
                if (!(list instanceof Array)) return false
                let is = true
                list.forEach(a => {
                    if (a.silkCode === silk) {
                        is = false
                        Toast("不能扫描当前丝车条码")
                    }
                })
                return is
            },
            getSilkcarDetails(code) {
                this.$api.getSilkCarDoff({
                    "silkCarCode": code,
                    "doffType": "AUTO_MANUAL"
                }).then((res) => {
                    if (res.data.status === '200') {
                        this.data = res.data.data[0];
                        // 确定activeName 的值
                        this.activeName = this.getActiveName(true)
                    } else {
                        Toast(res.data.msg)
                    }
                    console.log(res.data);
                });
            },
            getActiveName() {

                    for (let i = 0; i < this.data.silkCarRowColList.length; i++) {
                        if (this.data.silkCarRowColList[i].silkCode === null) {
                            return i
                        }
                    }
                    return -1


            },

            getDoff(arr) {

                let s = "";
                arr.forEach((e) => {
                    let a = e.lineMachine + "/" + e.doffNo + "  ";
                    s = s + a;
                });
                return s;
            },
            getGrades() {
                this.$api.getGrades().then((res) => {
                    if (res.data.code === 200) {
                        this.gradeData = res.data.queryResult.list;
                        this.gradeData.forEach((a,index)=>{
                            if(this.gradeData[index].grade=='A'){
                                this.gradeData[index].firstRate = true
                            }else {
                                this.gradeData[index].firstRate = false
                            }
                        })
                    } else {
                        Toast(res.data.message)
                        // console.log(res.data.queryResult , "aa")

                    }
                });
            }

        },
        created() {

            this.userId = this.$route.query.userId
            this.name = this.$route.query.name
            this.getGrades()

        },
        mounted() {
            window.callByAndroid = this.callByAndroid;
        },
    };
</script>

<style>
    .van-collapse-item-div {
        height: 50px;
        background-color: #57c3ae;
        width: 100%;
        border-radius: 6px;
        line-height: 50px;
        font-size: 20px;
        color: white;
    }

    .aa {
        color: #33aa46;
    }

    .main {
        margin: 1px;
        height: 40px;
        display: flex;
        background-color: #33aa46;
        border-radius: 3px;
        width: 100%;
    }

    .main > .left {
        flex: 4;
        line-height: 40px;
        color: white;
    }

    .main > .right {
        flex: 1;
        line-height: 40px;
        color: red;
    }

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
        height: 100px;
        background-color: #57c3ae;
        border-radius: 10px;
        margin-top: 10px;
        /*设置为伸缩盒子*/
        display: flex;
    }

    main > .item:nth-of-type(2) {
        background-color: #5b53aa;
    }

    main > .item:nth-of-type(3) {
        background-color: #aa4b40;
    }

    main > .item:nth-of-type(4) {
        background-color: #445faa;
    }

    main > .item > .left {
        flex: 1;
        display: flex;

    }

    main > .item > .right {
        flex: 2;
        /*设置换行显示*/
        flex-wrap: wrap;
        /*设置为伸缩盒子*/
        display: flex;
        overflow: hidden;
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

    .van-cell__value > span {
        position: relative;
        overflow: hidden;
        color: red;
        text-align: right;
        vertical-align: middle;
        word-wrap: break-word;
    }
    .van-cell__title > span{
        float: left;overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
    .van-toast__text {
        margin-top: 2.133vw;
        font-size: 25px;
    }
</style>
