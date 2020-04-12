<template>
    <div class="shopCar">
        <template v-if="allShopCar.length > 0">
            <div class="top-car">
                <div class="title clear">
                    <span class="tit">饮品与小食订单</span>
                    <span class="label">自提/外送</span>
                    <div class="batch fr" @click="batchProduct">
                        <span>{{!isBatch?'管理':'完成'}}</span>
                    </div>
                </div>

                <div class="banner">
                    <img class="auto-img" :src="require('../../assets/home/bottom_banner.jpg')" />
                </div>
                <!-- 商品订单 -->
                <div class="order">
                    <van-list
                        finished-text="没有更多商品喽!!!"
                        :finished="isFinished"
                        v-model="isLoading"
                        @load="loadData"
                    >
                        <van-swipe-cell v-for="(item, index) in shopCar" :key="index">
                            <div class="coffeeShop">
                                <div class="checkbox">
                                    <van-checkbox
                                        checked-color="#f7c3c8"
                                        class="check"
                                        v-model="item.isChecked"
                                        @click="checked(index)"
                                    ></van-checkbox>
                                </div>
                                <div class="images">
                                    <img class="auto-img" :src="item.small_img" />
                                </div>
                                <div class="proMsg" @click="goPage(item.pid)">
                                    <div class="msgTop">
                                        <p class="chName">{{item.name}}</p>
                                        <p class="checkTaste">
                                            <span>{{item.rule}}</span>
                                        </p>
                                    </div>
                                    <div class="msgBottom clear">
                                        <div class="fl">
                                            <span class="nowPrice">￥{{item.price}}</span>
                                        </div>
                                        <div class="fr">
                                            <div class="addShop">
                                                <div class="stepper clear">
                                                    <div class="fl sub" @click.stop="sub(item)">
                                                        <img
                                                            :src="require('../../assets/product/sub.png')"
                                                            class="auto-img"
                                                        />
                                                    </div>
                                                    <div class="fl count">{{item.count}}</div>
                                                    <div class="fr sum" @click.stop="sum(item)">
                                                        <img
                                                            :src="require('../../assets/product/add.png')"
                                                            class="auto-img"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <template #right>
                                <van-button
                                    square
                                    text="删除"
                                    class="delete-button v-btn"
                                    color="f7382c"
                                    @click="deletePrice(item.sid,index)"
                                />
                            </template>
                        </van-swipe-cell>
                    </van-list>
                </div>
            </div>
            <!-- 提交栏 -->
            <van-submit-bar
                :price="allPrice"
                button-text="提交订单"
                @submit="onSubmit"
                class="submitBox"
                v-show="!isBatch"
                v-if="isLogin"
            >
                <van-checkbox checked-color="#f7c3c8" v-model="allCheck" @click="allChecked">全选</van-checkbox>
                <!-- <template #tip>
                    你的收货地址不支持同城送, <span @click="onClickEditAddress">修改地址</span>
                </template>-->
            </van-submit-bar>
            <!-- 删除栏 -->
            <van-submit-bar
                button-text="删除"
                @submit="removeProduct"
                class="v-submit"
                v-show="isBatch"
            >
                <van-checkbox checked-color="#f7c3c8" v-model="allCheck" @click="allChecked">全选</van-checkbox>
            </van-submit-bar>
        </template>
        <template v-else>
            <div class="isLogin" v-if="isLogin">
                <div class="image">
                    <img class="auto-img" :src="require('../../assets/noThing.png')" />
                </div>
                <p class="text" @click="goRouter('Menu')">没有订单,快去逛逛</p>
            </div>
            <div class="isLogin" v-else>
                <div class="image">
                    <img class="auto-img" :src="require('../../assets/noThing.png')" />
                </div>
                <p class="text" @click="goRouter('Login')">登录查看商品详情...</p>
            </div>
        </template>
    </div>
</template>

