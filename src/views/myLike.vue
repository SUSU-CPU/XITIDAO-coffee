<template>
    <div class="my-like">
        <div class="like-top">
            <van-nav-bar
                title="我的收藏"
                left-text="返回"
                left-arrow
                :border="false"
                @click-left="onClickLeft"
                class="nav"
            />
        </div>
        <template v-if="allLikeProduct.length > 0">
            <div class="like-bottom clear">
                <van-list
                    finished-text="没有更多商品喽!!!"
                    :finished="isFinished"
                    v-model="isLoading"
                    @load="loadData"
                >
                    <van-swipe-cell v-for="(item,index) in likeProduct" :key="index">
                        <div class="like-product fl" @click="goDetail(item)">
                            <div class="proTop">
                                <img class="auto-img" :src="item.smallImg" />
                            </div>
                            <div class="proBottom">
                                <div class="name">
                                    <p class="chName">{{item.name}}</p>
                                    <p class="enName">{{item.enname}}</p>
                                </div>
                                <div class="likeIcon">
                                    <van-icon name="like" @click.stop="cancelLike(index,item)" />
                                </div>
                            </div>
                        </div>
                    </van-swipe-cell>
                </van-list>
            </div>
        </template>
        <template v-else>
            <div class="isLogin" v-if="isLogin">
                <div class="image">
                    <img class="auto-img" :src="require('../assets/my/like.png')" />
                </div>
                <p class="text" @click="goPage('Menu')">没有商品,快去逛逛</p>
            </div>
            <div class="isLogin" v-else>
                <div class="image">
                    <img class="auto-img" :src="require('../assets/my/like.png')" />
                </div>
                <p class="text" @click="goPage('Login')">登录查看详情...</p>
            </div>
        </template>
    </div>
</template>

<script>
    import { Utile } from "../Utils/Utilse";
    import { mapState } from "vuex";
    export default {
        name: "MyLike",
        data() {
            return {
                isLoading: false
            };
        },
        created() {
            this.$store.commit("LikeModule/emptyData");
            let tokenString = localStorage.getItem("_t");
            this.$toast.loading({
                forbidClick: true,
                duration: 0,
                message: "加载中..."
            });
            if (tokenString != "..") {
                this.axios({
                    method: "GET",
                    url: "/findAllLike",
                    params: {
                        appkey: this.appkey,
                        tokenString
                    }
                })
                    .then(result => {
                        this.$toast.clear()
                        if (result.data.code == 2000) {
                            this.$store.commit(
                                "LikeModule/addLikeProduct",
                                result.data.result
                            );
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
                    .catch(error => {
                        
                    });
            }
        },
        computed: {
            ...mapState("LikeModule", [
                "likeProduct",
                "allLikeProduct",
                "isShow",
                "isFinished"
            ]),
            isLogin() {
                return this.$store.state.isLogin;
            }
        },
        methods: {
            goPage(routeName) {
                this.$router.push({ name: routeName });
                // if (routeName == "Menu") {
                //     this.$store.commit("MainModule/changeActive", 1);
                // }
            },
            // 返回我的页面
            onClickLeft() {
                this.$router.go(-1);
            },
            // 懒加载购物车商品数据
            loadData() {
                setTimeout(() => {
                    
                    this.isLoading = false;
                    
                    if (this.likeProduct.length >= this.allLikeProduct.length) {
                        //没有数据可加载
                        this.$store.commit("LikeModule/changeData", {
                            key: "isFinished",
                            value: true
                        });
                        return;
                    }

                    this.$store.commit("LikeModule/loadShopcartData");
                }, 1000);
            },
            // 取消收藏商品
            cancelLike(index, item) {
                let tokenString = localStorage.getItem("_t");
                // 改变数据
                this.$store.commit("LikeModule/deleteLike", index);
                this.$toast.loading({
                forbidClick: true,
                duration: 0,
                message: "取消中..."
            });
                // 发起请求
                this.axios({
                    url: "notlike",
                    method: "POST",
                    data: {
                        appkey: this.appkey,
                        pid: item.pid,
                        tokenString
                    },
                    transformRequest: Utile.transformRequest
                })
                    .then(result => {
                        this.$toast.clear()
                        if (result.data.code == 900) {
                            this.$toast(result.data.msg);
                        }
                    })
                    .catch(error => {
                        
                    });
            },
            // 查看详情
            goDetail(item) {
                this.$router.push({ name: "Detail", params: { pid: item.pid } });
            }
        }
    };
</script>

<style lang="less" scoped>
    .my-like {
        width:calc(100% - 20px);
        padding:20px 10px 10px;
        height: calc(100% - 30px);
        /deep/.van-nav-bar__text,
        /deep/.van-nav-bar .van-icon {
            color: #fa9da5;
        }
        .van-list {
            margin-top: 50px;
        }
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
        .like-top {
            width: 100%;
            background: #fff;
            border-radius: 10px;
            position: fixed;
            left: 0;
            right: 0;
            top: 20px;
            z-index: 2;
        }
        .like-bottom {
            margin-top: 10px;
            height: calc(100% - 46px);
            border-radius: 10px;
            background: #fff;
            .van-swipe-cell {
                width: calc((100% / 2) - 30px);
                padding: 15px;
                display: inline-block;
                .proTop {
                    border-radius: 10px;
                    overflow: hidden;
                }
                .proBottom {
                    width: 100%;
                    display: flex;
                    .name {
                        width: 80%;
                        p {
                            margin-top: 8px;
                        }
                        .chName {
                            font-size: 16px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            color: #343333;
                            font-weight: bold;
                        }
                        .enName {
                            font-size: 13px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            color: #5c5c5c;
                            font-weight: bold;
                        }
                    }
                    .likeIcon {
                        width: 20%;
                        font-size: 20px;
                        text-align: center;
                        margin-top: 33px;
                        color: red;
                    }
                }
            }
        }
        .noProduct {
            width: 100%;
            position: fixed;
            top: 0;
            bottom: 0;
            text-align: center;
            line-height: 667px;
        }
    }
</style>