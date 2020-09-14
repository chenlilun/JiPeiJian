<template>
    <div id="app">
        <van-nav-bar
                title="拣配出库"
                left-text="返回"
                right-text=""
                left-arrow
                @click-left="onClickLeft"
                @click-right="onClickRight"
        />


        <div v-for="(item, index ) in this.data.silkCarRowColList" :key="index" class="div_item"
             :style="index ===activeName ?'background-color:  goldenrod ;  border: 1px solid red;' : 'background-color:   darkgrey ;'"
             @click="activeName=index"
        >
            <div class="van-collapse-item-div33" style="border-radius: 6px">{{item.silkCode}}</div>
            <div class="van-collapse-item-div2">
                <!--                    {{item.silkCode===null?'请扫描机台':item.canModify===true-->
                <!--                    ?item.showInfo:(item.batchNo+" "+item.silkCode+'-'+item.doffNo)-->
                <!--                    }}-->
                <p class="p1">{{item.sideType}}面{{item.row}}/{{item.col}}</p>
                <p class="p2">
                    {{(item.silkCode===null||typeof(item.silkCode)===undefined||item.silkCode==='')?'未落筒':item.canModify?'已扫码':'已落筒'}}</p>
                <p class="p3"
                   v-if="(item.silkCode===null||typeof(item.silkCode)===undefined||item.silkCode==='')?true:item.canModify?true:false"
                   @click="changeSilk(index)">更换</p>
            </div>
        </div>

        <van-button type="danger" block hairline="hairline" v-if="hairline"
                    style="margin:  15px auto;overflow: hidden ;display: inline" @click="dingDeng">落筒提交
        </van-button>
        <!--        <van-cell is-link @click="showPopup">展示弹出层</van-cell>-->
        <van-popup
                v-model="show"
                closeable
                position="bottom"
                :style="{ height: '30%' }"
        >
            <div v-for="(item, index ) in this.doffNoPop" :key="index" @click="doffNoPopChoose(index)">

                <div class="van-collapse-item-div">

                    {{item.batchNo+" "+item.lineName+'-'+item.machinName+'-'+item.doffNo}}
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

    Toast.setDefaultOptions({duration: 4000});
    export default {
        name: "DoffManMade",
        myIndex: -1,
        components: {
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [Row.name]: Row,
            [Col.name]: Col

        },
        data() {
            return {
                doffNoPop: [],
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
                currentScanMachineQrCode: '',
                username: '',
                factoryCode: '',
                companyCode: ''
            };
        },
        methods: {
            changeSilk(index) {
                this.activeName = index
                let a = Math.floor(Math.random() * this.data.silkCarPositionList[this.activeName].silkCarRowColList.length)
                this.data.silkCarRowColList[this.activeName].silkCode = null
                this.data.silkCarRowColList[this.activeName].canModify = null
                this.data.silkCarRowColList[this.activeName].sideType = this.data.silkCarPositionList[this.activeName].silkCarRowColList[a].sideType
                this.data.silkCarRowColList[this.activeName].row = this.data.silkCarPositionList[this.activeName].silkCarRowColList[a].row
                this.data.silkCarRowColList[this.activeName].col = this.data.silkCarPositionList[this.activeName].silkCarRowColList[a].col
                this.data.silkCarRowColList[this.activeName].spindleNum = this.data.silkCarPositionList[this.activeName].silkCarRowColList[a].spindleNum
                this.data.silkCarRowColList[this.activeName].orderBy = this.data.silkCarPositionList[this.activeName].silkCarRowColList[a].orderBy
                this.data.silkCarRowColList[this.activeName].createTime = this.data.silkCarPositionList[this.activeName].silkCarRowColList[a].createTime
                this.data.silkCarRowColList[this.activeName].grabFlag = this.data.silkCarPositionList[this.activeName].silkCarRowColList[a].grabFlag
                this.data.silkCarRowColList[this.activeName].eliminateFlag = this.data.silkCarPositionList[this.activeName].silkCarRowColList[a].eliminateFlag
            },
            doffNoPopChoose(i) {  // 弹框选择
                if (this.currentScanMachineQrCode) {
                    //去重扫过的机台
                    for (let i = 0; i < this.data.silkCarRowColList.length; i++) {
                        let a = this.data.silkCarRowColList[i]
                        if (this.data.silkCarRowColList[i].silkCode && a.canModify && this.data.silkCarRowColList[i].silkCode === code.split(',')[0]) {
                            this.data.silkCarRowColList[i].silkCode = null
                            this.data.silkCarRowColList[i].doffNo = null
                            this.data.silkCarRowColList[i].batchNo = null
                            this.data.silkCarRowColList[i].canModify = null
                            this.data.silkCarRowColList[i].showInfo = null
                        }
                    }

                    this.data.silkCarRowColList[this.activeName].silkCode = this.currentScanMachineQrCode.split(',')[0]
                    this.data.silkCarRowColList[this.activeName].doffNo = this.doffNoPop[i].doffNo
                    this.data.silkCarRowColList[this.activeName].batchNo = this.doffNoPop[i].batchNo
                    this.data.silkCarRowColList[this.activeName].canModify = true
                    this.data.silkCarRowColList[this.activeName].showInfo = this.doffNoPop[i].batchNo
                        + " " + this.doffNoPop[i].lineName + '-' + this.doffNoPop[i].machinName + '-' + this.doffNoPop[i].doffNo
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
                // let batNo = ''
                // let isCan = true;
                // if (this.data.silkCarRowColList) {
                //     // a.batchNo==='null'||
                //     this.data.silkCarRowColList.filter(a => a.batchNo != null).forEach((item, index) => {
                //         if (index > 0) {
                //             if (item.batchNo != batNo) {
                //                 isCan = false;
                //             }
                //         }
                //         if (index === 0) {
                //             batNo = item.batchNo
                //         }
                //         console.log(index, "index")
                //         console.log(item, "item")
                //
                //
                //     })
                // }
                // if (!isCan) {
                //     Toast("一辆车不能落不同批号")
                //     return;
                // }

                this.data.silkCode = this.silkCarCode
                this.data.userId = this.userId
                this.data.grade = this.gradeData.find(a => a.firstRate).grade
                // this.data.silkCarRowColList.forEach((a , index)=>{
                //     if((typeof a.canModify === "undefined")||!a.canModify){
                //         this.data.silkCarRowColList.splice(index,1)
                //     }
                // })
                for (let i = 0; i < this.data.silkCarRowColList.length; i++) {
                    let a = this.data.silkCarRowColList[i]
                    if ((typeof a.canModify === "undefined") || !a.canModify) {
                        this.data.silkCarRowColList.splice(i, 1)
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
                this.callByAndroid('0J1Y104AA0117D')
            },
            callByAndroid(code) {
                // Toast(code)
                if (code) {
                    if (this.$myUtils.checkIsSilkCar(code)) { // 丝车
                        this.silkCarCode = code;
                        this.getSilkcarDetails(code);
                    } /*else if (this.$myUtils.checkIsSilk(code)) { //丝锭
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
                    } */ else if (this.$myUtils.checkIsSilk(code)) {
                        console.log("丝锭")

                        if (!this.data.silkCarRowColList[this.activeName].canModify && this.data.silkCarRowColList[this.activeName].silkCode) {
                            Toast("已经落筒过了，请重新选择位置")
                            return
                        }
                        if (this.activeName == -1) {
                            Toast("请选择落筒位置")
                            return;
                        }
                        if (this.data === '' || this.data === null) {
                            Toast("请先扫描丝车")
                            return;
                        }
                        let last = code.substr(code.length - 1, 1)
                        let first = code.substr(0, 12);
                        let spindleNums = code.substr(code.length - 2, 1)
                        let isIn = true
                        this.data.silkCarRowColList.filter(a => a.silkCode && a.silkCode != null && a.silkCode != ''
                        ).forEach((item, index) => {
                            let mylast = item.silkCode.substr(item.silkCode.length - 1, 1)
                            let myfirst = item.silkCode.substr(0, 12);
                            let mySpindleNum = item.silkCode.substr(item.length - 2, 1)
                            if (mylast === last && myfirst === first) {
                                isIn = false
                            }

                        })
                        if (!isIn) {
                            Toast('不能重复验证同一个落次的丝锭')
                            return;
                        }
                        //都不一样判断锭位必须一致

                        //判断是不是正确的丝锭
                        let col = this.data.silkCarRowColList[this.activeName].col;
                        let row = this.data.silkCarRowColList[this.activeName].row;
                        console.log(col, 'col')
                        console.log(row, 'row')


                        for (let i = 0; i < this.data.silkCarPositionList[this.activeName].silkCarRowColList.length; i++) {
                            if (this.data.silkCarPositionList[this.activeName].silkCarRowColList[i].col === col
                                && this.data.silkCarPositionList[this.activeName].silkCarRowColList[i].row === row
                                && this.data.silkCarPositionList[this.activeName].silkCarRowColList[i].sideType === this.data.silkCarRowColList[this.activeName].sideType

                            ) {
                                if (code.substr(code.length - 2, 1) === this.data.silkCarPositionList[this.activeName].silkCarRowColList[i].spindleNum
                                ) {
                                    Toast("验证通过")
                                    this.data.silkCarRowColList[this.activeName].silkCode = code
                                    this.data.silkCarRowColList[this.activeName].canModify = true
                                    this.activeName = this.getActiveName()
                                    this.hairline = true
                                    return;
                                }
                            }
                        }
                        Toast("验证失败，请重新扫丝锭")

                        // this.$api.getMqDoffMessage({
                        //
                        //     lineName: code.split(',')[1],
                        //     machineName: code.split(',')[2]
                        //
                        // }).then((res) => {
                        //     if (res.data.status === '200') {
                        //
                        //         this.doffNoPop = res.data.data
                        //         if (this.doffNoPop.length > 1) {
                        //             this.showPopup()
                        //             this.currentScanMachineQrCode = code;
                        //         } else {
                        //             //控制删除重复扫过的机台
                        //             for (let i = 0; i < this.data.silkCarRowColList.length; i++) {
                        //                 let a = this.data.silkCarRowColList[i]
                        //                 if (this.data.silkCarRowColList[i].silkCode && a.canModify && this.data.silkCarRowColList[i].silkCode === code.split(',')[0]) {
                        //                     this.data.silkCarRowColList[i].silkCode = null
                        //                     this.data.silkCarRowColList[i].doffNo = null
                        //                     this.data.silkCarRowColList[i].batchNo = null
                        //                     this.data.silkCarRowColList[i].canModify = null
                        //                     this.data.silkCarRowColList[i].showInfo = null
                        //                 }
                        //             }
                        //
                        //             this.data.silkCarRowColList[this.activeName].silkCode = code.split(',')[0]
                        //             this.data.silkCarRowColList[this.activeName].doffNo = this.doffNoPop[0].doffNo
                        //             this.data.silkCarRowColList[this.activeName].batchNo = this.doffNoPop[0].batchNo
                        //             this.data.silkCarRowColList[this.activeName].canModify = true
                        //             this.data.silkCarRowColList[this.activeName].showInfo = this.doffNoPop[0].batchNo
                        //                 + " " + this.doffNoPop[0].lineName + '-' + this.doffNoPop[0].machinName + '-' + this.doffNoPop[0].doffNo
                        //             this.activeName = this.getActiveName()
                        //             this.hairline = true
                        //         }
                        //
                        //     } else {
                        //         Toast(res.data.msg)
                        //     }
                        //     console.log(res.data);
                        // })
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
                    "doffType": "MANUAL"
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
            this.username = this.$route.query.username
            this.factoryCode = this.$route.query.factoryCode
            this.companyCode = this.$route.query.companyCode


        },
        mounted() {
            window.callByAndroid = this.callByAndroid;
        },
    };
</script>

<style>
    .div_item {
        background-color: goldenrod;
        border-radius: 9px;
        margin: 3px 5px;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;


    }

    .van-collapse-item-div33 {
        height: 50px;
        width: 100%;
        border-radius: 6px;
        line-height: 50px;
        font-size: 20px;
        color: black;

    }

    .van-collapse-item-div2 {
        height: 50px;
        width: 100%;
        border-radius: 6px;
        line-height: 50px;
        font-size: 20px;
        display: flex;
        position: relative;
    }

    .van-collapse-item-div2 > .p1 {
        flex: 1.5;
        line-height: 16px;
        text-align: center;
        float: left;
        font-size: 18px;

    }

    .van-collapse-item-div2 > .p2 {
        flex: 1;
        line-height: 10px;
        color: red;
        font-size: 20px;
        text-align: center;
        float: left;
    }

    .van-collapse-item-div2 > .p3 {
        flex: 1.5;
        text-align: center;
        height: 100%;
        width: 100%;
        color: chartreuse;
        margin-top: -0px;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
        background-color: #1989fa;
        size: 20px;
        float: left;
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

    .van-cell__title > span {
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .van-toast__text {
        margin-top: 2.133vw;
        font-size: 25px;
    }
</style>