<script>
    import { mapState } from "vuex";

    import { Utile } from "../../Utils/Utilse";

    export default {
        name: "ShopCart",
        data() {
            return {
                isLoading: false
            };
        },
        computed: {
            allCheck: {
                get() {
                    return this.$store.state.ShopModule.allCheck;
                },
                set() {}
            },
            isLogin() {
                return this.$store.state.isLogin;
            },
            // 商品总价格
            allPrice() {
                return this.$store.state.ShopModule.allPrice;
            },
            ...mapState("ShopModule", [
                "isFinished",
                "allShopCar",
                "shopCar",
                "isBatch"
            ])
        },
        created() {
            if (this.$route.name == "ShopCart") {
                this.$store.commit("MainModule/changeData", {
                    key: "active",
                    value: 3
                });
            }
            this.$store.commit("ShopModule/emptyData");
            // 获取所有购物车商品
            this.getAllShopcartProduct();
        },
        methods: {
            goPage(pid) {
                this.$router.push({ name: "Detail", params: { pid } });
            },
            goRouter(routerName) {
                this.$router.push({ name: routerName });
                // if(routerName == "Menu"){
                // this.$store.commit("MainModule/changeActive", 1);
                // }
            },
            // 获取购物车所有商品
            getAllShopcartProduct() {
                //获取token字符串
                let tokenString = localStorage.getItem("_t");
                this.$toast.loading({
                    forbidClick: true,
                    duration: 0,
                    message: "加载中..."
                });
                this.axios({
                    method: "GET",
                    url: "/findAllShopcart",
                    params: {
                        appkey: this.appkey,
                        tokenString
                    }
                })
                    .then(result => {
                        this.$toast.clear()
                        if (result.data.code == 5000) {
                            //添加判断勾选的属性

                            result.data.result.forEach(v => {
                                v.isChecked = false;
                            });

                            this.$store.commit("ShopModule/changeData", {
                                key: "allShopCar",
                                value: result.data.result
                            });
                            this.$store.commit("changeData", {
                                key: "isLogin",
                                value: true
                            });
                        } else if (result.data.code == 700) {
                            this.$toast("先去登录再来查看购物车商品吧");
                            this.$store.commit("changeData", {
                                key: "isLogin",
                                value: false
                            });
                        }
                    })
                    .catch(err => {
                        this.$toast.clear()
                    });
            },

            // 懒加载购物车商品数据
            loadData() {
                setTimeout(() => {
                    this.isLoading = false;
                    if (this.shopCar.length >= this.allShopCar.length) {
                        //没有数据可加载
                        this.$store.commit("ShopModule/changeData", {
                            key: "isFinished",
                            value: true
                        });
                        return;
                    }

                    this.$store.commit("ShopModule/loadShopcartData");
                    // 计算商品价格
                    this.$store.commit("ShopModule/allPrice");
                }, 1000);
            },
            // 改变购物车商品数量
            changeShopCount() {
                this.$store.commit("ShopModule/priceCount");
                let count = this.$store.state.ShopModule.count;
                this.$store.commit("MainModule/changeShopCount", count);
            },
            // 修改商品数量
            changeProductCount(sid, count) {
                //获取token字符串
                let tokenString = localStorage.getItem("_t");

                this.axios({
                    method: "POST",
                    url: "/modifyShopcartCount",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        sid,
                        count
                    },
                    transformRequest: Utile.transformRequest
                })
                    .then(result => {})
                    .catch(err => {});
            },
            // 加
            sum(item) {
                ++item.count;
                this.changeProductCount(item.sid, item.count);
                this.$store.commit("ShopModule/allPrice");
                this.changeShopCount();
            },
            // 减
            sub(item) {
                --item.count;
                if (item.count <= 0) {
                    item.count = 1;
                }
                this.changeProductCount(item.sid, item.count);
                this.$store.commit("ShopModule/allPrice");
                this.changeShopCount();
            },
            // 单选点击事件
            checked(index) {
                this.$store.commit("ShopModule/check", index);
                this.$store.commit("ShopModule/allPrice");
            },
            // 多选
            allChecked() {
                this.$store.commit("ShopModule/allChecked");
                this.$store.commit("ShopModule/allPrice");
            },
            //删除商品
            removeShopcart(sids) {
                //加载提示
                this.$toast.loading({
                    forbidClick: true,
                    duration: 0,
                    message: "处理中..."
                });

                //获取token字符串
                let tokenString = localStorage.getItem("_t");
                return this.axios({
                    method: "POST",
                    url: "/deleteShopcart",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        sids
                    },
                    transformRequest: Utile.transformRequest
                });
            },
            // 删除购物车商品
            deletePrice(sid, index) {
                let sids = JSON.stringify([sid]);
                this.removeShopcart(sids)
                    .then(result => {
                        this.$toast.clear();

                        if (result.data.code == 7000) {
                            this.$store.commit("ShopModule/allPrice");
                            this.$store.commit("ShopModule/removeShopcartData", [
                                sid
                            ]);
                            this.changeShopCount();
                            this.$store.commit("ShopModule/check");
                        }
                    })
                    .catch(error => {});
            },
            // 删除多个商品
            removeProduct() {
                let sids = [];
                this.shopCar.forEach(v => {
                    if (v.isChecked) {
                        sids.push(v.sid);
                    }
                });
                if (sids.length == 0) {
                    this.$toast({
                        message: "没有选择商品"
                    });
                    return;
                }
                this.removeShopcart(JSON.stringify(sids))
                    .then(result => {
                        this.$toast.clear();

                        if (result.data.code == 7000) {
                            this.$store.commit(
                                "ShopModule/removeShopcartData",
                                sids
                            );
                            this.changeShopCount();
                            this.$store.commit("ShopModule/allPrice");
                        }
                    })
                    .catch(error => {});
            },
            // 批量管理商品
            batchProduct() {
                this.$store.commit("ShopModule/changeData", {
                    key: "isBatch",
                    value: !this.isBatch
                });
                if (!this.isBatch) {
                    let tokenString = localStorage.getItem("_t");
                    if (tokenString != "..") {
                        this.$store.commit("MainModule/getShopCount", {
                            self: this,
                            tokenString: tokenString
                        });
                    }
                }
            },
            // 提交订单
            onSubmit() {
                let sids = "";
                this.allShopCar.forEach(v => {
                    if (v.isChecked) {
                        sids += v.sid + "-";
                    }
                });
                sids = sids.slice(0, -1);
                if (sids == "") {
                    this.$toast("请选择需要购买的商品");
                    return;
                }
                this.$router.push({ name: "Submit", query: { sids: sids } });
            }
        }
    };
