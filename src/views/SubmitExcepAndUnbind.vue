<template>
    <div id="app2">


        <div class="roll">
            <van-nav-bar
                    title="提交异常并解绑"
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
            <van-divider/>
            <div style="overflow: hidden;display: inline-block">
                <a v-for="(item, index ) in gradeData" :key="index" @click.prevent="chooseOne(index)"
                   style="float: left">
                    <van-button :type="item.firstRate?'warning':'primary'"
                                style="margin : 0px 3px;width: 60px ; float: left">
                        {{item.grade}}
                    </van-button>
                </a>
            </div>
            <van-divider/>
            <!--整车 按位-->
            <div style="display: inline-block;margin-top: -10px">
                <div style="float: left ">
                    <a v-for="(item, index ) in weiList" :key="index" @click.prevent="chooseWei(index)"
                       style="float: left ; overflow: hidden">
                        <van-button :color="weiPosition===index? '#ff976a':'#07c160'" style="margin: 3px 3px;width: 80px ; float: left;overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;">{{item.lineMachine+'-'+item.doffNo}}
                        </van-button>
                    </a>
                </div>
            </div>
            <van-cell title="丝锭列表" is-link :value="silkCodeList.length" @click="show=true"/>
            <!--异常备注-->
            <van-tabs v-model="active">
                <van-tab title="异常">
                    <!--                    <div v-for="(item, index ) in silkCodeList" :key="index" style="margin: 0;padding: 0">-->
                    <!--                        <p :class="index===excepIndex?'left2':'left1'">{{item}}</p>-->
                    <!--                    </div>-->
                    <div style="margin-top: 5px;margin-left: 8px">
                        <div :class="index===excepIndex?'main3':'main4'" v-for="(item, index ) in excepArray"
                             :key="index">
                            <div class="left" @click="chooseException(index)">{{ item.exceptionName }}</div>

                        </div>
                    </div>
                </van-tab>
                <van-tab title="备注">
                    <div style="margin-top: 5px;margin-left: 8px">
                        <div :class="index===nodeExcepIndex?'main3':'main4'" v-for="(item, index ) in nodeArray"
                             :key="index">
                            <div class="left" @click="chooseExceptionNode(index)">{{ item.noteName }}</div>

                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
        <footer class="ftor">
            <van-button type="danger" block hairline="hairline" v-if="hairline"
                        style="margin: 3px 3px;display: inline-block ; flex: 1" @click="dingDeng(false)">只提交异常
            </van-button>
            <van-button type="danger" block hairline="hairline" v-if="hairline"
                        style="margin: 3px 3px;display: inline-block ; flex: 1" @click="dingDeng(true)">
                {{this.excepIndex===-1?'无异常解绑':'提交异常并解绑'}}
            </van-button>
        </footer>
        <!--丝锭列表-->
        <van-popup v-model="show"
                   close-icon-position="top-left"
                   closeable
                   position="right" :style="{ height: '100%' , width : '80%'  }   ">
            <div style="margin-top: 60px;margin-left: 8px">
                <div class="main2" v-for="(item, index ) in silkCodeList" :key="index">
                    <div class="left">{{item}}</div>
                    <div class="right" @click="deleteSilk(index)">
                        删除
                    </div>
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

    export default {
        name: "SubmitExcepAndUnbind",
        components: {
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [Row.name]: Row,
            [Col.name]: Col

        },
        data() {
            return {
                excepArray: [],
                nodeArray: [],
                excepIndex: -1,
                nodeExcepIndex: -1,
                active: 0,
                weiPosition: -1,
                weiList: [
                    {
                        "doffNo": "车",
                        "lineMachine": "整",


                    }],
                userId: '',
                hairline: this.silkCodeList && this.silkCodeList.length > 0,
                name: '',
                silkCodeList: [],
                data: '',
                gradeData: [],
                radio: '1',
                showDoff: false,
                show: false,
                lineWeiDoff: "",
                date: "",
                capacity: "",
                show: false,
                silkCarCode: "",
                list: [],
                loading: false,
                finished: true,
                refreshing: false,
            };
        },
        methods: {
            getExceps() {

                this.$api.getAllExceptions().then((res) => {
                    if (res.data.status === '200') {
                        // this.silkCodeList = []
                        this.excepArray = res.data.data

                    } else {
                        Toast(res.data.msg)
                    }
                });
            },
            getNodeArray() {

                this.$api.getAllSilkNote().then((res) => {
                    if (res.data.status === '200') {
                        // this.silkCodeList = []
                        this.nodeArray = res.data.data

                    } else {
                        Toast(res.data.msg)
                    }
                });
            },
            dingDeng(unbind) {
                let arr = [];
                this.silkCodeList.forEach(a => {
                    if (a.indexOf('位置:') != -1) {
                        arr.push({silkCode: a.split('位置:')[0]})
                    } else {
                        arr.push({silkCode: a})
                    }
                })
                Toast.loading({
                    message: '提交...',
                    forbidClick: true,
                    loadingType: 'spinner',
                    duration: 0
                });
                console.log("aaa")

                this.$api.silkUnbind({
                    post: this.name,
                    id: this.data.id,
                    grade: this.gradeData.find(a => a.firstRate).grade,
                    silkCarCode: this.silkCarCode,
                    modifier: this.userId,
                    silkCarRowColList: arr,
                    separateFlag: unbind,
                    silkNote: this.nodeExcepIndex === -1 ? {} : this.nodeArray[this.nodeExcepIndex],
                    exception: this.excepIndex === -1 ? '' : this.excepArray[this.excepIndex].exceptionName
                }).then((res) => {
                    if (res.data.status === '200') {
                        this.silkCodeList = []
                        this.hairline = false
                        this.data = ''
                        this.silkCarCode = ''
                        this.silkCodeList = []
                        this.hairline = false
                        this.data = ''
                        this.weiList = [{
                            "doffNo": "车",
                            "lineMachine": "整",
                        }]
                        this.weiPosition = -1
                        Toast.clear()
                        Toast.success(res.data.msg)
                    } else {
                        Toast.clear()
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

                if (clickIndex === this.weiPosition) {
                    this.weiPosition = -1
                    this.silkCodeList = []
                    return
                }
                this.weiPosition = clickIndex
                this.silkCodeList = []
                //如果weiPosition
                if (clickIndex === 0) {
                    this.data.silkCarRowColList && this.data.silkCarRowColList.forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode + '位置:' + b.sideType + '/' + b.row + '/' + b.col)
                    })
                } else {
                    this.data.silkCarRowColList && this.data.silkCarRowColList.filter(a => a.orderBy == this.weiList[clickIndex].orderBy).forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode + '位置:' + b.sideType + '/' + b.row + '/' + b.col)
                        console.log(b)

                    })
                }

                this.hairline = true
            },
            chooseException(clickIndex) {
                if (clickIndex === this.excepIndex) {
                    this.excepIndex = -1
                    // this.silkCodeList = []
                    return
                }
                this.excepIndex = clickIndex

            },
            chooseExceptionNode(clickIndex) {
                if (clickIndex === this.nodeExcepIndex) {
                    this.nodeExcepIndex = -1
                    // this.silkCodeList = []
                    return
                }
                this.nodeExcepIndex = clickIndex

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
            },
            callByAndroid(code) {
                // Toast("对了？" + code)
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
                    } else {
                        Toast('不符合规则')
                    }
                }

            },
            isContentThisSilk(silk, list) {
                if (!(list instanceof Array)) return false
                let is = false
                list.forEach(a => {
                    if (a.silkCode === silk) {
                        is = true
                    }
                })
                return is
            },
            getSilkcarDetails(code) {
                this.$api.getSilkss(code).then((res) => {
                    if (res.data.status === '200') {
                        this.data = res.data.data;
                        // this.weiList = res.data.data.silkCarOnLinePositions
                        this.weiList = [{
                            "doffNo": "车",
                            "lineMachine": "整",
                        }]
                        this.data.silkCarOnLinePositions && this.data.silkCarOnLinePositions.forEach(a => {
                            this.weiList.push(a)
                        })
                        this.silkCodeList = []
                        this.chooseWei(-1)

                    } else {
                        Toast(res.data.msg)
                        this.silkCodeList = []
                    }
                    console.log(res.data);
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
            getGrades() {
                this.$api.getGrades().then((res) => {
                    if (res.data.code === 200) {
                        this.gradeData = res.data.queryResult.list;
                        this.gradeData.forEach((a, index) => {
                            if (this.gradeData[index].grade == 'A') {
                                this.gradeData[index].firstRate = true
                            } else {
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
            this.getExceps()
            this.getNodeArray()


        },
        mounted() {
            window.callByAndroid = this.callByAndroid;
        },
    };
</script>

<style scoped="scoped">

    .ftor {
        background: #F2F3F6;
        max-width: 750px;
        width: 100%;
        height: 1rem;
        display: flex;
    }

    app2 {
        display: flex;
        display: -webkit-flex;
        height: 100%;
        flex-direction: column;

    }

    .roll {
        flex: 1;
        width: 100%;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        height: auto;
    }

    .main2 {
        margin: 5px 5px;
        height: 40px;
        display: flex;
        background-color: grey;
        overflow: hidden;
        border-radius: 6px;
    }

    .main2 > .left {
        flex: 3;
        padding-left: 8px;
        line-height: 40px;
        color: white;
        font-size: 10px;
    }

    .main4 {
        margin: 5px 5px;
        height: 40px;
        display: flex;
        background-color: grey;
        overflow: hidden;
        border-radius: 6px;
    }

    .main4 > .left {
        flex: 3;
        padding-left: 8px;
        line-height: 40px;
        color: white;
    }

    .main3 {
        margin: 5px 5px;
        height: 40px;
        display: flex;
        background-color: #ff976a;
        overflow: hidden;
        border-radius: 6px;
    }

    .main3 > .left {
        flex: 3;
        padding-left: 8px;
        line-height: 40px;
        color: white;
    }


    .left1 {
        display: flex;
        background-color: grey;
        overflow: hidden;
        border-radius: 6px;
        text-align: center;
        line-height: 40px;
        color: white;
        width: 100%;
        height: 40px;
        display: block;
        text-align: center;
    }

    .left2 {
        height: 40px;
        display: flex;
        background-color: red;
        overflow: hidden;
        border-radius: 6px;
        text-align: center;
        line-height: 40px;
        color: white;
        width: 100%;
        height: 40px;
        display: block;
        text-align: center;
    }

    .main2 > .right {
        flex: 1;
        line-height: 40px;
        color: red;
    }


</style>
