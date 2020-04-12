<template>
    <div class="submit-order">
        <van-nav-bar title="确认订单" left-arrow @click-left="onClickLeft" />
        <van-submit-bar :price="submitDesc.total * 100" button-text="提交订单" @submit="onSubmit" />
        <div class="order">
            <div class="product">
                <div class="product-top">
                    <van-cell center v-model="text">
                        <template #right-icon>
                            <van-switch v-model="checked" size="24" @change="changeSwitch" />
                        </template>
                    </van-cell>
                    <div class="address" v-show="checked" @click="changeSwitch">
                        <span>{{addressData.name}}&nbsp;{{addressData.phone}}</span>
                        <p>{{addressData.address}}</p>
                    </div>
                </div>
                <div class="product-list">
                    <div class="list" v-for="(item,index) in SubmitProduct" :key="index">
                        <div class="left">
                            <div class="img fl">
                                <img class="auto-img" :src="item.small_img" />
                            </div>
                            <div class="message fl">
                                <p>{{item.name}}</p>
                                <span>{{item.rule}}</span>
                            </div>
                        </div>
                        <div class="right">
                            <div class="count">
                                <span>X{{item.count}}</span>
                            </div>
                            <div class="price">￥{{item.price}}</div>
                        </div>
                    </div>
                    <div class="packing-fee" v-show="checked">
                        <span>配送费</span>
                        <span>￥0</span>
                    </div>
                    <div class="end clear">
                        <div class="total fr">
                            <span class="count">共{{submitDesc.count}}件</span>
                            <span>小计</span>
                            <span class="allPrice">￥{{submitDesc.total}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <van-action-sheet v-model="show" title="选择收货地址">
            <van-address-list
                v-model="chosenAddressId"
                :list="list"
                default-tag-text="默认"
                @add="onAdd"
                @select="selectAddress"
            />
        </van-action-sheet>
    </div>
</template>

<script>
    import { Utile } from "../Utils/Utilse";
    import { mapState } from "vuex";
    export default {
        name: "SubmitOrder",
        data() {
            return {
                checked: false,
                text: "自提",
                show: false,
                chosenAddressId: "1"
            };
        },
        computed: {
            ...mapState("SubmitModule", [
                "SubmitProduct",
                "submitDesc",
                "addressData",
                "list",
                "sids"
            ])
        },
        created() {
            // 获取sid
            let sids = this.$route.query.sids;
            sids = sids.split("-");
            this.$store.commit("SubmitModule/changeData", {
                key: "sids",
                value: sids
            });
            this.creatProduct(sids);
        },
        methods: {
            onClickLeft() {
                this.$router.go(-1);
            },
            // 初始化商品数据
            creatProduct(sids) {
                let tokenString = localStorage.getItem("_t");
                this.axios({
                    method: "GET",
                    url: "/commitShopcart",
                    params: {
                        appkey: this.appkey,
                        tokenString,
                        sids: JSON.stringify(sids)
                    }
                })
                    .then(result => {
                        
                        if (result.data.code == 50000) {
                            this.$store.commit("SubmitModule/changeData", {
                                key: "SubmitProduct",
                                value: result.data.result
                            });

                            result.data.result.forEach(v => {
                                this.submitDesc.count += v.count;
                                this.submitDesc.total += v.count * v.price;
                            });
                        }
                    })
                    .catch(() => {
                        
                    });
            },
            // 结算订单
            onSubmit() {
                let tokenString = localStorage.getItem("_t");
                //加载提示
                this.$toast.loading({
                    forbidClick: true,
                    duration: 0,
                    message: "结算中..."
                });
                this.axios({
                    url: "/pay",
                    method: "POST",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        sids: JSON.stringify(this.sids),
                        phone: this.addressData.phone,
                        address: this.addressData.address,
                        reciever: this.addressData.name
                    },
                    transformRequest: Utile.transformRequest
                })
                    .then(result => {
                        
                        this.$toast.clear();
                        this.$router.push({ name: "Indent" });
                        // this.$store.commit("MainModule/changeActive", 2);
                    })
                    .catch(() => {
                        this.$toast.clear();
                        
                    });
            },
            selectAddress(item) {
                
                this.show = false
                this.addressData.phone = item.tel;
                this.addressData.name = item.name;
                this.addressData.address = item.address;
            },
            changeSwitch() {
                let tokenString = localStorage.getItem("_t");
                if (this.checked) {
                    this.text = "外送";
                    this.show = true;
                    this.axios({
                        url: "/findAddress",
                        method: "GET",
                        params: {
                            appkey: this.appkey,
                            tokenString
                        }
                    })
                        .then(result => {
                            
                            let list = [];
                            result.data.result.forEach((v, i) => {
                                let address = {
                                    id: i + "",
                                    name: v.name,
                                    tel: v.tel,
                                    address:
                                        v.province +
                                        v.city +
                                        v.county +
                                        v.addressDetail,
                                    isDefault: Boolean(v.isDefault)
                                };

                                list.push(address);
                                if (v.isDefault == 1) {
                                    this.addressData.phone = v.tel;
                                    this.addressData.name = v.name;
                                    this.addressData.address = address.address;
                                    this.chosenAddressId = i + "";
                                }
                            });
                            this.$store.commit("SubmitModule/changeData", {
                                key: "list",
                                value: list
                            });
                        })
                        .catch(() => {
                            
                        });
                } else {
                    this.text = "自提";
                }
            },
            // 新增地址
            onAdd() {
                this.$router.push({ name: "AddLocal", query: { isAdd: 1 } });
            }
        }
    };
