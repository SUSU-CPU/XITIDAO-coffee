<template>
    <div class="menu">
        <!-- 标题 -->
        <div class="MenuTitle">
            <h2>咖啡与小食系列</h2>
        </div>

        <!-- 轮播 -->
        <div class="menu_banner">
            <van-swipe
                :autoplay="3000"
                :indicator-color="'#893e23'"
                :height="145"
                :show-indicators="false"
            >
                <van-swipe-item v-for="(item, index) in images" :key="index">
                    <img class="auto-img images" v-lazy="item.bannerImg" />
                </van-swipe-item>
            </van-swipe>
        </div>

        <!-- 商品分类 -->
        <div class="product-list clear">
            <!-- 商品分类 -->
            <div class="classify fl">
                <span
                    :class="item.isActive?'active':''"
                    v-for="(item,index) in type"
                    :key="index"
                    @click="cutClassify(item,index,$event)"
                >
                    {{item.typeDesc}}
                    <van-tag type="danger" class="disCount" v-show="item.isDisCount">{{item.msg}}</van-tag>
                </span>
            </div>

            <!-- 商品列表 -->
            <div class="product fr">
                <div class="proList">
                    <div class="proTitle">
                        <div class="title">{{typeName}}</div>
                        <div class="cut-off"></div>
                    </div>
                    <van-list
                        finished-text="没有更多商品喽!!!"
                        :finished="isFinished"
                        v-model="isLoading"
                        @load="loadData"
                    >
                        <van-swipe-cell v-for="(item,index) in product" :key="index">
                            <div class="coffeeShop" @click="cutIndent(item.pid)">
                                <div class="images">
                                    <img class="auto-img" :src="item.smallImg" />
                                </div>
                                <div class="proMsg">
                                    <div class="msgTop">
                                        <p class="chName">{{item.name}}</p>
                                        <p class="enName">{{item.enname}}</p>
                                    </div>
                                    <div class="msgBottom clear">
                                        <div class="fl">
                                            <span class="nowPrice">￥{{item.price}}</span>
                                            <!-- <span class="oldPrice">{{item.old_price}}</span> -->
                                        </div>
                                        <div class="fr">
                                            <div class="addShop">
                                                <img
                                                    class="auto-img"
                                                    :src="require('../../assets/product/add.png')"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </van-swipe-cell>
                    </van-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from "vuex";
    export default {
        name: "Menu",
        data() {
            return {
                isLoading: false,
                Login: false
            };
        },
        computed: {
            images() {
                return this.$store.state.MainModule.banner;
            },
            type() {
                return this.$store.state.MainModule.type;
            },
            //菜单页面是否加载过
            menuIsLoaded() {
                return this.$store.state.menuIsLoaded;
            },
            ...mapState("MainModule", [
                "isFinished",
                "allProduct",
                "product",
                "typeName"
            ])
        },
        created() {
            if (this.$route.name == "Menu") {
                this.$store.commit("MainModule/changeData", {
                    key: "active",
                    value: 1
                });
            }
            if (this.menuIsLoaded) {
                //如果请求过，不再请求
                return;
            }
            //加载提示
            this.$toast.loading({
                forbidClick: true,
                duration: 0,
                message: "加载中..."
            });

            // 获取banner图
            // this.getBanner();
            // 获取商品分类
            this.getType();

            this.$store.commit("changeData", { key: "menuIsLoaded", value: true });
        },
        methods: {
            // 懒加载购物车商品数据
            loadData() {
                setTimeout(() => {
                    this.isLoading = false;
                    if (this.product.length >= this.allProduct.length) {
                        //没有数据可加载
                        this.$store.commit("MainModule/changeData", {
                            key: "isFinished",
                            value: true
                        });
                        return;
                    }

                    this.$store.commit("MainModule/loadShopcartData");
                }, 1000);
            },
            // 点击侧边栏切换商品栏
            cutClassify(item, index, e) {
                // 切换列表
                if (item.isActive) {
                    return;
                }
                // 复制type数据
                let types = this.type.concat();
                // 遍历
                for (let i = 0; i < types.length; i++) {
                    if (types[i].isActive) {
                        types[i].isActive = false;
                        break;
                    }
                }

                types[index].isActive = true;

                this.$store.commit("MainModule/setBanner", types);

                this.$store.commit("MainModule/emptyData");

                this.getProducts(item);
            },
            // 点击商品跳转到订单页
            cutIndent(pid) {
                // index:商品分类下标
                //detailIndex:分类目录下的商品下标
                this.$router.push({
                    name: "Detail",
                    params: { pid }
                });
            },
            // 商品分类
            getType() {
                this.axios({
                    method: "GET",
                    url: "/type",
                    params: {
                        appkey: this.appkey
                    }
                })
                    .then(result => {
                        let types = result.data.result;

                        //添加一个isActive, 用于判断激活标签
                        types.forEach(v => {
                            v.isActive = false;
                        });

                        types.unshift({
                            type: "isHot",
                            typeDesc: "人气Top",
                            isActive: true
                        });

                        if (result.data.code == 400) {
                            this.$store.commit("MainModule/setType", types);
                            this.getProducts(this.type[0]);
                            this.$toast.clear();
                        }
                    })
                    .catch(error => {});
            },
            // 初始化人气Top数据
            getProducts(item) {
                let params = {
                    appkey: this.appkey
                };
                if (item.type == "isHot") {
                    params.key = item.type;
                    params.value = 1;
                } else {
                    params.key = "type";
                    params.value = item.type;
                }
                this.$store.commit("MainModule/changeData", {
                    key: "typeName",
                    value: item.typeDesc
                });
                this.axios({
                    method: "GET",
                    url: "/typeProducts",
                    params
                })
                    .then(result => {
                        if (result.data.code == 500) {
                            this.$store.commit("MainModule/changeData", {
                                key: "allProduct",
                                value: result.data.result
                            });
                        }
                    })
                    .catch(error => {});
            }
        }
    };