</script>

<style lang="less" scoped>
    .van-submit-bar__button--danger {
        background: linear-gradient(to right, #fa9ba7, #fa9ba7);
    }
    .custom-image {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        /deep/.van-empty__image {
            width: 120px;
            height: ：100px;
        }
        /deep/.van-empty__image img {
            display: block;
            width: 120px;
            height: ：100px;
        }
    }
    .shopCar {
        width: calc(100% - 20px);
        height: calc(100% - 90px);
        padding: 20px 10px 10px;
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
        .v-submit {
            position: fixed;
            bottom: 50px;
            // box-shadow: 0px 0px 15px 0px #ddd;
            .van-checkbox {
                margin-right: auto;
            }
        }
        .top-car {
            width: calc(100% - 20px);
            height: calc(100% - 80px);
            overflow-y: auto;
            padding: 20px 10px 10px;
            border-radius: 10px;
            background: #fff;
            .title {
                padding: 10px 0;
                .tit {
                    font-size: 13px;
                    color: #343333;
                }
                .label {
                    display: inline-block;
                    padding: 0 3px;
                    background: #ff7f8c;
                    color: #fff;
                    font-size: 8px;
                    border-radius: 2px;
                    margin-left: 5px;
                }
                .batch {
                    padding: 0 5px;
                    font-size: 14px;
                    color: #ff7f8c;
                    font-weight: bold;
                }
            }
            .banner {
                border-radius: 10px;
                overflow: hidden;
            }
            .order {
                margin-top: 10px;
                height: calc(100% - 110px);
                overflow-y: auto;
                .delete-button {
                    height: 100%;
                    background: red;
                }
                .van-button::before {
                    top: 0;
                }
                .coffeeShop {
                    padding: 10px 0;
                    width: 100%;
                    overflow: hidden;
                    display: flex;
                    border-top: 1px solid #ddd;
                    position: relative;
                    z-index: 0;

                    .checkbox {
                        width: 25px;
                        height: 70px;
                        position: relative;
                        .check {
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            margin: auto;
                        }
                    }
                    .images {
                        width: 63px;
                        height: 63px;
                        border-radius: 10px;
                        overflow: hidden;
                        margin-top: 4px;
                        border: 1px solid #ddd;
                        > img {
                            height: 100%;
                        }
                    }
                    .proMsg {
                        margin-left: 8px;
                        width: calc(100% - 88px);
                        .msgTop {
                            height: 65%;
                            > p {
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                            }
                            .chName {
                                font-size: 15px;
                                font-weight: bold;
                                color: #343333;
                            }
                            .checkTaste {
                                font-weight: bold;
                                color: #5c5c5c;
                            }
                        }
                        .msgBottom {
                            height: 35%;
                            > div {
                                height: 100%;
                                line-height: 32px;
                            }
                            .nowPrice {
                                color: red;
                                font-weight: bold;
                                font-size: 17px;
                                margin-right: 3px;
                            }
                            .oldPrice {
                                color: #5c5c5c;
                                text-decoration: line-through;
                            }
                            .addShop {
                                .stepper {
                                    width: 100%;
                                    height: 25px;
                                    .sub,
                                    .sum {
                                        width: 21px;
                                        height: 21px;
                                        padding: 3px;
                                    }
                                    .count {
                                        width: 30px;
                                        height: 100%;
                                        font-size: 15px;
                                        text-align: center;
                                        line-height: 25px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .submitBox {
            position: fixed;
            bottom: 50px;
            // box-shadow: 0px -2px 15px 0px #ddd;
        }
    }
</style>