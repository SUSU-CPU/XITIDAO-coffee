<template>
    <div class="order">
        <van-tabs v-model="active" @change="toggleTab" :swipeable="true">
            <van-tab title="全部"></van-tab>
            <van-tab title="未收货"></van-tab>
            <van-tab title="已收货"></van-tab>
        </van-tabs>
        <template v-if="IndentList.length > 0">
            <div class="order-list">
                <div class="indent" v-for="(item,index) in IndentList" :key="index">
                    <div class="indTop clear">
                        <span class="indent-count">{{item.oid}}</span>

                        <template v-if="item.status == 1">
                            <span class="fr finish" @click="confirmReceive(item.oid,index)">确认收货</span>
                        </template>
                        <template v-else>
                            <span class="fr delete" @click="deleteIndent(item.oid,index)">
                                <van-icon name="delete" />
                            </span>
                            <span class="fr finish">已完成 |</span>
                        </template>
                    </div>
                    <div class="indent-message" v-for="(value,i) in item.data" :key="i">
                        <div class="left">
                            <div class="img fl">
                                <img class="auto-img" :src="value.smallImg" />
                            </div>
                            <div class="message fl">
                                <p class="title">{{value.name}}</p>
                                <span>{{value.rule}}</span>
                            </div>
                        </div>
                        <div class="right">
                            <span>X{{value.count}}</span>
                        </div>
                    </div>
                    <div class="index-Time">
                        <div class="time">
                            <span>{{item.orderTime}}</span>
                        </div>
                        <div class="allPrice">
                            <span>共{{item.count}}件商品</span>
                            <span>共计: ￥{{item.total}}</span>
                        </div>
                    </div>
                    <van-button
                        size="mini"
                        round
                        plain
                        color="#FF7F8C"
                        @click="onceAgain(item)"
                    >再来一单</van-button>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="isLogin" v-if="isLogin">
                <div class="image">
                    <img class="auto-img" :src="require('../../assets/Indent.png')" />
                </div>
                <p class="text" @click="goPage('Menu')">没有订单,快去逛逛</p>
            </div>
            <div class="isLogin" v-else>
                <div class="image">
                    <img class="auto-img" :src="require('../../assets/Indent.png')" />
                </div>
                <p class="text" @click="goPage('Login')">登录查看订单详情...</p>
            </div>
        </template>
    </div>
</template>

