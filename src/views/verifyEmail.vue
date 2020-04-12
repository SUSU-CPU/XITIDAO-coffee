<template>
    <div class="verify-email">
        <van-nav-bar title="邮箱验证" left-text="返回" left-arrow @click-left="onClickLeft" />
        <van-form class="form" @submit="next">
            <van-field
                class="inp"
                type="text"
                name="邮箱"
                label="邮箱"
                v-model="userInfo.email"
                placeholder="输入邮箱"
                autocomplete="off"
            />
            <van-field
                v-model="userInfo.code"
                center
                clearable
                label="验证码"
                :maxlength="6"
                placeholder="请输入验证码"
                autocomplete="off"
            >
                <template #button>
                    <van-button
                        @click.prevent="loginVerify"
                        :disabled="isSend"
                        size="small"
                        type="primary"
                    >{{text}}</van-button>
                </template>
            </van-field>
            <div class="btn-box">
                <van-button
                    round
                    block
                    type="info"
                    native-type="submit"
                    class="button"
                >下&nbsp;一&nbsp;步</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
    import vaild from "../Utils/valids";
    import { Utile } from "../Utils/Utilse";

    export default {
        name: "Email",
        data() {
            return {
                userInfo: {
                    email: "",
                    code: ""
                },
                isDisabled: true,
                isSend: false,
                text: "发送验证码"
            };
        },
        methods: {
            loginVerify() {
                if (vaild.validForm({ email: this.userInfo.email }, this)) {
                    let num = 60;
                    this.axios({
                        url: "/emailValidCode",
                        method: "POST",
                        data: {
                            appkey: this.appkey,
                            email: this.userInfo.email
                        },
                        transformRequest: Utile.transformRequest
                    })
                        .then(request => {
                            
                            this.$toast(request.data.msg);
                        })
                        .catch(() => {
                            
                        });
                    let timer = setInterval(() => {
                        num--;
                        this.text = num + "s后重新发送";
                        this.isSend = true;
                        if (num <= 0) {
                            clearInterval(timer);
                            this.text = "发送验证码";
                            this.isSend = false;
                        }
                    }, 1000);
                }
            },
            next() {
                
                this.axios({
                    url: "/checkValidCode",
                    method: "POST",
                    data: {
                        appkey: this.appkey,
                        validCode: this.userInfo.code
                    },
                    transformRequest: Utile.transformRequest
                })
                    .then(request => {
                        
                        this.$toast(request.data.msg);
                        if (request.data.code == "K001") {
                            this.$router.push({ name: "FindPass" });
                        }
                    })
                    .catch(() => {
                        
                    });
            },
            onClickLeft() {
                this.$router.push({ name: "Login", query: { name: 1 } });
            }
        }
    };
</script>

<style lang="less" scoped>
    @color: #f7a2ad;
    .verify-email {
        width: calc(100% - 20px);
        height: calc(100% - 30px);
        padding:20px 10px 10px;
        .form {
            border-radius: 10px;
            overflow: hidden;
            padding: 30% 0;
        }
        .btn-box {
            margin-top: 40px;
        }
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
        .van-button--primary,
        .van-button--info {
            background-color: @color;
            border-color: @color;
        }
        .van-field {
            padding: 13px 20px;
            border-radius: 5px;
        }
    }
</style>