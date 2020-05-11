<template>
    <div class="my">
        <div class="my-nikeName">
            <div class="nike-left" v-if="isShow" @click="goMyData">
                <div class="image">
                    <img class="auto-img" :src="cellInfo.userImg" />
                </div>
                <div class="name">
                    <p>{{cellInfo.nickName}}</p>
                </div>
            </div>
            <div class="nike-left" v-else @click="goLogin">
                <div class="loginOut">
                    <p>立即登录</p>
                </div>
            </div>
            <div class="nike-right" v-if="isShow" @click="goMyData">
                <div class="icon">
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="nike-right" v-else @click="goLogin">
                <div class="icon">
                    <van-icon name="arrow" />
                </div>
            </div>
        </div>
        <div class="my-message">
            <div class="messageBox">
                <div class="mesBottom">
                    <div
                        class="clear"
                        @click="goPage(item)"
                        v-for="(item,index) in listData"
                        :key="index"
                    >
                        <div class="left fl">
                            <div class="leftIcon fl">
                                <img class="auto-img" :src="item.url" />
                            </div>
                            <div class="fl">{{item.text}}</div>
                        </div>
                        <div class="right fr">
                            <div class="icon">
                                <van-icon name="arrow" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="banner">
                <img :src="require('../../assets/home/bottom_banner.jpg')" class="auto-img" />
            </div>
        </div>
    </div>
</template>

<script>
    import { Utile } from "../../Utils/Utilse";
    import { mapState } from "vuex";
    export default {
        name: "My",
        data() {
            return {
                isShow: true,
            };
        },
        created() {
            if (this.$route.name == "My") {
                this.$store.commit("MainModule/changeData", {
                    key: "active",
                    value: 4
                });
            }
            let tokenString = localStorage.getItem("_t");

            this.axios({
                url: "/findMy",
                method: "GET",
                params: {
                    appkey: this.appkey,
                    tokenString
                }
            })
                .then(result => {
                    
                    if (result.data.code == "A001") {
                        this.$store.commit("MyModule/changeData", {
                            key: "cellInfo",
                            value: result.data.result[0]
                        });
                        this.isShow = true;
                        this.$store.commit("changeData", {
                            key: "isLogin",
                            value: true
                        });
                    } else if (result.data.code == 700) {
                        this.isShow = false;
                        this.$store.commit("changeData", {
                            key: "isLogin",
                            value: false
                        });
                    }
                })
                .catch(() => {
                    
                });
        },
        computed: {
            ...mapState("MyModule", ["listData", "cellInfo"]),
            isLogin(){
                return this.$store.state.isLogin
            }
        },
        methods: {
            // 跳转页面
            goPage(item) {
                let tokenString = localStorage.getItem("_t");
                if (this.isLogin) {
                    this.$router.push({ name: item.name });
                } else {
                    this.$toast("请先登录");
                    this.$router.push({ name: "Login" });
                }
            },
            // 跳转到资料管理
            goMyData() {
                this.$router.push({ name: "MyData" });
            },
            // 跳转到登录
            goLogin() {
                this.$router.push({ name: "Login" });
            }
        }
    };
</script>

<style lang="less" scoped>
    .my {
        height: calc(100% - 51px);
        .my-nikeName {
            width: calc(100% - 20px);
            height: 25%;
            padding: 10px;
            display: flex;
            background: #f7c3c8;
            .nike-left {
                width: 60%;
                height: 100%;
                position: relative;
                .image {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    overflow: hidden;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    margin: auto 0;
                }
                .name {
                    height: 35px;
                    position: absolute;
                    left: 80px;
                    top: 0;
                    bottom: 0;
                    margin: auto 0;
                    > p {
                        margin: 0;
                        text-align: center;
                        line-height: 35px;
                        font-size: 20px;
                        color: #fff;
                    }
                }
                .loginOut {
                    height: 35px;
                    position: absolute;
                    left: 20px;
                    top: 0;
                    bottom: 0;
                    margin: auto 0;
                    > p {
                        margin: 0;
                        line-height: 35px;
                        font-size: 22px;
                        color: #fff;
                        font-weight: bold;
                    }
                }
            }
            .nike-right {
                width: 40%;
                height: 100%;
                position: relative;
                .icon {
                    width: 20px;
                    height: 20px;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    right: 10px;
                    margin: auto 0;
                    font-size: 20px;
                    color: #fff;
                    font-weight: bolder;
                }
            }
        }
        .my-message {
            width: calc(100% - 20px);
            height: 75%;
            margin-top: -40px;
            padding: 10px;
            position: relative;
            .messageBox {
                width: calc(100% - 30px);
                height: calc(70% - 20px);
                margin: 0 auto;
                border-radius: 10px;
                background: #fff;
                padding: 10px;
                .mesBottom {
                    width: 100%;
                    height: 100%;
                    div {
                        height: 40px;
                        line-height: 40px;
                        font-size: 14px;
                        .leftIcon {
                            width: 20px;
                            margin-top: 7px;
                            margin-right: 10px;
                        }
                    }
                    .right {
                        .icon {
                            color: #ff808b;
                            font-weight: bold;
                        }
                    }
                }
            }
            .banner {
                width: calc(100% - 30px);
                height: 15%;
                position: absolute;
                bottom: 20px;
                left: 0;
                right: 0;
                margin: 0 auto;
                border-radius: 10px;
                overflow: hidden;
            }
        }
    }
</style>