</script>

<style lang="less" scoped>
    .style {
        width: calc(100% - 20px);
        padding: 10px;
        background-color: #fff;
        border-radius: 10px;
        margin-bottom: 10px;
    }
    /deep/.van-address-item .van-radio__icon--checked .van-icon {
        background-color: #fa9ba7;
        border-color: #fa9ba7;
    }
    /deep/.van-nav-bar .van-icon{
        color: #fa9ba7;

    }
    .van-icon-edit::before {
        content: "";
    }
    .van-address-item__value {
        padding-right: 0;
    }
    .van-button--danger {
        background-color: #fa9ba7;
        border-color: #fa9ba7;
        font-size: 17px;
    }
    /deep/.van-nav-bar {
        background: transparent;
    }
    .van-nav-bar .van-icon {
        color: #343333;
        font-size: 20px;
    }
    .van-submit-bar__text {
        text-align: left;
    }
    .van-submit-bar__button--danger {
        background: linear-gradient(to right, #fa9ba7, #fa9ba7);
    }
    .van-submit-bar__bar {
        border-top: 1px solid #ddd;
        box-shadow: 0px -1px 16px px #ddd;
    }
    .van-cell__value--alone {
        font-size: 16px;
        font-weight: bold;
        color: #fa9ba7;
    }
    .van-cell {
        padding: 5px 0;
    }
    .van-switch {
        background: #fcf0f0;
    }
    .van-switch--on {
        background: #fa9ba7;
    }
    .van-popup--bottom.van-popup--round {
        height: 70%;
    }
    .van-action-sheet__content {
        height: calc(100% - 44px);
        .local {
            width: calc(100% - 20px);
            height: calc(100% - 70px);
            padding: 10px;
            overflow: hidden;
            .local-list {
                width: calc(100% - 20px);
                padding: 10px;
                border-bottom: 1px solid #c1c1c1;
                div {
                    height: 25px;
                    line-height: 25px;
                }
                .local-top {
                    font-size: 16px;
                    font-weight: bold;
                    span {
                        margin-right: 10px;
                    }
                }
                .local-bottom {
                    font-size: 14px;
                    color: #9b9b9b;
                }
            }
            .addLocal {
                width: calc(100% - 40px);
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                margin: 5px auto;
                border-radius: 10px;
                overflow: hidden;
                .van-button--default {
                    font-size: 18px;
                    color: #fff;
                    background: linear-gradient(to right, #fa9ba7, #fa9ba7);
                }
            }
        }
    }
    .submit-order {
        width: calc(100% - 20px);
        height: calc(100% - 30px);
        padding:20px 10px 10px;
        .order {
            // width: calc(100% - 20px);
            height: calc(100% - 100px);
            // padding: 10px;
            overflow-y: auto;
            .product {
                .product-top {
                    .style;
                }
                .product-list {
                    .style;
                }
                .address {
                    width: calc(100% - 10px);
                    padding: 10px 10px 0;
                    font-size: 14px;
                    color: #5c5c5c;
                    p {
                        margin-top: 5px;
                    }
                }
                .packing-fee {
                    width: calc(100% - 20px);
                    padding: 10px 10px;
                    font-size: 14px;
                    font-weight: bold;
                    span {
                        display: inline-block;
                        width: 50%;
                    }
                    span:first-child {
                        text-align: left;
                    }
                    span:last-child {
                        text-align: right;
                    }
                }
                .list {
                    width: calc(100% - 20px);
                    padding: 0 10px 10px;
                    display: flex;
                    .left,
                    .right {
                        height: 100%;
                    }
                    .left {
                        width: 70%;

                        .img {
                            width: 50px;
                            height: 50px;
                            border-radius: 10px;
                            overflow: hidden;
                        }
                        .message {
                            height: 50px;
                            margin-left: 10px;
                            p {
                                margin: 0;
                                height: 55%;
                                font-size: 15px;
                                line-height: 33px;
                                font-weight: bold;
                            }
                            span {
                                font-size: 11px;
                                color: #bcbcbc;
                            }
                        }
                    }
                    .right {
                        width: 30%;
                        height: 50px;
                        div {
                            width: 100%;
                            height: 50%;
                            // float: left;
                            text-align: right;
                            line-height: 25px;
                        }
                        div:first-child {
                            color: #bcbcbc;
                        }
                        div:last-child {
                            font-size: 15px;
                            font-weight: bold;
                        }
                    }
                }
                .end {
                    width: calc(100% - 20px);
                    padding: 10px 10px 0;
                    border-top: 1px solid #c3c2c2;
                    .allPrice {
                        font-size: 14px;
                        font-weight: bold;
                    }
                    span {
                        display: inline-block;
                        min-width: 50px;
                        text-align: right;
                    }
                }
            }
        }
    }
</style>