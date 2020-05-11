<template>
    <div class="my-data">
        <van-nav-bar
            title="个人资料"
            left-text="返回"
            left-arrow
            :border="false"
            @click-left="onClickLeft"
            class="nav"
        />
        <van-popup
            v-model="nameShow"
            closeable
            close-icon="close"
            round
            :style="{height:'150px',width:'250px'}"
        >
            <van-nav-bar title="修改用户名" class="modify"></van-nav-bar>
            <!-- <van-cell-group> -->
            <van-field v-model="modifyName" placeholder="输入用户名" />
            <!-- </van-cell-group> -->
            <van-button @click="submit" class="submitBtn" round type="info">提&nbsp;&nbsp;交</van-button>
        </van-popup>
        <div class="dataBottom">
            <div class="list-box">
                <div class="datd-list">
                    <div class="list clear">
                        <div class="list_text fl">头像</div>
                        <div class="list_data fr">
                            <div class="icon fl">
                                <img class="auto-img" :src="userInfo.userImg" />
                                <van-uploader class="v-uploader" :after-read="afterRead" />
                            </div>
                            <van-icon class="arrow fl" name="arrow" />
                        </div>
                    </div>
                </div>
                <div class="datd-list" @click="modified">
                    <div class="list clear">
                        <div class="list_text fl">用户名</div>
                        <div class="list_data fr">
                            <input
                                type="text"
                                class="input fl"
                                v-model="userInfo.nickName"
                                disabled
                            />
                            <van-icon class="arrow fl" name="arrow" />
                        </div>
                    </div>
                </div>
                <div class="datd-list">
                    <div class="list clear">
                        <div class="list_text fl">用户ID</div>
                        <div class="list_data fr">
                            <input type="text" class="input fl" v-model="userInfo.userId" disabled />
                            <div class="arrow fl" />
                        </div>
                    </div>
                </div>
                <div class="datd-list">
                    <div class="list clear">
                        <div class="list_text fl">手机号</div>
                        <div class="list_data fr">
                            <span class="text fl">+86&nbsp;{{userInfo.phone}}</span>
                            <div class="arrow fl" />
                        </div>
                    </div>
                </div>
                <div class="datd-list" @click="goAccount">
                    <div class="list clear">
                        <div class="list_text fl">账号管理</div>
                        <div class="list_data fr">
                            <van-icon class="arrow fl" name="arrow" />
                        </div>
                    </div>
                </div>
            </div>
            <van-button
                class="data-btn"
                size="large"
                color="linear-gradient(to right,#FF97A2, #FF7F8C, #FF97A2)"
                @click="logOut"
            >退出登录</van-button>
        </div>
    </div>
</template>

