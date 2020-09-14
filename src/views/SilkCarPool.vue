<template>
    <div id="app">
        <van-nav-bar
                title="拼车"
                left-text="返回"
                right-text=""
                left-arrow
                @click-left="onClickLeft"
                @click-right="onClickRight"
        />

        <div style="margin: 10px;">
            <!-- <van-button round block plain hairline type="primary">{{silkCarCode}}</van-button> -->
            <van-field v-model="silkCarCode" center clearable label="丝车条码" placeholder="请扫描丝车条码">

            </van-field>
        </div>


        <div style="overflow: hidden" v-if="false">设置等级</div>
        <div style="display: inline-block" v-if="false">
            <a v-for="(item, index ) in gradeData" :key="index" @click.prevent="chooseOne(index)" style="float: left">
                <van-button :type="item.firstRate?'warning':'primary'" style="margin : 5px;width: 60px ; float: left">
                    {{item.grade}}
                </van-button>
            </a>
        </div>
        <p style="color: red;line-height: 40px" v-if="silkCarCode!=''">***请扫描丝锭***</p>
        <div class="main2" v-for="(item, index ) in silkCodeList" :key="index">
            <div class="left">{{item}}</div>
            <div class="right" @click="deleteSilk(index)">
                删除
            </div>
        </div>

        <van-button type="danger" block hairline="hairline" v-if="hairline"
                    style="margin:  0;overflow: hidden ;display: inline" @click="dingDeng">确定
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
        name: "SilkCarPool",
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
                // let arr  = []
                // // if( !this.silkCodeList|| this.silkCodeList.length==0||!this.silkCarCode){
                // //     Toast("请输入完整信息")
                // //     return
                // // }
                // this.silkCodeList.forEach(a=>{
                //     arr.push({silkCode:a})
                // })
                // Toast(arr + "xx")
                this.$api.poolSilkCar({
                    operator: this.name,
                    id: this.data.id,
                    silkCarCode: this.silkCarCode,
                    operatorId: this.userId,
                    silkCode: this.silkCodeList,
                    // grade: this.gradeData.find(a => a.firstRate).grade
                }).then((res) => {
                    Toast(res.data.status)
                    if (res.data.status === '200') {
                        this.silkCodeList = []
                        this.hairline = false
                        this.data = ''
                        this.silkCarCode = ''
                        this.weiList = [{
                            "doffNo": "车",
                            "lineMachine": "整",


                        }]
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
                this.callByAndroid('0J1V101A00214D')
            },
            callByAndroid(code) {
                // Toast("对了？" + code)
                if (code) {
                    if (this.$myUtils.checkIsSilkCar(code)) { // 丝车
                        this.silkCarCode = code;
                        this.getSilkcarDetails(code);
                    } else if (this.$myUtils.checkIsSilk(code)) { //丝锭
                        if (this.silkCarCode) {
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
                if (!(list instanceof Array)) return true
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
                this.$api.getSilkss(code).then((res) => {
                    if (res.data.status === '200') {
                        this.data = res.data.data;
                        // this.weiList = res.data.data.silkCarOnLinePositions
                        this.weiList = [{
                            "doffNo": "车",
                            "lineMachine": "整",
                        }]
                        this.data.silkCarOnLinePositions.forEach(a => {
                            this.weiList.push(a)
                        })
                        this.silkCodeList = []

                    } else {
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
