<template>
    <div id="app">
        <van-nav-bar
                title="丝锭解绑"
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
        <div style="overflow: hidden" v-if="false">设置等级</div>
        <div style="overflow: hidden" v-if="false">
            <a v-for="(item, index ) in gradeData" :key="index" @click.prevent="chooseOne(index)" style="float: left">
                <van-button :type="item.firstRate?'warning':'primary'" style="margin : 5px;width: 60px ; float: left">
                    {{item.grade}}
                </van-button>
            </a>
        </div>
        <div style="overflow: hidden">按位解绑</div>
        <!--整车 按位-->
        <div style="display: inline-block">
            <div style="float: left">
                <a v-for="(item, index ) in weiList" :key="index" @click.prevent="chooseWei(index)"
                   style="float: left ; overflow: hidden">
                    <van-button :color="weiPosition===index?'#ff976a':'#07c160'" style="margin : 5px;width: 80px ; float: left;overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;">{{item.lineMachine+'-'+item.doffNo}}
                    </van-button>
                </a>

            </div>


        </div>
        <div class="main2" v-for="(item, index ) in silkCodeList" :key="index">
            <div class="left">{{item}}</div>
            <div class="right" @click="deleteSilk(index)">
                删除
            </div>

        </div>
        <van-button type="danger" block hairline="hairline" v-if="hairline"
                    style="margin:  15px auto;overflow: hidden ;display: inline" @click="dingDeng">确定
        </van-button>


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
        name: "SilkUnbind",
        components: {
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [Row.name]: Row,
            [Col.name]: Col

        },
        data() {
            return {
                weiPosition: -1,
                weiList: [
                    {
                        "doffNo": "车",
                        "lineMachine": "整",


                    },{
                        "doffNo": "面",
                        "lineMachine": "A",


                    },{
                        "doffNo": "面",
                        "lineMachine": "B",


                    }],
                userId: '',
                hairline: this.silkCodeList && this.silkCodeList.length > 0,
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
            };
        },
        methods: {

            dingDeng() {
                let arr = [];
                this.silkCodeList.forEach(a => {
                    if(a.indexOf('位置:')!=-1){
                        arr.push({silkCode: a.split('位置:')[0]})
                    }else {
                        arr.push({silkCode: a})
                    }
                })
                this.$api.silkUnbind({
                    post: this.name,
                    id: this.data.id,
                    silkCarCode: this.silkCarCode,
                    modifier: this.userId,
                    silkCarRowColList: arr,
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


                        },{
                            "doffNo": "面",
                            "lineMachine": "A",


                        },{
                            "doffNo": "面",
                            "lineMachine": "B",


                        }]
                        this.weiPosition = -1
                        Toast.success(res.data.msg)
                    } else {
                        Toast(res.data.msg)
                    }
                });
                // this.$api.dingDeng({
                //     post: this.name,
                //     silkCarCode: this.silkCarCode,
                //     modifier: this.userId,
                //     silkCarRowColList: arr,
                //     id:this.data.id,
                //     grade: this.gradeData.find(a=>a.firstRate).grade
                // }).then((res) => {
                //     if (res.data.status === '200') {
                //         this.silkCodeList = []
                //         this.hairline = false
                //         this.data = ''
                //         this.silkCarCode = ''
                //         this.weiList = [    {
                //             "doffNo": "车",
                //             "lineMachine": "整",
                //
                //
                //         }]
                //         this.weiPosition = 0
                //
                //         Toast.success(res.data.msg)
                //     } else {
                //         Toast(res.data.msg)
                //     }
                // });
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
                    this.data.silkCarRowColList && this.data.silkCarRowColList.forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode+'位置:'+b.sideType+'/'+b.row+'/'+b.col)
                    })
                } if (clickIndex === 1) { // A
                    this.data.silkCarRowColList && this.data.silkCarRowColList.filter(a => a.sideType === 'A').forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode+'位置:'+b.sideType+'/'+b.row+'/'+b.col)
                    })
                }  if (clickIndex === 2) { //B
                    this.data.silkCarRowColList && this.data.silkCarRowColList.filter(a => a.sideType === 'B').forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode+'位置:'+b.sideType+'/'+b.row+'/'+b.col)
                    })
                }  else {
                    this.data.silkCarRowColList && this.data.silkCarRowColList.filter(a => a.orderBy == this.weiList[clickIndex].orderBy).forEach(b => {
                        this.silkCodeList.pushNoRepeat(b.silkCode+'位置:'+b.sideType+'/'+b.row+'/'+b.col)
                        console.log(b)

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


                        },{
                            "doffNo": "面",
                            "lineMachine": "A",


                        },{
                            "doffNo": "面",
                            "lineMachine": "B",


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
    .main2 {
        margin: 5px 5px;
        height: 40px;
        display: flex;
        /*background-color: #33aa46;*/
        background-color: grey;
        overflow: hidden;
        border-radius: 6px;
    }

    .main2 > .left {
        flex: 3;
        line-height: 40px;
        padding-left: 8px;
        color: white;
    }

    .main2 > .right {
        flex: 1;
        line-height: 40px;
        color: red;
    }


</style>