<script>
    import { Utile } from "../Utils/Utilse";
    import { mapState } from "vuex";
    export default {
        name: "MyData",
        data() {
            return {
                sex: "男",
                // show: false,
                nameShow: false,
                modifyName: "",
                actions: [{ name: "男" }, { name: "女" }],
                userInfo: {
                    userImg: "",
                    phone: "",
                    userId: "",
                    nickName: "",
                    desc: ""
                }
            };
        },
        computed: {
            ...mapState("MyModule", ["cellInfo"])
        },
        created() {
            // 获取用户信息
            this.getUserInfo();
        },
        methods: {
            // 获取用户信息
            getUserInfo() {
                let tokenString = localStorage.getItem("_t");
                this.axios({
                    url: "/findAccountInfo",
                    method: "GET",
                    params: {
                        appkey: this.appkey,
                        tokenString
                    }
                })
                    .then(result => {
                        
                        if (result.data.code == "B001") {
                            this.userInfo = result.data.result[0];
                        }
                    })
                    .catch(() => {
                        
                    });
            },
            // 返回上一级
            onClickLeft() {
                this.$router.go(-1);
            },
            // 上传头像
            afterRead(file) {
                
                // 获取token
                let tokenString = localStorage.getItem("_t");
                // 限制图片大小
                if (file.file.size > 400 * 1024) {
                    this.$toast("上传图片大小不能超过400kb");
                    return;
                }

                // 上传图片到服务器

                // 获取图片类型
                let imgType = file.file.type.split("/")[1];

                // 处理图片base64
                let serverBase64Img = file.content.replace(
                    /data:image\/[A-Za-z]+;base64,/,
                    ""
                );

                // 发起请求
                //加载提示
                this.$toast.loading({
                    forbidClick: true,
                    duration: 0,
                    message: "上传中..."
                });

                this.axios({
                    url: "/updateAvatar",
                    method: "POST",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        serverBase64Img,
                        imgType
                    },
                    transformRequest: Utile.transformRequest
                })
                    .then(result => {
                        
                        this.$toast.clear();
                        this.userInfo.userImg = result.data.userImg;
                    })
                    .catch(() => {
                        
                    });
            },
            // 修改用户名
            modified() {
                this.nameShow = true;
            },
            // 修改用户昵称
            submit() {
                if (this.modifyName == "") {
                    this.$toast("至少输入一个字符");
                    return;
                }
                this.nameShow = false;
                let tokenString = localStorage.getItem("_t");

                this.axios({
                    url: "/updateNickName",
                    method: "post",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        nickName: this.modifyName
                    },
                    transformRequest: Utile.transformRequest
                })
                    .then(result => {
                        
                        if (result.data.code == "C001") {
                            this.$toast("修改成功");
                            this.userInfo.nickName = result.data.nickName;
                        }
                    })
                    .catch(() => {
                        
                    });
            },
            // 退出登录
            logOut() {
            
                let tokenString = localStorage.getItem("_t");

                this.axios({
                    url: "/logout",
                    method: "POST",
                    data: {
                        tokenString,
                        appkey: this.appkey
                    },
                    transformRequest: Utile.transformRequest
                })
                    .then(result => {
                        
                        if (result.data.code == "F001") {
                            // 返回我的界面
                            this.$router.go(-1);
                            localStorage.removeItem("_t")
                            this.$toast.commit("changeData",{key:"isLogin",value:false})
                            this.$toast.commit("mainModule/changeShopCount",'')
                        }
                    })
                    .catch(() => {
                        
                    });
            },
            // 跳转到账户管理页面
            goAccount(){
                this.$router.push({name:"Account",query:{phone:this.userInfo.phone}})
            }
        }
    };
</script>

<style lang="less" scoped>
    .my-data {
        width:calc(100% - 20px);
        height: calc(100% - 30px);
        padding:20px 10px 10px;
        .van-popup--bottom {
            width: calc(100% - 20px);
            margin: 0 10px;
            border-radius: 10px;
            bottom: 0px;
        }
        .nav {
            border-radius: 10px;
            overflow: hidden;
            background: transparent;
        }

        /deep/ .van-nav-bar .van-icon,
        /deep/.van-nav-bar__text {
            color: #ff7f8c;
        }
        /deep/.van-field {
            width: 200px;
            margin-left: 25px;
            background: #f0f0f0;
            padding-top: 5px;
            padding-bottom: 5px;
        }
        /deep/.van-button {
            height: 35px;
            width: 200px;
            margin-left: 25px;
            margin-top: 10px;
            line-height: 35px;
            font-size: 17px;
            background: rgb(255, 151, 162);
            outline: none;
            border: 0;
        }
        .dataBottom {
            height: calc(100% - 65px);
            padding: 10px;
            .list-box {
                background: #fff;
                border-radius: 10px;
                padding: 15px 0 10px;
            }
            .datd-list {
                width: calc(100% - 20px);
                padding: 0 10px;

                .list {
                    width: 100%;
                    .list_text {
                        width: 90px;
                        height: 100%;
                        font-size: 100%;
                        line-height: 50px;
                        font-size: 13px;
                        color: #5c5c55;
                    }
                    .icon {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        overflow: hidden;
                        position: relative;
                        .v-uploader {
                            position: absolute;
                            width: 50px;
                            height: 50px;
                            left: 0;
                            top: 0;
                            overflow: hidden;
                            z-index: 2;
                            opacity: 0;
                        }
                    }

                    .list_data {
                        span,
                        div {
                            margin-right: 10px;
                        }
                        .arrow {
                            line-height: 50px;
                            font-size: 16px;
                            color: #b2b2b2;
                        }
                        .text {
                            line-height: 50px;
                            font-size: 13px;
                            color: #000;
                        }
                        .input {
                            background: transparent;
                            border: none;
                            height: 100%;
                            padding: 0;
                            outline: none;
                            font-size: 13px;
                            line-height: 50px;
                            text-align: right;
                            margin: 16px 10px 0 0;
                        }
                    }
                }
            }
            .data-btn {
                width: calc(100% - 20px);
                margin: 40px 10px 0;
                height: 45px;
                border-radius: 25px;
            }
        }
    }
</style>