</script>

<style lang="less" scoped>
    .menu {
        height: calc(100% - 90px);
        padding: 20px 10px 10px;
        .MenuTitle {
            h2 {
                margin: 10px;
                text-align: center;
                color: #343333;
                font-size: 22px;
            }
        }
        .menu_banner {
            border-radius: 15px;
            overflow: hidden;
            img {
                height: 100%;
            }
        }
        .product-list {
            width: 100%;
            height: calc(100% - 195px);
            margin-top: 10px;
            .classify {
                width: 28%;
                height: 100%;
                background: #fff;
                border-radius: 8px;
                overflow-y: auto;
                box-shadow: 0px 0px 10px 0px #ddd;
                > span {
                    width: 100%;
                    height: 50px;
                    display: block;
                    text-align: center;
                    font-size: 15px;
                    color: #5c5c5c;
                    line-height: 50px;
                    position: relative;
                    border-bottom: 1px solid #e5e5e5;
                    &.active {
                        background: #faf5f5;
                        font-weight: bold;
                        color: #343333;
                    }
                    .disCount {
                        position: absolute;
                        right: 0;
                        top: 0;
                    }
                }
                > span:last-child {
                    border-bottom: none;
                }
            }
            .product {
                width: 70%;
                height: 100%;
                margin-left: auto;
                overflow-y: auto;
                transition: all 3s;
                .proList {
                    width: calc(100% - 20px);
                    // height: 50px;
                    border-radius: 8px;
                    margin-bottom: 5px;
                    background: #fff;
                    padding: 10px;
                    box-shadow: 0px 0px 8px 0px #ddd;
                    .proTitle {
                        display: flex;
                        .title {
                            font-size: 15px;
                            font-weight: bold;
                            color: #343333;
                            width: 30%;
                        }
                        .cut-off {
                            width: 70%;
                            height: 1px;
                            margin-top: 11px;
                            background: #5c5c5c;
                        }
                    }
                }
                .coffeeShop {
                    margin-top: 10px;
                    width: 100%;
                    display: flex;
                    .images {
                        width: 70px;
                        border-radius: 10px;
                        overflow: hidden;
                        border: 1px solid #ddd;
                    }
                    .proMsg {
                        margin-left: 8px;
                        width: calc(100% - 70px);
                        .msgTop {
                            height: 70%;
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
                            .enName {
                                font-weight: bold;
                                color: #5c5c5c;
                            }
                        }
                        .msgBottom {
                            height: 30%;
                            .nowPrice {
                                color: red;
                                font-weight: bold;
                                font-size: 15px;
                                margin-right: 3px;
                            }
                            .oldPrice {
                                color: #5c5c5c;
                                text-decoration: line-through;
                            }
                            .addShop {
                                width: 20px;
                                height: 20px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>