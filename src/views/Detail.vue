<template>
    <div class="detail">
        <div class="detail-top">
            <div class="image">
                <div class="nav">
                    <div class="fl">
                        <van-icon :name="isCollect?'like':'like-o'" @click="collect" />
                    </div>
                    <div class="fr" @click="cutMenu">
                        <van-icon name="cross" />
                    </div>
                </div>
                <div class="product-img">
                    <img :src="productDetail.large_img" class="auto-img" />
                </div>
            </div>
            <!-- 商品详情 -->
            <div class="product-detail">
                <!-- 名称 -->
                <div class="detile-title">
                    <p class="ch-name">{{productDetail.name}}</p>
                    <p class="en-name">{{productDetail.enname}}</p>
                </div>
                <!-- 选择口味 -->
                <div class="taste">
                    <div class="options clear" v-for="(item,i) in rules" :key="i">
                        <div class="fl type">
                            <span>{{item.title}}</span>
                        </div>
                        <div class="fl">
                            <van-tag
                                round
                                size="large"
                                :class="val.isActive?'active':'select'"
                                v-for="(val,index) in item.rule"
                                :key="index"
                                @click="cutOptions(val,i)"
                            >{{val.text}}</van-tag>
                        </div>
                    </div>
                </div>

                <!-- 商品介绍 -->
                <div class="introuce">
                    <p class="title">商品详情</p>
                    <div class="text">
                        <p v-for="(item,index) in desc" :key="index">{{item}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="detail-bottom">
            <div class="shop-car">
                <div class="top-car clear">
                    <div class="fl price">
                        <p class="actual_price">￥{{productDetail.price}}</p>
                        <p class="describe">{{productDetail.name}}￥{{productDetail.price}}*{{count}}</p>
                    </div>
                    <div class="fr sum">
                        <div class="stepper">
                            <div class="fl sub" @click="sub">
                                <img :src="require('../assets/product/sub.png')" class="auto-img" />
                            </div>
                            <div class="fl count">{{count}}</div>
                            <div class="fr sum" @click="sum">
                                <img :src="require('../assets/product/add.png')" class="auto-img" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom-car clear">
                    <div class="fr">
                        <van-button
                            class="button"
                            round
                            type="info"
                            size="small"
                            color="linear-gradient(to right, #F7C2C8, #FA9BA7)"
                            @click="addShop"
                        >加入购物车</van-button>
                    </div>
                    <div class="fr">
                        <van-button
                            class="button"
                            round
                            plain
                            type="info"
                            size="small"
                            color="#FA9BA7"
                            @click="buyNow"
                        >立即购买</van-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from "vuex";
    import { Utile } from "../Utils/Utilse";
    export default {
        name: "Detail",
        data() {
            return {
                Login: false
            };
        },
        computed: {
            ...mapState("DetailModule", [
                "productDetail",
                "rules",
                "desc",
                "count",
                "isCollect"
            ])
        },
        created() {
            //加载提示
            this.$toast.loading({
                forbidClick: true,
                duration: 0,
                message: "加载中..."
            });

            //  先置空再请求
            this.$store.commit("DetailModule/emptyData");

            let pid = this.$route.params.pid;

            this.axios({
                url: "/productDetail",
                method: "GET",
                params: {
                    appkey: this.appkey,
                    pid
                }
            })
                .then(regest => {
                    if (regest.data.code == 600) {
                        this.$toast.clear();
                        this.$store.commit(
                            "DetailModule/processingData",
                            regest.data.result[0]
                        );
                        this.Login = true;
                    } else if (result.data.code == 700) {
                        this.Login = false;
                    }
                })
                .catch(error => {
                    this.$toast.clear();
                });

            // 查看是否收藏商品
            this.findlike(pid);
        },

        methods: {
            // 点击关闭按钮跳转到菜单
            cutMenu() {
                this.$router.push({ name: "Menu" });
            },
            // 选择口味
            cutOptions(item, index) {
                // 如果当前点击类型已激活，直接终止程序
                if (item.isActive) {
                    return;
                }

                let rules = this.rules[index];

                for (let i = 0; i < rules.rule.length; i++) {
                    if (rules.rule[i].isActive) {
                        rules.rule[i].isActive = false;
                        break;
                    }
                }

                item.isActive = true;
            },
            sum() {
                this.$store.commit("DetailModule/sumCount");
            },
            sub() {
                this.$store.commit("DetailModule/subCount");
            },
            // 加入购物车
            addShop(type) {
                let rules = this.rules;
                let tokenString = localStorage.getItem("_t");
                if (tokenString == null) {
                    this.$toast("请先登录");
                    this.$router.push({ name: "Login" });
                    return;
                }
                let taste = "";
                rules.forEach((val, i) => {
                    val.rule.forEach(v => {
                        if (v.isActive) {
                            taste += v.text + "/";
                        }
                    });
                });
                taste = taste.slice(0, -1);

                this.axios({
                    url: "/addShopcart",
                    method: "POST",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        count: this.count,
                        rule: taste,
                        pid: this.productDetail.pid
                    },
                    transformRequest: Utile.transformRequest
                })
                    .then(result => {
                        if (result.data.code == 700) {
                            this.$toast("请先登录");
                            return;
                        }
                        if (type == "buy") {
                            this.$router.push({
                                name: "Submit",
                                query: { sids: result.data.sid }
                            });
                        } else {
                            // 返回菜单页
                            this.$router.push({ name: "Menu" });
                            this.$toast(result.data.msg);
                        }
                    })
                    .catch(error => {});
            },
            // 立即购买
            buyNow() {
                this.addShop("buy");
            },
            // 查看当前商品是否被收藏
            findlike(pid) {
                let tokenString = localStorage.getItem("_t");

                this.axios({
                    url: "/findlike",
                    method: "GET",
                    params: {
                        pid,
                        tokenString,
                        appkey: this.appkey
                    }
                }).then(result => {
                    if (result.data.code == 1000) {
                        this.$store.commit("DetailModule/changeData", {
                            key: "isCollect",
                            value: result.data.result.length > 0
                        });
                    }
                });
            },
            // 收藏商品
            collect() {
                let tokenString = localStorage.getItem("_t");
                if (tokenString == null) {
                    this.$toast("请先登录");
                    this.$router.push({ name: "Login" });
                    return;
                }
                let url = this.isCollect ? "/notlike" : "/like";
                this.axios({
                    url,
                    method: "POST",
                    data: {
                        appkey: this.appkey,
                        pid: this.productDetail.pid,
                        tokenString
                    },
                    transformRequest: Utile.transformRequest
                })
                    .then(result => {
                        if (result.data.code == 700) {
                            this.$toast("请先登录");
                            return;
                        } else {
                            this.$toast(result.data.msg);
                            this.$store.commit("DetailModule/changeData", {
                                key: "isCollect",
                                value: !this.isCollect
                            });
                        }
                    })
                    .catch(error => {});
            }
        }
    };