<script>
    import { mapState } from "vuex";
    import { Utile } from "../../Utils/Utilse";

    export default {
        name: "Order",
        data() {
            return {
                active: 0
            };
        },
        computed: {
            ...mapState("OrderModule", ["IndentList", "allIndentList"]),
            isLogin() {
                return this.$store.state.isLogin;
            }
        },
        created() {
            this.$store.commit("OrderModule/emptyData");
            if (this.$route.name == "Indent") {
                this.$store.commit("MainModule/changeData", {
                    key: "active",
                    value: 2
                });
            }
            // 初始化全部订单数据
            this.createdAllIndent(0);

            this.$store.commit("OrderModule/changeData", {
                key: "allIndentList",
                value: this.IndentList
            });
        },
        methods: {
            goPage(routerName) {
                this.$router.push({ name: routerName });
                // if(routerName == "Menu"){
                // this.$store.commit("MainModule/changeActive", 1);
                // }
            },
            // 初始化全部订单数据
            createdAllIndent(status) {
                let tokenString = localStorage.getItem("_t");
                this.$store.commit("OrderModule/changeData", {
                    key: "allIndentList",
                    value: []
                });
                this.$toast.loading({
                    forbidClick: true,
                    duration: 0,
                    message: "加载中..."
                });
                this.axios({
                    url: "/findOrder",
                    method: "GET",
                    params: {
                        tokenString,
                        appkey: this.appkey,
                        status
                    }
                })
                    .then(result => {
                        this.$toast.clear();
                        if (result.data.code == 70000) {
                            let indentData = [];
                            let listCount = [];
                            result.data.result.forEach((v, i) => {
                                if (listCount.indexOf(v.oid) == -1) {
                                    listCount.push(v.oid);
                                }
                            });

                            listCount.forEach((v, i) => {
                                // 当前订单数据
                                let currentOrderData = {
                                    oid: v,
                                    count: 0,
                                    total: 0,
                                    // 当前订单的所有商品数据
                                    data: []
                                };

                                result.data.result.forEach((item, index) => {
                                    if (item.oid == v) {
                                        currentOrderData.data.push(item);
                                        currentOrderData.count += item.count;
                                        currentOrderData.total +=
                                            item.count * item.price;
                                    }
                                });

                                // 订单事件
                                //订单时间
                                currentOrderData.orderTime = Utile.formatDate(
                                    new Date(currentOrderData.data[0].createdAt),
                                    "yyyy-MM-dd hh:mm:ss"
                                );

                                currentOrderData.status =
                                    currentOrderData.data[0].status;
                                indentData.unshift(currentOrderData);
                            });
                            this.$store.commit("OrderModule/changeData", {
                                key: "IndentList",
                                value: indentData
                            });
                            this.$store.commit("changeData", {
                                key: "isLogin",
                                value: true
                            });
                        } else if (result.data.code == 700) {
                            this.$store.commit("changeData", {
                                key: "isLogin",
                                value: false
                            });
                        }
                    })
                    .catch(() => {
                        this.$toast.clear()
                    });
            },
            // 确认收货
            confirmReceive(oid, index) {
                let tokenString = localStorage.getItem("_t");
                this.axios({
                    url: "/receive",
                    method: "POST",
                    data: {
                        tokenString,
                        appkey: this.appkey,
                        oid
                    },
                    transformRequest: Utile.transformRequest
                })
                    .then(result => {
                        if (result.data.code == 80000) {
                            this.IndentList[index].status = 2;
                            if (this.active == 1) {
                                this.IndentList.splice(index, 1);
                            }
                        }
                    })
                    .catch(() => {});
            },
            // 切换标签更换数据
            toggleTab(status) {
                this.createdAllIndent(status);
            },
            // 删除订单
            deleteIndent(oid, index) {
                let tokenString = localStorage.getItem("_t");
                this.axios({
                    url: "/removeOrder",
                    method: "POST",
                    data: {
                        tokenString,
                        appkey: this.appkey,
                        oid
                    },
                    transformRequest: Utile.transformRequest
                })
                    .then(result => {
                        if (result.data.code == 90000) {
                            this.IndentList.splice(index, 1);
                        }
                    })
                    .catch(() => {});
            },
            // 再来一单
            onceAgain(item) {
                let tokenString = localStorage.getItem("_t");

                item.data.forEach(v => {
                    this.axios({
                        url: "/addShopcart",
                        method: "POST",
                        data: {
                            appkey: this.appkey,
                            tokenString,
                            rule: v.rule,
                            pid: v.pid,
                            count: v.count
                        },
                        transformRequest: Utile.transformRequest
                    })
                        .then(result => {
                            if (result.data.code == 3000) {
                                this.$router.push({ name: "ShopCart" });
                                // this.$store.commit("MainModule/changeActive", 3);
                                let tokenString = localStorage.getItem("_t");
                                this.$store.commit("MainModule/getShopCount", {
                                    self: this,
                                    tokenString: tokenString
                                });
                            }
                        })
                        .catch(() => {});
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .order {
        width: calc(100% - 20px);
        height: calc(100% - 90px);
        padding: 30px 10px 10px;
        .isLogin {
            width: 150px;
            height: 180px;
            margin: auto;
            margin-top: 120px;
            .image {
                width: calc(100% - 20px);
                height: 130px;
                padding: 10px;
            }
            p {
                font-size: 14px;
                text-align: center;
                text-decoration: underline;
                color: #fa9ba7;
            }
        }
        .van-nav-bar {
            background: transparent;
            // border-bottom:1px solid #bbb8b8;
        }
        .van-nav-bar__title {
            color: #343333;
            font-size: 18px;
            font-weight: bold;
        }
        /deep/.van-tabs__line {
            background-color: #fa9da5;
        }
        .van-tag {
            font-size: 10px;
        }

        .order-list {
            width: calc(100% - 20px);
            height: calc(100% - 57px);
            margin-top: 10px;
            padding: 10px;
            overflow-y: auto;
            .indent {
                width: calc(100% - 20px);
                background-color: #fff;
                border-radius: 10px;
                overflow: hidden;
                padding: 10px;
                margin-bottom: 10px;
                box-shadow: 1px 1px 5px 0px #dbdbdb;
                .indTop {
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 10px;
                    .indent-count {
                        margin-left: 10px;
                        font-size: 15px;
                    }
                    .finish {
                        color: #5c5c5c;
                        line-height: 20px;
                    }
                    .delete {
                        margin-left: 3px;
                        font-size: 16px;
                    }
                    .van-icon-delete {
                        line-height: 21px;
                    }
                }
                .indent-message {
                    display: flex;
                    padding: 10px 0;
                    .left {
                        width: 80%;
                        .img {
                            width: 50px;
                            height: 50px;
                            border-radius: 10px;
                            overflow: hidden;
                            margin-right: 10px;
                        }
                        .message {
                            height: 50px;
                            p {
                                height: 50%;
                                font-size: 15px;
                                // font-weight:bold;
                                line-height: 25px;
                            }
                            span {
                                font-size: 11px;
                                color: #343333;
                            }
                        }
                    }
                    .right {
                        width: 20%;
                        span {
                            line-height: 50px;
                            float: right;
                            font-size: 11px;
                            color: #adadad;
                        }
                    }
                }
                .index-Time {
                    padding: 10px 0;
                    display: flex;
                    .time,
                    .allPrice {
                        width: 60%;
                    }
                    .time {
                        color: #939393;
                    }
                    .allPrice {
                        font-size: 11px;
                        text-align: right;
                        span:first-child {
                            margin-right: 5px;
                        }
                    }
                }
                .van-button--mini {
                    width: 65px;
                    height: 25px;
                    line-height: 25px;
                    float: right;
                }
            }
        }
    }
</style>