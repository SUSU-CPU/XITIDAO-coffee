<template>
    <div class="boutique">
        <van-nav-bar title="精品推荐" left-text="返回" left-arrow @click-left="onClickLeft" />
        <div class="boutiqueList">
            <van-grid :border="false" :column-num="2" :gutter="10">
                <van-grid-item
                    v-for="(item,index) in product"
                    :key="index"
                    @click="toIndent(item.pid)"
                >
                    <van-image :src="item.smallImg" />
                    <div class="name">
                        <p class="ch-name">{{item.name}}</p>
                        <p class="en-name">{{item.enname}}</p>
                    </div>
                </van-grid-item>
            </van-grid>
        </div>
    </div>
</template>

<script>
    import { mapState } from "vuex";
    export default {
        name: "Boutique",
        data() {
            return {};
        },
        created() {
            this.getProducts();
        },
        computed: {
            ...mapState("BoutiqueModule", ["product"])
        },
        methods: {
            // 初始化人气Top数据
            getProducts() {
                this.$toast.loading({
                    forbidClick: true,
                    duration: 0,
                    message: "加载中..."
                });
                this.axios({
                    method: "GET",
                    url: "/typeProducts",
                    params: {
                        appkey: this.appkey,
                        key: "isHot",
                        value: 1
                    }
                })
                    .then(result => {
                        if (result.data.code == 500) {
                            this.$store.commit("BoutiqueModule/changeData", {
                                key: "product",
                                value: result.data.result
                            });
                            this.$toast.clear();
                        }
                    })
                    .catch(error => {});
            },
            onClickLeft() {
                this.$router.go(-1);
            },
            toIndent(pid) {
                this.axios({
                    url: "/productDetail",
                    method: "GET",
                    params: {
                        appkey: this.appkey,
                        pid
                    }
                })
                    .then(result => {
                        if (result.data.code == 600) {
                            this.$router.push({
                                name: "Detail",
                                params: { pid }
                            });
                            // this.$store.commit("MainModule/changeActive", 1);
                        }
                    })
                    .catch(() => {});
            }
        }
    };
</script>

<style lang="less" scoped>
    @color: #f7a2ad;
    .van-nav-bar {
        position: fixed;
        top: 20px;
        left: 0;
        right: 0;
    }
    /deep/.van-nav-bar__text,
    /deep/.van-nav-bar .van-icon {
        color: @color;
    }
    .van-image {
        width: calc(100% - 10px);
        height: calc(100% - 10px);
        padding: 5px;
    }
    /deep/.van-grid-item__content--center {
        border-radius: 10px;
        overflow: hidden;
    }
    .name {
        width: 100%;
        .ch-name {
            margin: 5px 0;
            font-size: 16px;
            text-align: left;
        }
        .en-name {
            color: #5c5c5c;
            font-size: 15px;
        }
    }

    .boutique {
        width: calc(100% - 20px);
        height: calc(100% - 30px);
        padding: 20px 10px 10px;
        .boutiqueList {
            margin-top: 50px;
        }
    }
</style>