</script>

<style lang="less" scoped>
    .detail {
        width: calc(100% - 20px);
        height: calc(100% - 30px);
        padding: 20px 10px 10px;
        .detail-top {
            height: 83%;
            .image {
                position: relative;
                height: 40%;
                overflow: hidden;
                .nav {
                    width: calc(100% - 30px);
                    height: 25px;
                    position: absolute;
                    top: 0;
                    z-index: 2;
                    font-size: 17px;
                    text-align: center;
                    font-weight: bolder;
                    color: #fff;
                    margin: 15px 15px;
                    div {
                        width: 25px;
                        height: 25px;
                        line-height: 30px;
                        border-radius: 50%;
                        background: rgba(13, 3, 15, 0.8);
                    }
                }
            }
            .product-detail {
                width: calc(100% - 20px);
                height: calc((100% - 40%) - 20px);
                padding: 10px;
                overflow-y: auto;
                > div {
                    width: calc(100% - 20px);
                    padding: 10px;
                    background: #fff;
                    border-radius: 10px;
                    margin-bottom: 10px;
                    box-shadow: 0px 0px 12px 0px #ddd;
                }
                > div:last-child {
                    margin-bottom: 0;
                }
                .detile-title {
                    p {
                        margin: 7px;
                    }
                    .ch-name {
                        font-size: 20px;
                        font-weight: bold;
                        color: #343333;
                    }
                    .en-name {
                        font-size: 13px;
                        font-weight: bold;
                        color: #5c5c5c;
                    }
                }
                .options {
                    margin: 10px 0;
                    span {
                        text-align: center;
                    }
                    .type {
                        font-size: 14px;
                    }
                    .select {
                        margin-left: 15px;
                        padding: 5px 15px;
                        height: 15px;
                        color: #343333;
                        background: #f1f3f4;
                    }
                    .active {
                        color: #fa9da5;
                        margin-left: 15px;
                        padding: 5px 15px;
                        height: 15px;
                        background: rgba(247, 195, 200, 0.3);
                        border: 1px solid #fa9da5;
                    }
                }
                .introuce {
                    .title {
                        font-size: 15px;
                        margin-bottom: 5px;
                    }
                }
            }
        }

        .detail-bottom {
            height: calc(17% - 10px);
            width: calc(100% - 20px);
            padding: 10px 10px 0;
            .shop-car {
                width: calc(100% - 20px);
                height: calc(100% - 20px);
                padding: 10px;
                background: #fff;
                border-radius: 10px;
                box-shadow: 0px 0px 12px 0px #ddd;
                .price {
                    width: 70%;
                    height: 100%;
                    .actual_price {
                        font-size: 18px;
                    }
                    .describe {
                        font-size: 12px;
                        color: #898989;
                    }
                }
                .sum {
                    width: 30%;
                    height: 100%;
                    .stepper {
                        width: 100%;
                        height: 30px;
                        margin-top: 4px;
                        .sub,
                        .sum {
                            width: 23px;
                            height: 23px;
                            padding: 3px;
                        }
                        .count {
                            width: calc(100% - 60px);
                            height: 30px;
                            font-size: 15px;
                            text-align: center;
                            line-height: 30px;
                        }
                    }
                }
                .bottom-car {
                    height: calc(100% - 40px);
                    padding-top: 8px;
                    > div:last-child {
                        margin-right: 10px;
                    }
                    .button {
                        width: 110px;
                        height: 37px;
                    }
                }
            }
        }
    }
</style>
<style scoped>
    .text >>> p {
        font-size: 13px;
        color: #525252;
    }
</style>